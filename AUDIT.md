# RecyclaBag — Full Codebase Audit Report

> **Branch audited:** `ML` (merged into current working branch)  
> **Audit date:** March 2026  
> **Scope:** Backend (Node.js/Express/Prisma), Frontend (HTML/JS), ML service (FastAPI/Python)

---

## Quick Summary

| Layer    | Completed | In Progress | Pending |
|----------|-----------|-------------|---------|
| Backend  | ~65 %     | JWT refresh | Redis, rate-limit, tests, Zod |
| Frontend | ~40 %     | Static pages | API integration, React migration |
| ML       | ~80 %     | —           | Trained weights, end-to-end wiring |

---

## 1. Backend

### ✅ Done

| Area | What is in place |
|------|-----------------|
| Project scaffold | `server.js` → `src/app.js` with modular routes |
| Prisma schema | All models defined: `User`, `Product`, `ProductEmbedding`, `Customization`, `Order`, `OrderItem`, `Review`, `MlReviewQueue` |
| Auth — register / login | `POST /api/auth/register`, `POST /api/auth/login` (bcrypt + JWT) |
| JWT access token | `utils/jwt.js` — `signToken` / `verifyToken` |
| **JWT refresh token** *(newly added in this PR)* | `signRefreshToken` / `verifyRefreshToken` in `utils/jwt.js`; `POST /api/auth/refresh` and `POST /api/auth/logout` wired up |
| Auth middleware | `middleware/auth.middleware.js` — Bearer token guard |
| Role guard | `middleware/isadmin.middleware.js` — ADMIN check |
| Product routes | `GET /`, `GET /:id`, `POST /` (admin + image upload) |
| Order routes | `POST /`, `GET /`, `GET /:id` (authenticated) |
| Payment — Razorpay | Initiate + verify with HMAC signature check |
| Review routes | CRUD for product reviews |
| Search route | Route file present (`search.route.js`) |
| Customisation route | Route file present |
| Admin endpoints | Analytics, revenue, segments, ML review queue, forecast |
| Segmentation cron job | Weekly Monday 02:00 IST — RFM → ML → write-back |
| Cloudinary upload | `middleware/upload.middleware.js` with multer |
| Error handler | Global `(err, req, res, next)` in `app.js` |
| ML service integration | HTTP calls from jobs to `ML_SERVICE_URL` |
| Env example | `backend/env.example` with all required keys |

### 🟡 In Progress

| Area | Current state | What is missing |
|------|--------------|-----------------|
| JWT lifetime | Single-token flow was `7d`; **now split to 15 m access + 7 d refresh** (done in this PR) | Redis blocklist for revoked refresh tokens |
| Prisma DB | Schema defined, `@prisma/client` installed | `prisma generate` + `prisma migrate dev` not yet run against a real DB (see `PRISMA_SETUP.md`) |
| Search controller | `search.route.js` exists | Controller / service logic not implemented yet |

### ❌ Not Started

| Area | Priority | Notes |
|------|----------|-------|
| Redis connection | HIGH | Needed for refresh-token revocation on logout and rate limiting |
| Rate limiter middleware | HIGH | No `express-rate-limit` or similar; endpoint is fully open |
| Zod input validation | HIGH | No request-body validation on any route — SQL-injection / type errors possible |
| Refresh-token blocklist | HIGH | `POST /api/auth/logout` currently stateless; requires Redis set to block used tokens |
| Password reset flow | MEDIUM | No `POST /api/auth/forgot-password` or `POST /api/auth/reset-password` |
| Google OAuth | MEDIUM | Planned but not started |
| Seller role + SELLER routes | MEDIUM | Schema has `CUSTOMER`/`ADMIN` only; no `SELLER` role or seller-specific product CRUD |
| Soft delete for products | MEDIUM | `isActive` field exists but no DELETE route uses it |
| Cursor pagination | MEDIUM | Product list returns all rows |
| Bull / BullMQ async queues | LOW | Emails, image processing still synchronous |
| SendGrid email | LOW | Order events trigger no email notifications |
| Unit / integration tests | LOW | Only a placeholder `npm test` script |

---

## 2. Frontend

### ✅ Done

| Page / Component | Status |
|-----------------|--------|
| `index.html` — landing page | ✅ Complete (hero, stats, product showcase) |
| `login.html` / `signup.html` | ✅ Forms present |
| `shop.html` | ✅ Product listing UI |
| `product-detail.html` | ✅ Detail view |
| `cart.html` / `checkout.html` | ✅ UI scaffolded |
| `orders.html` / `profile.html` | ✅ UI present |
| `dashboard.html` — buyer dashboard | ✅ Present |
| `seller-dashboard.html` | ✅ Present |
| `sell.html` — list an item | ✅ Present |
| `admin/` pages | ✅ earnings, manage-orders, manage-products, manage-users, reviews |
| `style.css` | ✅ Shared stylesheet |
| `components/imagesearchuploaad.tsx` | ✅ React component for visual search |
| `components/similarporducts.tsx` | ✅ React component for similar products |

### ❌ Not Started / Critical Gaps

| Area | Impact | Notes |
|------|--------|-------|
| **Real API calls** | 🔴 CRITICAL | `script.js` stores user in `localStorage` — no actual fetch to backend; **zero backend integration** |
| Auth token handling | 🔴 CRITICAL | No access-token storage, no `Authorization` header sent |
| Refresh-token rotation client-side | HIGH | No logic to call `POST /api/auth/refresh` on 401 |
| Product listing from API | HIGH | Products are hardcoded / mock in JS |
| Cart → Order flow | HIGH | Cart total is calculated in JS; no `POST /api/orders` call |
| Payment integration (Razorpay SDK) | HIGH | Checkout page has no Razorpay JS SDK included |
| React app scaffold | MEDIUM | Two `.tsx` components exist but no `package.json` React build setup |
| Seller product upload | MEDIUM | `sell.html` form not connected to `POST /api/products` |
| Shared API client | MEDIUM | No centralised `api.js` / Axios instance with auth headers |
| React Query / Zustand | LOW | Not set up; currently vanilla JS |

---

## 3. ML Service (`recyclebag_ml/`)

### ✅ Done

| Feature | Files | Status |
|---------|-------|--------|
| Feature 1 — Textile classifier | `feature_1_classifier/` | Model, train, predict, active-learning loop, FastAPI router |
| Feature 2 — Visual search | `feature_2_searching/` | Extractor, index builder/updater, pgvector search, FastAPI router |
| Feature 3 — Sentiment analysis | `feature_3_sentiment/` | Aspect analyser, model, predict, FastAPI router |
| Feature 4 — Customer segmentation | `feature_4_segmentation/` | RFM builder, K-Means segmenter, FastAPI router |
| Feature 5 — Sales forecasting | `feature_5_forecasting/` | LSTM + Prophet models, predict, FastAPI router |
| Feature 6 — Recommender | `feature_6_recommender/` | Collaborative, content-based, hybrid, FastAPI router |
| FastAPI serve app | `serve/main.py` | All 6 routers mounted (`/search`, `/sentiment`, `/textile`, `/segment`, `/forecast`, `/recommend`) |
| Build scripts | `scripts/` | `build_recommender.py`, `build_visual_index.py`, `run_forecast.py`, `run_segmentation.py` |

### 🟡 In Progress / Partially Done

| Area | Notes |
|------|-------|
| `requirement.txt` | Has entries but needs `pip freeze > requirements.txt` to produce pinned versions for reproducible builds |
| Trained model weights | Not committed (correct for large files); team needs to document how to download / train |

### ❌ Not Started

| Area | Priority | Notes |
|------|----------|-------|
| ML ↔ backend authentication | HIGH | ML service receives requests without any API key / JWT guard |
| `POST /segment` endpoint body validation | HIGH | No Pydantic input validation on segmentation endpoint |
| pgvector extension setup | HIGH | Feature 2 requires PostgreSQL `pgvector`; not documented |
| Model accuracy metrics / eval results | MEDIUM | `evaluate.py` exists per feature but no results logged anywhere |
| Docker / docker-compose | MEDIUM | No `Dockerfile` for ML service or backend; needed for consistent deployment |

---

## 4. Cross-Cutting Issues

| Issue | Severity | Action |
|-------|----------|--------|
| No rate limiting | 🔴 HIGH | Install `express-rate-limit`; apply to `/api/auth/*` at minimum |
| No Zod validation | 🔴 HIGH | Validate all request bodies; prevents malformed data and type-coercion bugs |
| Redis not configured | 🔴 HIGH | Required for logout revocation + rate limiting |
| Frontend not connected to backend | 🔴 HIGH | All `script.js` auth is mock localStorage |
| Single CI job, no DB in CI | MEDIUM | CI runs `npm test` (placeholder); add real test runner + test DB |
| `ADMIN_JWT_TOKEN` generation undocumented | MEDIUM | Add generation command to `PRISMA_SETUP.md` |

---

## 5. Actionable Next Steps

### Sprint 1 — Foundation (do this first, unblocks everything)

1. **Prisma setup** — follow `PRISMA_SETUP.md` to run `prisma generate` and `prisma migrate dev`.
2. **Redis** — add `redis` / `ioredis` package; create `src/utils/redis.js`; update `docker-compose.yml`.
3. **Refresh-token blocklist** — in `POST /api/auth/logout`, add the token's `jti` to a Redis set with TTL matching `JWT_REFRESH_EXPIRES_IN`. Check the set in `verifyRefreshToken`.
4. **Rate limiter** — `npm install express-rate-limit`; mount on `/api/auth/` routes.
5. **Zod validation** — `npm install zod`; add `validateBody` middleware; apply to register, login, order, and product routes.

### Sprint 2 — Frontend Integration

6. Create `frontend/js/api.js` — Axios/fetch wrapper that reads `accessToken` from `localStorage`, adds `Authorization: Bearer` header, and calls `POST /api/auth/refresh` on 401.
7. Wire `login.html` → `POST /api/auth/login`; store `accessToken` + `refreshToken`.
8. Wire `shop.html` → `GET /api/products`.
9. Wire cart checkout → `POST /api/orders` → `POST /api/payments/initiate` → Razorpay JS SDK.
10. Wire seller `sell.html` → `POST /api/products`.

### Sprint 3 — ML End-to-End

11. Add pgvector to PostgreSQL (needed for Feature 2 visual search).
12. Add API-key middleware to FastAPI `serve/main.py` — check `X-API-Key` header against an env var.
13. Run `build_visual_index.py` and `build_recommender.py` after training to generate index files.
14. Validate segmentation pipeline end-to-end: seed DB with test orders → run cron job manually → verify `user.segment` updates.

### Sprint 4 — Quality & Deployment

15. Write integration tests for auth, orders, and payments using Jest + Supertest + a test PostgreSQL DB.
16. Add Docker Compose (`docker-compose.yml`) with services: `postgres`, `redis`, `backend`, `ml`.
17. Extend CI workflow to spin up test DB and run real tests.

---

## 6. Member Ownership (Conflict-Free)

| Area | Owner | Status |
|------|-------|--------|
| Backend auth (JWT refresh, Redis revocation, rate limit) | Member 1 | 🟡 In progress |
| Prisma migrate + seed data | Member 1 | ❌ Not started |
| Product / category CRUD + search | Member 2 | 🟡 Partial |
| Order / cart / checkout backend | Member 2 | ✅ Basic done |
| Payment webhook + email (SendGrid) | Member 3 | ❌ Not started |
| Frontend API integration (`api.js` + all pages) | Member 4 | ❌ Not started |
| ML service hardening + pgvector + scripts | Member 5 | 🟡 Partial |

---

*Generated by Copilot audit task — update this file as features are completed.*
