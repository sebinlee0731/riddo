# P07 PostgreSQL with Korean FTS (mecab-ko + textsearch_ko)
# Extends pgvector/pgvector:pg16 with Korean morphological analysis for FTS.

# ---------- Build stage ----------
FROM pgvector/pgvector:pg16 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
      postgresql-server-dev-16 \
      autoconf automake libtool pkg-config \
      git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Step 1: mecab-ko engine (provides mecab-config, mecab.h — required by textsearch_ko build)
RUN curl -sL https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz | tar xz -C /tmp \
  && cd /tmp/mecab-0.996-ko-0.9.2 \
  && ./configure --prefix=/usr/local \
  && make -j"$(nproc)" && make install \
  && ldconfig

# Step 2: mecab-ko-dic (Korean dictionary)
# autoreconf -fi regenerates autotools files (bundled 2018 autotools are too old for Debian 12)
RUN curl -sL https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz | tar xz -C /tmp \
  && cd /tmp/mecab-ko-dic-2.1.1-20180720 \
  && autoreconf -fi \
  && ./configure --prefix=/usr/local --with-mecab-config=/usr/local/bin/mecab-config \
  && make && make install

# Step 3: textsearch_ko PostgreSQL extension (requires mecab headers from Step 1)
# NOTE: ts_mecab_ko.sql is NOT copied into the image — it lives on the host
# (p07-infra/ts_mecab_ko.sql) and is mounted into the container by docker-compose.yml.
RUN git clone --depth 1 https://github.com/i0seph/textsearch_ko /tmp/textsearch_ko \
  && cd /tmp/textsearch_ko \
  && make USE_PGXS=1 \
  && make USE_PGXS=1 install

# ---------- Runtime stage ----------
FROM pgvector/pgvector:pg16

# mecab runtime (libs, binary, config, dictionary)
COPY --from=builder /usr/local/lib/libmecab.so.2 /usr/local/lib/libmecab.so.2
COPY --from=builder /usr/local/lib/libmecab.so /usr/local/lib/libmecab.so
COPY --from=builder /usr/local/bin/mecab /usr/local/bin/mecab
COPY --from=builder /usr/local/etc/mecabrc /usr/local/etc/mecabrc
COPY --from=builder /usr/local/lib/mecab/dic/mecab-ko-dic /usr/local/lib/mecab/dic/mecab-ko-dic

# textsearch_ko extension artifacts (paths verified from Phase 0 build)
COPY --from=builder /usr/lib/postgresql/16/lib/ts_mecab_ko.so /usr/lib/postgresql/16/lib/ts_mecab_ko.so
COPY --from=builder /usr/lib/postgresql/16/lib/bitcode/ts_mecab_ko /usr/lib/postgresql/16/lib/bitcode/ts_mecab_ko
COPY --from=builder /usr/lib/postgresql/16/lib/bitcode/ts_mecab_ko.index.bc /usr/lib/postgresql/16/lib/bitcode/ts_mecab_ko.index.bc
COPY --from=builder /usr/share/postgresql/16/extension/textsearch_ko.control /usr/share/postgresql/16/extension/textsearch_ko.control
COPY --from=builder /usr/share/postgresql/16/extension/textsearch_ko--1.0.sql /usr/share/postgresql/16/extension/textsearch_ko--1.0.sql

# NOTE: /docker-entrypoint-initdb.d/01_ts_mecab_ko.sql 는 docker-compose.yml 에서
# 호스트의 p07-infra/ts_mecab_ko.sql 을 마운트해 주입한다 (이미지에 embed하지 않음).

RUN ldconfig
