# KalaKart – Recyclable Fashion Marketplace ♻️👗

KalaKart is a sustainable fashion marketplace built for a hackathon sprint, focused on delivering a stable, demo-ready user journey:

- User authentication & profile management
- Product discovery
- Order creation and tracking
- Sustainability storytelling (with extensible eco-metrics)

---

## 🚀 Live Demo

- **Frontend URL:** `ADD_FRONTEND_URL_HERE`
- **Backend URL:** `ADD_BACKEND_URL_HERE`

---

## ✨ Core Features

### 1) Authentication
- Register / Login
- JWT-based protected routes
- Refresh token flow
- User profile (`GET /auth/me`, `PUT /auth/me`)

### 2) Product Catalog
- Product list with pagination/filter support
- Product detail by ID
- Admin product creation with image upload

### 3) Orders
- Create order with items + shipping address
- View own order list
- View own order detail
- Ownership protection (users cannot access others’ orders)

### 4) Platform Reliability
- API health endpoint
- Request validation
- Rate limiting for auth routes

---

## 🧱 Tech Stack

### Backend
- Node.js, Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cloudinary (image upload integration)

### Frontend
- Next.js / React
- API integration with token-based auth

---

## 📁 Project Structure (high-level)

```text
backend/
  src/
    controllers/
    services/
    routes/
    middleware/
    validators/
    utils/
  prisma/
frontend/
  ...
```

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

> Also maintain a safe `backend/.env.example` (without real secrets).

---

## ⚙️ Local Setup

### 1. Clone repo
```bash
git clone https://github.com/ADD_OWNER/ADD_REPO.git
cd ADD_REPO
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup backend env
- Create `backend/.env` using the template above.

### 4. Prisma setup
```bash
npx prisma generate
npx prisma migrate deploy
# or during development
npx prisma migrate dev
```

### 5. Run app
```bash
npm run start
# or dev mode if configured
npm run dev
```

---

## 📘 API Overview

Base path: `/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout` (auth required)
- `GET /auth/me` (auth required)
- `PUT /auth/me` (auth required)

### Products
- `GET /products`
- `GET /products/id/:id`
- `POST /products` (auth + admin)

### Orders
- `POST /orders` (auth required)
- `GET /orders` (auth required)
- `GET /orders/:id` (auth required, owner-only)

### Health
- `GET /health`

---

## 🧪 Testing / Validation Checklist

- [ ] Register + Login works with real DB
- [ ] Protected route (`/auth/me`) works with Bearer token
- [ ] Profile update persists
- [ ] Product list/detail loads from backend
- [ ] Order create/list/detail works
- [ ] Unauthorized access returns expected errors (401/403)

---

## 🌱 Sustainability Note

KalaKart is designed to support sustainability indicators (e.g., estimated water savings for recycled materials).  
In this sprint version, core commerce and reliability flows were prioritized for demo stability.

---

## 👥 Team Workflow (Conflict-safe)

- One task = one branch
- No direct push to `main`
- Small PRs with clear ownership
- Freeze features before final demo; bugfix-only in final window

---

## 🔮 Future Scope

- Add structured sustainability scoring model per product
- Add payment capture + webhook verification
- Add advanced search and recommendation
- Add seller/artisan dashboards
- Add analytics and impact reporting

---

## 📄 License

This project is built for educational/hackathon purposes.  
Add your preferred license (MIT/Apache-2.0/etc.) before production use.
](#)
