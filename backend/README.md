# backend

.NET 11 Web API, Onion architecture, PostgreSQL 19.

```
src/
├─ Core/Portfolio.Domain              entities, enums (no dependencies)
├─ Core/Portfolio.Application         repository and service ports, DTOs, mappings, errors
├─ Infrastructure/Portfolio.Infrastructure   external services (auth, uploads: upcoming)
├─ Infrastructure/Portfolio.Persistence      EF Core, migrations, generic repositories, services, seed
└─ Presentation/Portfolio.WebAPI      controllers, error envelope, rate limiting, security headers
tests/
├─ Portfolio.UnitTests
└─ Portfolio.IntegrationTests         Testcontainers (real PostgreSQL 19)
```

## Endpoints

| Method | Path | |
|---|---|---|
| GET | `/api/content/{tr\|en}` | All site content in one language (same shape as the frontend `PortfolioContent`) |
| GET | `/api/health` | Liveness and database connectivity |
| GET | `/api/auth/status`, `/api/auth/login`, `/api/auth/me` | GitHub sign-in for the single admin (`ADMIN_GITHUB_ID`) |
| POST | `/api/auth/logout` | |
| GET, PUT | `/api/admin/profile` | Admin only |
| GET, POST, PUT `{id}`, DELETE `{id}`, PUT `order` | `/api/admin/{projects\|journey\|technologies\|school\|tracks}` | Admin only |
| POST | `/api/admin/uploads` | PNG, JPEG or WebP up to 2 MB, served from `/api/uploads/` |

Admin writes need the `X-Portfolio-Admin: 1` header (CSRF guard) and clear the content cache.

Errors always use `{ "error": { "code", "message", "fields"? } }`.

## Configuration

No secret lives in the repository. The API reads its connection string from the
`ConnectionStrings__Default` environment variable; `docker-compose.yml` builds it from the
`POSTGRES_*` values in the server's `.env` file (see `.env.example` at the repository root).

| Variable | Default | |
|---|---|---|
| `ConnectionStrings__Default` | none (required) | PostgreSQL connection string |
| `MIGRATE_ON_STARTUP` | `true` | Apply pending migrations on start |
| `SEED_ON_STARTUP` | `true` | Load the initial content when the database is empty |
| `ADMIN_GITHUB_ID` | none | Numeric GitHub id of the only account allowed into the admin panel |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | none | GitHub OAuth App; without them the site works and admin sign-in is off |
| `UPLOADS_DIR`, `DATA_PROTECTION_DIR` | `/data/uploads`, `/data/keys` | Volumes for uploaded images and session keys |

## Commands

```bash
dotnet build Portfolio.slnx
dotnet test --solution Portfolio.slnx   # integration tests need Docker
dotnet tool restore
dotnet tool run dotnet-ef migrations add <Name> \
  --project src/Infrastructure/Portfolio.Persistence \
  --startup-project src/Infrastructure/Portfolio.Persistence --output-dir Migrations
```
