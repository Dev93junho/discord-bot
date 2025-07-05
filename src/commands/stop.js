import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playing music and clear the queue');

export async function execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: 'You need to be in a voice channel!', ephemeral: true });
    }
    
    const queue = client.queues.get(interaction.guildId);
    if (!queue || !queue.connection) {
        return interaction.reply({ content: 'There is nothing playing!', ephemeral: true });
    }
    
    queue.stop();
    client.queues.delete(interaction.guildId);
    
    await interaction.reply('Stopped playing and cleared the queue!');
}