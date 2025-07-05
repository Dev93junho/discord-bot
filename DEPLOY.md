# 배포 가이드

## Railway 배포 (추천)

### 1. 준비사항
- GitHub 계정
- Railway 계정 (GitHub로 가입 가능)
- Discord Bot Token

### 2. GitHub에 코드 업로드
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3. Railway 배포
1. [Railway](https://railway.app) 접속
2. "New Project" → "Deploy from GitHub repo"
3. 레포지토리 선택
4. 환경변수 설정:
   - `DISCORD_TOKEN`: 봇 토큰
   - `CLIENT_ID`: 애플리케이션 ID
   - `DASHBOARD_PORT`: 3000 (선택사항)

### 4. 배포 완료
- Railway가 자동으로 빌드 및 배포
- Logs 탭에서 봇 상태 확인

## Render 배포

### 1. render.yaml 생성
```yaml
services:
  - type: web
    name: discord-music-bot
    env: node
    buildCommand: npm install
    startCommand: node src/index.js
    envVars:
      - key: DISCORD_TOKEN
        sync: false
      - key: CLIENT_ID
        sync: false
```

### 2. Render Dashboard
1. [Render](https://render.com) 가입
2. "New+" → "Web Service"
3. GitHub 연결 및 레포 선택
4. 환경변수 입력

## Fly.io 배포

### 1. Fly CLI 설치
```bash
brew install flyctl  # macOS
# 또는
curl -L https://fly.io/install.sh | sh
```

### 2. 앱 생성 및 배포
```bash
fly auth login
fly launch
fly secrets set DISCORD_TOKEN=your_token
fly secrets set CLIENT_ID=your_client_id
fly deploy
```

## Replit 배포

### 1. Replit 설정
1. [Replit](https://replit.com)에서 "Import from GitHub"
2. 레포지토리 URL 입력
3. Secrets 탭에서 환경변수 설정

### 2. .replit 파일
```
run = "npm start"
```

## 환경변수 설정

모든 플랫폼에서 필요한 환경변수:
- `DISCORD_TOKEN`: Discord 봇 토큰
- `CLIENT_ID`: Discord 애플리케이션 ID
- `DATABASE_PATH`: SQLite 데이터베이스 경로 (선택사항)
- `DASHBOARD_PORT`: 대시보드 포트 (기본: 3000)

## 주의사항

1. **무료 티어 제한**
   - Railway: 월 $5 크레딧
   - Render: 750시간/월, 15분 비활성시 슬립
   - Fly.io: 3개 앱, 메모리 제한
   - Replit: Always On은 유료

2. **데이터 영속성**
   - SQLite 파일이 재배포시 초기화될 수 있음
   - 중요한 데이터는 외부 DB 사용 권장

3. **성능**
   - 무료 티어는 리소스 제한이 있음
   - 대규모 서버에는 유료 플랜 권장