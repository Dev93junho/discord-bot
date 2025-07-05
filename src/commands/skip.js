import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song');

export async function execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: 'You need to be in a voice channel!', ephemeral: true });
    }
    
    const queue = client.queues.get(interaction.guildId);
    if (!queue || !queue.currentSong) {
        return interaction.reply({ content: 'There is nothing playing!', ephemeral: true });
    }
    
    queue.skip();
    
    await interaction.reply('Skipped the current song!');
}