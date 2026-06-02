# Backend 작업 기록

## 작업 개요

프론트엔드만 존재하던 프로젝트에 Spring Boot 기반 백엔드 환경을 새로 구성했습니다.

## 작업 내용

### 1. 프로젝트 구조 분리

기존 루트에 있던 프론트엔드 파일을 `frontend/` 폴더로 이동하고, 백엔드 개발을 위한 `backend/` 폴더를 생성했습니다.

```text
.
├── frontend/   # Vue + Vite 프론트엔드
└── backend/    # Spring Boot 백엔드
```

### 2. Spring Boot 프로젝트 생성

`backend/` 폴더에 Gradle 기반 Spring Boot 프로젝트를 생성했습니다.

- Java 17
- Spring Boot 4.0.6
- Gradle Wrapper
- 기본 패키지: `com.dgu.backend`

### 3. 의존성 추가

백엔드 개발에 필요한 기본 의존성을 추가했습니다.

- Spring Web MVC
- Spring Data JPA
- Spring Validation
- Spring Actuator
- H2 Database
- MySQL Driver
- Lombok
- Spring Boot DevTools
- Springdoc OpenAPI / Swagger UI

### 4. 환경설정 추가

`application.yml`을 생성하고 local/prod 프로필을 분리했습니다.

#### local 프로필

- H2 인메모리 DB 사용
- H2 Console 활성화
- JPA `ddl-auto: update`
- SQL 로그 출력 활성화

#### prod 프로필

- MySQL 환경변수 기반 설정
- JPA `ddl-auto: validate`
- SQL 로그 출력 비활성화

### 5. CORS 설정 추가

프론트엔드 개발 서버와 연동할 수 있도록 CORS 설정을 추가했습니다.

기본 허용 Origin:

```text
http://localhost:5173
http://127.0.0.1:5173
```

설정 파일:

```text
backend/src/main/java/com/dgu/backend/global/config/WebConfig.java
```

### 6. 공통 응답 객체 추가

API 응답 형식을 통일하기 위해 `ApiResponse` record를 추가했습니다.

파일 위치:

```text
backend/src/main/java/com/dgu/backend/global/response/ApiResponse.java
```

응답 예시:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### 7. Health Check API 추가

백엔드 서버 상태 확인을 위한 API를 추가했습니다.

파일 위치:

```text
backend/src/main/java/com/dgu/backend/health/HealthController.java
```

요청 URL:

```text
GET /api/health
```

### 8. 실행 및 검증

Gradle 테스트를 실행하여 백엔드 프로젝트가 정상적으로 빌드되는지 확인했습니다.

```bash
cd backend
./gradlew test
```

검증 결과:

```text
BUILD SUCCESSFUL
```

## 실행 방법

```bash
cd backend
./gradlew bootRun
```

## 주요 확인 URL

```text
Health API      : http://localhost:8080/api/health
Actuator Health : http://localhost:8080/actuator/health
Swagger UI      : http://localhost:8080/swagger-ui.html
H2 Console      : http://localhost:8080/h2-console
```

## 환경변수 예시

환경변수 예시는 아래 파일에 정리했습니다.

```text
backend/.env.example
```

운영 프로필 실행 예시:

```bash
SPRING_PROFILES_ACTIVE=prod \
DB_URL='jdbc:mysql://localhost:3306/dgu_backend?serverTimezone=Asia/Seoul&characterEncoding=UTF-8' \
DB_USERNAME=root \
DB_PASSWORD=password \
./gradlew bootRun
```
