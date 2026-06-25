# EstateForClosure
an application that helps people manage estate foreclosures and downsizing by streamlining the process of identifying, listing, and shipping items for resale.

# Estate App — Backend

API backend for managing estate foreclosure and downsizing inventory, eBay listings, and shipping.

## Tech Stack

- **FastAPI** — Python async REST API
- **PostgreSQL** — users, items, listings
- **MongoDB** — AI-generated item metadata
- **Redis** — async job queuing
- **Docker** — containerized local development

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repo

```bash
git clone git@github.com:Akhaled19/EstateForClosure.git
cd estate-backend
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in the following values in `.env`:

- `SECRET_KEY` — generate one with `openssl rand -hex 32`
- `SUPABASE_URL` — from your [Supabase dashboard](https://supabase.com) under Project Settings → API
- `SUPABASE_KEY` — from the same page

### 3. Start the containers

```bash
docker-compose up --build
```

This starts the API, PostgreSQL, MongoDB, and Redis.

### 4. Run database migrations

In a separate terminal tab:

```bash
docker-compose exec api alembic upgrade head
```

### 5. Verify it's running

Visit [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive API docs.

## Common Commands

```bash
# Start containers (after first build)
docker-compose up

# Stop containers
docker-compose down

# View API logs
docker-compose logs -f api

# Run migrations after model changes
docker-compose exec api alembic revision --autogenerate -m "description"
docker-compose exec api alembic upgrade head

# Access PostgreSQL directly
docker-compose exec postgres psql -U estate -d estate_db
```

## Environment Variables

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing secret |
| `DATABASE_URL` | PostgreSQL connection string |
| `MONGO_URI` | MongoDB connection string |
| `MONGO_DB` | MongoDB database name |
| `REDIS_URL` | Redis connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon key |
