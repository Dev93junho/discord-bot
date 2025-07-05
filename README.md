# 🎵 Discord Music Bot

<div align="center">
  <img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" alt="Discord.js">
  <img src="https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
</div>

<div align="center">
  <p>A feature-rich Discord bot for playing YouTube music with advanced queue management, play history tracking, and a web dashboard.</p>
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#commands">Commands</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#contributing">Contributing</a>
  </p>
  <p>
    <a href="README.md">🌐 English</a> •
    <a href="README.ko.md">🇰🇷 한국어</a>
  </p>
</div>

---

## ✨ Features

### 🎶 Music Playback
- YouTube search and URL playback
- Queue management with shuffle and loop
- High-quality audio streaming
- Automatic disconnect on inactivity

### 📊 Analytics & History
- Play history tracking per server
- User statistics and preferences
- Most played songs tracking
- Smart recommendations based on history

### 🖥️ Web Dashboard
- Real-time server statistics
- Queue visualization
- Play history browser
- Server management interface

### 🎯 Smart Features
- Auto-playlist from popular songs
- Personalized recommendations
- Cross-server statistics
- Advanced permission system

## 📋 Requirements

- Node.js 18.0.0 or higher
- Discord Bot Token ([Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html))
- FFmpeg installed on your system
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Dev93junho/discord-bot.git
cd discord-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
DASHBOARD_PORT=3000 # Optional
```

### 4. Start the bot
```bash
npm start
```

For development mode with auto-restart:
```bash
npm run dev
```

## 📝 Commands

### 🎵 Music Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/play` | Play a song from YouTube | `/play <song name or URL>` |
| `/pause` | Pause current playback | `/pause` |
| `/resume` | Resume playback | `/resume` |
| `/skip` | Skip current song | `/skip` |
| `/stop` | Stop playback and clear queue | `/stop` |
| `/queue` | Show current queue | `/queue` |
| `/loop` | Toggle loop mode | `/loop` |

### 📊 Analytics Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/history` | View play history | `/history [type: recent/top]` |
| `/stats` | View user statistics | `/stats [user]` |
| `/recommend` | Get song recommendations | `/recommend [type: random/popular/recent]` |
| `/playlist` | Auto-play popular songs | `/playlist [count]` |

### 🛠️ Utility Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/cache` | Manage audio cache | `/cache [action: info/clear]` |

## 🗺️ Development Roadmap

### ✅ Completed Features
- [x] Basic music playback
- [x] Queue management
- [x] Play history database
- [x] Web dashboard
- [x] Recommendation system
- [x] User statistics

### 🚧 In Progress
- [ ] Screen capture system for gaming
- [ ] Advanced permission management
- [ ] Custom playlists

### 📅 Planned Features

<details>
<summary><b>Phase 1: Gaming Integration (Q3 2025)</b></summary>

- **Screen Capture System**
  - [ ] `/capture` - Take gameplay screenshots
  - [ ] Auto-capture on events (kills, wins)
  - [ ] Gameplay recording with highlights
  - [ ] Cloud storage integration

- **Game Integration**
  - [ ] Auto-detect running games
  - [ ] Game-specific commands
  - [ ] Stats tracking per game
</details>

<details>
<summary><b>Phase 2: Enhanced Permissions (Q4 2025)</b></summary>

- **Permission System**
  - [ ] Role-based command access
  - [ ] Command cooldowns per role
  - [ ] Server-specific settings
  - [ ] Permission presets

- **Multi-Server Features**
  - [ ] Global vs local settings
  - [ ] Cross-server playlists
  - [ ] Server federation
</details>

<details>
<summary><b>Phase 3: Music Expansion (Q1 2026)</b></summary>

- **Playlist Features**
  - [ ] Save/load playlists
  - [ ] Collaborative playlists
  - [ ] Playlist sharing
  - [ ] Smart shuffle

- **Platform Support**
  - [ ] Spotify integration
  - [ ] SoundCloud support
  - [ ] Direct file uploads
  - [ ] Live radio streams
</details>

<details>
<summary><b>Phase 4: AI Features (Q2 2026)</b></summary>

- **AI Integration**
  - [ ] Natural language commands
  - [ ] Music recommendations
  - [ ] Chat moderation
  - [ ] Voice commands
</details>

### 🎯 Priority Queue
1. 🎮 Screen capture system
2. 🔐 Permission management
3. 📋 Playlist system
4. 🚀 Performance optimization

## 📊 Project Status

### Current Version: v1.5.0
- Latest Release: July 2025
- Active Development: Yes
- Community: Growing

### Statistics
- Commands: 12+ active commands
- Servers: Personal use (expanding)
- Uptime: 99.9%

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Start for Contributors
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/discord-bot.git

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

## 🐛 Known Issues

- YouTube may occasionally block requests (use VPN as workaround)
- Audio speed issues on some tracks (FFmpeg processing implemented)
- Command registration may take 1-2 minutes to appear in Discord

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [@distube/ytdl-core](https://github.com/distube/ytdl-core) - YouTube downloader
- [FFmpeg](https://ffmpeg.org/) - Audio processing
- Community contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Dev93junho/discord-bot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Dev93junho/discord-bot/discussions)
- **Email**: your-email@example.com

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Dev93junho">Dev93junho</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>