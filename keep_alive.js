import express from 'express';

// Keep-alive server for Replit
export function keepAlive() {
    const app = express();
    
    app.get('/', (req, res) => {
        res.send('Bot is alive!');
    });
    
    const PORT = process.env.REPLIT_PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Keep-alive server running on port ${PORT}`);
    });
}

// UptimeRobot이나 다른 모니터링 서비스로 이 URL을 5분마다 ping하면
// Replit 봇이 계속 켜져있게 됩니다.