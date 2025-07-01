# Discord Bot Setup Guide

This guide will help you set up the Discord bot for managing admin access to your Luminous Scripts website.

## Prerequisites

1. A Discord account
2. A Discord server where you want to add the bot
3. Basic understanding of Discord Developer Portal

## Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "Luminous Scripts Admin Bot")
4. Click "Create"

## Step 2: Create a Bot

1. In your application, go to the "Bot" section
2. Click "Add Bot"
3. Under "Token", click "Copy" to copy your bot token
4. Save this token securely - you'll need it for `DISCORD_BOT_TOKEN`

## Step 3: Set Bot Permissions

1. In the "Bot" section, scroll down to "Privileged Gateway Intents"
2. Enable "Message Content Intent" (if you plan to use message commands)
3. Under "Bot Permissions", select:
   - Send Messages
   - Use Slash Commands
   - Embed Links

## Step 4: Get Your Discord User ID

1. Enable Developer Mode in Discord:
   - User Settings → Advanced → Developer Mode (toggle on)
2. Right-click on your username in any server
3. Click "Copy User ID"
4. Save this ID - you'll need it for `BOT_OWNER_ID`

## Step 5: Set Up OAuth2 for Website Login

1. In your application, go to "OAuth2" → "General"
2. Add redirect URL: `http://localhost:5000/auth/discord/callback` (adjust for your domain)
3. Copy your "Client ID" and "Client Secret"
4. Save these for `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`

## Step 6: Invite Bot to Your Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select bot permissions:
   - Send Messages
   - Use Slash Commands
   - Embed Links
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

## Step 7: Configure Environment Variables

Create a `.env` file in your project root with:

```env
# Discord OAuth (for website login)
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_CALLBACK_URL=http://localhost:5000/auth/discord/callback

# Discord Bot
DISCORD_BOT_TOKEN=your_bot_token_here
BOT_OWNER_ID=your_discord_user_id_here

# Session
SESSION_SECRET=your-super-secret-session-key-change-this
```

## Step 8: Start the Bot

Run the bot with:
```bash
npm run bot
```

## Bot Commands

### For Bot Users (managed by owner):
- `/add-admin <user>` - Add a user as website admin
- `/remove-admin <user>` - Remove admin access
- `/list-admins` - List all current admins

### For Bot Owner Only:
- `/add-bot-user <user>` - Grant someone access to use bot commands
- `/remove-bot-user <user>` - Remove bot command access
- `/list-bot-users` - List all users who can use the bot

### For Everyone:
- `/help` - Show available commands

## Initial Setup

1. Start the bot
2. As the owner, you automatically have bot access
3. Use `/add-admin @yourself` to make yourself a website admin
4. Use `/add-bot-user @someone` to give others bot access
5. They can then use `/add-admin` and `/remove-admin` commands

## Security Notes

- Only the bot owner (you) can manage who can use the bot
- Bot users can manage website admins
- Admin IDs are stored in `data/admin_ids.json`
- Bot user IDs are stored in `data/bot_users.json`
- The owner cannot be removed from either list

## Troubleshooting

1. **Bot not responding**: Check if bot token is correct and bot is online
2. **Commands not showing**: Make sure bot has `applications.commands` scope
3. **Permission denied**: Ensure you're the bot owner or have been added as a bot user
4. **Website login fails**: Check OAuth2 credentials and callback URL

## Production Deployment

For production:
1. Update `DISCORD_CALLBACK_URL` to your domain
2. Use a secure `SESSION_SECRET`
3. Set `NODE_ENV=production`
4. Ensure bot and web server are both running