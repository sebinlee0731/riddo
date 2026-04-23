CREATE EXTENSION IF NOT EXISTS vector;


CREATE TABLE "users" (
	"id"	UUID		NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
	"email"	VARCHAR(255)		NOT NULL UNIQUE,
	"name"	VARCHAR(20)		NULL,
	"pwd_hash"	VARCHAR(255)		NOT NULL,
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL
);

CREATE TABLE "sessions" (
	"id"	UUID		NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id"	UUID		NULL REFERENCES "users"("id") ON DELETE SET NULL,
	"title"	TEXT		NULL,
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL,
	"expires_at"	TIMESTAMPTZ		NULL
);

CREATE TABLE "document" (
	"id"	SERIAL		NOT NULL PRIMARY KEY,
	"title"	TEXT		NOT NULL,
	"source_url"	TEXT		NULL,
	"category"	VARCHAR(20)		NULL,
	"status"	VARCHAR(20)	DEFAULT 'pending' NOT NULL check (status in ('pending', 'indexing', 'indexed', 'failed')),
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL,
	"updated_at"	TIMESTAMPTZ		NULL
);

CREATE TABLE "doc_chunks" (
	"id"	SERIAL		NOT NULL PRIMARY KEY,
	"doc_id"	INT		NOT NULL REFERENCES "document"("id") ON DELETE CASCADE,
	"chunk_index"	INT		NULL,
	"heading"	TEXT		NULL,
	"content"	TEXT		NULL,
	"fts_vector"	TSVECTOR		NULL,
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL
);


CREATE TABLE "chat_logs" (
	"id"	SERIAL		NOT NULL PRIMARY KEY,
	"session_id"	UUID		NULL REFERENCES "sessions"("id") ON DELETE CASCADE,
	"user_id"	UUID		NULL REFERENCES "users"("id") ON DELETE SET NULL,
	"message"	TEXT		NULL,
	"role"	VARCHAR(10)		NULL check (role in ('user', 'assistant')),
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL
);

CREATE TABLE "search_logs" (
	"id"	SERIAL		NOT NULL PRIMARY KEY,
	"session_id"	UUID		NULL REFERENCES "sessions"("id") ON DELETE CASCADE,
	"query"	TEXT		NOT NULL,
	"matched_chunks_json"	JSONB		NULL,
	"duration_ms"	INT		NULL,
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL
);

CREATE TABLE "feedback" (
	"id"	SERIAL		NOT NULL PRIMARY KEY,
	"chat_logs_id"	INT		NOT NULL REFERENCES "chat_logs"("id") ON DELETE CASCADE,
	"rating"	VARCHAR(10)		NULL check (rating in ('thumb_up', 'thumb_down')),
	"comment"	TEXT		NULL,
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL
);


CREATE TABLE "unanswered_questions" (
	"id"	SERIAL		NOT NULL PRIMARY KEY,
	"question"	TEXT		NOT NULL,
	"reason"	VARCHAR(20)		NULL check (reason in ('out_of_scope', 'no_document')),
	"status"	VARCHAR(20)	DEFAULT 'unresolved'	NULL check (status in ('unresolved', 'resolved', 'dismissed')),
	"frequency"	INT	DEFAULT 1	NOT NULL,
	"resolved_by"	INT		NULL REFERENCES "document"("id") ON DELETE SET NULL,
	"created_at"	TIMESTAMPTZ	DEFAULT now()	NOT NULL,
	"updated_at"	TIMESTAMPTZ		NULL
);

CREATE INDEX idx_doc_chunks_fts_vector ON "doc_chunks" USING GIN ("fts_vector");

CREATE INDEX idx_sessions_user_id ON "sessions" ("user_id");
CREATE INDEX idx_doc_chunks_doc_id ON "doc_chunks" ("doc_id");
CREATE INDEX idx_chat_logs_session_id ON "chat_logs" ("session_id");
CREATE INDEX idx_chat_logs_user_id ON "chat_logs" ("user_id");
CREATE INDEX idx_search_logs_session_id ON "search_logs" ("session_id");
CREATE INDEX idx_feedback_chat_logs_id ON "feedback" ("chat_logs_id");

-- FTS 자동 갱신 트리거: content/heading 변경 시 fts_vector를 korean(mecab-ko) 토큰으로 재색인
-- public.korean 은 01_ts_mecab_ko.sql(Dockerfile이 넣어준 init script) 실행 시점에 생성됨
CREATE TRIGGER doc_chunks_fts_update
  BEFORE INSERT OR UPDATE ON "doc_chunks"
  FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger("fts_vector", 'public.korean', "content", "heading");


