# German Vocabulary Manager

A full-stack web application for German language learners to store, organize, and track vocabulary.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | TailwindCSS v4 |
| State | React Query + React Hook Form |
| Backend | Bun + Hono |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (JWT) |
| Migrations | Supabase CLI |
| Security | Row Level Security (RLS) |

## Project Structure

```
german_vocabulary_manager/
├── frontend/               # Vite React TypeScript app
│   └── src/
│       ├── components/     # UI & feature components
│       ├── hooks/          # React Query hooks
│       ├── lib/            # Supabase client + API client
│       ├── pages/          # Route-level pages
│       └── types/          # Shared TypeScript types
├── backend/                # Bun + Hono REST API
│   └── src/
│       ├── middleware/     # JWT auth middleware
│       └── routes/         # API route handlers
└── supabase/
    ├── config.toml         # Local Supabase config
    └── migrations/         # SQL migrations
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- A [Supabase project](https://app.supabase.com)

### 1. Supabase Setup

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Push migrations to remote database
supabase db push
```

Or run locally:

```bash
supabase start
supabase db reset   # applies migrations
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project
bun install
bun dev
```

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from your Supabase project
bun dev
```

The API runs on `http://localhost:3001`.

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:3001/api`) |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret!) |
| `PORT` | Server port (default: `3001`) |
| `FRONTEND_URL` | Frontend origin for CORS (default: `http://localhost:5173`) |

## API Endpoints

All endpoints require `Authorization: Bearer <supabase_jwt>`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/vocabularies` | List vocabularies (search, filter, paginate) |
| `POST` | `/api/vocabularies` | Create a vocabulary entry |
| `PATCH` | `/api/vocabularies/:id` | Update a vocabulary entry |
| `DELETE` | `/api/vocabularies/:id` | Delete a vocabulary entry |
| `GET` | `/api/vocabularies/stats` | Get dashboard statistics |

### Query Parameters for `GET /api/vocabularies`

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search in German word or Persian translation |
| `level` | `A1`\|`A2`\|`B1`\|`B2`\|`C1`\|`C2` | Filter by level |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |

## Features

- **Authentication** — Register, login, logout via Supabase Auth
- **Vocabulary CRUD** — Create, read, update, delete vocabulary entries
- **Fields** — German word, article (der/die/das), Persian translation, example sentence, level (A1–C2)
- **Search** — Full-text search across German word and Persian translation
- **Filter** — Filter by CEFR level (A1–C2)
- **Pagination** — Server-side pagination
- **Dashboard** — Statistics cards (total + per-level counts)
- **Security** — Row Level Security: users only access their own data

## Database Schema

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | References `auth.users.id` |
| `name` | text | |
| `created_at` | timestamptz | |

### `vocabularies`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, auto-generated |
| `user_id` | uuid | References `auth.users.id` |
| `german_word` | text | |
| `article` | enum | `der`, `die`, `das` |
| `persian_translation` | text | |
| `example_sentence` | text | Nullable |
| `level` | enum | `A1`–`C2` |
| `created_at` | timestamptz | |
