import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Force refresh commands
async function registerCommands() {
    const commands = [];
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // Load all commands
    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = await import(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`Loaded command: ${command.data.name}`);
        }
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        console.log(`\nForce refreshing ${commands.length} application (/) commands...`);
        
        // First, delete all existing commands
        console.log('Deleting existing commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] },
        );
        
        // Wait a bit for Discord to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Then register new commands
        console.log('Registering new commands...');
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully registered ${data.length} commands globally.`);
        console.log('\nRegistered commands:');
        data.forEach(cmd => {
            console.log(`  /${cmd.name} - ${cmd.description}`);
        });
        
        console.log('\n✅ Commands should appear in Discord within 1-2 minutes.');
        console.log('💡 Tips if commands don\'t appear:');
        console.log('  1. Restart Discord (Ctrl+R or Cmd+R)');
        console.log('  2. Wait 1-2 minutes for Discord to update');
        console.log('  3. Make sure the bot is in your server');
        console.log('  4. Check bot has "applications.commands" scope');
        
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

registerCommands();