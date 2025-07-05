import { SlashCommandBuilder } from 'discord.js';
import { getTopSongs } from '../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Play popular songs automatically')
    .addStringOption(option =>
        option.setName('count')
            .setDescription('Number of songs to play (default: 5, max: 20)')
            .setRequired(false));

export async function execute(interaction, client) {
    await interaction.deferReply();
    
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.editReply('You need to be in a voice channel!');
    }
    
    const count = Math.min(parseInt(interaction.options.getString('count') || '5'), 20);
    
    try {
        const topSongs = await getTopSongs(interaction.guildId, count);
        
        if (topSongs.length === 0) {
            return interaction.editReply('No songs in history. Play some songs first to build a playlist!');
        }
        
        let queue = client.queues.get(interaction.guildId);
        if (!queue) {
            const { MusicQueue } = await import('../utils/queue.js');
            queue = new MusicQueue();
            client.queues.set(interaction.guildId, queue);
        }
        
        if (!queue.connection) {
            await queue.join(voiceChannel);
        }
        
        // Add all songs to queue
        for (const song of topSongs) {
            await queue.add({
                title: song.song_title,
                url: song.song_url,
                duration: 0,
                thumbnail: '',
                author: song.song_author
            });
        }
        
        const embed = {
            color: 0x0099ff,
            title: '🎵 Playlist Started',
            description: `Added **${topSongs.length}** popular songs to the queue!`,
            fields: [
                {
                    name: 'Songs',
                    value: topSongs.map((song, index) => 
                        `${index + 1}. ${song.song_title} (${song.play_count} plays)`
                    ).slice(0, 10).join('\n')
                }
            ],
            footer: {
                text: 'Based on this server\'s most played songs'
            }
        };
        
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Playlist command error:', error);
        await interaction.editReply('There was an error creating the playlist.');
    }
}