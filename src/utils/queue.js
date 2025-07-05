import { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, joinVoiceChannel } from '@discordjs/voice';
import playdl from 'play-dl';

export class MusicQueue {
    constructor() {
        this.queue = [];
        this.player = createAudioPlayer();
        this.connection = null;
        this.currentSong = null;
        this.loop = false;
        this.volume = 1.0;
        
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
            const stream = await playdl.stream(this.currentSong.url);
            
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });
            
            resource.volume.setVolume(this.volume);
            
            this.player.play(resource);
        } catch (error) {
            console.error('Error playing song:', error);
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