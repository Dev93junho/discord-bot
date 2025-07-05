import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH || join(__dirname, '../../music_history.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
export function initDatabase() {
    db.serialize(() => {
        // Create play history table
        db.run(`CREATE TABLE IF NOT EXISTS play_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guild_id TEXT NOT NULL,
            guild_name TEXT NOT NULL,
            song_title TEXT NOT NULL,
            song_url TEXT NOT NULL,
            song_author TEXT,
            requested_by TEXT NOT NULL,
            requested_by_id TEXT NOT NULL,
            played_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create index for faster queries
        db.run(`CREATE INDEX IF NOT EXISTS idx_guild_id ON play_history(guild_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_played_at ON play_history(played_at)`);
    });
}

// Save play history
export function savePlayHistory(data) {
    const stmt = db.prepare(`INSERT INTO play_history 
        (guild_id, guild_name, song_title, song_url, song_author, requested_by, requested_by_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    stmt.run(
        data.guildId,
        data.guildName,
        data.songTitle,
        data.songUrl,
        data.songAuthor,
        data.requestedBy,
        data.requestedById
    );
    
    stmt.finalize();
}

// Get play history for a guild
export function getGuildHistory(guildId, limit = 50) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM play_history 
            WHERE guild_id = ? 
            ORDER BY played_at DESC 
            LIMIT ?`,
            [guildId, limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

// Get most played songs for a guild
export function getTopSongs(guildId, limit = 10) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT song_title, song_url, song_author, COUNT(*) as play_count 
            FROM play_history 
            WHERE guild_id = ? 
            GROUP BY song_url 
            ORDER BY play_count DESC 
            LIMIT ?`,
            [guildId, limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

// Get user statistics
export function getUserStats(guildId, userId) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT COUNT(*) as total_requests, 
                    COUNT(DISTINCT song_url) as unique_songs
            FROM play_history 
            WHERE guild_id = ? AND requested_by_id = ?`,
            [guildId, userId],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            }
        );
    });
}

// Get global statistics
export function getGlobalStats() {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT 
                COUNT(DISTINCT guild_id) as total_guilds,
                COUNT(*) as total_plays,
                COUNT(DISTINCT song_url) as unique_songs,
                COUNT(DISTINCT requested_by_id) as unique_users
            FROM play_history`,
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
}

// Search history
export function searchHistory(guildId, query) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM play_history 
            WHERE guild_id = ? AND (
                song_title LIKE ? OR 
                song_author LIKE ? OR 
                requested_by LIKE ?
            )
            ORDER BY played_at DESC 
            LIMIT 50`,
            [guildId, `%${query}%`, `%${query}%`, `%${query}%`],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

export default db;