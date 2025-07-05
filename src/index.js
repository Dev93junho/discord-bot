import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { startDashboard } from './dashboard/server.js';
import { initDatabase } from './utils/database.js';

config();

// Debug: Check environment variables
console.log('Environment check:');
console.log('DISCORD_TOKEN exists:', !!process.env.DISCORD_TOKEN);
console.log('TOKEN length:', process.env.DISCORD_TOKEN?.length || 0);
console.log('CLIENT_ID:', process.env.CLIENT_ID);



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
client.queues = new Map();

async function loadCommands() {
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = await import(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`Loaded command: ${command.data.name}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    
    console.log(`Total commands loaded: ${client.commands.size}`);
}

client.once('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    try {
        // Initialize database
        initDatabase();
        console.log('Database initialized.');
        
        await loadCommands();
        
        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });
        
        await client.application.commands.set(commands);
        console.log('Successfully registered application commands.');
        console.log('Registered commands:', commands.map(cmd => cmd.name).join(', '));
        
        // Start dashboard
        startDashboard(client);
    } catch (error) {
        console.error('Error registering commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        console.error('Available commands:', Array.from(client.commands.keys()).join(', '));
        await interaction.reply({ 
            content: '⚠️ 이 명령어를 찾을 수 없습니다. 봇을 재시작하거나 잠시 후 다시 시도해주세요.', 
            ephemeral: true 
        });
        return;
    }

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);