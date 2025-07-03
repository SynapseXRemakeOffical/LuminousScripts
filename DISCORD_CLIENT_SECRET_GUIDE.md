# How to Get Your Discord Client Secret

## Step-by-Step Guide

### 1. Go to Discord Developer Portal
- Visit: https://discord.com/developers/applications
- Log in with your Discord account

### 2. Select Your Application
- Click on your existing application (the one you created for the bot)
- OR create a new one if you haven't already

### 3. Get Client ID and Client Secret

#### For Client ID:
1. In your application, go to **"General Information"**
2. Copy the **"Application ID"** (this is your Client ID)

#### For Client Secret:
1. In your application, go to **"OAuth2"** → **"General"**
2. Under **"Client Secret"**, click **"Reset Secret"**
3. Click **"Yes, do it!"** to confirm
4. Copy the new secret immediately (you won't be able to see it again!)

### 4. Set Up OAuth2 Redirect URL
1. Still in **"OAuth2"** → **"General"**
2. Under **"Redirects"**, click **"Add Redirect"**
3. Add: `http://localhost:5000/auth/discord/callback`
4. For production, also add your domain: `https://yourdomain.com/auth/discord/callback`
5. Click **"Save Changes"**

### 5. Update Your .env File

Replace the placeholders in your `.env` file:

```env
# Discord OAuth Configuration
DISCORD_CLIENT_ID=your_application_id_from_step_3
DISCORD_CLIENT_SECRET=your_client_secret_from_step_3
DISCORD_CALLBACK_URL=http://localhost:5000/auth/discord/callback

# Discord Bot Configuration  
DISCORD_BOT_TOKEN=your_bot_token_here
BOT_OWNER_ID=your_discord_user_id_here

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Environment
NODE_ENV=development
```

## Important Notes

⚠️ **Security Warning:**
- Never share your Client Secret publicly
- Never commit it to GitHub or other public repositories
- Keep your `.env` file in `.gitignore`

✅ **What Each Does:**
- **Client ID**: Public identifier for your Discord app (safe to share)
- **Client Secret**: Private key for OAuth authentication (keep secret!)
- **Bot Token**: For the Discord bot functionality (also keep secret!)

## Testing Your Setup

1. Start your website: `npm run dev`
2. Start your bot: `npm run bot`
3. Go to: `http://localhost:5000/admin-hexa-hub-2024`
4. Click "Login with Discord"
5. You should be redirected to Discord for authorization

If it works, you'll be redirected back to your admin panel!

## Troubleshooting

**"Invalid OAuth2 redirect_uri"**
- Make sure you added the exact redirect URL in Discord Developer Portal
- Check that the URL matches exactly (including http/https)

**"Invalid client_secret"**
- Make sure you copied the entire secret
- Try resetting the secret and copying it again

**"Application not found"**
- Double-check your Client ID is correct
- Make sure you're using the Application ID, not the Bot ID