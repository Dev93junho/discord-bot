import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue');

export async function execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);
    
    if (!queue || queue.getQueue().length === 0) {
        return interaction.reply({ content: 'The queue is empty!', ephemeral: true });
    }
    
    const songs = queue.getQueue();
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Music Queue')
        .setDescription(
            songs.map((song, index) => {
                const prefix = index === 0 ? '🎵 **Now Playing:**' : `**${index}.**`;
                return `${prefix} [${song.title}](${song.url})`;
            }).join('\n')
        )
        .setFooter({ text: `${songs.length} songs in queue` });
    
    await interaction.reply({ embeds: [embed] });
}