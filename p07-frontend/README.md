# p07-frontend

P07 RAG 챗봇 — Next.js 프론트엔드 (챗봇 위젯 + 어드민 콘솔).

## Getting Started

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 아래 내용을 입력하세요. 백엔드 서버 주소 설정입니다.

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 개발 서버

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인.

---

## 📁 폴더 구조

이 레포는 **유저 챗봇 위젯**과 **어드민 콘솔**을 하나의 Next.js 앱에서 서빙한다.
도메인별로 `src/features/<domain>/`에 자급자족 모듈로 두고, `src/app/`은 라우팅 조립만 담당한다.

### 디렉토리

```
src/
├── app/                         라우팅만 (얇게 유지)
│   ├── page.tsx, layout.tsx     루트
│   ├── login/, signup/          인증
│   ├── chat/, chat/[id]/        챗봇 위젯
│   ├── settings/                챗봇 설정
│   └── admin/                   어드민 콘솔 (AuthGuard 보호)
│       ├── documents/           문서 관리
│       ├── unanswered/          미해결 질문
│       ├── feedback/            피드백
│       └── analytics/           FAQ 통계
│
├── features/                    도메인별 자급자족 모듈
│   ├── documents/
│   │   ├── components/          해당 도메인 전용 UI
│   │   ├── hooks/               데이터·상태 훅
│   │   ├── api.ts               HTTP 함수 (lib/api 재사용)
│   │   └── types.ts             도메인 타입
│   ├── chat/
│   ├── unanswered/
│   ├── feedback/
│   └── auth/
│
├── components/
│   ├── ui/                      디자인시스템 원자 (Button, Input, Modal, Drawer, Badge, ...)
│   ├── layout/                  AdminSidebar, AdminTopNav 등 공통 레이아웃
│   ├── AuthGuard.tsx            인증 가드 (추후 features/auth/ 로 이동 예정)
│   ├── Navbar.tsx               챗봇 하단 탭 (추후 features/chat/ 로 이동 예정)
│   └── ToggleSwitch.tsx         토글 (추후 components/ui/ 로 이동 예정)
│
└── lib/
    └── api.ts                   axios 단일 인스턴스 — 모든 도메인에서 재사용
```

### URL ↔ 파일 매핑 (어드민)

| URL | 파일 |
|---|---|
| `/admin` | `app/admin/page.tsx` (→ `/admin/documents`) |
| `/admin/documents` | `app/admin/documents/page.tsx` |
| `/admin/unanswered` | `app/admin/unanswered/page.tsx` |
| `/admin/feedback` | `app/admin/feedback/page.tsx` |
| `/admin/analytics` | `app/admin/analytics/page.tsx` |

### 규약

1. **도메인 컴포넌트는 `features/` 안에서만** — 다른 도메인에서 직접 import 금지.
2. **디자인시스템 원자는 `components/ui/` 단일 출처** — 중복 구현 금지.
3. **HTTP 통신은 `@/lib/api` 재사용** — 개별 도메인에서 별도 axios 인스턴스를 만들지 않는다.
4. **컬러는 `tailwind.config.js`의 theme 토큰 사용** — 하드코딩 hex 금지. 토큰 기준은 `../../docs/P07_디자인시스템.md`.
5. **어드민 라우트는 반드시 `AuthGuard`로 감쌀 것** — `app/admin/layout.tsx`에서 일괄 처리.

### 알려진 TODO (후속 정리 PR)

- [ ] `postcss.config.mjs` 제거 (`postcss.config.js`와 중복)
- [ ] `src/components/{AuthGuard,Navbar,ToggleSwitch}.tsx`를 구조에 맞게 이동
- [ ] 디자인시스템 토큰(`tailwind.config.js`에 컬러 추가)
- [ ] Pretendard 폰트 적용 (`next/font/local`)
- [ ] `eslint.config.mjs`에 `no-restricted-imports` 추가 (features 간 import 차단)

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | `next dev` |
| `npm run build` | `next build` |
| `npm start` | `next start` (prod) |
| `npm run lint` | `eslint` |
