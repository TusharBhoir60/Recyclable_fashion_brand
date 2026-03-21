# RecyclaBag

A sustainable fashion startup that collects textile waste and converts it into fashion bags — basic, premium, and fully customised — sold through a modern e-commerce platform with an intelligent ML layer powering every user-facing decision.

---

## Table of contents

- [What this project is](#what-this-project-is)
- [How the system works](#how-the-system-works)
- [Repository structure](#repository-structure)
- [Tech stack](#tech-stack)
- [Team ownership](#team-ownership)
- [Getting started](#getting-started)
- [Backend — recyclabag-backend](#backend--recyclabag-backend)
- [Frontend — recyclabag-frontend](#frontend--recyclabag-frontend)
- [ML service — recyclabag-ml](#ml-service--recyclabag-ml)
- [Database schema](#database-schema)
- [API reference](#api-reference)
- [ML features](#ml-features)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Development workflow](#development-workflow)

---

## What this project is

RecyclaBag is a three-layer system:

```
Customer browser
      ↓
Next.js frontend  (Vercel)
      ↓
Node.js + Express backend  (Render)
      ↓                    ↓
PostgreSQL DB          FastAPI ML service  (Render)
(Supabase / Neon)
```

A customer browses bags, customises one with their own text and image, pays via Razorpay, and gets a confirmation. Behind the scenes, every interaction feeds into an ML system that classifies incoming textile waste, finds visually similar products, analyses review sentiment, segments customers, forecasts demand, recommends products, suggests dynamic prices, and inspects finished bags for defects.

---

## How the system works

### Customer journey

```
1. Browse products
     ↓ visual search — upload any photo to find similar bags (Feature 2)
     ↓ recommendations — personalised "you might also like" (Feature 6)

2. Customise a bag
     ↓ add text (font, colour, position)
     ↓ upload image
     ↓ live price calculator including customisation surcharge

3. Place order
     ↓ Prisma transaction — order + items + customisation written atomically

4. Pay
     ↓ Razorpay checkout opens in browser
     ↓ backend verifies HMAC signature
     ↓ order status → PAID

5. Leave a review
     ↓ sentiment analysis runs async (Feature 3)
     ↓ aspect breakdown stored alongside review
```

### Production / ops journey

```
Textile waste arrives
     ↓ photographed
     ↓ classifier assigns material + quality grade (Feature 1)
     ↓ routed to premium / basic / manual review

Finished bags photographed
     ↓ defect detector flags stitching errors, tears, zip faults (Feature 8)
     ↓ pass → ship | fail → rework queue

Weekly batch jobs
     ↓ customer segments updated — Champions / Loyal / Occasional / At risk (Feature 4)
     ↓ demand forecasts refreshed — 30-day per product type (Feature 5)
     ↓ dynamic pricing suggestions updated per product + segment (Feature 7)
```

---

## Repository structure

Three separate repos, one shared PostgreSQL database.

```
recyclabag-backend/      Node.js + Express API
recyclabag-frontend/     Next.js 14 App Router
recyclabag-ml/           Python FastAPI ML service
```

---

## Tech stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| ORM | Prisma 5 |
| Database | PostgreSQL (Supabase / Neon) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File upload | Multer + Cloudinary |
| Payments | Razorpay |
| Scheduling | node-cron |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | React Context (Auth + Cart) |
| Payments | Razorpay checkout.js |
| Deployment | Vercel |

### ML service
| Layer | Technology |
|---|---|
| Framework | FastAPI + Uvicorn |
| Deep learning | PyTorch 2.3 + torchvision |
| NLP | HuggingFace Transformers 4.41 |
| Classical ML | scikit-learn 1.5 |
| Gradient boosting | XGBoost 2.0 |
| Vector search | FAISS-cpu 1.8 |
| Time series | Prophet 1.1 |
| Object detection | Ultralytics YOLOv8 |
| Explainability | SHAP 0.45 |
| Deployment | Render |

---

## Team ownership

| Person | Owns | Branch |
|---|---|---|
| ML Dev (you) | ML service + DevOps + search/review API integration | `feat/ml-integration` |
| Dev 1 | Auth backend + auth frontend + global layout | `feat/auth` |
| Dev 2 | Products backend + products frontend + admin panel | `feat/products` |
| Dev 3 | Customisation backend + cart frontend | `feat/customisation` |
| Dev 4 | Orders + payments backend + checkout frontend | `feat/orders` |

Each person owns a complete vertical slice — database to UI — so everyone ships something visible and end-to-end.

---

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL (or a free Supabase / Neon account)
- Cloudinary account (free tier)
- Razorpay account (test mode)

### Clone all three repos

```bash
git clone https://github.com/your-org/recyclabag-backend.git
git clone https://github.com/your-org/recyclabag-frontend.git
git clone https://github.com/your-org/recyclabag-ml.git
```

### Start everything locally

```bash
# Terminal 1 — backend
cd recyclabag-backend
npm install
cp .env.example .env      # fill in credentials
npx prisma migrate dev
npm run dev               # runs on port 5000

# Terminal 2 — ML service
cd recyclabag-ml
python -m venv .venv && .venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn serve.main:app --port 8000 --reload      # runs on port 8000

# Terminal 3 — frontend
cd recyclabag-frontend
npm install
cp .env.example .env.local   # fill in credentials
npm run dev                  # runs on port 3000
```

---

## Backend — recyclabag-backend

### Folder structure

```
recyclabag-backend/
├── prisma/
│   └── schema.prisma          ← full DB schema
├── src/
│   ├── controllers/           ← request/response handling
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── customization.controller.js
│   │   ├── order.controller.js
│   │   └── payment.controller.js
│   ├── routes/                ← Express route definitions
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── customization.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── search.routes.js   ← visual search + semantic search
│   │   └── admin.routes.js    ← ML review queue, forecasts, segments
│   ├── services/              ← business logic
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── customization.service.js
│   │   ├── order.service.js
│   │   ├── payment.service.js
│   │   ├── visualSearch.service.js
│   │   ├── sentiment.service.js
│   │   ├── recommender.service.js
│   │   └── forecast.service.js
│   ├── middleware/
│   │   ├── auth.middleware.js      ← JWT verification
│   │   ├── isAdmin.middleware.js   ← role guard
│   │   └── upload.middleware.js    ← multer memory storage
│   ├── jobs/
│   │   └── segmentCustomers.job.js ← weekly cron
│   ├── utils/
│   │   ├── prisma.js
│   │   ├── cloudinary.js
│   │   ├── jwt.js
│   │   └── priceCalculator.js
│   └── app.js
├── server.js
└── .env
```

### Auth system

JWT-based authentication. Tokens are signed with `JWT_SECRET` and expire in 7 days.

```
POST /api/auth/register   →  { name, email, password }  →  { user, token }
POST /api/auth/login      →  { email, password }         →  { user, token }
```

All protected routes require `Authorization: Bearer <token>` header. Admin routes additionally require `role: ADMIN` on the user record.

### Product system

Products have three types: `BASIC`, `PREMIUM`, `CUSTOMIZED`. Images are stored on Cloudinary and their URLs are saved in a PostgreSQL array. Filtering by type uses a query parameter. Pagination is built in.

```
GET  /api/products          →  list with ?type=BASIC&page=1&limit=12
GET  /api/products/:id      →  single product
POST /api/products          →  admin only — create product
```

When a product is created, the backend automatically sends the first product image to the ML service to index it for visual search.

### Customisation system

The core feature of the product. Customisations are created as independent records before order placement. This keeps the order transaction clean.

```
POST /api/customize         →  multipart: text, font, colour, position, image(file)
                               returns: { id, extraCharge }
```

Price calculation rules live in `utils/priceCalculator.js`:

| Customisation | Extra charge |
|---|---|
| Text only | +₹100 |
| Image only | +₹200 |
| Text + image | +₹280 |

The `customizationId` from this call is attached to the order item when the order is created.

### Order system

Orders are created in a Prisma transaction — all items and the order record are written atomically. If anything fails, nothing is committed.

```
POST /api/orders            →  { items: [{ productId, quantity, customizationId }], shippingAddress }
GET  /api/orders            →  user's own orders
GET  /api/orders/:id        →  single order detail
```

Order statuses: `PENDING → PAID → PROCESSING → SHIPPED → DELIVERED`

### Payment system (Razorpay)

Two-step payment flow:

```
Step 1 — initiate
POST /api/payments/initiate    →  { orderId }
                                   returns: { razorpayOrderId, amount, currency, keyId }

   ↓ frontend opens Razorpay checkout with these params

Step 2 — verify
POST /api/payments/verify      →  { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
                                   backend verifies HMAC-SHA256 signature
                                   order status → PAID
```

The signature verification is critical — it proves the payment actually came from Razorpay and was not tampered with.

### Review system

Reviews are submitted by users after purchase. Sentiment analysis runs asynchronously — it does not block the review creation response.

```
POST /api/reviews            →  { productId, text, rating }
GET  /api/reviews/:productId →  all reviews with sentiment labels
```

---

## Frontend — recyclabag-frontend

### Folder structure

```
recyclabag-frontend/
├── app/                        ← Next.js 14 App Router pages
│   ├── layout.tsx              ← global layout, fonts, providers
│   ├── page.tsx                ← home
│   ├── products/
│   │   ├── page.tsx            ← product listing + filter + image search
│   │   └── [id]/page.tsx       ← product detail + similar products
│   ├── customize/page.tsx      ← customisation builder
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/
│   │   ├── page.tsx            ← order history
│   │   └── [id]/page.tsx       ← order detail
│   ├── search/page.tsx         ← visual search results
│   └── auth/
│       ├── login/page.tsx
│       └── register/page.tsx
├── components/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CustomizationForm.tsx   ← text + font + colour + image upload
│   ├── CartSummary.tsx
│   ├── RazorpayButton.tsx      ← opens Razorpay checkout
│   ├── ImageSearchUpload.tsx   ← upload photo → find similar bags
│   ├── SimilarProducts.tsx     ← "More like this" on product page
│   └── ReviewForm.tsx
├── services/                   ← all API calls — components stay clean
│   ├── api.ts                  ← base fetch with JWT injection
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── customization.service.ts
│   ├── order.service.ts
│   └── payment.service.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useProducts.ts
└── context/
    ├── AuthContext.tsx          ← JWT storage + user state
    └── CartContext.tsx          ← cart items in localStorage
```

### Key pages explained

**Product listing (`/products`)** — fetches all active products with type filter. The `ImageSearchUpload` component sits above the grid. When a user uploads a photo, it calls `POST /api/search/image` and replaces the grid with visually similar results.

**Product detail (`/products/:id`)** — shows full product info, the customisation CTA, and the `SimilarProducts` component which calls `GET /api/search/similar/:id` on mount.

**Customisation (`/customize`)** — text input with font and colour pickers, image upload with live preview, and a price breakdown that updates in real time as options are toggled. On submit, calls `POST /api/customize` (multipart), stores the returned `customizationId` in cart state.

**Checkout** — shipping address form + `RazorpayButton`. The button calls `POST /api/payments/initiate`, opens the Razorpay modal, and on success calls `POST /api/payments/verify`. On verification success, redirects to `/orders/:id?success=true`.

### Cart state

The cart lives in React Context + `localStorage`. There is no cart table in the database. Cart items have the shape:

```typescript
interface CartItem {
  productId:       string;
  name:            string;
  quantity:        number;
  unitPrice:       number;
  customizationId: string | null;
  extraCharge:     number;
  imageUrl:        string;
}
```

The cart is only persisted to the database when the user places an order.

---

## ML service — recyclabag-ml

### Service structure

```
recyclabag-ml/
├── feature_1_classifier/      ← textile waste classification
├── feature_2_visual_search/   ← image similarity search
├── feature_3_sentiment/       ← review sentiment analysis
├── feature_4_segmentation/    ← customer segmentation
├── feature_5_forecasting/     ← demand forecasting
├── feature_6_recommender/     ← product recommendations
├── feature_7_pricing/         ← dynamic pricing
├── feature_8_defect_detection/← quality control
├── serve/                     ← FastAPI app + all routers
└── scripts/                   ← one-off and scheduled utilities
```

Each feature is completely self-contained. You can work on Feature 5 without understanding Feature 2. They share nothing except the FastAPI serving layer.

---

## Database schema

### Core tables

```
Users
  id, name, email, password (hashed), role (CUSTOMER|ADMIN),
  segment (Champions|Loyal|Occasional|At risk|New), createdAt

Products
  id, name, description, type (BASIC|PREMIUM|CUSTOMIZED),
  basePrice, stock, images (String[]), isActive, createdAt

Customizations
  id, textContent, imageUrl (Cloudinary), font, color,
  position (front|back), extraCharge, createdAt

Orders
  id, userId, status (PENDING|PAID|PROCESSING|SHIPPED|DELIVERED|CANCELLED),
  totalAmount, shippingAddress (JSON), paymentId, razorpayOrderId, createdAt

OrderItems
  id, orderId, productId, quantity, unitPrice, customizationId

Reviews
  id, productId, userId, text, rating (1-5),
  sentimentLabel, sentimentScore, sentimentAspects (JSON),
  sentimentSummary, sentimentAnalyzed, createdAt

MlReviewQueue
  id, imageUrl, materialPred, confidence, allProbs (JSON),
  trueLabel, reviewed, reviewedAt, usedInTraining, createdAt
```

### Relationships

```
User        →  many Orders
User        →  many Reviews
Order       →  many OrderItems
OrderItem   →  one Product
OrderItem   →  optional one Customization
Product     →  many Reviews
Product     →  one ProductEmbedding (pgvector)
```

---

## API reference

### Auth

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | — | `{ name, email, password }` | `{ user, token }` |
| POST | `/api/auth/login` | — | `{ email, password }` | `{ user, token }` |

### Products

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/products` | — | `?type=BASIC&page=1&limit=12` |
| GET | `/api/products/:id` | — | |
| POST | `/api/products` | Admin | multipart with images |

### Customisation

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/customize` | JWT | multipart: textContent, font, color, position, image(file) |

### Orders

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/orders` | JWT | `{ items, shippingAddress }` |
| GET | `/api/orders` | JWT | — |
| GET | `/api/orders/:id` | JWT | — |

### Payments

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/payments/initiate` | JWT | `{ orderId }` |
| POST | `/api/payments/verify` | JWT | `{ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }` |

### Search (ML-powered)

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/search/image` | — | multipart image upload |
| GET | `/api/search/similar/:productId` | — | `?top_k=6` |

### Admin (ML + operations)

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/admin/orders/all` | Admin | for ML segmentation + forecasting |
| POST | `/api/admin/users/segments` | Admin | bulk segment write-back |
| GET | `/api/admin/forecast/:type` | Admin | demand forecast per product type |
| GET | `/api/admin/ml/review-queue` | Admin | low-confidence predictions |
| PATCH | `/api/admin/ml/review-queue/:id` | Admin | label a flagged prediction |

---

## ML features

### Feature 1 — Textile waste classifier

**Status:** ✅ Complete

Photographs of incoming textile waste are classified by material type and quality grade. The grade determines which production line the material goes to.

**How it works:** ResNet-50 (pretrained on ImageNet) with the classification head replaced by a custom two-layer head trained on fabric images. The backbone stays frozen for the first 10 epochs, then the last two residual blocks are unfrozen for fine-tuning. Active learning flags low-confidence predictions for admin labelling, which get added back to the training set weekly.

**Output:**
```json
{
  "material": "denim",
  "confidence": 0.93,
  "grade": "A",
  "route_to": "premium",
  "flag_for_review": false
}
```

**Concepts learned:** Transfer learning, CNN fine-tuning, data augmentation, class imbalance (WeightedRandomSampler), mixed precision training, label smoothing, gradual unfreezing, active learning.

---

### Feature 2 — Visual similarity search

**Status:** ✅ Complete

A user uploads any bag photo and gets the most visually similar products from the catalog. Also powers "More like this" on product detail pages without any image upload.

**How it works:** The same ResNet-50 backbone from Feature 1, but with `nn.Identity()` replacing the head entirely. Every image becomes a 2048-dimensional vector. After L2 normalisation, cosine similarity between images equals a dot product — which FAISS computes across the entire catalog in under 5ms. New products are added to the live index incrementally without a full rebuild.

**Phase 2 upgrade:** pgvector in PostgreSQL enables filtered similarity search inside a single SQL query — "find similar bags that are PREMIUM and under ₹2000."

**Concepts learned:** Feature extraction vs classification, embedding spaces, L2 normalisation, FAISS index types, approximate nearest neighbour, incremental updates, pgvector.

---

### Feature 3 — Review sentiment analysis

**Status:** ✅ Complete

Every submitted review is automatically analysed for overall sentiment and broken down by five product-specific aspects. Results power the admin dashboard and feed into product improvement decisions.

**How it works:** `cardiffnlp/twitter-roberta-base-sentiment-latest` fine-tuned on product reviews. The [CLS] token output feeds a two-layer classification head. Aspect-level analysis uses zero-shot prompting — the model is given a context-anchored prompt like "Regarding the bag durability: [review text]" and predicts sentiment for that specific aspect without needing separate aspect labels.

**Aspects:** durability, aesthetics, value, customization_quality, packaging

**Output:**
```json
{
  "overall": { "label": "positive", "confidence": 0.89 },
  "aspects": {
    "durability":           { "label": "positive",  "confidence": 0.82 },
    "packaging":            { "label": "negative",  "confidence": 0.74 }
  },
  "summary": "Positive: aesthetics, durability. Needs work: packaging."
}
```

**Concepts learned:** BPE tokenisation, [CLS] aggregation, BERT fine-tuning, AdamW, warmup scheduler, gradient clipping, zero-shot aspect prompting.

---

### Feature 4 — Customer segmentation

**Status:** ✅ Complete

All customers are clustered into four behaviour-based segments weekly. The segment label is stored on the User record and read by the dynamic pricing and recommender features to personalise their outputs.

**How it works:** Three numbers — Recency (days since last order), Frequency (total orders), and Monetary (total spend) — are computed per user from order history. StandardScaler normalises all three to equal influence. K-Means groups users into 4 clusters. Clusters are labelled by ranking their centroids on a composite score.

**Segments:**

| Segment | Profile | Action |
|---|---|---|
| Champions | Recent, frequent, high spend | VIP treatment, early access |
| Loyal | Regular buyers, moderate spend | Loyalty rewards |
| Occasional | Infrequent, moderate value | Re-engagement |
| At risk | Haven't bought in a while | Win-back offers |

**Concepts learned:** RFM feature engineering, StandardScaler, K-Means, elbow method, silhouette score, cluster labelling, pickle persistence.

---

### Feature 5 — Demand forecasting

**Status:** ✅ Complete

Predicts daily bag demand per product type for the next 30 days. Drives inventory planning — how much textile waste to procure, how many bags to produce.

**How it works:** Two-phase approach. Phase 1 (MVP, less than 6 months of data) uses Facebook Prophet which separates demand into trend + weekly seasonality + Indian holidays. Phase 2 (after 6 months of data) upgrades to an LSTM that learns patterns from sliding windows of the past 30 days to predict the next 7 — repeated recursively for a 30-day horizon.

**Key detail:** Time series data must never be shuffled. Train/val split is always chronological — train on the oldest data, validate on the most recent.

**Output:**
```json
{
  "product_type": "BASIC",
  "forecasts": [
    { "date": "2026-03-22", "predicted": 8.4, "lower": 5.1, "upper": 11.7 }
  ]
}
```

**Concepts learned:** Trend/seasonality decomposition, Prophet, LSTM, sliding window sequences, MinMaxScaler, chronological split, autoregressive forecasting, MAPE/RMSE/MAE.

---

### Feature 6 — Hybrid recommender

**Status:** ✅ Complete

Personalised product recommendations on the product detail page, home page, and post-purchase emails. Solves the cold-start problem — new users with no history still get relevant recommendations.

**How it works:** Two signals fused with a weighted average.

Collaborative filtering (SVD): decomposes the user × product purchase matrix into latent factors. Users who bought similar things end up with similar vectors. Recommendation = find products whose vectors align with the user's.

Content-based filtering: builds a feature vector per product from type, price tier, and material. Cosine similarity matrix captures which products are attribute-similar. New users who haven't bought anything get pure content-based results.

The mixing weight α is set automatically by the user's segment from Feature 4: Champions get α=0.75 (trust purchase history heavily), new users get α=0.0 (pure content).

**Concepts learned:** Implicit feedback, sparse matrices, matrix factorisation, user/product latent vectors, one-hot encoding, content similarity, cold-start problem, hybrid ensemble, precision@K, recall@K.

---

### Feature 7 — Dynamic pricing

**Status:** 🔲 Planned

Suggests adjusted prices per product per session based on demand signals, stock, seasonality, and user segment. Shown to admins for approval before going live.

**How it works:** XGBoost trained on historical price and demand data. Input features include base price, product type, stock level, day of week, festival season flag, user segment (from Feature 4), and rolling demand windows. SHAP explains every prediction — the admin can see that "the price is up 15% because it's Diwali week and stock is low."

**Guardrails:** Suggested price is clamped to [80%, 130%] of base price regardless of model output.

**Concepts learned:** Gradient boosting, XGBoost, feature importance, SHAP explainability, price elasticity, regression metrics.

---

### Feature 8 — Defect detection

**Status:** 🔲 Planned

Quality control pipeline. Photographs of finished bags are run through an object detection model before shipment. Any detected defect holds the order for rework.

**How it works:** YOLOv8-nano fine-tuned on photos of bag defects. Unlike the classifier (which says "what is this?"), the detector says "where is the problem?" and draws a bounding box around it. Trained with the standard YOLO annotation format.

**Defect classes:** stitch_error, colour_bleed, torn_fabric, shape_defect, zipper_fault

**Output:**
```json
{
  "pass": false,
  "grade": "fail",
  "defects": [
    { "class": "stitch_error", "confidence": 0.91, "bbox": [120, 340, 280, 410] }
  ]
}
```

**Concepts learned:** Object detection vs classification, YOLOv8, bounding boxes, IoU, non-maximum suppression, mAP evaluation.

---

## Deployment

### Three services, three platforms

| Service | Platform | URL pattern |
|---|---|---|
| Frontend | Vercel | `recyclabag.vercel.app` |
| Backend | Render | `recyclabag-api.onrender.com` |
| ML service | Render | `recyclabag-ml.onrender.com` |

### Database

PostgreSQL hosted on Supabase or Neon. Both offer a generous free tier. The same database is shared by the backend and the ML service (for pgvector writes).

### ML service startup command on Render

```bash
python scripts/download_artifacts.py && uvicorn serve.main:app --host 0.0.0.0 --port 8000 --workers 2
```

The `download_artifacts.py` script pulls model weights from S3/cloud storage before the server starts — weights are never committed to Git.

### Model artefacts storage

Large binary files (`.pt`, `.pkl`, `.faiss`) are stored in S3 or equivalent and pulled at deploy time.

| Artefact | Size |
|---|---|
| `textile_v1.pt` (ResNet-50 fine-tuned) | ~100MB |
| `sentiment_v1.pt` (RoBERTa fine-tuned) | ~500MB |
| `kmeans_model.pkl` + `scaler.pkl` | < 1MB |
| `bags_flat.faiss` + `bags_metadata.json` | ~80MB |
| `prophet_*.pkl` × 3 | ~10MB |
| `svd_model.pkl` + `content_sim.npy` | ~5MB |

---

## Environment variables

### recyclabag-backend/.env

```env
DATABASE_URL=postgresql://user:password@host:5432/recyclabag
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=rzp_test_
RAZORPAY_KEY_SECRET=

ML_SERVICE_URL=http://localhost:8000
```

### recyclabag-frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_
```

### recyclabag-ml/.env

```env
DATABASE_URL=postgresql://user:password@host:5432/recyclabag
BACKEND_API_URL=http://localhost:5000
ADMIN_JWT_TOKEN=long-lived-admin-jwt-for-cron-jobs
```

---

## Development workflow

### Branching

```
main          ← production only — CI deploys from here
dev           ← integration branch — all PRs target this
feat/auth
feat/products
feat/customisation
feat/orders
feat/ml-integration
```

### Dependency order — who starts first

```
Day 1   Dev 1 starts backend foundation + Prisma schema
        ML dev starts DevOps setup

Day 2   Dev 1 signals "DB migration succeeded + auth routes working"
        Dev 2 and Dev 3 start their backend slices
        Dev 4 starts Next.js init + HTML/CSS conversion

Day 4   Dev 2 signals "products API working"
        Dev 4 wires product pages to real data

Day 5   Dev 3 signals "customisation API working"
        Dev 4 wires cart and customisation pages

Day 7   Dev 4 wires checkout once orders/payments API is ready
        ML dev wires ML service endpoints to backend services
```

### Running the weekly ML jobs manually (until cron is set up)

```bash
# Segmentation — assign customer segments
python scripts/run_segmentation.py --train

# Forecasting — refresh demand forecasts
python scripts/run_forecast.py --all --synthetic

# Recommender — rebuild interaction matrix
python scripts/build_recommender.py --synthetic
```

---

## What gets better over time

This is not a static product. Every user action improves it:

| User action | What it improves |
|---|---|
| Places an order | Demand forecast accuracy (Feature 5) |
| Places an order | Recommender collaborative signal (Feature 6) |
| Leaves a review | Sentiment model training data (Feature 3) |
| Segment changes | Recommender personalisation (Feature 6) |
| Segment changes | Dynamic pricing accuracy (Feature 7) |
| Admin labels a textile | Classifier accuracy (Feature 1 active learning) |

After 3 months of real orders the ML models will be meaningfully better than on launch day — trained on actual RecyclaBag customer behaviour rather than synthetic bootstrap data.

---

*RecyclaBag — turning textile waste into fashion, one bag at a time.*
