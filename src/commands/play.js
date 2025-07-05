import { SlashCommandBuilder } from 'discord.js';
import { MusicQueue } from '../utils/queue.js';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
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
        let url;
        
        // Check if it's a YouTube URL
        if (ytdl.validateURL(query)) {
            url = query;
        } else {
            // Search YouTube
            const searchResults = await ytsr(query, { limit: 1 });
            const video = searchResults.items.find(item => item.type === 'video');
            
            if (!video) {
                return interaction.editReply('No results found! Try a different search term.');
            }
            
            url = video.url;
        }
        
        // Get video info with cookie support
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    cookie: process.env.YOUTUBE_COOKIE || '',
                    'x-youtube-identity-token': process.env.YOUTUBE_IDENTITY_TOKEN || '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                }
            }
        });
        
        songInfo = {
            title: info.videoDetails.title,
            url: info.videoDetails.video_url,
            duration: info.videoDetails.lengthSeconds,
            thumbnail: info.videoDetails.thumbnails[0]?.url,
            author: info.videoDetails.author.name
        };
        
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
        await interaction.editReply('There was an error trying to play that song! YouTube might be blocking requests. Please try again later.');
    }
}