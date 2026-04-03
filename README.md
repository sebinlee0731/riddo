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
