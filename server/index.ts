import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variables for Discord OAuth
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL || `http://localhost:${PORT}/auth/discord/callback`;
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this';

// Admin Discord User IDs (replace with your Discord user IDs)
const ADMIN_USER_IDS = [
  '123456789012345678', // Replace with your Discord user ID
  '987654321098765432', // Add more admin user IDs as needed
];

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Discord OAuth Strategy
passport.use(new DiscordStrategy({
  clientID: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  callbackURL: DISCORD_CALLBACK_URL,
  scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
  // Check if user is an admin
  const isAdmin = ADMIN_USER_IDS.includes(profile.id);
  
  if (isAdmin) {
    return done(null, {
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
      isAdmin: true
    });
  } else {
    return done(null, false, { message: 'Access denied: Not an admin' });
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/public')));

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user?.isAdmin) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Auth routes
app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/admin-hexa-hub-2024?error=access_denied' 
  }),
  (req, res) => {
    res.redirect('/admin-hexa-hub-2024?authenticated=true');
  }
);

app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated() && req.user?.isAdmin) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        discriminator: req.user.discriminator,
        avatar: req.user.avatar
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Protected admin routes
app.get('/api/admin/games', requireAuth, (req, res) => {
  // This would typically fetch from a database
  res.json({ message: 'Admin games endpoint' });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Discord OAuth callback URL: ${DISCORD_CALLBACK_URL}`);
});