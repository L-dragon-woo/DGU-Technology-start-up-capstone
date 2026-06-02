# Backend

Spring Boot 기반 백엔드입니다.

## 기술 스택

- Java 17
- Spring Boot 4.0.6
- Gradle
- Spring Web MVC
- Spring Data JPA
- Bean Validation
- Actuator
- H2 Database(local)
- MySQL Driver(prod)
- Lombok
- Springdoc OpenAPI / Swagger UI

## 실행

```bash
cd backend
./gradlew bootRun
```

## 확인 URL

- Health API: <http://localhost:8080/api/health>
- Actuator Health: <http://localhost:8080/actuator/health>
- Swagger UI: <http://localhost:8080/swagger-ui.html>
- H2 Console: <http://localhost:8080/h2-console>

## 프로필

기본 프로필은 `local`이며 H2 인메모리 DB를 사용합니다.

운영/배포용 MySQL 설정은 환경변수로 주입합니다.

```bash
SPRING_PROFILES_ACTIVE=prod \
DB_URL='jdbc:mysql://localhost:3306/dgu_backend?serverTimezone=Asia/Seoul&characterEncoding=UTF-8' \
DB_USERNAME=root \
DB_PASSWORD=password \
./gradlew bootRun
```

환경변수 예시는 `.env.example`을 참고하세요.
