# P07 뤼이도 RAG 챗봇

문서 근거 기반(RAG) 서비스 사용 안내 챗봇입니다.
뤼이도(Riido) 이용가이드 문서를 기반으로 사용자 질문에 요약 + 단계 안내 + 관련 링크 형태의 응답을 제공합니다.

## 프로젝트 구조

riddo/
├── backend/        # NestJS 백엔드 서버
└── riddo-front/    # Next.js 프론트엔드

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16, TypeScript, Tailwind CSS |
| 백엔드 | NestJS, TypeScript |
| 데이터베이스 | PostgreSQL 16, Redis |
| 검색 | PostgreSQL FTS (GIN 인덱스) |
| AI | OpenAI GPT |
| 인프라 | Docker, AWS |

## 실행 방법

### 사전 준비

- Docker Desktop 설치
- Node.js 설치

### 1. 인프라 실행 (PostgreSQL + Redis)

```bash
git clone https://github.com/Capstone-P07/p07-infra.git
cd p07-infra
# .env 파일 추가
docker compose up -d
```

### 2. 백엔드 실행

```bash
cd backend
npm install
# .env 파일 설정
npm run start:dev
```

백엔드 서버: `http://localhost:4000`

### 3. 프론트엔드 실행

```bash
cd riddo-front
npm install
# .env.local 파일 설정
npm run dev
```

프론트엔드: `http://localhost:3000`

### 환경변수

**backend/.env**

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=비밀번호
DB_DATABASE=cap_p07_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=시크릿키
JWT_EXPIRES_IN=3600s
OPENAI_API_KEY=OpenAI API 키
PORT=4000

**riddo-front/.env.local**

NEXT_PUBLIC_API_URL=http://localhost:4000/api

## API 명세

Base URL: `http://localhost:4000/api`

### Auth

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /auth/signup | - | 회원가입 |
| POST | /auth/login | - | 로그인 |
| POST | /auth/logout | JWT | 로그아웃 |
| GET | /auth/me | JWT | 내 정보 조회 |
| DELETE | /auth/me | JWT | 회원탈퇴 |
| PATCH | /auth/password | JWT | 비밀번호 변경 |

### Chat

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /chat/session | - | 세션 생성 |
| POST | /chat/message | - | 질문 전송 (SSE) |
| DELETE | /chat/session | - | 세션 종료 및 대화 삭제 |

### Search

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /search | - | FTS 검색 수행 |
| GET | /search/faq | - | 자주 묻는 질문 Top 조회 |

### Docs

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /docs | - | 문서 목록 조회 |
| POST | /docs | - | 문서 등록 |
| PUT | /docs/:docId | - | 문서 수정 |
| DELETE | /docs/:docId | - | 문서 삭제 |
| POST | /docs/:docId/reindex | - | 문서 재색인 |

### Logs

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /logs/chat | - | 세션 기반 대화 로그 조회 |
| GET | /logs/chat/history | JWT | 사용자 전체 대화 기록 조회 |
| POST | /logs/feedback | - | 피드백 저장 |

### Admin

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /admin/unanswered | - | 무응답 질문 목록 조회 |
| PATCH | /admin/unanswered/:id | - | 무응답 질문 상태 변경 |
| GET | /admin/stats/faq | - | 자주 묻는 질문 통계 |
| GET | /admin/stats/trend | - | 기간별 질문 수 추이 |
| GET | /admin/stats/satisfaction | - | 답변 만족도 통계 |
| GET | /admin/stats/unanswered-rate | - | 무응답 비율 통계 |

