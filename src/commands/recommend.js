import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getTopSongs, getGuildHistory } from '../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('recommend')
    .setDescription('Get song recommendations based on play history')
    .addStringOption(option =>
        option.setName('type')
            .setDescription('Recommendation type')
            .setRequired(false)
            .addChoices(
                { name: 'Random from history', value: 'random' },
                { name: 'Most played', value: 'popular' },
                { name: 'Recently played', value: 'recent' }
            ));

export async function execute(interaction) {
    await interaction.deferReply();
    
    const type = interaction.options.getString('type') || 'popular';
    
    try {
        let embed;
        
        switch (type) {
            case 'random': {
                const history = await getGuildHistory(interaction.guildId, 100);
                if (history.length === 0) {
                    return interaction.editReply('No play history found. Play some songs first!');
                }
                
                // Get 5 random songs from history
                const randomSongs = [];
                const usedIndexes = new Set();
                
                while (randomSongs.length < Math.min(5, history.length) && usedIndexes.size < history.length) {
                    const randomIndex = Math.floor(Math.random() * history.length);
                    if (!usedIndexes.has(randomIndex)) {
                        usedIndexes.add(randomIndex);
                        randomSongs.push(history[randomIndex]);
                    }
                }
                
                embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle('🎲 Random Recommendations')
                    .setDescription(
                        randomSongs.map((song, index) => 
                            `**${index + 1}.** [${song.song_title}](${song.song_url})\nBy ${song.song_author}`
                        ).join('\n\n')
                    )
                    .setFooter({ text: 'Use /play to play any of these songs!' });
                break;
            }
            
            case 'popular': {
                const topSongs = await getTopSongs(interaction.guildId, 10);
                if (topSongs.length === 0) {
                    return interaction.editReply('No play history found. Play some songs first!');
                }
                
                embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle('🔥 Most Popular Songs')
                    .setDescription(
                        topSongs.map((song, index) => 
                            `**${index + 1}.** [${song.song_title}](${song.song_url})\nBy ${song.song_author} • Played **${song.play_count}** times`
                        ).join('\n\n')
                    )
                    .setFooter({ text: 'These are the server favorites!' });
                break;
            }
            
            case 'recent': {
                const recentHistory = await getGuildHistory(interaction.guildId, 20);
                if (recentHistory.length === 0) {
                    return interaction.editReply('No play history found. Play some songs first!');
                }
                
                // Remove duplicates, keeping only the most recent
                const uniqueSongs = [];
                const seenUrls = new Set();
                
                for (const song of recentHistory) {
                    if (!seenUrls.has(song.song_url)) {
                        seenUrls.add(song.song_url);
                        uniqueSongs.push(song);
                        if (uniqueSongs.length >= 10) break;
                    }
                }
                
                embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle('🕐 Recently Played')
                    .setDescription(
                        uniqueSongs.map((song, index) => 
                            `**${index + 1}.** [${song.song_title}](${song.song_url})\nBy ${song.song_author}`
                        ).join('\n\n')
                    )
                    .setFooter({ text: 'Your recent listening history' });
                break;
            }
        }
        
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Recommend command error:', error);
        await interaction.editReply('There was an error getting recommendations.');
    }
}