import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { setupAuth } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔧 Server starting...');

// Session configuration
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this';

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

// Middleware
app.use(express.json());

// Setup authentication
const authConfigured = setupAuth(app);

if (authConfigured) {
  console.log('✅ Discord OAuth configured successfully');
} else {
  console.log('⚠️ Discord OAuth not configured - check environment variables');
}

// Serve static files if dist exists
try {
  const distPath = path.join(__dirname, '../dist/public');
  await fs.access(distPath);
  app.use(express.static(distPath));
  console.log('✅ Serving static files from dist/public');
} catch (error) {
  console.log('⚠️ No dist/public folder found - run "npm run build" first');
}

// Auth middleware for protected routes
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user?.isAdmin) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Debug route
app.get('/auth/debug', (req, res) => {
  res.json({
    hasClientId: !!process.env.DISCORD_CLIENT_ID,
    hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
    callbackUrl: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/auth/discord/callback',
    sessionSecret: !!SESSION_SECRET,
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

// Protected admin routes
app.get('/api/admin/games', requireAuth, (req, res) => {
  res.json({ message: 'Admin games endpoint', user: req.user });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    auth: authConfigured,
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes
app.get('*', async (req, res) => {
  try {
    const indexPath = path.join(__dirname, '../dist/public/index.html');
    await fs.access(indexPath);
    res.sendFile(indexPath);
  } catch (error) {
    res.status(404).json({ 
      error: 'Frontend not built yet',
      message: 'Run "npm run build" to build the frontend'
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Discord OAuth callback: ${process.env.DISCORD_CALLBACK_URL || `http://localhost:${PORT}/auth/discord/callback`}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});