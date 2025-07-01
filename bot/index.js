import { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';

// Bot configuration
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const OWNER_ID = process.env.BOT_OWNER_ID; // Your Discord user ID - only you can manage bot users

// File paths for storing data
const ADMIN_IDS_FILE = path.join(process.cwd(), 'data', 'admin_ids.json');
const BOT_USERS_FILE = path.join(process.cwd(), 'data', 'bot_users.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Load admin IDs from file
async function loadAdminIds() {
  try {
    const data = await fs.readFile(ADMIN_IDS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return default admin (owner)
    const defaultAdmins = [OWNER_ID];
    await saveAdminIds(defaultAdmins);
    return defaultAdmins;
  }
}

// Save admin IDs to file
async function saveAdminIds(adminIds) {
  await fs.writeFile(ADMIN_IDS_FILE, JSON.stringify(adminIds, null, 2));
}

// Load bot users from file
async function loadBotUsers() {
  try {
    const data = await fs.readFile(BOT_USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return default (owner only)
    const defaultUsers = [OWNER_ID];
    await saveBotUsers(defaultUsers);
    return defaultUsers;
  }
}

// Save bot users to file
async function saveBotUsers(botUsers) {
  await fs.writeFile(BOT_USERS_FILE, JSON.stringify(botUsers, null, 2));
}

// Check if user can use bot commands
async function canUseBot(userId) {
  const botUsers = await loadBotUsers();
  return botUsers.includes(userId);
}

// Check if user is admin
async function isAdmin(userId) {
  const adminIds = await loadAdminIds();
  return adminIds.includes(userId);
}

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Bot ready event
client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  
  await ensureDataDirectory();
  
  // Register slash commands
  const commands = [
    // Admin management commands (for bot users)
    new SlashCommandBuilder()
      .setName('add-admin')
      .setDescription('Add a user as admin for the website')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('User to add as admin')
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName('remove-admin')
      .setDescription('Remove admin access from a user')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('User to remove admin access from')
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName('list-admins')
      .setDescription('List all current admins'),
    
    // Bot user management commands (owner only)
    new SlashCommandBuilder()
      .setName('add-bot-user')
      .setDescription('Add a user who can use bot commands (Owner only)')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('User to add as bot user')
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName('remove-bot-user')
      .setDescription('Remove bot command access from a user (Owner only)')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('User to remove bot access from')
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName('list-bot-users')
      .setDescription('List all users who can use bot commands (Owner only)'),
    
    // Help command
    new SlashCommandBuilder()
      .setName('help')
      .setDescription('Show available commands and their usage')
  ];

  try {
    console.log('🔄 Registering slash commands...');
    await client.application.commands.set(commands);
    console.log('✅ Slash commands registered successfully');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  try {
    // Check if user can use bot (except for help command)
    if (commandName !== 'help' && !(await canUseBot(user.id))) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Access Denied')
        .setDescription('You do not have permission to use this bot.')
        .setFooter({ text: 'Contact the bot owner for access' });
      
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    switch (commandName) {
      case 'add-admin': {
        const targetUser = interaction.options.getUser('user');
        const adminIds = await loadAdminIds();
        
        if (adminIds.includes(targetUser.id)) {
          const embed = new EmbedBuilder()
            .setColor('#ffa500')
            .setTitle('⚠️ Already Admin')
            .setDescription(`${targetUser.username} is already an admin.`);
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        adminIds.push(targetUser.id);
        await saveAdminIds(adminIds);
        
        const embed = new EmbedBuilder()
          .setColor('#4ade80')
          .setTitle('✅ Admin Added')
          .setDescription(`Successfully added ${targetUser.username} as an admin.`)
          .addFields([
            { name: 'User ID', value: targetUser.id, inline: true },
            { name: 'Username', value: targetUser.username, inline: true }
          ])
          .setThumbnail(targetUser.displayAvatarURL())
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'remove-admin': {
        const targetUser = interaction.options.getUser('user');
        const adminIds = await loadAdminIds();
        
        // Prevent removing the owner
        if (targetUser.id === OWNER_ID) {
          const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Cannot Remove Owner')
            .setDescription('The bot owner cannot be removed as admin.');
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        if (!adminIds.includes(targetUser.id)) {
          const embed = new EmbedBuilder()
            .setColor('#ffa500')
            .setTitle('⚠️ Not an Admin')
            .setDescription(`${targetUser.username} is not currently an admin.`);
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const updatedAdminIds = adminIds.filter(id => id !== targetUser.id);
        await saveAdminIds(updatedAdminIds);
        
        const embed = new EmbedBuilder()
          .setColor('#f87171')
          .setTitle('✅ Admin Removed')
          .setDescription(`Successfully removed ${targetUser.username} from admin list.`)
          .addFields([
            { name: 'User ID', value: targetUser.id, inline: true },
            { name: 'Username', value: targetUser.username, inline: true }
          ])
          .setThumbnail(targetUser.displayAvatarURL())
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'list-admins': {
        const adminIds = await loadAdminIds();
        
        let adminList = '';
        for (const adminId of adminIds) {
          try {
            const user = await client.users.fetch(adminId);
            const isOwner = adminId === OWNER_ID ? ' 👑' : '';
            adminList += `• ${user.username} (${adminId})${isOwner}\n`;
          } catch (error) {
            adminList += `• Unknown User (${adminId})\n`;
          }
        }
        
        const embed = new EmbedBuilder()
          .setColor('#8b7dd8')
          .setTitle('👥 Current Admins')
          .setDescription(adminList || 'No admins found.')
          .addFields([
            { name: 'Total Admins', value: adminIds.length.toString(), inline: true }
          ])
          .setFooter({ text: '👑 = Bot Owner' })
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'add-bot-user': {
        // Owner only command
        if (user.id !== OWNER_ID) {
          const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Owner Only')
            .setDescription('Only the bot owner can manage bot users.');
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const targetUser = interaction.options.getUser('user');
        const botUsers = await loadBotUsers();
        
        if (botUsers.includes(targetUser.id)) {
          const embed = new EmbedBuilder()
            .setColor('#ffa500')
            .setTitle('⚠️ Already Bot User')
            .setDescription(`${targetUser.username} already has bot access.`);
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        botUsers.push(targetUser.id);
        await saveBotUsers(botUsers);
        
        const embed = new EmbedBuilder()
          .setColor('#4ade80')
          .setTitle('✅ Bot User Added')
          .setDescription(`Successfully granted bot access to ${targetUser.username}.`)
          .addFields([
            { name: 'User ID', value: targetUser.id, inline: true },
            { name: 'Username', value: targetUser.username, inline: true }
          ])
          .setThumbnail(targetUser.displayAvatarURL())
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'remove-bot-user': {
        // Owner only command
        if (user.id !== OWNER_ID) {
          const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Owner Only')
            .setDescription('Only the bot owner can manage bot users.');
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const targetUser = interaction.options.getUser('user');
        const botUsers = await loadBotUsers();
        
        // Prevent removing the owner
        if (targetUser.id === OWNER_ID) {
          const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Cannot Remove Owner')
            .setDescription('The bot owner cannot be removed from bot users.');
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        if (!botUsers.includes(targetUser.id)) {
          const embed = new EmbedBuilder()
            .setColor('#ffa500')
            .setTitle('⚠️ Not a Bot User')
            .setDescription(`${targetUser.username} does not have bot access.`);
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const updatedBotUsers = botUsers.filter(id => id !== targetUser.id);
        await saveBotUsers(updatedBotUsers);
        
        const embed = new EmbedBuilder()
          .setColor('#f87171')
          .setTitle('✅ Bot User Removed')
          .setDescription(`Successfully removed bot access from ${targetUser.username}.`)
          .addFields([
            { name: 'User ID', value: targetUser.id, inline: true },
            { name: 'Username', value: targetUser.username, inline: true }
          ])
          .setThumbnail(targetUser.displayAvatarURL())
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'list-bot-users': {
        // Owner only command
        if (user.id !== OWNER_ID) {
          const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Owner Only')
            .setDescription('Only the bot owner can view bot users.');
          
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const botUsers = await loadBotUsers();
        
        let userList = '';
        for (const userId of botUsers) {
          try {
            const user = await client.users.fetch(userId);
            const isOwner = userId === OWNER_ID ? ' 👑' : '';
            userList += `• ${user.username} (${userId})${isOwner}\n`;
          } catch (error) {
            userList += `• Unknown User (${userId})\n`;
          }
        }
        
        const embed = new EmbedBuilder()
          .setColor('#8b7dd8')
          .setTitle('🤖 Bot Users')
          .setDescription(userList || 'No bot users found.')
          .addFields([
            { name: 'Total Users', value: botUsers.length.toString(), inline: true }
          ])
          .setFooter({ text: '👑 = Bot Owner' })
          .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'help': {
        const isOwner = user.id === OWNER_ID;
        const canUse = await canUseBot(user.id);
        
        const embed = new EmbedBuilder()
          .setColor('#8b7dd8')
          .setTitle('🤖 Luminous Scripts Admin Bot')
          .setDescription('Manage admin access for the Luminous Scripts website.');
        
        if (canUse) {
          embed.addFields([
            {
              name: '👥 Admin Management Commands',
              value: '`/add-admin <user>` - Add a user as website admin\n' +
                     '`/remove-admin <user>` - Remove admin access\n' +
                     '`/list-admins` - List all current admins',
              inline: false
            }
          ]);
        }
        
        if (isOwner) {
          embed.addFields([
            {
              name: '🤖 Bot User Management (Owner Only)',
              value: '`/add-bot-user <user>` - Grant bot command access\n' +
                     '`/remove-bot-user <user>` - Remove bot access\n' +
                     '`/list-bot-users` - List all bot users',
              inline: false
            }
          ]);
        }
        
        embed.addFields([
          {
            name: '❓ General',
            value: '`/help` - Show this help message',
            inline: false
          }
        ]);
        
        if (!canUse && !isOwner) {
          embed.setDescription('You do not have permission to use this bot. Contact the bot owner for access.');
          embed.setColor('#ff6b6b');
        }
        
        embed.setFooter({ text: 'Luminous Scripts Admin Management' })
             .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      }

      default:
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('❌ Unknown Command')
          .setDescription('Command not recognized. Use `/help` for available commands.');
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (error) {
    console.error('Error handling command:', error);
    
    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setTitle('❌ Error')
      .setDescription('An error occurred while processing your command.');
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Login to Discord
if (!BOT_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN is required in environment variables');
  process.exit(1);
}

if (!OWNER_ID) {
  console.error('❌ BOT_OWNER_ID is required in environment variables');
  process.exit(1);
}

client.login(BOT_TOKEN).catch((error) => {
  console.error('❌ Failed to login to Discord:', error);
  process.exit(1);
});