import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import fs from 'fs/promises';
import path from 'path';

// File path for admin IDs (managed by Discord bot)
const ADMIN_IDS_FILE = path.join(process.cwd(), 'data', 'admin_ids.json');

// Load admin IDs from file
async function loadAdminIds() {
  try {
    const data = await fs.readFile(ADMIN_IDS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Admin IDs file not found. Use Discord bot to add admins.');
    return [];
  }
}

// Check if user is admin
async function isUserAdmin(discordId) {
  try {
    const adminIds = await loadAdminIds();
    return adminIds.includes(discordId);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export function setupAuth(app) {
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/auth/discord/callback';

  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.error('❌ Discord OAuth credentials missing');
    return false;
  }

  // Configure Discord Strategy
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
      console.error('Error in Discord strategy:', error);
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Auth routes
  app.get('/auth/discord', passport.authenticate('discord'));

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
              // Send success message to parent window
              if (window.opener) {
                window.opener.postMessage({
                  type: 'DISCORD_AUTH_SUCCESS',
                  user: ${JSON.stringify(req.user)}
                }, '*');
              }
              
              // Close popup after delay
              setTimeout(() => {
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
            // Send error message to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'DISCORD_AUTH_ERROR',
                error: 'Access denied: Not an admin'
              }, '*');
            }
            
            // Close popup after delay
            setTimeout(() => {
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

  return true;
}