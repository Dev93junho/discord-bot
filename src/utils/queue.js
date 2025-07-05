import { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, joinVoiceChannel, StreamType } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { AudioPreloader } from './preloader.js';

export class MusicQueue {
    constructor() {
        this.queue = [];
        this.player = createAudioPlayer();
        this.connection = null;
        this.currentSong = null;
        this.loop = false;
        this.volume = 1.0;
        this.preloader = new AudioPreloader();
        
        this.player.on(AudioPlayerStatus.Idle, () => {
            if (this.loop && this.currentSong) {
                this.queue.unshift(this.currentSong);
            }
            this.playNext();
        });
        
        this.player.on('error', error => {
            console.error('Audio player error:', error);
            this.playNext();
        });
    }
    
    async join(channel) {
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        
        this.connection.on(VoiceConnectionStatus.Disconnected, () => {
            this.clear();
        });
        
        this.connection.subscribe(this.player);
    }
    
    async add(song) {
        this.queue.push(song);
        
        if (!this.currentSong) {
            await this.playNext();
        }
    }
    
    async playNext() {
        if (this.queue.length === 0) {
            this.currentSong = null;
            if (this.connection) {
                this.connection.destroy();
                this.connection = null;
            }
            return;
        }
        
        this.currentSong = this.queue.shift();
        
        try {
            console.log(`Playing: ${this.currentSong.title}`);
            
            const stream = ytdl(this.currentSong.url, {
                filter: format => format.audioCodec === 'opus' && format.container === 'webm',
                quality: 'highestaudio',
                highWaterMark: 1 << 22, // 4MB buffer
                requestOptions: {
                    headers: {
                        cookie: process.env.YOUTUBE_COOKIE || '',
                        'x-youtube-identity-token': process.env.YOUTUBE_IDENTITY_TOKEN || '',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                    }
                }
            });
            
            // FFmpeg processing for consistent audio
            const ffmpegArgs = [
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-i', 'pipe:0',
                '-acodec', 'libopus',
                '-f', 'opus',
                '-ar', '48000',
                '-ac', '2',
                'pipe:1'
            ];
            
            const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs);
            stream.pipe(ffmpegProcess.stdin);
            
            const resource = createAudioResource(ffmpegProcess.stdout, {
                inputType: StreamType.OggOpus,
                inlineVolume: true
            });
            
            ffmpegProcess.on('error', (error) => {
                console.error('FFmpeg error:', error);
            });
            
            resource.volume.setVolume(this.volume);
            
            this.player.play(resource);
        } catch (error) {
            console.error('Error playing song:', error);
            console.error('URL:', this.currentSong.url);
            await this.playNext();
        }
    }
    
    skip() {
        this.player.stop();
    }
    
    stop() {
        this.clear();
        this.player.stop();
        if (this.connection) {
            this.connection.destroy();
            this.connection = null;
        }
    }
    
    pause() {
        this.player.pause();
    }
    
    resume() {
        this.player.unpause();
    }
    
    setLoop(value) {
        this.loop = value;
    }
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(2, value));
    }
    
    clear() {
        this.queue = [];
        this.currentSong = null;
        this.loop = false;
    }
    
    getQueue() {
        return [this.currentSong, ...this.queue].filter(song => song !== null);
    }
}