# Discord Music Bot

YouTube 음악을 재생할 수 있는 Discord 봇입니다. 로컬 환경에서 실행하도록 설계되었습니다.

## 기능

- YouTube에서 음악 검색 및 재생
- 재생 목록 관리
- 일시정지/재개
- 곡 건너뛰기
- 반복 재생
- 재생 목록 확인

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. `.env.example` 파일을 `.env`로 복사하고 봇 토큰 입력:
```bash
cp .env.example .env
```

3. Discord Developer Portal에서 봇 생성 후 토큰을 `.env` 파일에 입력

4. 봇 실행:
```bash
npm start
```

개발 모드 (자동 재시작):
```bash
npm run dev
```

## 명령어

- `/play <query>` - YouTube에서 음악 검색 후 재생
- `/stop` - 재생 중지 및 대기열 초기화
- `/skip` - 현재 곡 건너뛰기
- `/queue` - 재생 목록 확인
- `/pause` - 일시정지
- `/resume` - 재개
- `/loop` - 반복 재생 토글

## 필요 권한

봇이 정상적으로 작동하려면 다음 권한이 필요합니다:
- 메시지 읽기/보내기
- 음성 채널 연결
- 음성 채널에서 말하기
- 슬래시 명령어 사용