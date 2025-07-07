# Running Your Discord Bot Locally

## Quick Setup (2 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Bot
```bash
npm run bot
```

### Step 3: Verify Bot is Online
- Check your Discord server - the bot should show as online
- Try the `/help` command in your server

## Bot Commands Available

### For Bot Owner (You):
- `/add-bot-user @user` - Give someone access to use bot commands
- `/remove-bot-user @user` - Remove bot access
- `/list-bot-users` - See who can use the bot

### For Bot Users:
- `/add-admin @user` - Make someone a website admin
- `/remove-admin @user` - Remove admin access
- `/list-admins` - See current website admins
- `/help` - Show all commands

## First Time Setup

1. **Make yourself an admin:**
   ```
   /add-admin @yourusername
   ```

2. **Give others bot access:**
   ```
   /add-bot-user @friend
   ```

3. **Test website login:**
   - Go to your website admin panel
   - Click "Login with Discord"
   - Should work now!

## Keeping Bot Running

### Option A: Keep Terminal Open
- Just leave the terminal running with `npm run bot`
- Bot stops when you close terminal

### Option B: Use PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start "npm run bot" --name "discord-bot"

# Bot will restart automatically if it crashes
pm2 save
pm2 startup
```

### Option C: Run in Background (Linux/Mac)
```bash
# Start in background
nohup npm run bot &

# Check if running
ps aux | grep node
```

## Troubleshooting

**Bot not responding?**
- Check if bot token is correct in `.env`
- Make sure bot has permissions in your Discord server
- Check console for error messages

**Commands not showing?**
- Wait 1-2 minutes for Discord to register commands
- Try typing `/` in your server

**Website login still not working?**
- Make sure bot is running
- Use `/add-admin @yourself` first
- Check that you're using the correct Discord account

## Production Hosting (Later)

When ready for 24/7 hosting, consider:
- **Railway.app** (Free tier)
- **Render.com** (Free tier) 
- **Heroku alternatives**
- **VPS hosting**

For now, running locally is perfectly fine for testing and development!