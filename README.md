# DGU-Technology-start-up-capstone

프로젝트 구조를 프론트엔드와 백엔드로 분리했습니다.

```text
.
├── frontend/   # Vue + Vite 프론트엔드
└── backend/    # Spring Boot 백엔드
```

## Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Backend

```bash
cd backend
./gradlew bootRun
```

- Health API: <http://localhost:8080/api/health>
- Swagger UI: <http://localhost:8080/swagger-ui.html>
