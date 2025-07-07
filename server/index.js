import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { db, testConnection } from './db.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variables for Discord OAuth
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL || `https://luminousscripts.netlify.app/auth/discord/callback`;
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this';

console.log('🔧 Server starting with environment:');
console.log('- PORT:', PORT);
console.log('- DISCORD_CLIENT_ID:', DISCORD_CLIENT_ID ? 'Set ✅' : 'Missing ❌');
console.log('- DISCORD_CLIENT_SECRET:', DISCORD_CLIENT_SECRET ? 'Set ✅' : 'Missing ❌');
console.log('- DISCORD_CALLBACK_URL:', DISCORD_CALLBACK_URL);
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✅' : 'Missing ❌');

// Test database connection
await testConnection();

// File path for admin IDs (managed by Discord bot) - fallback for compatibility
const ADMIN_IDS_FILE = path.join(process.cwd(), 'data', 'admin_ids.json');

// Load admin IDs from file (fallback)
async function loadAdminIdsFromFile() {
  try {
    const data = await fs.readFile(ADMIN_IDS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Admin IDs file not found. Using database instead.');
    return [];
  }
}

// Check if user is admin (check both database and file)
async function isUserAdmin(discordId) {
  try {
    // First check database
    const user = await db.select().from(users).where(eq(users.discordId, discordId)).limit(1);
    if (user.length > 0 && user[0].isAdmin) {
      return true;
    }
    
    // Fallback to file system
    const fileAdmins = await loadAdminIdsFromFile();
    return fileAdmins.includes(discordId);
  } catch (error) {
    console.error('Error checking admin status:', error);
    // Fallback to file system
    const fileAdmins = await loadAdminIdsFromFile();
    return fileAdmins.includes(discordId);
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

// Discord OAuth Strategy - Only configure if credentials are available
if (DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET) {
  console.log('🔧 Configuring Discord OAuth Strategy...');
  
  passport.use(new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: DISCORD_CALLBACK_URL,
    scope: ['identify']
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('🔧 Discord OAuth callback received for user:', profile.username);
    
    try {
      const isAdmin = await isUserAdmin(profile.id);
      console.log('🔧 Admin check result for', profile.username, ':', isAdmin);
      
      if (isAdmin) {
        // Update or create user in database
        try {
          const existingUser = await db.select().from(users).where(eq(users.discordId, profile.id)).limit(1);
          
          if (existingUser.length > 0) {
            // Update existing user
            await db.update(users)
              .set({
                username: profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                updatedAt: new Date()
              })
              .where(eq(users.discordId, profile.id));
          } else {
            // Create new user
            await db.insert(users).values({
              discordId: profile.id,
              username: profile.username,
              discriminator: profile.discriminator,
              avatar: profile.avatar,
              isAdmin: true
            });
          }
        } catch (dbError) {
          console.error('Database error during user upsert:', dbError);
          // Continue with authentication even if DB update fails
        }
        
        return done(null, {
          id: profile.id,
          username: profile.username,
          discriminator: profile.discriminator,
          avatar: profile.avatar,
          isAdmin: true
        });
      } else {
        console.log('🔧 Access denied for user:', profile.username);
        return done(null, false, { message: 'Access denied: Not an admin' });
      }
    } catch (error) {
      console.error('Error in Discord strategy:', error);
      return done(error);
    }
  }));
  
  console.log('✅ Discord OAuth Strategy configured successfully');
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

// Debug route to check Discord OAuth configuration
app.get('/auth/debug', (req, res) => {
  res.json({
    hasClientId: !!DISCORD_CLIENT_ID,
    hasClientSecret: !!DISCORD_CLIENT_SECRET,
    callbackUrl: DISCORD_CALLBACK_URL,
    passportConfigured: !!passport._strategies.discord
  });
});

// Auth routes - Only if Discord is configured
if (DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET) {
  app.get('/auth/discord', (req, res, next) => {
    console.log('🔧 Discord auth route hit');
    passport.authenticate('discord')(req, res, next);
  });

  app.get('/auth/discord/callback', 
    passport.authenticate('discord', { 
      failureRedirect: '/auth/discord/error' 
    }),
    async (req, res) => {
      console.log('🔧 Discord callback success for user:', req.user?.username);
      
      // Send success message to parent window and close popup
      const authStatus = {
        authenticated: true,
        user: {
          id: req.user.id,
          username: req.user.username,
          discriminator: req.user.discriminator,
          avatar: req.user.avatar
        }
      };

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
                background: rgba(30, 41, 59, 0.5);
                padding: 2rem;
                border-radius: 1rem;
                border: 1px solid rgba(139, 125, 216, 0.2);
                backdrop-filter: blur(10px);
              }
              .success {
                color: #4ade80;
                font-size: 1.2rem;
                margin-bottom: 1rem;
              }
              .loading {
                color: #8b7dd8;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">✅ Authentication Successful!</div>
              <div class="loading">Redirecting...</div>
            </div>
            <script>
              console.log('Sending auth success message to parent');
              // Send success message to parent window
              if (window.opener) {
                window.opener.postMessage({
                  type: 'DISCORD_AUTH_SUCCESS',
                  authStatus: ${JSON.stringify(authStatus)}
                }, '*');
              }
              // Close popup after a short delay
              setTimeout(() => {
                window.close();
              }, 1500);
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
              background: rgba(30, 41, 59, 0.5);
              padding: 2rem;
              border-radius: 1rem;
              border: 1px solid rgba(239, 68, 68, 0.2);
              backdrop-filter: blur(10px);
            }
            .error {
              color: #ef4444;
              font-size: 1.2rem;
              margin-bottom: 1rem;
            }
            .message {
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">❌ Authentication Failed</div>
            <div class="message">Access denied. You need admin permissions.</div>
          </div>
          <script>
            console.log('Sending auth error message to parent');
            // Send error message to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'DISCORD_AUTH_ERROR',
                error: 'Access denied: Not an admin'
              }, '*');
            }
            // Close popup after a short delay
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `);
  });
} else {
  // Fallback routes when Discord is not configured
  app.get('/auth/discord', (req, res) => {
    res.status(500).json({ error: 'Discord OAuth not configured' });
  });
  
  app.get('/auth/discord/callback', (req, res) => {
    res.status(500).json({ error: 'Discord OAuth not configured' });
  });
}

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
    // Double-check admin status
    try {
      const isStillAdmin = await isUserAdmin(req.user.id);
      
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
  res.json({ message: 'Admin games endpoint' });
});

// API route to get current admin list (for debugging)
app.get('/api/admin/list', requireAuth, async (req, res) => {
  try {
    // Get from database
    const dbAdmins = await db.select().from(users).where(eq(users.isAdmin, true));
    
    // Get from file (fallback)
    const fileAdmins = await loadAdminIdsFromFile();
    
    res.json({ 
      dbAdmins: dbAdmins.map(u => ({ id: u.discordId, username: u.username })),
      fileAdmins 
    });
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
  console.log('📁 Admin management: Database + Discord bot fallback');
});