# Recyclable_fashion_brand[README (4).md](https://github.com/user-attachments/files/26158636/README.4.md)
# recyclabag-ml

Machine learning service for the RecyclaBag platform — a recyclable fashion bag startup that converts textile waste into fashion bags. This repo contains all ML features, model training pipelines, inference servers, and integration code.

---

## Table of contents

- [Overview](#overview)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Setup](#setup)
- [Features](#features)
  - [Feature 1 — Textile waste classifier](#feature-1--textile-waste-classifier)
  - [Feature 2 — Visual similarity search](#feature-2--visual-similarity-search)
  - [Feature 3 — Review sentiment analysis](#feature-3--review-sentiment-analysis)
  - [Feature 4 — Customer segmentation](#feature-4--customer-segmentation)
  - [Feature 5 — Demand forecasting](#feature-5--demand-forecasting)
  - [Feature 6 — Hybrid recommender](#feature-6--hybrid-recommender)
  - [Feature 7 — Dynamic pricing](#feature-7--dynamic-pricing)
  - [Feature 8 — Defect detection](#feature-8--defect-detection)
- [ML service API](#ml-service-api)
- [Integration with backend](#integration-with-backend)
- [Model artefacts](#model-artefacts)
- [Active learning loop](#active-learning-loop)
- [Running the service](#running-the-service)
- [Environment variables](#environment-variables)
- [Gitignore rules](#gitignore-rules)
- [ML concepts index](#ml-concepts-index)

---

## Overview

The ML service is a standalone FastAPI application that runs alongside the Node.js backend. The backend calls it over HTTP. Every ML feature lives in its own isolated folder — you can work on one feature without touching anything from another.

```
Node.js backend  ──HTTP──►  FastAPI ML service (port 8000)
                                 ├── /classify        Feature 1
                                 ├── /visual-search   Feature 2
                                 ├── /sentiment       Feature 3
                                 ├── /segment         Feature 4
                                 ├── /forecast        Feature 5
                                 ├── /recommend       Feature 6
                                 ├── /pricing         Feature 7
                                 └── /quality         Feature 8
```

---

## Project structure

```
recyclabag-ml/
│
├── feature_1_classifier/          # Textile material + quality classification
│   ├── dataset.py
│   ├── model.py
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── active_learning.py
│   ├── configs/
│   │   └── textile_config.yaml
│   ├── weights/                   # .gitignore — large binary files
│   ├── data/                      # .gitignore — images
│   └── notebooks/
│
├── feature_2_visual_search/       # Image similarity search (FAISS + embeddings)
│   ├── extractor.py
│   ├── index_builder.py
│   ├── searcher.py
│   ├── index_updater.py
│   ├── pgvector_store.py
│   ├── evaluate.py
│   ├── indexes/                   # .gitignore — FAISS binary files
│   └── notebooks/
│
├── feature_3_sentiment/           # Review sentiment + aspect analysis (BERT)
│   ├── dataset.py
│   ├── model.py
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── aspect_analyzer.py
│   ├── configs/
│   │   └── sentiment_config.yaml
│   ├── weights/                   # .gitignore
│   ├── data/                      # .gitignore
│   └── notebooks/
│
├── feature_4_segmentation/        # Customer segmentation (K-Means + RFM)
│   ├── rfm_builder.py
│   ├── segmenter.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── configs/
│   │   └── segmentation_config.yaml
│   ├── weights/                   # .gitignore
│   ├── data/                      # .gitignore
│   └── notebooks/
│
├── feature_5_forecasting/         # Demand forecasting (Prophet + LSTM)
│   ├── preprocessor.py
│   ├── prophet_model.py
│   ├── lstm_model.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── configs/
│   │   └── forecast_config.yaml
│   ├── weights/                   # .gitignore
│   ├── data/                      # .gitignore
│   └── notebooks/
│
├── feature_6_recommender/         # Hybrid recommendation system
│   ├── collaborative.py
│   ├── content_based.py
│   ├── hybrid.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── configs/
│   │   └── recommender_config.yaml
│   ├── weights/                   # .gitignore
│   └── notebooks/
│
├── feature_7_pricing/             # Dynamic pricing (XGBoost + SHAP)
│   ├── feature_engineering.py
│   ├── pricing_model.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── configs/
│   │   └── pricing_config.yaml
│   ├── weights/                   # .gitignore
│   └── notebooks/
│
├── feature_8_defect_detection/    # Bag quality control (YOLOv8)
│   ├── dataset.py
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── configs/
│   │   └── dataset.yaml
│   ├── weights/                   # .gitignore
│   ├── data/                      # .gitignore
│   └── notebooks/
│
├── serve/                         # FastAPI — one app, all features
│   ├── main.py
│   └── routers/
│       ├── textile_router.py
│       ├── visual_search_router.py
│       ├── sentiment_router.py
│       ├── segmentation_router.py
│       ├── forecast_router.py
│       ├── recommender_router.py
│       ├── pricing_router.py
│       └── quality_router.py
│
├── scripts/                       # One-off and scheduled utility scripts
│   ├── build_visual_index.py
│   ├── label_reviews.py
│   ├── run_segmentation.py
│   └── download_artifacts.py
│
├── .env
├── .gitignore
└── requirements.txt
```

---

## Tech stack

| Layer | Library | Version |
|---|---|---|
| Serving | FastAPI + Uvicorn | 0.111.0 |
| Deep learning | PyTorch + torchvision | 2.3.0 |
| Transformers | HuggingFace Transformers | 4.41.0 |
| Classical ML | scikit-learn | 1.5.0 |
| Gradient boosting | XGBoost | 2.0.3 |
| Vector search | FAISS-cpu | 1.8.0 |
| Time series | Prophet | 1.1.5 |
| Object detection | Ultralytics (YOLOv8) | 8.2.0 |
| Explainability | SHAP | 0.45.0 |
| Data | Pandas + NumPy | 2.2.2 / 1.26.4 |
| Image processing | Pillow | 10.3.0 |
| HTTP client | httpx | latest |

---

## Setup

### 1. Clone and create virtual environment

```bash
git clone https://github.com/your-org/recyclabag-ml.git
cd recyclabag-ml
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac / Linux
source .venv/bin/activate
```

### 2. Install dependencies

```bash
# CPU-only (development)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt

# GPU (Render / production)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

### 3. Create all directories

**Windows (PowerShell):**

```powershell
$features = @(
  "feature_1_classifier/{configs,weights,data/raw,data/processed/{train/{cotton,denim,polyester,silk_blend,synthetic},val/{cotton,denim,polyester,silk_blend,synthetic}},notebooks}",
  "feature_2_visual_search/{indexes,notebooks}",
  "feature_3_sentiment/{configs,weights,data/processed,notebooks}",
  "feature_4_segmentation/{configs,weights,data/processed,notebooks}",
  "feature_5_forecasting/{configs,weights,data/processed,notebooks}",
  "feature_6_recommender/{configs,weights,notebooks}",
  "feature_7_pricing/{configs,weights,notebooks}",
  "feature_8_defect_detection/{configs,weights,data/{images/{train,val},labels/{train,val}},notebooks}"
)
foreach ($f in $features) { New-Item -ItemType Directory -Force -Path $f }
```

**Mac / Linux:**

```bash
mkdir -p feature_1_classifier/{configs,weights,data/raw,data/processed/{train/{cotton,denim,polyester,silk_blend,synthetic},val/{cotton,denim,polyester,silk_blend,synthetic}},notebooks}
mkdir -p feature_2_visual_search/{indexes,notebooks}
mkdir -p feature_3_sentiment/{configs,weights,data/processed,notebooks}
mkdir -p feature_4_segmentation/{configs,weights,data/processed,notebooks}
mkdir -p feature_5_forecasting/{configs,weights,data/processed,notebooks}
mkdir -p feature_6_recommender/{configs,weights,notebooks}
mkdir -p feature_7_pricing/{configs,weights,notebooks}
mkdir -p feature_8_defect_detection/{configs,weights,data/{images/{train,val},labels/{train,val}},notebooks}
mkdir -p serve/routers scripts
```

### 4. Environment file

```bash
cp .env.example .env
# Fill in DATABASE_URL and BACKEND_API_URL
```

### 5. Download model artifacts (production deploy)

```bash
python scripts/download_artifacts.py
```

### 6. Start the ML service

```bash
uvicorn serve.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Features

---

### Feature 1 — Textile waste classifier

**Status:** ✅ Implemented

**What it does:** Photographs of incoming textile waste are classified by material type and assigned a quality grade that routes them to the correct production line.

**ML concepts:** Transfer learning, CNN fine-tuning, data augmentation, class imbalance (WeightedRandomSampler), mixed precision training, label smoothing, gradual unfreezing, active learning.

**Model:** ResNet-50 (ImageNet pretrained) + custom classification head

**Classes:**

| Class | Description |
|---|---|
| `cotton` | Natural cotton fabric |
| `denim` | Denim / jeans material |
| `polyester` | Synthetic polyester |
| `silk_blend` | Silk or silk-blend |
| `synthetic` | Other synthetic materials |

**Quality gate:**

| Grade | Confidence threshold | Routes to |
|---|---|---|
| A | ≥ 0.85 | Premium bag production |
| B | ≥ 0.60 | Basic bag production |
| Reject | < 0.60 | Manual review queue |

**Training:**

```bash
# Prepare data
python scripts/label_reviews.py    # or place images manually in data/processed/

# Train
python feature_1_classifier/train.py

# Evaluate
python feature_1_classifier/evaluate.py
```

**API endpoint:**

```
POST /classify
Content-Type: multipart/form-data
Body: file (image/jpeg | image/png | image/webp, max 5MB)

Response:
{
  "material":    "denim",
  "confidence":  0.9312,
  "grade":       "A",
  "route_to":    "premium",
  "all_probs":   { "cotton": 0.02, "denim": 0.93, ... },
  "flag_for_review": false
}
```

**Data requirements:** Minimum 200 labelled images per class to start. Active learning adds samples automatically from low-confidence predictions.

---

### Feature 2 — Visual similarity search

**Status:** ✅ Implemented

**What it does:** A user uploads any bag photo and gets the most visually similar products from the catalog. Also powers "More like this" on product detail pages.

**ML concepts:** Feature extraction (vs classification), embedding spaces, L2 normalisation, cosine similarity, FAISS index types (Flat vs IVF vs HNSW), approximate nearest neighbour search, incremental index updates, pgvector for filtered search.

**Model:** ResNet-50 backbone with `nn.Identity()` replacing the FC head → 2048-dim embedding vector

**How similarity works:**

Every bag image is mapped to a 2048-dimensional vector. After L2 normalisation, cosine similarity between two images equals their dot product. FAISS searches across all product vectors in milliseconds to find the top-K closest.

**Index types:**

| Index | Use when | Accuracy | Latency |
|---|---|---|---|
| `IndexFlatIP` | < 5,000 products | Exact | ~5ms |
| `IndexIVFFlat` | 5,000–500,000 | ~97% | ~15ms |
| `IndexHNSWFlat` | Any size, lowest latency | ~99% | ~3ms |

**Build the index:**

```bash
# Pull products from backend and build FAISS index
python scripts/build_visual_index.py
```

**API endpoints:**

```
POST /visual-search/by-image
Content-Type: multipart/form-data
Body: file (image), top_k (int, default 8), exclude (product_id optional)

GET /visual-search/by-product/{product_id}?top_k=6

POST /visual-search/add-product
Body: product_id, name, type, base_price, file (image)
```

**Production upgrade:** Use pgvector in PostgreSQL to enable filtered similarity search — e.g. "find similar bags that are PREMIUM and under ₹2000" in a single SQL query.

---

### Feature 3 — Review sentiment analysis

**Status:** ✅ Implemented

**What it does:** Every review is automatically analysed for overall sentiment (positive / neutral / negative) and broken down by five product aspects. Results are stored alongside the review and surfaced in the admin dashboard.

**ML concepts:** Tokenisation (BPE subwords), [CLS] token aggregation, BERT fine-tuning, AdamW optimiser, warmup scheduler, gradient clipping, label smoothing, aspect-level zero-shot prompting.

**Model:** `cardiffnlp/twitter-roberta-base-sentiment-latest` + classification head

**Aspects analysed:**

| Aspect | What it captures |
|---|---|
| `durability` | Material quality, stitching, longevity |
| `aesthetics` | Design, colour, appearance |
| `value` | Price vs quality perception |
| `customization_quality` | Print quality, text accuracy |
| `packaging` | Unboxing experience, box condition |

**Training:**

```bash
# Bootstrap dataset from HuggingFace (yelp_polarity)
python scripts/label_reviews.py

# Train
python feature_3_sentiment/train.py

# Evaluate
python feature_3_sentiment/evaluate.py
```

**API endpoint:**

```
POST /sentiment/analyze
Content-Type: application/json
Body: { "text": "...", "run_aspects": true, "product_id": "..." }

Response:
{
  "overall": { "label": "positive", "confidence": 0.89, "scores": {...} },
  "aspects": {
    "durability":           { "label": "positive",  "confidence": 0.82 },
    "aesthetics":           { "label": "positive",  "confidence": 0.91 },
    "value":                { "label": "neutral",   "confidence": 0.67 },
    "customization_quality":{ "label": "positive",  "confidence": 0.88 },
    "packaging":            { "label": "negative",  "confidence": 0.74 }
  },
  "summary": "Positive: aesthetics, durability. Needs work: packaging."
}

POST /sentiment/batch
Body: { "texts": ["review 1", "review 2", ...] }
```

**Integration:** Called async after review submission — does not block the API response. Results written back to `Review.sentimentLabel`, `Review.sentimentAspects`.

---

### Feature 4 — Customer segmentation

**Status:** ✅ Implemented

**What it does:** All customers are clustered into four segments weekly based on their purchase history. Segment labels are written to the User table and read by the dynamic pricing and recommender features.

**ML concepts:** RFM feature engineering, StandardScaler (why distance models need normalisation), K-Means algorithm, elbow method, silhouette score, cluster labelling by centroid analysis, model persistence with pickle.

**Segments:**

| Segment | Recency | Frequency | Monetary | Action |
|---|---|---|---|---|
| Champions | Low (recent) | High | High | VIP treatment, early access |
| Loyal | Medium | High | Medium | Reward programme |
| Occasional | High | Low | Low | Re-engagement campaigns |
| At risk | Very high | Very low | Low | Win-back discounts |

**Run segmentation:**

```bash
# Full retrain + write segments to DB
python scripts/run_segmentation.py --train

# Use existing model, just re-assign (faster, weekly cron)
python scripts/run_segmentation.py --predict
```

**API endpoints:**

```
POST /segment/predict
Body: { "recency": 5, "frequency": 8, "monetary": 12000 }

POST /segment/predict-from-orders
Body: { "user_id": "...", "orders": [{created_at, total_amount, status}] }

Response:
{
  "segment": "Champions",
  "cluster_id": 2,
  "centroid_distance": 0.38,
  "rfm": { "recency": 5, "frequency": 8, "monetary": 12000 }
}
```

**Cron schedule:** Every Sunday at 02:00 UTC — re-runs on full order history, updates all user segments.

---

### Feature 5 — Demand forecasting

**Status:** 🔲 Planned

**What it does:** Predicts weekly bag demand per product type for the next 30 days. Drives inventory planning and textile waste procurement decisions.

**ML concepts:** Time series stationarity, seasonality decomposition, autocorrelation, ARIMA baseline, Facebook Prophet, LSTM sequence modelling, time-series train/val split (no random split), MAPE / RMSE evaluation.

**Two-phase approach:**

| Phase | Model | When to use |
|---|---|---|
| Phase 1 (MVP) | Facebook Prophet | < 6 months of order data |
| Phase 2 | LSTM (PyTorch) | ≥ 6 months — captures complex seasonal patterns |

**API endpoint:**

```
GET /forecast/{product_type}?horizon=30
Response: { "forecasts": [{ "date": "2025-01-15", "predicted": 23, "lower": 18, "upper": 28 }] }
```

---

### Feature 6 — Hybrid recommender

**Status:** 🔲 Planned

**What it does:** "You might also like" — personalised product recommendations shown on the product page and in post-purchase emails.

**ML concepts:** Collaborative filtering, matrix factorisation (TruncatedSVD), content-based filtering (cosine similarity on product features), cold-start problem, hybrid ensemble (alpha weighting), implicit feedback.

**Hybrid formula:**

```
final_score = α × collaborative_score + (1 - α) × content_score
```

Where `α = 0.6` by default. Champions and Loyal segments get higher `α` (more personalised). New users with no history get `α = 0` (pure content-based).

**API endpoint:**

```
POST /recommend
Body: { "user_id": "...", "product_id": "...", "top_k": 8 }
Response: { "recommendations": [{ product_id, name, score, reason }] }
```

---

### Feature 7 — Dynamic pricing

**Status:** 🔲 Planned

**What it does:** Suggests an adjusted price for each product per session based on demand signals, stock levels, seasonality, and the user's segment. Shown only to admins initially — they approve or override.

**ML concepts:** Gradient boosting (XGBoost), feature importance, price elasticity modelling, SHAP explainability (why did the model suggest this price?), regression evaluation (MAE, MAPE), guardrail constraints.

**Input features:**

| Feature | Description |
|---|---|
| `base_price` | Original listed price |
| `product_type` | BASIC / PREMIUM / CUSTOMIZED |
| `stock_level` | Units remaining |
| `day_of_week` | 0–6 |
| `is_festival_season` | Diwali, Christmas etc. |
| `user_segment` | From Feature 4 |
| `rolling_7d_demand` | Orders in last 7 days |
| `rolling_30d_demand` | Orders in last 30 days |

**Guardrails:** Suggested price is clamped to [80%, 130%] of base price. Model cannot recommend prices outside this range regardless of its output.

**API endpoint:**

```
POST /pricing/suggest
Body: { "product_id": "...", "user_id": "...", "context": {...} }
Response: { "suggested_price": 1299, "base_price": 999, "delta_pct": 30, "top_driver": "festival" }
```

---

### Feature 8 — Defect detection

**Status:** 🔲 Planned

**What it does:** Quality control — photographs of finished bags are run through an object detection model before shipment. Defects are flagged and the order is held for review.

**ML concepts:** Object detection vs image classification, YOLOv8 architecture, bounding boxes, IoU (Intersection over Union), NMS (non-maximum suppression), anchor boxes, mAP evaluation.

**Defect classes detected:**

| Class | Description |
|---|---|
| `stitch_error` | Loose or broken stitching |
| `colour_bleed` | Ink or dye bleeding outside design |
| `torn_fabric` | Tears or holes in material |
| `shape_defect` | Bag not holding correct form |
| `zipper_fault` | Zip misaligned or not closing |

**Training:**

```bash
# Fine-tune YOLOv8 nano (fastest to train, runs on CPU)
yolo detect train data=feature_8_defect_detection/configs/dataset.yaml \
  model=yolov8n.pt epochs=50 imgsz=640 batch=16
```

**API endpoint:**

```
POST /quality/inspect
Content-Type: multipart/form-data
Body: file (bag image)

Response:
{
  "pass": false,
  "grade": "fail",
  "defects": [
    { "class": "stitch_error", "confidence": 0.91, "bbox": [120, 340, 280, 410] }
  ]
}
```

---

## ML service API

All routes follow the pattern `/{feature}/{action}`. Base URL in development: `http://localhost:8000`

| Method | Endpoint | Feature | Description |
|---|---|---|---|
| POST | `/classify` | 1 | Classify textile image |
| GET | `/classify/health` | 1 | Model health check |
| POST | `/visual-search/by-image` | 2 | Search by uploaded image |
| GET | `/visual-search/by-product/{id}` | 2 | More like this |
| POST | `/visual-search/add-product` | 2 | Add product to index |
| POST | `/sentiment/analyze` | 3 | Analyze single review |
| POST | `/sentiment/batch` | 3 | Analyze multiple reviews |
| POST | `/segment/predict` | 4 | Predict segment from RFM |
| POST | `/segment/predict-from-orders` | 4 | Predict from order history |
| GET | `/forecast/{type}` | 5 | Demand forecast |
| POST | `/recommend` | 6 | Get recommendations |
| POST | `/pricing/suggest` | 7 | Suggest dynamic price |
| POST | `/quality/inspect` | 8 | Inspect bag for defects |

---

## Integration with backend

The Node.js backend communicates with the ML service through service files in `recyclabag-backend/src/services/`. Each ML feature has a corresponding service:

```
recyclabag-backend/src/services/
├── mlClassifier.service.js     # Feature 1
├── visualSearch.service.js     # Feature 2
├── sentiment.service.js        # Feature 3 — called async after review save
└── segmentation.service.js     # Feature 4 — called by weekly cron + pricing
```

The ML service URL is configured in the backend `.env`:

```env
ML_SERVICE_URL=http://localhost:8000          # development
ML_SERVICE_URL=https://recyclabag-ml.onrender.com  # production
```

---

## Model artefacts

Model weights and indexes are not committed to Git. They live in cloud storage and are pulled at deploy time.

| Artefact | Location | Size (approx) |
|---|---|---|
| `textile_v1.pt` | S3 / cloud storage | ~100MB |
| `sentiment_v1.pt` | S3 / cloud storage | ~500MB |
| `kmeans_model.pkl` | S3 / cloud storage | < 1MB |
| `scaler.pkl` | S3 / cloud storage | < 1MB |
| `bags_flat.faiss` | S3 / cloud storage | ~80MB |
| `bags_metadata.json` | S3 / cloud storage | < 5MB |
| `best.pt` (YOLOv8) | S3 / cloud storage | ~6MB |

Download script for deploy:

```bash
python scripts/download_artifacts.py
```

---

## Active learning loop

Features 1 and 3 implement active learning — the models improve automatically using production data.

```
User uploads textile / submits review
    ↓
Model predicts with low confidence (< threshold)
    ↓
Sample flagged → stored in MlReviewQueue (PostgreSQL)
    ↓
Admin reviews via /api/admin/ml/review-queue
    ↓
True label assigned
    ↓
Sample added to training dataset
    ↓
Weekly retrain triggered when ≥ 50 new samples accumulate
    ↓
Model accuracy improves over time
```

---

## Running the service

### Development

```bash
# Start with hot reload
uvicorn serve.main:app --host 0.0.0.0 --port 8000 --reload
```

### Production (Render)

Start command:

```bash
python scripts/download_artifacts.py && uvicorn serve.main:app --host 0.0.0.0 --port 8000 --workers 2
```

### Run training scripts

```bash
# Feature 1 — classifier
python feature_1_classifier/train.py

# Feature 2 — build FAISS index
python scripts/build_visual_index.py

# Feature 3 — sentiment
python scripts/label_reviews.py      # prepare data first
python feature_3_sentiment/train.py

# Feature 4 — segmentation (weekly)
python scripts/run_segmentation.py --train
```

---

## Environment variables

```env
# .env

# PostgreSQL — same DB as backend (for pgvector writes)
DATABASE_URL=postgresql://user:password@host:5432/recyclabag

# Backend API — for pulling order data and writing segment results
BACKEND_API_URL=http://localhost:5000
ADMIN_JWT_TOKEN=your-long-lived-admin-jwt

# Cloud storage — for downloading model artefacts on deploy
S3_BUCKET=recyclabag-ml-artifacts
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
```

---

## Gitignore rules

```gitignore
# All training data — never commit raw images or CSVs
feature_1_classifier/data/
feature_2_visual_search/indexes/
feature_3_sentiment/data/
feature_4_segmentation/data/
feature_5_forecasting/data/
feature_6_recommender/data/
feature_7_pricing/data/
feature_8_defect_detection/data/

# All model weights — large binary files, stored in S3
feature_1_classifier/weights/
feature_3_sentiment/weights/
feature_4_segmentation/weights/
feature_5_forecasting/weights/
feature_6_recommender/weights/
feature_7_pricing/weights/
feature_8_defect_detection/weights/
feature_8_defect_detection/runs/

# Python
__pycache__/
*.py[cod]
*.egg-info/
.venv/
dist/

# Notebooks — don't commit output cells
.ipynb_checkpoints/

# Environment
.env
```

---

## ML concepts index

A quick reference of every ML concept used in this project and which feature teaches it.

| Concept | Feature | File |
|---|---|---|
| Transfer learning | 1, 2 | `feature_1_classifier/model.py` |
| CNN fine-tuning | 1 | `feature_1_classifier/train.py` |
| Data augmentation | 1 | `feature_1_classifier/dataset.py` |
| Class imbalance (WeightedRandomSampler) | 1 | `feature_1_classifier/dataset.py` |
| Mixed precision training | 1 | `feature_1_classifier/train.py` |
| Cosine LR scheduling | 1 | `feature_1_classifier/train.py` |
| Gradual unfreezing | 1 | `feature_1_classifier/model.py` |
| Active learning | 1, 3 | `feature_1_classifier/active_learning.py` |
| Confusion matrix + F1 | 1, 3 | `*/evaluate.py` |
| Feature extraction (vs classification) | 2 | `feature_2_visual_search/extractor.py` |
| L2 normalisation | 2 | `feature_2_visual_search/extractor.py` |
| Cosine similarity via dot product | 2 | `feature_2_visual_search/extractor.py` |
| FAISS index types | 2 | `feature_2_visual_search/index_builder.py` |
| Approximate nearest neighbour | 2 | `feature_2_visual_search/searcher.py` |
| Incremental index updates | 2 | `feature_2_visual_search/index_updater.py` |
| pgvector filtered search | 2 | `feature_2_visual_search/pgvector_store.py` |
| BPE tokenisation | 3 | `feature_3_sentiment/dataset.py` |
| [CLS] token aggregation | 3 | `feature_3_sentiment/model.py` |
| BERT fine-tuning | 3 | `feature_3_sentiment/train.py` |
| AdamW (proper weight decay) | 3 | `feature_3_sentiment/train.py` |
| Warmup LR scheduler | 3 | `feature_3_sentiment/train.py` |
| Gradient clipping | 3 | `feature_3_sentiment/train.py` |
| Aspect-level zero-shot prompting | 3 | `feature_3_sentiment/aspect_analyzer.py` |
| RFM feature engineering | 4 | `feature_4_segmentation/rfm_builder.py` |
| StandardScaler | 4 | `feature_4_segmentation/segmenter.py` |
| K-Means algorithm | 4 | `feature_4_segmentation/segmenter.py` |
| Elbow method | 4 | `feature_4_segmentation/evaluate.py` |
| Silhouette score | 4 | `feature_4_segmentation/evaluate.py` |
| Cluster labelling by centroid | 4 | `feature_4_segmentation/segmenter.py` |
| Model persistence (pickle) | 4 | `feature_4_segmentation/segmenter.py` |
| Time series stationarity | 5 | `feature_5_forecasting/preprocessor.py` |
| Facebook Prophet | 5 | `feature_5_forecasting/prophet_model.py` |
| LSTM sequence modelling | 5 | `feature_5_forecasting/lstm_model.py` |
| MAPE / RMSE evaluation | 5 | `feature_5_forecasting/evaluate.py` |
| Collaborative filtering | 6 | `feature_6_recommender/collaborative.py` |
| Matrix factorisation (SVD) | 6 | `feature_6_recommender/collaborative.py` |
| Content-based filtering | 6 | `feature_6_recommender/content_based.py` |
| Cold-start problem | 6 | `feature_6_recommender/hybrid.py` |
| Hybrid ensemble | 6 | `feature_6_recommender/hybrid.py` |
| Gradient boosting (XGBoost) | 7 | `feature_7_pricing/pricing_model.py` |
| Feature importance | 7 | `feature_7_pricing/pricing_model.py` |
| SHAP explainability | 7 | `feature_7_pricing/pricing_model.py` |
| Price elasticity | 7 | `feature_7_pricing/feature_engineering.py` |
| Object detection (YOLOv8) | 8 | `feature_8_defect_detection/predict.py` |
| Bounding boxes + IoU | 8 | `feature_8_defect_detection/evaluate.py` |
| Non-maximum suppression | 8 | YOLOv8 internals |
| mAP evaluation | 8 | `feature_8_defect_detection/evaluate.py` |

---

## Skill progression

| Month | Features built | Paradigms mastered |
|---|---|---|
| 1 | 1 + 2 | Supervised CV, transfer learning, embedding spaces |
| 2 | 3 + 4 | NLP fine-tuning, unsupervised clustering |
| 3 | 5 + 2 upgrade | Time series, pgvector production search |
| 4 | 6 + 7 | Recommendation systems, gradient boosting, explainability |
| 5 | 8 | Object detection, localisation |

---

*Built as part of the RecyclaBag startup MVP. ML service maintained by the ML developer.*
