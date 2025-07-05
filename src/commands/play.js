import { SlashCommandBuilder } from 'discord.js';
import { MusicQueue } from '../utils/queue.js';
import YouTube from 'youtube-sr';
import ytdl from '@distube/ytdl-core';
import { savePlayHistory } from '../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(option =>
        option.setName('query')
            .setDescription('Song name or YouTube URL')
            .setRequired(true));

export async function execute(interaction, client) {
    await interaction.deferReply();
    
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.editReply('You need to be in a voice channel to play music!');
    }
    
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
        return interaction.editReply('I need the permissions to join and speak in your voice channel!');
    }
    
    const query = interaction.options.getString('query');
    
    let queue = client.queues.get(interaction.guildId);
    if (!queue) {
        queue = new MusicQueue();
        client.queues.set(interaction.guildId, queue);
    }
    
    try {
        let songInfo;
        
        if (ytdl.validateURL(query)) {
            const info = await ytdl.getInfo(query, {
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                    }
                }
            });
            songInfo = {
                title: info.videoDetails.title,
                url: info.videoDetails.video_url,
                duration: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails[0].url,
                author: info.videoDetails.author.name
            };
        } else {
            const searchResults = await YouTube.search(query, { limit: 1 });
            if (searchResults.length === 0) {
                return interaction.editReply('No results found!');
            }
            
            const video = searchResults[0];
            songInfo = {
                title: video.title,
                url: video.url,
                duration: video.duration,
                thumbnail: video.thumbnail?.url,
                author: video.channel?.name
            };
        }
        
        if (!queue.connection) {
            await queue.join(voiceChannel);
        }
        
        await queue.add(songInfo);
        
        // Save to play history
        savePlayHistory({
            guildId: interaction.guildId,
            guildName: interaction.guild.name,
            songTitle: songInfo.title,
            songUrl: songInfo.url,
            songAuthor: songInfo.author,
            requestedBy: interaction.user.username,
            requestedById: interaction.user.id
        });
        
        const embed = {
            color: 0x0099ff,
            title: 'Added to queue',
            description: `[${songInfo.title}](${songInfo.url})`,
            thumbnail: {
                url: songInfo.thumbnail
            },
            fields: [
                {
                    name: 'Channel',
                    value: songInfo.author,
                    inline: true
                },
                {
                    name: 'Queue Position',
                    value: queue.getQueue().length.toString(),
                    inline: true
                }
            ]
        };
        
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Play command error:', error);
        await interaction.editReply('There was an error trying to play that song!');
    }
}