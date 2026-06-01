# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Project-wide context lives in `../../CLAUDE.md`. This file covers **infra-specific** details only.

## Purpose

Local dev environment only (PostgreSQL + Redis via Docker Compose). **No Dockerfiles for backend/frontend** — those run on the host directly during development. No AWS/Terraform yet.

## Services (`docker-compose.yml`)

| Service | Image | Port | Notes |
|---------|-------|------|-------|
| `db` | **built from `Dockerfile`** (pgvector/pgvector:pg16 + mecab-ko + textsearch_ko) | 5432 | Persistent volume `postgres_data`. Init scripts: `01_ts_mecab_ko.sql` (from host `./ts_mecab_ko.sql`, vendored) → `02_init.sql` (from host `./init.sql`). |
| `redis` | `redis:8.6.2-alpine` | 6379 | No persistence configured. |

Both services share the `p07-network` bridge. Backend/frontend connect from the host at `localhost:5432` / `localhost:6379`.

## Commands

```bash
docker compose up -d        # start stack
docker compose down         # stop (keeps volume)
docker compose down -v      # stop + wipe postgres_data
docker compose logs -f db   # tail DB logs
```

To re-run `init.sql` after changes: `docker compose down -v && docker compose up -d`. The init script only runs on an empty volume.

## `init.sql` — PostgreSQL Schema

Creates the full 8-table schema matching `../../docs/P07_ERD_schema_clean.sql`:
`users`, `sessions`, `document`, `doc_chunks`, `chat_logs`, `search_logs`, `feedback`, `unanswered_questions`.

Includes **FTS setup** on `doc_chunks.fts_vector TSVECTOR` with GIN index. This is the canonical source of DDL — backend's TypeORM `synchronize: true` should be kept in sync (or disabled once formal migrations are introduced).

### Korean FTS (mecab-ko)

`fts_vector` is auto-populated by a DB trigger (`doc_chunks_fts_update`) using the `korean` text search config. That config is created by `ts_mecab_ko.sql` (vendored from `github.com/i0seph/textsearch_ko`, mounted as `01_ts_mecab_ko.sql`) which registers the mecab-ko parser/template/dictionary/configuration.

Backend writes only `content` + `heading`. **Never set `fts_vector` from application code** — the trigger owns it. TypeORM `synchronize: true` is unaffected because the trigger is transparent (no schema change, no new columns).

To add more columns to the index, edit the trigger in `init.sql` (append to the column list in `tsvector_update_trigger(...)`).

**Do not edit `ts_mecab_ko.sql`** — it's a vendored file. Compose mounts it `:ro`. To upgrade textsearch_ko, re-copy from upstream.

## Required Env (`.env`, not committed)

```
DB_USER
DB_PASSWORD
DB_NAME
```

Referenced by `docker-compose.yml`. Create `.env` in this directory before `docker compose up`.

## What's Missing

- No Dockerfile for backend/frontend (no containerized dev stack)
- No production compose / Terraform / AWS IaC
- No CI workflows
- No backup/restore scripts
