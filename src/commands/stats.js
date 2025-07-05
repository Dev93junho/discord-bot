import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUserStats, getGlobalStats, getTopSongs } from '../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View music statistics')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('User to view stats for (leave empty for your own stats)')
            .setRequired(false));

export async function execute(interaction) {
    await interaction.deferReply();
    
    const targetUser = interaction.options.getUser('user') || interaction.user;
    
    try {
        // Get user stats
        const userStats = await getUserStats(interaction.guildId, targetUser.id);
        
        // Get user's favorite songs
        const db = (await import('../utils/database.js')).default;
        const userFavorites = await new Promise((resolve, reject) => {
            db.all(
                `SELECT song_title, song_url, song_author, COUNT(*) as play_count 
                FROM play_history 
                WHERE guild_id = ? AND requested_by_id = ?
                GROUP BY song_url 
                ORDER BY play_count DESC 
                LIMIT 5`,
                [interaction.guildId, targetUser.id],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
        
        // Get server stats
        const serverTopSongs = await getTopSongs(interaction.guildId, 3);
        
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`🎵 Music Stats for ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { 
                    name: '📊 User Statistics', 
                    value: `Total Requests: **${userStats.total_requests || 0}**\nUnique Songs: **${userStats.unique_songs || 0}**`,
                    inline: true
                }
            );
        
        if (userFavorites && userFavorites.length > 0) {
            embed.addFields({
                name: '❤️ Favorite Songs',
                value: userFavorites.map((song, index) => 
                    `**${index + 1}.** ${song.song_title} (${song.play_count}x)`
                ).join('\n'),
                inline: false
            });
        }
        
        if (serverTopSongs && serverTopSongs.length > 0) {
            embed.addFields({
                name: '🏆 Server Top 3',
                value: serverTopSongs.map((song, index) => 
                    `**${index + 1}.** ${song.song_title} (${song.play_count} plays)`
                ).join('\n'),
                inline: false
            });
        }
        
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Stats command error:', error);
        await interaction.editReply('There was an error fetching statistics.');
    }
}