import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variables for Discord OAuth
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL || `http://localhost:${PORT}/auth/discord/callback`;
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this';

console.log('🔧 Server starting with environment:');
console.log('- PORT:', PORT);
console.log('- DISCORD_CLIENT_ID:', DISCORD_CLIENT_ID ? 'Set' : 'Missing');
console.log('- DISCORD_CLIENT_SECRET:', DISCORD_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('- DISCORD_CALLBACK_URL:', DISCORD_CALLBACK_URL);

// File path for admin IDs (managed by Discord bot)
const ADMIN_IDS_FILE = path.join(process.cwd(), 'data', 'admin_ids.json');

// Load admin IDs from file
async function loadAdminIds() {
  try {
    const data = await fs.readFile(ADMIN_IDS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return empty array
    console.warn('Admin IDs file not found. Use Discord bot to add admins.');
    return [];
  }
}

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
if (DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: DISCORD_CALLBACK_URL,
    scope: ['identify']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Load current admin IDs from file
      const adminIds = await loadAdminIds();
      const isAdmin = adminIds.includes(profile.id);
      
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
    } catch (error) {
      console.error('Error checking admin status:', error);
      return done(error);
    }
  }));
} else {
  console.error('❌ Discord OAuth not configured - missing CLIENT_ID or CLIENT_SECRET');
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/public')));

// Auth middleware
const requireAuth = (req, res, next) => {
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

app.get('/auth/status', async (req, res) => {
  if (req.isAuthenticated() && req.user?.isAdmin) {
    // Double-check admin status against current file
    try {
      const currentAdminIds = await loadAdminIds();
      const isStillAdmin = currentAdminIds.includes(req.user.id);
      
      if (!isStillAdmin) {
        // User is no longer admin, logout
        req.logout((err) => {
          res.json({ authenticated: false });
        });
        return;
      }
    } catch (error) {
      console.error('Error checking current admin status:', error);
    }
    
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

// API route to get current admin list (for debugging)
app.get('/api/admin/list', requireAuth, async (req, res) => {
  try {
    const adminIds = await loadAdminIds();
    res.json({ adminIds });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load admin list' });
  }
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
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Discord OAuth callback URL: ${DISCORD_CALLBACK_URL}`);
  console.log('📁 Admin IDs are managed by the Discord bot');
});