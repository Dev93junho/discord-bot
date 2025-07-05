# Discord Bot 초대 가이드

## 방법 1: 기본 권한으로 초대
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=36700160&scope=bot%20applications.commands
```

## 방법 2: 최소 권한으로 초대
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=3145728&scope=bot%20applications.commands
```

## 방법 3: Discord Developer Portal에서 직접 생성

1. https://discord.com/developers/applications 접속
2. 봇 애플리케이션 선택
3. 왼쪽 메뉴에서 **OAuth2** → **URL Generator** 클릭
4. **Scopes**에서 체크:
   - `bot`
   - `applications.commands`
5. **Bot Permissions**에서 체크:
   - Send Messages
   - Connect
   - Speak
   - Use Slash Commands
   - Embed Links
   - Read Message History
6. 하단의 생성된 URL 복사

## 권한 번호 설명
- 3145728 = 기본 음악 봇 권한
- 36700160 = 권장 권한 (메시지 관리 포함)
- 8 = 관리자 권한 (모든 권한)

## 오류 해결
"integration requires code grant" 오류가 계속되면:
1. 봇이 실행 중인지 확인 (`npm start`)
2. Discord Developer Portal에서 봇의 **PUBLIC BOT** 옵션이 켜져 있는지 확인
3. 브라우저 캐시 삭제 후 다시 시도