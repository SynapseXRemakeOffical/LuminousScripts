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

console.log('🔧 Starting server...');

// Environment variables
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL || `http://localhost:${PORT}/auth/discord/callback`;
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this';

console.log('🔧 Environment check:');
console.log('- DISCORD_CLIENT_ID:', DISCORD_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('- DISCORD_CLIENT_SECRET:', DISCORD_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('- DISCORD_CALLBACK_URL:', DISCORD_CALLBACK_URL);

// File path for admin IDs (managed by Discord bot)
const ADMIN_IDS_FILE = path.join(process.cwd(), 'data', 'admin_ids.json');

// Load admin IDs from file
async function loadAdminIds() {
  try {
    const data = await fs.readFile(ADMIN_IDS_FILE, 'utf8');
    const adminIds = JSON.parse(data);
    console.log('📋 Loaded admin IDs:', adminIds);
    return adminIds;
  } catch (error) {
    console.warn('⚠️ Admin IDs file not found. Use Discord bot to add admins.');
    return [];
  }
}

// Check if user is admin
async function isUserAdmin(discordId) {
  try {
    const adminIds = await loadAdminIds();
    const isAdmin = adminIds.includes(discordId);
    console.log(`🔍 Admin check for ${discordId}:`, isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('❌ Error checking admin status:', error);
    return false;
  }
}

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
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
      console.log('🔧 Discord OAuth callback for:', profile.username);
      
      const isAdmin = await isUserAdmin(profile.id);
      console.log('🔧 Admin check result:', isAdmin);
      
      if (isAdmin) {
        const user = {
          id: profile.id,
          username: profile.username,
          discriminator: profile.discriminator,
          avatar: profile.avatar,
          isAdmin: true
        };
        console.log('✅ User authenticated:', user.username);
        return done(null, user);
      } else {
        console.log('❌ User not admin:', profile.username);
        return done(null, false, { message: 'Access denied: Not an admin' });
      }
    } catch (error) {
      console.error('❌ Error in Discord strategy:', error);
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  console.log('✅ Discord OAuth configured successfully');
} else {
  console.log('❌ Discord OAuth not configured - missing credentials');
}

// Middleware
app.use(express.json());

// CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user?.isAdmin) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Auth routes
app.get('/auth/discord', (req, res, next) => {
  console.log('🔧 Starting Discord auth...');
  passport.authenticate('discord')(req, res, next);
});

app.get('/auth/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/auth/discord/error' 
  }),
  (req, res) => {
    console.log('🔧 Discord callback success for:', req.user?.username);
    
    // Send success response that the popup can handle
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Success</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .container {
              background: rgba(30, 41, 59, 0.8);
              padding: 2rem;
              border-radius: 1rem;
              border: 1px solid rgba(139, 125, 216, 0.3);
              backdrop-filter: blur(10px);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .success {
              color: #4ade80;
              font-size: 1.5rem;
              margin-bottom: 1rem;
              font-weight: bold;
            }
            .loading {
              color: #8b7dd8;
              font-size: 1rem;
            }
            .spinner {
              display: inline-block;
              width: 20px;
              height: 20px;
              border: 3px solid rgba(139, 125, 216, 0.3);
              border-radius: 50%;
              border-top-color: #8b7dd8;
              animation: spin 1s ease-in-out infinite;
              margin-right: 10px;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅ Authentication Successful!</div>
            <div class="loading">
              <span class="spinner"></span>
              Redirecting...
            </div>
          </div>
          <script>
            console.log('Auth success page loaded');
            
            // Send success message to parent window
            if (window.opener) {
              console.log('Sending success message to parent');
              window.opener.postMessage({
                type: 'DISCORD_AUTH_SUCCESS',
                user: ${JSON.stringify(req.user)}
              }, '*');
            }
            
            // Close popup after delay
            setTimeout(() => {
              console.log('Closing popup');
              window.close();
            }, 2000);
          </script>
        </body>
      </html>
    `);
  }
);

// Handle auth errors
app.get('/auth/discord/error', (req, res) => {
  console.log('🔧 Discord auth error');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Failed</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .container {
            background: rgba(30, 41, 59, 0.8);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(239, 68, 68, 0.3);
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          .error {
            color: #ef4444;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: bold;
          }
          .message {
            color: #94a3b8;
            font-size: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">❌ Authentication Failed</div>
          <div class="message">Access denied. You need admin permissions.</div>
        </div>
        <script>
          console.log('Auth error page loaded');
          
          // Send error message to parent window
          if (window.opener) {
            console.log('Sending error message to parent');
            window.opener.postMessage({
              type: 'DISCORD_AUTH_ERROR',
              error: 'Access denied: Not an admin'
            }, '*');
          }
          
          // Close popup after delay
          setTimeout(() => {
            console.log('Closing popup');
            window.close();
          }, 3000);
        </script>
      </body>
    </html>
  `);
});

// Logout route
app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// Auth status route
app.get('/auth/status', async (req, res) => {
  console.log('🔧 Auth status check:', {
    authenticated: req.isAuthenticated(),
    user: req.user?.username || 'none'
  });
  
  if (req.isAuthenticated() && req.user?.isAdmin) {
    // Double-check admin status
    try {
      const isStillAdmin = await isUserAdmin(req.user.id);
      
      if (!isStillAdmin) {
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

// Debug route
app.get('/auth/debug', (req, res) => {
  res.json({
    hasClientId: !!DISCORD_CLIENT_ID,
    hasClientSecret: !!DISCORD_CLIENT_SECRET,
    callbackUrl: DISCORD_CALLBACK_URL,
    sessionSecret: !!SESSION_SECRET,
    authenticated: req.isAuthenticated(),
    user: req.user || null,
    session: req.session
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
    auth: !!(DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET),
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes
app.get('*', async (req, res) => {
  // Skip serving static files for API routes
  if (req.path.startsWith('/auth') || req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  
  try {
    const indexPath = path.join(__dirname, '../dist/public/index.html');
    await fs.access(indexPath);
    res.sendFile(indexPath);
  } catch (error) {
    // For development, just return a simple response
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Development Server</title></head>
        <body>
          <h1>Development Server Running</h1>
          <p>Frontend is served by Vite on port 5173</p>
          <p>API server running on port 5000</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Discord OAuth callback: ${DISCORD_CALLBACK_URL}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log(`🔧 Admin panel: http://localhost:${PORT}/admin-panel`);
});