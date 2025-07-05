import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getGuildHistory, getTopSongs, getGlobalStats } from '../utils/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function startDashboard(client) {
    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    app.use(cors());
    app.use(express.json());
    app.use(express.static(join(__dirname, 'public')));

    // API Routes
    app.get('/api/stats', (req, res) => {
        res.json({
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            uptime: process.uptime(),
            ping: client.ws.ping
        });
    });

    app.get('/api/guilds', (req, res) => {
        const guilds = client.guilds.cache.map(guild => ({
            id: guild.id,
            name: guild.name,
            memberCount: guild.memberCount,
            icon: guild.iconURL(),
            playing: client.queues.has(guild.id)
        }));
        res.json(guilds);
    });

    app.get('/api/guild/:id/queue', (req, res) => {
        const queue = client.queues.get(req.params.id);
        if (!queue) {
            return res.json({ queue: [], currentSong: null });
        }
        res.json({
            queue: queue.queue,
            currentSong: queue.currentSong,
            loop: queue.loop
        });
    });

    app.get('/api/guild/:id/history', async (req, res) => {
        try {
            const history = await getGuildHistory(req.params.id, 50);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    });

    app.get('/api/guild/:id/top-songs', async (req, res) => {
        try {
            const topSongs = await getTopSongs(req.params.id, 20);
            res.json(topSongs);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch top songs' });
        }
    });

    app.get('/api/stats/global', async (req, res) => {
        try {
            const stats = await getGlobalStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch global stats' });
        }
    });

    // WebSocket for real-time updates
    io.on('connection', (socket) => {
        console.log('Dashboard connected');

        // Send initial data
        socket.emit('stats', {
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            uptime: process.uptime(),
            ping: client.ws.ping
        });

        // Send updates every 5 seconds
        const interval = setInterval(() => {
            socket.emit('stats', {
                guilds: client.guilds.cache.size,
                users: client.users.cache.size,
                uptime: process.uptime(),
                ping: client.ws.ping
            });
        }, 5000);

        socket.on('disconnect', () => {
            clearInterval(interval);
            console.log('Dashboard disconnected');
        });
    });

    const PORT = process.env.DASHBOARD_PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Dashboard running on http://localhost:${PORT}`);
    });

    return { app, io };
}