-- =============================================================================
-- VENDORED FILE — DO NOT EDIT
-- -----------------------------------------------------------------------------
-- 출처: https://github.com/i0seph/textsearch_ko (ts_mecab_ko.sql)
-- 역할: textsearch_ko 확장이 설치된 Postgres에 한국어 텍스트 검색 구성
--       (parser/template/dictionary/configuration) 을 등록한다.
--       이 스크립트가 실행되어야 `to_tsvector('korean', ...)` 와
--       `tsvector_update_trigger(..., 'public.korean', ...)` 가 동작한다.
-- 주의:
--   * 이 파일은 우리 프로젝트의 스키마가 아니라 textsearch_ko 외부 소스의
--     복사본(vendored)이다. 수정하지 말 것.
--   * 버전 업그레이드는 원본 레포에서 다시 복사해서 반영.
--   * 실제 컨테이너 내부 경로는 docker-compose.yml 에서 마운트 규칙으로
--     /docker-entrypoint-initdb.d/01_ts_mecab_ko.sql 로 연결된다.
-- =============================================================================

SET search_path = public;

BEGIN;

--
-- Korean text parser
--

CREATE FUNCTION ts_mecabko_start(internal, int4)
    RETURNS internal
    AS '$libdir/ts_mecab_ko'
    LANGUAGE 'c' STRICT;

CREATE FUNCTION ts_mecabko_gettoken(internal, internal, internal)
    RETURNS internal
    AS '$libdir/ts_mecab_ko'
    LANGUAGE 'c' STRICT;

CREATE FUNCTION ts_mecabko_end(internal)
    RETURNS void
    AS '$libdir/ts_mecab_ko'
    LANGUAGE 'c' STRICT;

CREATE TEXT SEARCH PARSER korean (
    START    = ts_mecabko_start,
    GETTOKEN = ts_mecabko_gettoken,
    END      = ts_mecabko_end,
    HEADLINE = pg_catalog.prsd_headline,
    LEXTYPES = pg_catalog.prsd_lextype
);
COMMENT ON TEXT SEARCH PARSER korean IS
    'korean word parser';

--
-- Korean text lexizer
--

CREATE FUNCTION ts_mecabko_lexize(internal, internal, internal, internal)
    RETURNS internal
    AS '$libdir/ts_mecab_ko'
    LANGUAGE 'c' STRICT;

CREATE TEXT SEARCH TEMPLATE mecabko (
	LEXIZE = ts_mecabko_lexize
);

CREATE TEXT SEARCH DICTIONARY korean_stem (
	TEMPLATE = mecabko
);

--
-- Korean text configuration
--

CREATE TEXT SEARCH CONFIGURATION korean (PARSER = korean);
COMMENT ON TEXT SEARCH CONFIGURATION korean IS
    'configuration for korean language';

ALTER TEXT SEARCH CONFIGURATION korean ADD MAPPING
    FOR email, url, url_path, host, file, version,
        sfloat, float, int, uint,
        numword, hword_numpart, numhword
    WITH simple;

-- Default configuration is Korean-English.
-- Replace english_stem if you use other language.
ALTER TEXT SEARCH CONFIGURATION korean ADD MAPPING
    FOR asciiword, hword_asciipart, asciihword
    WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION korean ADD MAPPING
    FOR word, hword_part, hword
    WITH korean_stem;

--
-- Utility functions
--

CREATE FUNCTION mecabko_analyze(
        text,
        OUT word text,
        OUT type text,
        OUT part1st text,
        OUT partlast text,
        OUT pronounce text,
        OUT conjtype text,
        OUT conjugation text,
        OUT basic text,
        OUT detail text,
        OUT lucene text)
    RETURNS SETOF record
    AS '$libdir/ts_mecab_ko'
    LANGUAGE 'c' IMMUTABLE STRICT;

CREATE FUNCTION korean_normalize(text)
    RETURNS text
    AS '$libdir/ts_mecab_ko'
    LANGUAGE 'c' IMMUTABLE STRICT;

CREATE FUNCTION hanja2hangul(text)
    RETURNS text
    AS '$libdir/ts_mecab_ko'
    LANGUAGE 'c' IMMUTABLE STRICT;

COMMIT;
