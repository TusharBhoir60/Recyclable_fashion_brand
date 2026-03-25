# Prisma Setup Guide

Follow these steps to get the database running for the first time, or to apply schema changes.

## Prerequisites

- PostgreSQL 14+ running locally (or a hosted instance, e.g. Supabase / Neon / Railway)
- Node.js 18+
- The `backend/` directory dependencies installed (`npm ci`)

---

## 1. Configure your database URL

Copy the example env file and fill in real values:

```bash
cd backend
cp env.example .env
```

Edit `.env` and set **all** of the following:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

JWT_SECRET=<random 32+ char string>
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=<different random 32+ char string>
JWT_REFRESH_EXPIRES_IN=7d
```

Generate secure secrets quickly:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run the command twice — once for `JWT_SECRET` and once for `JWT_REFRESH_SECRET`.

---

## 2. Generate the Prisma client

This step must be run after any schema change and before starting the server:

```bash
npm run prisma:generate
# shorthand: npx prisma generate
```

---

## 3. Run migrations

### First time (new database)

```bash
npm run prisma:migrate
# shorthand: npx prisma migrate dev --name init
```

Prisma will create all tables defined in `prisma/schema.prisma`.

### Subsequent schema changes

After editing `prisma/schema.prisma`, run:

```bash
npx prisma migrate dev --name <describe-your-change>
```

---

## 4. (Optional) Seed sample data

If a `prisma/seed.js` file exists:

```bash
npx prisma db seed
```

---

## 5. Inspect the database visually

```bash
npm run prisma:studio
# Opens Prisma Studio at http://localhost:5555
```

---

## 6. Generate the long-lived ADMIN_JWT_TOKEN

The weekly segmentation cron job uses `ADMIN_JWT_TOKEN` to call internal admin APIs.  
Generate it **after** creating an admin user in the DB.

First, find the admin user's ID:

```sql
-- Run in psql or Prisma Studio
SELECT id FROM "User" WHERE role = 'ADMIN' LIMIT 1;
```

Then generate the token (replace `<adminUserId>` with the `id` value from the query above):

```bash
node -e "
  require('dotenv').config();
  const jwt = require('jsonwebtoken');
  // Replace <adminUserId> with the actual cuid from the users table
  const token = jwt.sign(
    { id: '<adminUserId>', role: 'ADMIN' },
    process.env.JWT_SECRET,
    { expiresIn: '365d' }
  );
  console.log(token);
"
```

Paste the output into `ADMIN_JWT_TOKEN` in `.env`.

---

## 7. Start the server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.  
Health check: `GET http://localhost:5000/health`

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `PrismaClientInitializationError` | `DATABASE_URL` is wrong or PostgreSQL is not running |
| `Error: @prisma/client did not initialize` | Run `npm run prisma:generate` |
| `P3005: migration table missing` | Run `npx prisma migrate deploy` in production |
| `JWT_SECRET is not set` | Ensure `.env` is present and `dotenv` is loaded at app startup |
| `JWT_REFRESH_SECRET is not set` | New required variable — add it to `.env` (see step 1) |

---

## pgvector (required for ML Feature 2 — Visual Search)

Feature 2 stores image embeddings in PostgreSQL using the `pgvector` extension.

```sql
-- Run once in your PostgreSQL database
CREATE EXTENSION IF NOT EXISTS vector;
```

For hosted databases (Supabase, Neon) enable the extension from the dashboard.  
After enabling it, re-run `npx prisma migrate dev` if the schema references `vector` columns.
