# Products App

Minimal end-to-end app for listing and creating products (React frontend, Node backend, Postgres).

## Prerequisites

- Node 20+
- Docker Desktop
- Git

## Database setup

Start Postgres:

```bash
docker compose up -d
```

On first start, [`db/init.sql`](db/init.sql) creates the `products` table:

```sql
CREATE TABLE products (
  id   BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL
);
```

If you need to reset the database, stop the container and remove its volume:

```bash
docker compose down -v
docker compose up -d
```

## Start backend

```bash
cd backend
npm install
npm run dev
```

The API runs at http://localhost:8080.

## Start frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The UI runs at http://localhost:3000.

## Verify

Open http://localhost:3000, create a product named P1, and confirm it appears in the list.

You can also verify the API directly:

```bash
curl http://localhost:8080/api/products
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"P1"}'
```

## Notes

The preferred interview stack is React + Kotlin Spring Boot + Postgres. This repo uses **Node/Express/TypeScript** for the backend instead of Spring Boot. The interview instructions allow alternative mainstream stacks when you are more productive with them; Node was chosen for familiarity and speed during the live pairing session. The frontend (React) and database (Postgres) match the preferred stack.
