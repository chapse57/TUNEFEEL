# 🎵 TUNEFEEL

> AI가 찾아주는 나만의 플레이리스트

![TUNEFEEL](https://img.shields.io/badge/TUNEFEEL-AI%20Music-c8f135?style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude%20AI-D97757?style=for-the-badge)

## 📌 프로젝트 소개

TUNEFEEL은 좋아하는 아티스트나 현재 기분을 입력하면 AI가 감성적으로 음악을 추천해주는 서비스입니다.

단순한 알고리즘 추천이 아닌, **가사의 깊이와 감성을 분석**해서 진짜 잘 맞는 곡을 찾아드려요.

## ✨ 주요 기능

- 🎤 **아티스트 기반 추천** — 좋아하는 아티스트와 비슷한 감성의 곡 추천
- 🌙 **기분 기반 추천** — 현재 기분/분위기에 맞는 곡 추천
- 💬 **추천 이유 제공** — 왜 이 곡인지 감성적인 설명 제공
- ▶️ **YouTube / Spotify 바로가기** — 추천받은 곡 바로 감상 가능
- 🔒 **하루 3회 무료 제한** — IP 기반 사용량 제한
- 🔐 **이메일 회원가입/로그인** — Supabase 인증
- 💳 **프리미엄 결제** — Stripe 연동 ($4.99/월)

## 🛠 기술 스택

| 역할 | 기술 |
|------|------|
| 프론트엔드 | React + Vite |
| 백엔드 | Node.js + Express |
| AI 추천 엔진 | Anthropic Claude Sonnet |
| 음악 데이터 | Last.fm API |
| 인증 | Supabase |
| 결제 | Stripe |
| DB | Supabase (users, playlists) |
| 프론트 배포 | Vercel |
| 백엔드 배포 | Railway |

## 🌐 배포 주소

- **프론트엔드**: https://tunefeel.vercel.app
- **백엔드**: https://tunefeel-production.up.railway.app

## 🗺 아키텍처

```
유저 입력 (아티스트/기분)
    ↓
Last.fm API → 실제 존재하는 유사 아티스트/곡 데이터 수집
    ↓
Claude Sonnet → 감성/가사 분석 후 최종 큐레이션
    ↓
YouTube API → 직접 재생 가능한 영상 URL 매칭
    ↓
YouTube / Spotify 링크와 함께 추천 결과 반환
```

## 🚀 로컬 실행

### 필요한 것
- Node.js v22+
- Anthropic API 키
- Last.fm API 키
- YouTube Data API 키
- Spotify Client ID / Secret
- Supabase URL / Service Key
- Stripe Secret Key / Webhook Secret

### 백엔드 실행
```bash
cd backend
npm install
# .env 파일 생성 후 API 키 입력
node src/index.js
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

### 백엔드 .env 파일 형식
```
ANTHROPIC_API_KEY=your_key
LASTFM_API_KEY=your_key
YOUTUBE_API_KEY=your_key
SPOTIFY_CLIENT_ID=your_key
SPOTIFY_CLIENT_SECRET=your_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_key
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_key
STRIPE_PRICE_ID=your_key
FRONTEND_URL=http://localhost:5173
PORT=4000
```

### 프론트엔드 .env 파일 형식
```
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
```

## 💰 수익 모델

- **무료** — 하루 3회 추천
- **프리미엄** — 무제한 추천 + 플레이리스트 저장 (월 $4.99)

## 📅 개발 로그

- `2026-03-14` 프로젝트 초기 세팅 및 백엔드 구조 완성
- `2026-03-14` React 프론트엔드 완성 및 MVP 완료
- `2026-03-16` Last.fm + Claude Sonnet 연동으로 추천 정확도 개선
- `2026-03-17` Supabase 이메일 인증 완료
- `2026-03-17` Stripe 결제 연동 완료
- `2026-03-17` Vercel 프론트엔드 배포 완료
- `2026-03-17` Railway 백엔드 배포 완료
- `2026-03-17` CORS 설정 및 환경변수 이슈 해결
- `2026-03-17` YouTube API 직접 영상 URL 매칭으로 개선

## 📄 라이선스

MIT License
