# Changelog

이 문서는 `p07-infra` 레포의 변경 이력을 기록합니다.
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따르며, 버전은 릴리즈되지 않으므로 날짜로 구분합니다.

## [2026-04-23] — 한국어 FTS 색인 구축 (Task 21-45)

`doc_chunks.fts_vector`를 mecab-ko 형태소 분석기로 자동 색인하도록 PostgreSQL 이미지를 커스터마이징. 기존 pgvector 이미지를 확장해 mecab-ko + textsearch_ko 확장을 빌드 단계에 포함시키고, INSERT/UPDATE 시 트리거가 자동으로 `fts_vector`를 채우도록 구성.

### 파일 경로 명명 안내

아래 변경 설명에서 `01_ts_mecab_ko.sql`, `02_init.sql` 은 **컨테이너 안의 경로 이름**이고, 호스트의 실제 파일명은 다르다. Postgres 공식 이미지는 `/docker-entrypoint-initdb.d/` 안의 스크립트를 **파일명 알파벳 순**으로 실행하므로, `01_`, `02_` 접두사로 실행 순서(mecab config → 스키마/트리거)를 강제한다.

| 호스트 파일 | 컨테이너 안 경로 | 주입 방식 | 편집 가능? |
|------------|----------------|----------|-----------|
| `p07-infra/ts_mecab_ko.sql` | `/docker-entrypoint-initdb.d/01_ts_mecab_ko.sql` | `docker-compose.yml` 볼륨 마운트 (read-only) | ❌ **vendored** — textsearch_ko 원본. 수정 금지. |
| `p07-infra/init.sql` | `/docker-entrypoint-initdb.d/02_init.sql` | `docker-compose.yml` 볼륨 마운트 | ✅ 프로젝트 스키마/트리거 — 편집 가능 |

두 SQL 모두 호스트에 있어서 팀원이 레포만 열어도 실제로 DB에 어떤 SQL이 적용되는지 한눈에 파악 가능. `ts_mecab_ko.sql` 은 상단에 vendored 경고 주석이 붙어 있고 compose에서 `:ro` 플래그로도 보호.

### Added

- **`Dockerfile`** — 멀티스테이지 커스텀 Postgres 이미지
  - 베이스: `pgvector/pgvector:pg16`
  - Build stage: mecab-ko 0.9.2 → mecab-ko-dic 2.1.1 → textsearch_ko (github.com/i0seph/textsearch_ko) 순서로 컴파일 · 설치
  - Runtime stage: mecab 라이브러리/사전, textsearch_ko `.so` + 확장 메타파일만 복사. **SQL 초기화 스크립트는 이미지에 embed하지 않고 호스트에서 마운트** (레포 투명성 우선)
  - mecab-ko-dic은 2018년 배포판으로 Debian 12 automake와 버전 불일치가 있어 `autoreconf -fi`로 autotools 재생성
- **`ts_mecab_ko.sql`** — textsearch_ko 원본(https://github.com/i0seph/textsearch_ko)에서 가져온 **vendored 파일**. Postgres에 `korean` text search parser/template/dictionary/configuration 과 유틸 함수 3개(`mecabko_analyze`, `korean_normalize`, `hanja2hangul`)를 등록. 상단 주석으로 vendored 표시. `docker-compose.yml` 에서 `:ro` 로 마운트해 추가 방어.
- **`.gitattributes`** — Windows 팀원 CRLF 문제 방지를 위해 `Dockerfile`, `*.sh`, `*.sql` 을 LF 고정
- **`CHANGELOG.md`** — 본 문서
- **`init.sql` 트리거** — `doc_chunks` 테이블에 `BEFORE INSERT OR UPDATE` 트리거 추가.
  Postgres 내장 `tsvector_update_trigger` 로 `content` + `heading` 컬럼을 `public.korean` 설정으로 토큰화해서 `fts_vector`에 자동 저장.

### Changed

- **`docker-compose.yml`**
  - `image: pgvector/pgvector:pg16` 제거 → `build: { context: ., dockerfile: Dockerfile }` 로 변경 (로컬 빌드)
  - 빌드 결과에 이름 태그 지정: `p07-postgres-korean:pg16`
  - 초기화 스크립트 마운트 2개 추가:
    - `./ts_mecab_ko.sql:/docker-entrypoint-initdb.d/01_ts_mecab_ko.sql:ro` (vendored, 읽기 전용)
    - `./init.sql:/docker-entrypoint-initdb.d/02_init.sql` (기존 `init.sql` 경로만 `02_`로 rename)
  - **호스트 파일명은 그대로** (`ts_mecab_ko.sql`, `init.sql`). 컨테이너 내부에서만 `01_`, `02_` 접두사로 보여 실행 순서(mecab config → 스키마/트리거)가 보장됨.
- **`README.md`** — "한국어 FTS (mecab-ko)" 섹션 추가. 최초 빌드 시간(5–10분), 볼륨 삭제 필수 안내, 동작 확인 쿼리 문서화
- **`CLAUDE.md`** — 서비스 설명 업데이트(image → build), `init.sql` 섹션에 mecab-ko 관련 설명 추가

### Operational Impact

- **최초 롤아웃 시 기존 볼륨 삭제 필수**
  ```
  docker compose down -v
  docker compose up -d --build
  ```
  기존 `postgres_data` 는 `public.korean` 텍스트 검색 설정이 없어서 트리거 생성 단계에서 실패함.
- **최초 빌드 5–10분 소요** — mecab-ko-dic 컴파일이 대부분을 차지. 이후 실행은 Docker 캐시로 수 초.
- **팀 전체 재빌드 필요** — 모든 팀원이 `docker compose up -d --build` 로 이미지 재빌드.

### Verification

Phase 2 검증 6단계 모두 통과 (V1 빌드 → V6 백엔드 기동):

| # | 검증 | 결과 |
|---|------|------|
| V1 | `docker compose build db` | ✅ |
| V2 | 컨테이너 init 스크립트가 `01_ts_mecab_ko.sql` → `02_init.sql` 순서로 실행 | ✅ CREATE TRIGGER까지 |
| V3 | `SELECT to_tsvector('korean', '팀원을 초대합니다')` | ✅ `'초대':2 '팀원':1` |
| V4 | 트리거 자동 fts_vector 채움 | ✅ content 원문 보존, 토큰 색인 생성 |
| V5 | FTS 검색 + 활용형 매칭 | ✅ "팀원 초대" / "팀원을 초대하려면" 동일 매칭 |
| V6 | 백엔드 `npm run start:dev` | ✅ TypeORM synchronize 충돌 없음 |

### Notes

- `ts_mecab_ko.sql` 은 초기에 Dockerfile COPY로 이미지에 embed 했으나, **팀원이 SQL 내용을 레포에서 바로 확인할 수 있도록 호스트로 내렸다**. 이미지에는 `.so`/`.control`/`.bc` 같은 확장 아티팩트만 남고, 초기화 SQL은 compose 볼륨 마운트로 주입.
- `textsearch_ko` 저장소는 10년 이상 관리되지 않았지만 PG16에서 컴파일 + 실행이 정상 확인됨 (경고 1건: `ascii_sign defined but not used`, 무시 가능).
- 백엔드의 TypeORM `synchronize: true` 는 트리거와 충돌하지 않음 (트리거는 스키마에 새 컬럼을 추가하지 않아 TypeORM에 투명).

### Rollback

`feature/21-45-fts-mecab` 브랜치의 머지 커밋을 되돌리면 기본 `pgvector/pgvector:pg16` 이미지로 복귀:

```
git revert <merge-commit-sha>
docker compose down -v
docker compose up -d
```
