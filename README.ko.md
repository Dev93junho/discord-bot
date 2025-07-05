# 🎵 Discord 음악 봇

<div align="center">
  <img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" alt="Discord.js">
  <img src="https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
</div>

<div align="center">
  <p>고급 대기열 관리, 재생 기록 추적 및 웹 대시보드를 갖춘 YouTube 음악 재생용 기능이 풍부한 Discord 봇입니다.</p>
  <p>
    <a href="#기능">기능</a> •
    <a href="#설치">설치</a> •
    <a href="#명령어">명령어</a> •
    <a href="#로드맵">로드맵</a> •
    <a href="#기여">기여</a>
  </p>
  <p>
    <a href="README.md">🌐 English</a> •
    <a href="README.ko.md">🇰🇷 한국어</a>
  </p>
</div>

---

## ✨ 기능

### 🎶 음악 재생
- YouTube 검색 및 URL 재생
- 셔플 및 반복 기능이 있는 대기열 관리
- 고품질 오디오 스트리밍
- 비활성 시 자동 연결 해제

### 📊 분석 및 기록
- 서버별 재생 기록 추적
- 사용자 통계 및 선호도
- 가장 많이 재생된 노래 추적
- 기록 기반 스마트 추천

### 🖥️ 웹 대시보드
- 실시간 서버 통계
- 대기열 시각화
- 재생 기록 브라우저
- 서버 관리 인터페이스

### 🎯 스마트 기능
- 인기곡 자동 재생목록
- 개인화된 추천
- 서버 간 통계
- 고급 권한 시스템

## 📋 요구사항

- Node.js 18.0.0 이상
- Discord 봇 토큰 ([가이드](https://discordjs.guide/preparations/setting-up-a-bot-application.html))
- FFmpeg 설치
- npm 또는 yarn 패키지 매니저

## 🚀 설치

### 1. 저장소 복제
```bash
git clone https://github.com/Dev93junho/discord-bot.git
cd discord-bot
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 설정
```bash
cp .env.example .env
```

`.env` 파일 수정:
```env
DISCORD_TOKEN=여기에_봇_토큰_입력
CLIENT_ID=여기에_클라이언트_ID_입력
DASHBOARD_PORT=3000 # 선택사항
```

### 4. 봇 시작
```bash
npm start
```

개발 모드 (자동 재시작):
```bash
npm run dev
```

## 📝 명령어

### 🎵 음악 명령어
| 명령어 | 설명 | 사용법 |
|---------|-------------|-------|
| `/play` | YouTube에서 노래 재생 | `/play <노래 이름 또는 URL>` |
| `/pause` | 현재 재생 일시정지 | `/pause` |
| `/resume` | 재생 재개 | `/resume` |
| `/skip` | 현재 노래 건너뛰기 | `/skip` |
| `/stop` | 재생 중지 및 대기열 초기화 | `/stop` |
| `/queue` | 현재 대기열 표시 | `/queue` |
| `/loop` | 반복 모드 전환 | `/loop` |

### 📊 분석 명령어
| 명령어 | 설명 | 사용법 |
|---------|-------------|-------|
| `/history` | 재생 기록 보기 | `/history [타입: recent/top]` |
| `/stats` | 사용자 통계 보기 | `/stats [사용자]` |
| `/recommend` | 노래 추천 받기 | `/recommend [타입: random/popular/recent]` |
| `/playlist` | 인기곡 자동 재생 | `/playlist [개수]` |

### 🛠️ 유틸리티 명령어
| 명령어 | 설명 | 사용법 |
|---------|-------------|-------|
| `/cache` | 오디오 캐시 관리 | `/cache [액션: info/clear]` |

## 🗺️ 개발 로드맵

### ✅ 완료된 기능
- [x] 기본 음악 재생
- [x] 대기열 관리
- [x] 재생 기록 데이터베이스
- [x] 웹 대시보드
- [x] 추천 시스템
- [x] 사용자 통계

### 🚧 진행 중
- [ ] 게임 화면 캡처 시스템
- [ ] 고급 권한 관리
- [ ] 사용자 정의 재생목록

### 📅 계획된 기능

<details>
<summary><b>1단계: 게임 통합 (다음)</b></summary>

- **화면 캡처 시스템**
  - [ ] `/capture` - 게임플레이 스크린샷 촬영
  - [ ] 이벤트 시 자동 캡처 (킬, 승리)
  - [ ] 하이라이트 포함 게임플레이 녹화
  - [ ] 클라우드 스토리지 통합

- **게임 통합**
  - [ ] 실행 중인 게임 자동 감지
  - [ ] 게임별 전용 명령어
  - [ ] 게임별 통계 추적
</details>

<details>
<summary><b>2단계: 향상된 권한 (계획됨)</b></summary>

- **권한 시스템**
  - [ ] 역할 기반 명령어 접근
  - [ ] 역할별 명령어 쿨다운
  - [ ] 서버별 설정
  - [ ] 권한 프리셋

- **다중 서버 기능**
  - [ ] 전역 vs 로컬 설정
  - [ ] 서버 간 재생목록
  - [ ] 서버 연합
</details>

<details>
<summary><b>3단계: 음악 확장 (향후)</b></summary>

- **재생목록 기능**
  - [ ] 재생목록 저장/불러오기
  - [ ] 협업 재생목록
  - [ ] 재생목록 공유
  - [ ] 스마트 셔플

- **플랫폼 지원**
  - [ ] Spotify 통합
  - [ ] SoundCloud 지원
  - [ ] 직접 파일 업로드
  - [ ] 라이브 라디오 스트림
</details>

<details>
<summary><b>4단계: AI 기능 (향후)</b></summary>

- **AI 통합**
  - [ ] 자연어 명령
  - [ ] 음악 추천
  - [ ] 채팅 관리
  - [ ] 음성 명령
</details>

### 🎯 우선순위 대기열
1. 🎮 화면 캡처 시스템
2. 🔐 권한 관리
3. 📋 재생목록 시스템
4. 🚀 성능 최적화

## 📊 프로젝트 현황

### 현재 버전: v1.5.0
- 최신 릴리스: 2025년 7월
- 활발한 개발: 예
- 커뮤니티: 성장 중

### 통계
- 명령어: 12개 이상의 활성 명령어
- 서버: 개인 사용 (확장 중)
- 가동 시간: 99.9%

## 🤝 기여

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](CONTRIBUTING.md)을 참조하세요.

### 기여자를 위한 빠른 시작
1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/놀라운기능`)
3. 변경사항 커밋 (`git commit -m 'feat: 놀라운 기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/놀라운기능`)
5. Pull Request 열기

### 개발 설정
```bash
# 포크 복제
git clone https://github.com/YOUR_USERNAME/discord-bot.git

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 테스트 실행
npm test
```

## 🐛 알려진 문제

- YouTube가 가끔 요청을 차단할 수 있음 (VPN 사용을 우회 방법으로 권장)
- 일부 트랙에서 오디오 속도 문제 (FFmpeg 처리 구현됨)
- Discord에서 명령어 등록이 표시되는 데 1-2분 소요될 수 있음

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [Discord.js](https://discord.js.org/) - Discord API 래퍼
- [@distube/ytdl-core](https://github.com/distube/ytdl-core) - YouTube 다운로더
- [FFmpeg](https://ffmpeg.org/) - 오디오 처리
- 커뮤니티 기여자들

## 📞 지원

- **이슈**: [GitHub Issues](https://github.com/Dev93junho/discord-bot/issues)
- **토론**: [GitHub Discussions](https://github.com/Dev93junho/discord-bot/discussions)
- **이메일**: your-email@example.com

---

<div align="center">
  <p><a href="https://github.com/Dev93junho">Dev93junho</a>가 ❤️를 담아 제작</p>
  <p>⭐ 도움이 되셨다면 이 저장소에 별표를 남겨주세요!</p>
</div>