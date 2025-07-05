import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildHistory, getTopSongs } from '../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('history')
    .setDescription('Show music play history')
    .addStringOption(option =>
        option.setName('type')
            .setDescription('History type')
            .setRequired(false)
            .addChoices(
                { name: 'Recent', value: 'recent' },
                { name: 'Top Songs', value: 'top' }
            ));

export async function execute(interaction) {
    await interaction.deferReply();
    
    const type = interaction.options.getString('type') || 'recent';
    
    try {
        let embed;
        
        if (type === 'recent') {
            const history = await getGuildHistory(interaction.guildId, 20);
            
            if (history.length === 0) {
                return interaction.editReply('No play history found for this server.');
            }
            
            embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Recent Play History')
                .setDescription(
                    history.map((entry, index) => {
                        const date = new Date(entry.played_at);
                        return `**${index + 1}.** [${entry.song_title}](${entry.song_url})
                        By ${entry.song_author} • Requested by ${entry.requested_by}
                        ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                    }).join('\n\n')
                )
                .setFooter({ text: `Showing last ${history.length} songs` });
        } else {
            const topSongs = await getTopSongs(interaction.guildId, 10);
            
            if (topSongs.length === 0) {
                return interaction.editReply('No play history found for this server.');
            }
            
            embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Top Played Songs')
                .setDescription(
                    topSongs.map((song, index) => {
                        return `**${index + 1}.** [${song.song_title}](${song.song_url})
                        By ${song.song_author}
                        Played **${song.play_count}** times`;
                    }).join('\n\n')
                )
                .setFooter({ text: `Top ${topSongs.length} most played songs` });
        }
        
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('History command error:', error);
        await interaction.editReply('There was an error fetching the history.');
    }
}