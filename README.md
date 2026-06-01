# 📚 Riddo RAG 챗봇 시스템

> **문서 근거 기반(RAG) 서비스 사용 안내 챗봇**  
> 2026-1학기 산학협력 캡스톤디자인Ⅱ | 삼육대학교 컴퓨터공학부 P07팀 × ㈜스위그

---

## 프로젝트 소개

Riido(리이도) 이용가이드 문서를 기반으로 사용자의 자연어 질문에 대해 **문서 근거 기반 답변**을 제공하는 RAG 챗봇 시스템입니다.

사용자는 챗봇 화면에서 질문을 입력하고, 시스템은 관련 가이드 문서를 검색하여 요약, 단계별 안내, 참고 링크를 포함한 답변을 실시간으로 제공합니다.

---

## 주요 기능

### 사용자 화면
- 자연어 질문 입력 및 실시간 스트리밍 답변
- 참고 문서 링크 확인
- 채팅 히스토리 조회 및 삭제
- 회원가입 / 로그인

### 관리자 콘솔
- 문서 업로드 및 목록 조회
- 문서 재색인
- 무응답 질문 확인
- 통계 조회 (일별 질문 수, 응답 만족도 등)

---

## 기술 스택

### Frontend (`p07-frontend`)
| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 배포 | Vercel |

### Backend (`p07-backend`)
| 항목 | 기술 |
|------|------|
| 프레임워크 | NestJS |
| 언어 | TypeScript |
| 데이터베이스 | PostgreSQL (mecab-ko FTS + GIN 인덱스) |
| 캐시 | Redis |
| AI | OpenAI GPT-4o-mini |
| 실시간 응답 | SSE (Server-Sent Events) |
| 배포 | AWS EC2 + Docker |

### Infra (`p07-infra`)
| 항목 | 기술 |
|------|------|
| 컨테이너 | Docker Compose |
| 모니터링 | AWS CloudWatch |
| CI/CD | GitHub Actions |

---

## 시스템 아키텍처

```
사용자 UI (Next.js)
    │
    ▼
API 서버 (NestJS)
    ├── Auth / Session
    ├── Chat / Search
    ├── Docs / Logs
    └── Admin
    │
    ▼
챗봇 처리 흐름
    ├── 질문 정규화
    ├── 문서 검색 (PostgreSQL FTS)
    ├── 근거 조합
    ├── LLM 호출 (GPT-4o-mini)
    └── SSE 스트리밍 응답
    │
    ▼
데이터 영역
    ├── PostgreSQL (운영 DB)
    └── Redis (캐시)
```

---

## 프로젝트 구조

```
riddo/
├── p07-frontend/   # Next.js 웹 클라이언트
├── p07-backend/    # NestJS REST API 서버
└── p07-infra/      # Docker, DB 초기화 스크립트
```

---

## 로컬 실행 방법

### 사전 요구사항
- Docker & Docker Compose
- Node.js 18+
- OpenAI API Key

### 1. 인프라 실행

```bash
cd p07-infra
docker compose up -d
```

### 2. 백엔드 실행

```bash
cd p07-backend
cp .env.example .env   # 환경변수 설정
npm install
npm run start:dev
```

### 3. 프론트엔드 실행

```bash
cd p07-frontend
cp .env.example .env.local   # 환경변수 설정
npm install
npm run dev
```

---

## 환경변수

### 백엔드 (`.env`)
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
JWT_SECRET=...
```

### 프론트엔드 (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 팀 구성

| 이름 | 역할 |
|------|------|
| 박유미 | 팀장 / 개발 |
| 권현석 | 개발 |
| 양윤서 | 개발 |
| 이세빈 | 개발 |

**지도교수**: 김성완 교수님 (삼육대학교 컴퓨터공학부)  
**협력기업**: ㈜주식회사스위그

---

## 과제 기간

2026년 3월 16일 ~ 2026년 6월 3일
