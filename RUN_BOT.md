# How to Run the Discord Bot - Simple Guide

## Quick Start (3 Steps)

### Step 1: Get Your Discord Bot Token
1. Go to https://discord.com/developers/applications
2. Click "New Application" → Give it a name → "Create"
3. Go to "Bot" section → Click "Add Bot"
4. Under "Token" → Click "Copy" (save this token!)

### Step 2: Get Your Discord User ID
1. In Discord, go to Settings → Advanced → Turn on "Developer Mode"
2. Right-click your username anywhere → "Copy User ID"
3. Save this ID!

### Step 3: Create .env File
Create a file called `.env` in your project root with:

```
DISCORD_BOT_TOKEN=paste_your_bot_token_here
BOT_OWNER_ID=paste_your_user_id_here
DISCORD_CLIENT_ID=your_client_id_from_step_1
DISCORD_CLIENT_SECRET=your_client_secret_from_step_1
SESSION_SECRET=change-this-to-something-random
```

## Running the Bot

### Option 1: Run Bot Only
```bash
npm run bot
```

### Option 2: Run Both Website and Bot (Recommended)
```bash
# Terminal 1 - Run the website
npm run dev

# Terminal 2 - Run the bot
npm run bot
```

## Invite Bot to Your Server

1. In Discord Developer Portal → Your App → "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select permissions: "Send Messages", "Use Slash Commands"
4. Copy the URL and open it → Select your server → "Authorize"

## First Time Setup Commands

Once bot is running and in your server:

1. `/help` - See all commands
2. `/add-admin @yourself` - Make yourself a website admin
3. `/add-bot-user @friend` - Give someone else bot access
4. `/list-admins` - See current admins

## Troubleshooting

**Bot not responding?**
- Check if bot token is correct
- Make sure bot is online (green dot in Discord)
- Verify bot has permissions in your server

**Commands not showing?**
- Wait a few minutes for Discord to register commands
- Try typing `/` in your server

**Website login not working?**
- Make sure you added yourself as admin with `/add-admin`
- Check that both website and bot are running

## File Structure

Your bot files are already in your project:
```
your-project/
├── bot/
│   └── index.js          # Main bot code
├── data/                 # Created automatically
│   ├── admin_ids.json    # Website admins
│   └── bot_users.json    # Bot users
├── .env                  # Your secrets (create this)
└── package.json          # Already has bot script
```

That's it! The bot is already coded and ready to run.