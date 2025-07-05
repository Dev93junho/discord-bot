import { Transform } from 'stream';
import prism from 'prism-media';

export function createOpusStream(stream) {
    // Create a transform stream that ensures proper audio format
    const opusEncoder = new prism.opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960,
    });

    return stream.pipe(opusEncoder);
}

export function fixAudioSpeed(stream) {
    // Transform stream to fix audio speed issues
    const audioFixer = new Transform({
        transform(chunk, encoding, callback) {
            // Pass through the chunk without modification
            // The key is ensuring proper format in createAudioResource
            callback(null, chunk);
        }
    });

    return stream.pipe(audioFixer);
}