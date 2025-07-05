import ytdl from 'ytdl-core';
import { PassThrough } from 'stream';

export class AudioPreloader {
    constructor() {
        this.cache = new Map();
        this.preloading = new Map();
        this.maxCacheSize = 5; // Maximum songs to cache
    }

    async preload(url, options = {}) {
        // Check if already cached
        if (this.cache.has(url)) {
            console.log(`Using cached audio for: ${url}`);
            return this.createStreamFromBuffer(this.cache.get(url));
        }

        // Check if currently preloading
        if (this.preloading.has(url)) {
            console.log(`Waiting for preload to complete: ${url}`);
            return this.preloading.get(url);
        }

        // Start preloading
        console.log(`Starting preload for: ${url}`);
        const preloadPromise = this._preloadAudio(url, options);
        this.preloading.set(url, preloadPromise);

        try {
            const buffer = await preloadPromise;
            this.preloading.delete(url);
            return this.createStreamFromBuffer(buffer);
        } catch (error) {
            this.preloading.delete(url);
            throw error;
        }
    }

    async _preloadAudio(url, options) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            let totalSize = 0;

            const stream = ytdl(url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                dlChunkSize: 0,
                ...options
            });

            stream.on('data', (chunk) => {
                chunks.push(chunk);
                totalSize += chunk.length;
                
                // Limit cache size (50MB per song max)
                if (totalSize > 50 * 1024 * 1024) {
                    stream.destroy();
                    reject(new Error('Audio file too large to cache'));
                }
            });

            stream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                
                // Cache management
                if (this.cache.size >= this.maxCacheSize) {
                    const firstKey = this.cache.keys().next().value;
                    this.cache.delete(firstKey);
                    console.log(`Removed oldest cache entry: ${firstKey}`);
                }

                this.cache.set(url, buffer);
                console.log(`Cached audio for: ${url} (${(totalSize / 1024 / 1024).toFixed(2)}MB)`);
                resolve(buffer);
            });

            stream.on('error', reject);
        });
    }

    createStreamFromBuffer(buffer) {
        const stream = new PassThrough();
        stream.end(buffer);
        return stream;
    }

    // Preload next song in queue
    async preloadNext(url, options = {}) {
        if (!this.cache.has(url) && !this.preloading.has(url)) {
            // Preload in background without waiting
            this.preload(url, options).catch(err => {
                console.error('Background preload failed:', err);
            });
        }
    }

    clearCache() {
        this.cache.clear();
        console.log('Audio cache cleared');
    }

    getCacheInfo() {
        const info = [];
        for (const [url, buffer] of this.cache) {
            info.push({
                url,
                size: (buffer.length / 1024 / 1024).toFixed(2) + 'MB'
            });
        }
        return info;
    }
}