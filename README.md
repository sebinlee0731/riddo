# p07-infra

## 사전 준비사항
Docker Desktop

DBeaver (option)

## 실행 방법
### 1. 클론
git clone https://github.com/Capstone-P07/p07-infra.git

### 2.  .env 파일
별도로 받은 .env 파일을 같은 폴더에 넣습니다.

### 3. 컨테이너 실행
docker compose up -d

### 4. 접속정보 확인
로컬개발 시 서버에서 연동할 환경변수 설정값입니다.
#### PostgreSQL
- Host: localhost 

- Port: 5432

- User: admin

- Database: cap_p07_db

#### Redis

- Host: localhost

- Port: 6379

---

### 주요 명령어
- 서비스 상태 확인
docker compose ps

- 서비스 종료
docker compose stop (데이터 유지)

- 컨테이너 삭제 
docker compose down (데이터 유지)

- 환경 초기화 (데이터 포함 삭제) 
docker compose down -v

- DB 로그 확인 
docker logs -f p07-postgres

---

## 한국어 FTS (mecab-ko)

PostgreSQL에 **mecab-ko 형태소 분석기 + textsearch_ko** 확장이 내장되어 있습니다. `doc_chunks.fts_vector`는 트리거가 `content`/`heading`에서 자동 색인.

### 최초 반영 절차

`Dockerfile`이 추가되어 **커스텀 이미지를 로컬에서 빌드**합니다. 최초 1회는 5–10분 소요 (mecab-ko-dic 컴파일). 이후 실행은 Docker 캐시로 수 초.

```
docker compose down -v        # 기존 볼륨 삭제 필수 (이전 스키마 호환 안 됨)
docker compose up -d --build  # 이미지 빌드 후 기동
```

빌드 진행 상황을 자세히 보려면:
```
docker compose build --progress=plain db
```

### 동작 확인

mecab 토큰화가 되는지:
```
docker exec -it p07-postgres psql -U admin -d cap_p07_db -c "SELECT to_tsvector('korean', '팀원을 초대합니다');"
```
예상 결과: `'초대':3 '팀원':1 '합니다':4` 같이 여러 토큰 반환.

트리거가 동작하는지 (문서 1건 삽입 후 `fts_vector` 확인):
```
docker exec -i p07-postgres psql -U admin -d cap_p07_db -c \
  "INSERT INTO document (title) VALUES ('test'); \
   INSERT INTO doc_chunks (doc_id, chunk_index, heading, content) \
   VALUES ((SELECT id FROM document ORDER BY id DESC LIMIT 1), 0, '팀원 초대', '팀원을 초대하려면 설정에서 버튼을 누릅니다.'); \
   SELECT fts_vector FROM doc_chunks ORDER BY id DESC LIMIT 1;"
```
`fts_vector`에 mecab 토큰이 채워져 있으면 정상.
