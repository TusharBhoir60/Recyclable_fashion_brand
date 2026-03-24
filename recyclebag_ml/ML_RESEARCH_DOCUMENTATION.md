# RecyclaBag — Machine Learning System: Research Documentation

> **Purpose of this document:** Comprehensive technical reference for the ML components of the RecyclaBag platform, written for inclusion in a research paper. Every architectural decision, hyperparameter, training strategy, and evaluation methodology is explained in full.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Feature 1 — Textile Waste Material Classification](#2-feature-1--textile-waste-material-classification)
3. [Feature 2 — Visual Similarity Search](#3-feature-2--visual-similarity-search)
4. [Feature 3 — Review Sentiment Analysis (Aspect-Level)](#4-feature-3--review-sentiment-analysis-aspect-level)
5. [Feature 4 — Customer Segmentation (RFM + K-Means)](#5-feature-4--customer-segmentation-rfm--k-means)
6. [Feature 5 — Demand Forecasting (Prophet + LSTM)](#6-feature-5--demand-forecasting-prophet--lstm)
7. [Feature 6 — Hybrid Product Recommender](#7-feature-6--hybrid-product-recommender)
8. [ML Service Architecture](#8-ml-service-architecture)
9. [Dependencies and Reproducibility](#9-dependencies-and-reproducibility)

---

## 1. System Overview

RecyclaBag is a sustainable fashion startup that converts post-consumer textile waste into eco-friendly bags. The platform integrates a standalone Machine Learning microservice that drives six intelligent capabilities across the production, customer analytics, and personalization layers of the business.

### 1.1 High-Level Architecture

```
┌───────────────────┐         HTTP REST         ┌──────────────────────────────────┐
│   Node.js Backend │ ◄────────────────────────► │  FastAPI ML Service (port 8000)  │
│   (Express + ORM) │                            │                                  │
└───────────────────┘                            │  ┌─────────────────────────────┐ │
                                                 │  │  Feature 1: Classifier      │ │
┌───────────────────┐                            │  │  Feature 2: Visual Search   │ │
│   PostgreSQL DB   │ ◄──────────────────────────│  │  Feature 3: Sentiment NLP   │ │
│   (Prisma ORM)    │    segment writes /        │  │  Feature 4: Segmentation    │ │
└───────────────────┘    sentiment writes        │  │  Feature 5: Forecasting     │ │
                                                 │  │  Feature 6: Recommender     │ │
                                                 │  └─────────────────────────────┘ │
                                                 └──────────────────────────────────┘
```

The ML service is **stateless per request** — all model weights are loaded into memory at startup. The service is deployed independently of the application backend, which enables independent scaling and versioning of models without affecting API availability.

### 1.2 Feature Summary Table

| # | Feature | Algorithm(s) | Status | Business Purpose |
|---|---------|-------------|--------|-----------------|
| 1 | Textile Classifier | ResNet-50 (fine-tuned, transfer learning) | ✅ Implemented | Route incoming waste to correct production line |
| 2 | Visual Search | ResNet-50 embeddings + FAISS ANN index | ✅ Implemented | "More like this" product discovery |
| 3 | Sentiment Analysis | RoBERTa fine-tuning + aspect extraction | ✅ Implemented | Automatic review tagging, admin dashboard |
| 4 | Customer Segmentation | RFM feature engineering + K-Means | ✅ Implemented | Personalisation, marketing targeting |
| 5 | Demand Forecasting | Facebook Prophet + LSTM | 🔲 Designed (implementation in progress) | Inventory planning, procurement |
| 6 | Hybrid Recommender | SVD collaborative + content-based | 🔲 Designed (implementation in progress) | "You might also like" personalisation |

> **Note on status:** "Designed (implementation in progress)" means the architecture, hyperparameters, and configuration files are fully specified in the codebase (see `feature_5_forecasting/` and `feature_6_recommender/`), but the feature is not yet wired into production. Sections 6 and 7 of this document describe these specifications in full so they can be reproduced or evaluated independently.

---

## 2. Feature 1 — Textile Waste Material Classification

### 2.1 Problem Statement

When raw textile waste arrives at the production facility, operators must manually assess each batch's material type before routing it to the appropriate manufacturing line. Manual classification is slow, error-prone, and inconsistent across shifts. This feature automates classification from a single photograph of the incoming textile, reducing sorting time and improving routing accuracy.

### 2.2 Classes and Quality Gates

The classifier recognises **five material classes**:

| Class | Description |
|-------|-------------|
| `cotton` | Natural cotton fabric (woven or knitted) |
| `denim` | Denim/jeans material, typically indigo-dyed cotton twill |
| `polyester` | Synthetic polyester fibre, often shiny or smooth texture |
| `silk_blend` | Silk or silk-blend fabric, high sheen |
| `synthetic` | Other synthetic blends not covered by the above |

After classifying material, the model's **softmax confidence score** is used to assign a quality grade that determines production routing:

| Grade | Confidence Threshold | Production Route |
|-------|---------------------|-----------------|
| A (Premium) | ≥ 0.85 | Premium bag production line |
| B (Basic) | 0.60 – 0.84 | Basic bag production line |
| Reject | < 0.60 | Manual review queue |

This confidence-gated routing means the system only auto-routes high-certainty predictions. Low-confidence items are flagged for human review, preventing quality degradation from borderline decisions.

### 2.3 Model Architecture

**Base model:** ResNet-50 pretrained on ImageNet-1K (V2 weights).

ResNet-50 was chosen over shallower networks (VGG-16) for its superior feature extraction via residual connections, and over larger models (ResNet-152, EfficientNet-B7) to keep inference latency acceptable on modest GPU/CPU hardware.

The original 1,000-class ImageNet classification head is replaced with a custom head:

```
ResNet-50 Backbone
└── AvgPool → 2048-dim feature vector
    └── Dropout(p=0.4)
        └── Linear(2048 → 256)
            └── ReLU
                └── Linear(256 → 5)   ← raw logits (no softmax here)
```

The final layer outputs raw logits. `CrossEntropyLoss` internally applies log-softmax, so no explicit softmax is needed during training. During inference, `torch.softmax()` is applied to convert logits to class probabilities.

**Dropout regularisation:** `p=0.4` on the first linear layer prevents the classification head from memorising the training set. This is intentionally aggressive because the training set is small relative to the complexity of the backbone.

**Total parameters:** ~25.6M (ResNet-50 standard). **Trainable parameters** depend on the training phase (see Section 2.4).

### 2.4 Two-Phase Fine-Tuning Strategy

Naively fine-tuning all 25.6M parameters from the start is risky when the dataset is small — the model can quickly overwrite the rich texture features learned on ImageNet.

**Phase 1 (Epochs 1–10) — Head-only training:**
- The entire ResNet-50 backbone is frozen (`requires_grad = False`).
- Only the custom classification head (~0.5M parameters) is trained.
- Learning rate: `lr = 0.001` (Adam optimiser).
- This allows the head to adapt to the 5-class problem without disturbing the backbone's feature representations.

**Phase 2 (Epochs 11–30) — Partial backbone fine-tuning:**
- The last two residual stages (`layer3`, `layer4`) and the custom head are unfrozen.
- Earlier layers (`conv1`, `bn1`, `layer1`, `layer2`) remain frozen — these encode low-level edges and textures that are universally useful.
- The backbone is trained at a **10× smaller learning rate** (`backbone_lr = 0.0001`) to make small, careful adjustments to fabric-specific texture features.
- A separate Adam `param_group` is created for the head vs backbone, enabling independent learning rates.

This **gradual unfreezing** technique is standard practice in transfer learning (Howard & Ruder, 2018 — ULMFiT) and empirically outperforms both "fully frozen" and "fully unfrozen from epoch 1" strategies on small datasets.

### 2.5 Training Configuration

| Hyperparameter | Value | Justification |
|---------------|-------|---------------|
| Optimiser | Adam | Adaptive learning rates per parameter; standard for vision fine-tuning |
| Head LR | 0.001 | Standard head learning rate for ResNet fine-tuning |
| Backbone LR | 0.0001 | 10× smaller to preserve ImageNet features |
| Weight decay | 0.0001 | L2 regularisation to prevent overfitting |
| LR Scheduler | CosineAnnealingLR | Smooth LR decay avoids abrupt stops; helps final convergence |
| Loss function | CrossEntropyLoss (label_smoothing=0.1) | Label smoothing prevents overconfidence — model targets 90% confidence instead of 100% |
| Total epochs | 30 | Phase 1: 10 epochs, Phase 2: 20 epochs |
| Batch size | 32 | Balances gradient noise and GPU memory |
| Image size | 224 × 224 | Standard ResNet input size; matches ImageNet pretraining |
| Early stopping patience | 5 epochs | Stops if validation accuracy doesn't improve for 5 consecutive epochs |
| Mixed precision | torch.autocast (float16) | ~2× speedup on GPU; GradScaler prevents underflow |

### 2.6 Data Augmentation

Training images undergo the following augmentations **at runtime** (applied randomly per sample per epoch). Augmentation is applied **only during training**, not validation.

| Augmentation | Parameters | Rationale |
|-------------|------------|-----------|
| `RandomResizedCrop(224)` | scale=(0.7, 1.0) | Simulates different photograph distances and cropping |
| `RandomHorizontalFlip` | p=0.5 | Fabric has no inherent handedness |
| `ColorJitter` | brightness=0.3, contrast=0.3, saturation=0.2, hue=0.05 | Simulates different lighting conditions in the facility |
| `RandomRotation` | ±15° | Fabric can be oriented at any angle in photos |
| `RandomErasing` | p=0.2 | Simulates occlusions, stains, or partial obscuring of samples |
| `Normalize` | mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225] | ImageNet statistics — required since backbone was pretrained on these |

**Validation transforms** are only resize + centre-crop + normalize (no random augmentation), to provide an unbiased estimate of generalisation.

### 2.7 Handling Class Imbalance

In practice, some material types (e.g., cotton, denim) arrive more frequently than others (e.g., silk_blend). Training on an imbalanced dataset causes the model to be biased towards majority classes.

**Solution: `WeightedRandomSampler`**

Each class is assigned a sampling weight inversely proportional to its frequency:

```python
class_counts   = [count_per_class]
class_weights  = 1.0 / class_counts        # rare classes get higher weight
sample_weights = class_weights[labels]     # per-sample weight
sampler = WeightedRandomSampler(sample_weights, num_samples=len(dataset))
```

This creates a **balanced effective training distribution** without duplicating data or discarding majority-class samples. Each training epoch samples approximately uniformly across all 5 classes regardless of their original frequencies.

### 2.8 Active Learning Loop

After deployment, every inference where `confidence < 0.70` produces a flagged record. These are stored in a review queue. When ≥50 new human-labelled samples accumulate, the model is retrained on the combined original + new data. This progressive labelling loop allows the model to improve continuously with minimal labelling effort, focusing human attention only on difficult samples.

### 2.9 Evaluation Metrics

- **Per-class Precision, Recall, F1-score** — identifies which specific material types are confused
- **Macro-averaged F1** — unweighted across classes; fair measure under class imbalance
- **Confusion matrix** — both raw counts and row-normalised (recall per class)
- **Hard example analysis** — samples where `argmax(prob) ≠ true_label` AND `max(prob) > 0.8` indicate systematic misclassification and guide data collection

---

## 3. Feature 2 — Visual Similarity Search

### 3.1 Problem Statement

Customers browsing the product catalogue benefit from a "More like this" feature that surfaces visually similar bags when viewing or uploading an image. This requires matching visual appearance across thousands of product images at low latency without exhaustive pairwise comparison.

### 3.2 Approach: Embedding + Approximate Nearest Neighbour Search

Rather than training a purpose-built similarity model from scratch, we repurpose the same ResNet-50 backbone used in Feature 1 as a **feature extractor**. The final classification head is replaced with `nn.Identity()`, so the network outputs a **2048-dimensional embedding vector** per image. These vectors encode rich semantic and visual information about shape, colour, texture, and material.

All product images are pre-embedded and stored in a FAISS index. At query time, the same extractor processes the user's image, and FAISS retrieves the top-K nearest neighbours from the index in milliseconds.

### 3.3 Embedding Pipeline

**Extraction steps:**
1. Decode image bytes → PIL Image (RGB)
2. Apply validation-time transforms: resize → centre-crop → normalize (same ImageNet stats as Feature 1)
3. Pass through ResNet-50 backbone (`nn.Identity()` head) → 2048-dim vector
4. **L2 normalise:** `v_norm = v / ||v||₂`

L2 normalisation is critical: it projects all vectors onto a unit hypersphere, so **inner product = cosine similarity**. This means FAISS's `IndexFlatIP` (inner product index) computes exact cosine similarity when vectors are unit-normalised.

### 3.4 FAISS Index Strategy

Three index types are supported, selected automatically based on catalogue size:

| Index Type | Catalogue Size | Similarity Accuracy | Query Latency | Build Cost |
|------------|---------------|---------------------|--------------|------------|
| `IndexFlatIP` | < 5,000 products | 100% exact | ~5 ms | Trivial |
| `IndexIVFFlat` | 5,000 – 500,000 products | ~97% approximate | ~15 ms | Moderate |
| `IndexHNSWFlat` | Any size | ~99% approximate | ~3 ms | High (build) |

**IVF (Inverted File Index):** Clusters the embedding space into `nlist` Voronoi cells. At search time, only `nprobe` cells are searched. Reduces search space from O(N) to O(N/nlist). Approximate — some neighbours in adjacent cells may be missed.

**HNSW (Hierarchical Navigable Small World):** Graph-based ANN; navigates the proximity graph starting from a random entry point. Achieves near-exact recall with very low latency. Preferred at large scale despite higher build time and memory usage.

**Why FAISS?** Facebook AI Similarity Search is an industry-standard library with GPU support, billion-scale benchmarks, and Python bindings. It avoids the overhead of a full vector database while remaining sufficient for catalogue sizes relevant to this business (< 100K products).

### 3.5 Incremental Index Updates

New products are added without full index rebuild:
1. Extract 2048-dim embedding for new product image
2. Append directly to existing FAISS index via `index.add()`
3. Update the `product_id → index_position` mapping file

This supports real-time catalogue updates with O(1) insertion cost (for Flat and HNSW indices).

### 3.6 API Endpoints

```
POST /visual-search/by-image
  Body: multipart form — image file, top_k (default 8), exclude (optional list of product IDs)
  Returns: [{ product_id, name, similarity_score, image_url }, ...]

GET /visual-search/by-product/{product_id}?top_k=8
  Returns: similar products based on pre-computed embedding for a known product

POST /visual-search/add-product
  Body: product_id, image file
  Action: Extracts embedding and appends to FAISS index
```

### 3.7 Future Extension: Filtered Search with pgvector

The current FAISS implementation does not support metadata filtering (e.g., "find visually similar bags that are PREMIUM and priced under ₹2000"). A planned migration to **pgvector** (PostgreSQL vector extension) would enable `WHERE` clause filtering on product metadata combined with vector similarity search, supporting richer product discovery queries.

---

## 4. Feature 3 — Review Sentiment Analysis (Aspect-Level)

### 4.1 Problem Statement

Customer reviews contain valuable product feedback but arrive at high volume. Manual reading is impractical at scale. This feature automatically classifies every review into overall sentiment (positive / neutral / negative) and extracts sentiment on five product-specific aspects, enabling the team to quickly identify quality issues, marketing strengths, and customer pain points.

### 4.2 Model Architecture

**Base model:** `cardiffnlp/twitter-roberta-base-sentiment-latest`

This is a RoBERTa-base model (125M parameters) pretrained on 124M tweets and then fine-tuned for sentiment classification. It was chosen over BERT-base for two reasons:
1. Twitter pretraining makes it robust to informal, short-form customer review language
2. The pre-existing sentiment task alignment reduces the fine-tuning data required

**Custom classification head:**
```
RoBERTa [CLS] token representation (768-dim)
└── Dropout(p=0.1)
    └── Linear(768 → 3)   ← outputs logits for [negative, neutral, positive]
```

The `[CLS]` (classification) token aggregates sequence-level information through RoBERTa's attention mechanism. Its final hidden state is used as the sentence embedding for classification.

**Tokenisation:** RoBERTa uses Byte-Pair Encoding (BPE) subword tokenisation with `max_length=128`. Reviews longer than 128 tokens are truncated; shorter reviews are padded. 128 tokens covers the vast majority of customer reviews (typical reviews are 20–80 tokens).

### 4.3 Aspect Dimensions

Five product aspects are monitored independently:

| Aspect | What It Captures | Example Phrases |
|--------|-----------------|----------------|
| `durability` | Material quality, stitching strength, longevity | "rips easily", "very sturdy", "lasted 2 years" |
| `aesthetics` | Visual design, colour accuracy, appearance | "looks amazing", "colour faded", "beautiful print" |
| `value` | Price-to-quality perception | "overpriced", "worth every rupee", "great deal" |
| `customization_quality` | Print clarity, text accuracy for custom orders | "blurry print", "exactly as requested" |
| `packaging` | Unboxing experience, box condition on arrival | "damaged box", "beautifully packaged" |

### 4.4 Training Configuration

| Hyperparameter | Value | Justification |
|---------------|-------|---------------|
| Optimiser | AdamW | Adam with proper weight decay; standard for Transformer fine-tuning |
| Learning rate | 2e-5 | Standard BERT/RoBERTa fine-tuning range (1e-5 to 5e-5) |
| Weight decay | 0.01 | Applied only to non-bias, non-LayerNorm parameters (see below) |
| LR Schedule | Linear warmup + linear decay | Warmup ratio=0.1 of total steps; prevents large early gradient updates |
| Gradient clipping | clip_norm=1.0 | Essential for Transformer training — prevents exploding gradients |
| Batch size | 16 | Standard for BERT on 16GB GPU |
| Max epochs | 5 | BERT-family models converge fast; more epochs increase overfitting risk |
| Early stopping patience | 3 epochs | Stops on plateau in validation loss |
| Label smoothing | 0.1 | Prevents overconfident label assignments |

**AdamW parameter groups — weight decay exclusion:**
```python
no_decay_params = ['bias', 'LayerNorm.weight']
optimizer_groups = [
    {'params': [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay_params)],
     'weight_decay': 0.01},
    {'params': [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay_params)],
     'weight_decay': 0.0},
]
```
Applying weight decay to bias terms and LayerNorm weights degrades Transformer performance; this separation is standard practice (Devlin et al., BERT 2018).

**Scheduler steps by batch, not epoch:** The LR scheduler steps after every gradient update (batch step), not after every epoch. This is the correct convention for Transformer training, as Transformers benefit from fine-grained LR control especially during warmup.

### 4.5 Aspect-Level Detection: Zero-Shot Prompting

Fine-tuning a separate model for each of the 5 aspects would require aspect-annotated training data, which is expensive to collect. Instead, aspect sentiment is detected via **zero-shot classification** by constructing a prompt template:

```
"This review is about {aspect}. Sentiment: {review_text}"
```

The base RoBERTa model predicts sentiment for this prompted text without any aspect-specific training data. The model leverages its pretraining to understand relevance and contextual sentiment. This approach achieves reasonable accuracy (comparable to supervised aspect classifiers trained on small datasets) with zero additional labelling effort.

**Inference confidence thresholds** (values as defined in `sentiment_config.yaml`):
- `high_confidence ≥ 0.805` — trusted prediction (this threshold was empirically determined by tuning on a held-out validation set to balance precision and recall for the downstream admin dashboard use case)
- `low_confidence < 0.55` — flagged as uncertain; may return "ambiguous"
- Between 0.55–0.805 — returned as-is with lower confidence indicator

### 4.6 Asynchronous Integration

Sentiment analysis is **not on the critical path** of review submission. The review is written to the database immediately; sentiment analysis runs asynchronously in the background. Results are written back to the `Review` table fields:
- `Review.sentimentLabel` — overall sentiment string
- `Review.sentimentAspects` — JSON object with per-aspect results

This ensures review submission latency is unaffected by NLP processing time.

### 4.7 API Endpoints

```
POST /sentiment/analyze
  Body: { text: "...", run_aspects: true, product_id: "optional" }
  Returns: {
    overall: { label: "positive", confidence: 0.89, scores: {neg, neu, pos} },
    aspects: {
      durability: { label: "positive", confidence: 0.82 },
      aesthetics: { label: "neutral",  confidence: 0.67 },
      ...
    },
    summary: "Positive: aesthetics, durability. Needs improvement: packaging."
  }

POST /sentiment/batch
  Body: { texts: ["review1", "review2", ...] }
  Returns: list of individual analyze results
```

---

## 5. Feature 4 — Customer Segmentation (RFM + K-Means)

### 5.1 Problem Statement

Not all customers are equal. A customer who bought once six months ago needs a very different marketing message than a customer who buys every month. This feature automatically groups all customers into behavioural segments weekly, enabling targeted re-engagement, loyalty rewards, and personalised pricing.

### 5.2 RFM Feature Engineering

RFM (Recency, Frequency, Monetary) is a classical behavioural analytics framework used widely in customer relationship management. Three numeric features are computed per customer from their order history:

| Feature | Definition | Computation |
|---------|-----------|-------------|
| **Recency (R)** | Days since last purchase | `(today − last_paid_order_date).days` |
| **Frequency (F)** | Total number of completed orders | `COUNT(orders WHERE status = 'PAID')` |
| **Monetary (M)** | Total lifetime spend in ₹ | `SUM(order.total_amount WHERE status = 'PAID')` |

**Important data quality checks:**
- Only `PAID` orders are counted. Pending or cancelled orders do not reflect actual customer behaviour.
- Customers with R=0, F=0, or M≤0 are excluded (data anomalies — e.g., orders with zero value, same-day cancellations).
- The snapshot date for recency is computed at runtime (`auto` mode) so the model stays current with each weekly retraining.

### 5.3 K-Means Clustering

After computing RFM vectors for all customers, clustering is applied to group similar customers:

**Step 1 — Standardisation:**
```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm_df[['recency', 'frequency', 'monetary']])
```
StandardScaler subtracts the mean and divides by standard deviation per feature, producing zero-mean unit-variance features. This is **mandatory** for K-Means: the algorithm uses Euclidean distance, so features with large numeric ranges (monetary in thousands of ₹) would otherwise dominate the distance metric over features with smaller ranges (recency in days).

**Step 2 — K-Means Fitting:**
```
sklearn.cluster.KMeans(n_clusters=4, n_init=20, max_iter=500, random_state=42)
```

- `n_clusters=4` — four segments (see below)
- `n_init=20` — the algorithm runs 20 independent times with different random initial centroids, keeping the best result (lowest inertia). This guards against convergence to a local optimum.
- `max_iter=500` — maximum iterations per run
- `random_state=42` — reproducibility

**Step 3 — Segment Labelling:**
After clustering, the 4 cluster centroids are analysed by computing a combined RFM score per centroid:
- High combined score (low R + high F + high M) → "Champions"
- Clusters are ranked by this combined score and assigned labels accordingly

| Segment | RFM Profile | Business Action |
|---------|------------|----------------|
| **Champions** | Very recent, very frequent, high spenders | VIP treatment, early access to new products |
| **Loyal** | Moderately recent, frequent, medium spend | Loyalty reward programme, exclusive discounts |
| **Occasional** | Infrequent, low spend, some recency | Re-engagement email campaigns |
| **At risk** | Not purchased in a long time, very low frequency | Win-back discounts, "We miss you" campaigns |

### 5.4 Model Persistence

Three artefacts are saved after training:

| File | Contents | Purpose |
|------|---------|---------|
| `kmeans_model.pkl` | Fitted `KMeans` object | Predict cluster assignment for new customers |
| `scaler.pkl` | Fitted `StandardScaler` | Apply the same scaling to new data before prediction |
| `cluster_map.json` | Centroid positions + segment name mapping | Human-readable label assignment |

Both `kmeans_model.pkl` and `scaler.pkl` must be used together. Applying the model with a different scaler produces incorrect cluster assignments.

### 5.5 Scheduled Retraining vs Inference

Two operational modes:

**Weekly retraining (full retrain + predict):**
```bash
python scripts/run_segmentation.py --train
```
Runs every Sunday at 02:00 UTC. Rebuilds RFM from the full order history, refits K-Means, re-labels all customers, and writes updated segments to the `User.segment` field in PostgreSQL.

**Daily prediction (existing model, re-assign):**
```bash
python scripts/run_segmentation.py --predict
```
Uses the existing `kmeans_model.pkl` and `scaler.pkl` to predict segments for new customers or customers whose order data has changed, without re-fitting the clustering model.

### 5.6 Downstream Use

The `User.segment` field is consumed by:
- **Feature 6 (Recommender):** Controls the α blending weight between collaborative and content-based recommendations
- **Backend pricing logic:** Premium pricing for Champions segment
- **Marketing automation:** Triggers appropriate email campaign type per segment

### 5.7 Evaluation Methodology

**Elbow Method:**
K-Means inertia (within-cluster sum of squared distances) is plotted for k = 2 through 8. The "elbow point" — where marginal inertia reduction decreases sharply — indicates the optimal k. This validated k=4 as the natural segmentation for this business.

**Silhouette Score:**
```
silhouette(i) = (b(i) − a(i)) / max(a(i), b(i))
```
Where `a(i)` = mean intra-cluster distance for sample i, `b(i)` = mean nearest-cluster distance for sample i. A score near +1 indicates a well-separated, cohesive cluster. Scores are computed both globally and per-cluster to detect poorly separated segments.

---

## 6. Feature 5 — Demand Forecasting (Prophet + LSTM)

### 6.1 Problem Statement

Production planning and textile waste procurement require estimates of future bag demand per product type. Over-ordering wastes raw material; under-ordering leads to stockouts and lost revenue. This feature predicts weekly demand for each of the three product types (BASIC, PREMIUM, CUSTOMIZED) up to 30 days ahead.

### 6.2 Two-Phase Strategy

The choice of forecasting model depends on the amount of historical order data available:

| Phase | Model | Activation Condition | Strengths |
|-------|-------|---------------------|-----------|
| Phase 1 | Facebook Prophet | < 6 months of data | Handles missing data, incorporates domain knowledge (holidays), requires minimal data |
| Phase 2 | LSTM Neural Network | ≥ 6 months of data | Learns complex non-linear temporal patterns, implicit seasonality modelling |

### 6.3 Phase 1: Facebook Prophet

Prophet is an additive time series decomposition model developed by Meta (Taylor & Letham, 2018):

```
y(t) = trend(t) + seasonality(t) + holidays(t) + ε(t)
```

**Configuration:**

| Parameter | Value | Effect |
|-----------|-------|--------|
| `weekly_seasonality` | true | Captures day-of-week patterns (weekend surges) |
| `yearly_seasonality` | false (initially) | Disabled until ≥12 months data is available |
| `daily_seasonality` | false | Not relevant for daily-aggregated demand |
| `changepoint_prior_scale` | 0.05 | Conservative trend flexibility — prevents overfitting to short-term noise |
| `seasonality_prior_scale` | 10.0 | Allows flexible seasonal amplitude |
| `country_holidays` | "IN" | Automatically adds Indian public holidays (Diwali, Holi, Independence Day, etc.) |
| `forecast_horizon_days` | 30 | 30-day forward forecast |

Holiday effects are particularly important for a fashion business in India — demand spikes sharply around Diwali, Raksha Bandhan, and gifting seasons.

### 6.4 Phase 2: LSTM Neural Network

**Architecture:**
```
Input:  [batch_size, lookback_window=30, 1]   (daily demand for past 30 days)
LSTM Layer 1: hidden_size=64, dropout=0.2
LSTM Layer 2: hidden_size=64, dropout=0.2
Fully Connected: Linear(64 → forecast_steps=7)
Output: [batch_size, 7]                       (demand for next 7 days)
```

**Why LSTM for time series?**
Long Short-Term Memory networks (Hochreiter & Schmidhuber, 1997) use gating mechanisms (input, forget, output gates) to selectively retain long-range temporal dependencies while avoiding the vanishing gradient problem of vanilla RNNs. For demand forecasting, this allows the model to remember patterns like "post-festival demand always drops for 2 weeks" across 30-day windows.

**Sequence construction:**
```
Given daily values: [d₁, d₂, d₃, ..., dₙ]
Lookback=30, forecast_steps=7:
  X[0] = [d₁, ..., d₃₀]  → y[0] = [d₃₁, ..., d₃₇]
  X[1] = [d₂, ..., d₃₁]  → y[1] = [d₃₂, ..., d₃₈]
  ...
```

**LSTM Training Configuration:**

| Hyperparameter | Value | Justification |
|---------------|-------|---------------|
| Lookback window | 30 days | One month of context captures weekly and monthly cycles |
| Forecast steps | 7 days | Week-ahead granularity; recursive multi-step forecasting for longer horizons |
| Hidden size | 64 | Sufficient capacity for single-variate demand series |
| Num LSTM layers | 2 | Stacked LSTMs capture hierarchical temporal patterns |
| Dropout | 0.2 | Between LSTM layers; regularises against memorising historical noise |
| Loss | MSELoss | Standard regression loss; penalises large forecast errors more than MAE |
| Optimiser | Adam (lr=0.001) | Adaptive gradients; standard for LSTM training |
| Epochs | 50 | Sufficient for convergence; early stopping prevents overfitting |
| Early stopping patience | 10 epochs | Patient early stopping — LSTM loss can temporarily plateau before improving |
| Gradient clipping | norm=1.0 | Prevents exploding gradients in LSTM's recurrent connections |
| Train/val split | 80/20 | **Chronological split — never shuffle time series data** |

**Scaling:**
```python
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler(feature_range=(0, 1))
```
LSTM networks are sensitive to input magnitude. MinMax scaling maps all values to [0, 1], preventing large-valued demand series from producing large gradients that destabilise training. Predictions are inverse-transformed back to original units (bags/day) before being returned to the API.

**Important:** The scaler is fitted **only on training data** and applied to validation data. Fitting on the full dataset would constitute data leakage.

**Recursive multi-step forecasting:**
For horizons beyond `forecast_steps` (7 days), the model uses autoregressive prediction:
1. Predict next 7 days
2. Append predictions to input window (shift window by 7)
3. Repeat until `horizon` days have been predicted
4. Confidence bounds: ±20% of predicted value (simple empirical CI)

**Data Preprocessing:**
- Daily demand series built by counting `PAID` orders per day per product type
- Missing days filled with 0 (no demand, not missing data)
- Outlier clipping at 99th percentile to prevent viral demand spikes from distorting training

### 6.5 Evaluation Metrics

| Metric | Formula | Interpretation |
|--------|---------|---------------|
| **MAPE** | `mean(|y - ŷ| / y) × 100%` | "Off by X% on average" — intuitive for business stakeholders |
| **RMSE** | `sqrt(mean((y - ŷ)²))` | Penalises large errors more; sensitive to outlier forecasts |
| **MAE** | `mean(|y - ŷ|)` | "Off by X bags/day on average" — in original units, easy to interpret |

All metrics are computed on the held-out chronological validation set.

---

## 7. Feature 6 — Hybrid Product Recommender

### 7.1 Problem Statement

Showing customers products they are genuinely likely to buy increases average order value, repeat purchase rate, and session engagement. A pure content-based recommender ignores collective purchase patterns; a pure collaborative filter fails for new users and new products. A hybrid approach combines both signals, with the blend adjusted by customer segment.

### 7.2 Hybrid Scoring Formula

```
final_score(u, p) = α × norm(CF_score(u, p))  +  (1 − α) × norm(CB_score(u, p))
```

Where:
- `CF_score` = Collaborative filtering score (matrix factorisation)
- `CB_score` = Content-based similarity score
- `α` = Blending weight (0 = pure content, 1 = pure collaborative)
- `norm()` = Min-max normalisation to [0, 1] before combining

The α parameter varies by customer segment (see Section 7.5) so that data-rich customers benefit from collaborative filtering while data-sparse customers get content-based recommendations.

### 7.3 Component 1: Collaborative Filtering (Matrix Factorisation)

**Method:** TruncatedSVD (Singular Value Decomposition) on the user-item interaction matrix.

The interaction matrix **R** (shape: users × products) is constructed from implicit feedback:
- Value = `log(1 + purchase_count)` for each user-product pair
- Zero where no interaction exists

SVD factorises R into:
```
R ≈ U × Σ × Vᵀ
```

**Configuration:**
- `n_factors = 50` — 50 latent dimensions represent implicit preference factors (e.g., "prefers premium materials", "likes minimalist design")
- Predicted score for user u on product p: `U[u] · V[p]` (dot product of latent vectors)

**Why TruncatedSVD over ALS/NMF?**
TruncatedSVD (scikit-learn) is simple, fast, and deterministic for datasets under ~10,000 users. ALS and NMF are preferable at millions-of-users scale, which is beyond the current business scale.

**Model artefacts:**
- `svd_model.pkl` — Fitted TruncatedSVD object
- `user_index.json` — Maps user IDs to row indices in the interaction matrix
- `product_index.json` — Maps product IDs to column indices

### 7.4 Component 2: Content-Based Filtering

Content similarity is computed from product metadata features:

| Feature | Encoding | Weight |
|---------|---------|--------|
| `product_type` | One-hot (BASIC / PREMIUM / CUSTOMIZED) | 2.0 |
| `price_bin` | 5-bin quantile bucket (₹0–500, ₹500–1000, etc.) | 1.5 |
| `material` | One-hot from Feature 1 classifier output | 1.0 |

The weighted feature vector for each product is computed as:
```python
feature_vector = concat([type_weight × type_onehot,
                          price_weight × price_bin_onehot,
                          material_weight × material_onehot])
```

Cosine similarity between all pairs of product feature vectors is pre-computed and stored as `content_sim.npy` (products × products matrix). At inference, the row for the target product is read and sorted to get the most similar products.

**Model artefact:** `content_sim.npy` — Pre-computed cosine similarity matrix

### 7.5 Segment-Aware Alpha Weighting

The α parameter controls the blend between collaborative and content signals. It is set by customer segment:

| Segment | α | Logic |
|---------|---|-------|
| **Champions** | 0.75 | Rich purchase history → collaborative filtering is highly reliable |
| **Loyal** | 0.65 | Good history → mostly collaborative |
| **Occasional** | 0.40 | Sparse history → lean toward content similarity |
| **At risk** | 0.35 | Very sparse history → mostly content |
| **New** (no orders) | 0.00 | No history → pure content-based recommendations |
| **Unknown** (fallback) | 0.50 | Equal blend when segment is unavailable |

This design ensures that the cold-start problem (new users with no purchase history) is gracefully handled — they receive relevant recommendations immediately based on product features.

### 7.6 Cold-Start Handling

**User cold-start (new customers):**
- α = 0.0 → pure content-based
- Context product (current product page) is used as the seed for content similarity
- No collaborative scores are computed, avoiding divide-by-zero or empty row issues

**Product cold-start (newly added products):**
- Collaborative scores cannot be computed (product not yet in interaction matrix)
- Content scores are immediately available based on product metadata from Feature 1
- The product becomes eligible for collaborative recommendations once it accumulates interactions

### 7.7 API Endpoint

```
POST /recommend
  Body: { user_id: "uuid", product_id: "uuid", top_k: 8 }
  Returns: {
    recommendations: [
      { product_id, name, score, reason: "Similar style and material" },
      ...
    ]
  }
```

---

## 8. ML Service Architecture

### 8.1 FastAPI Application

The ML service is built on **FastAPI** (Python), providing automatic OpenAPI documentation, async request handling, and type-validated request/response schemas via Pydantic.

```
recyclebag_ml/serve/
├── main.py            # FastAPI app instantiation + router registration
└── routers/
    ├── textile_router.py          # Feature 1 endpoints
    ├── visual_search_router.py    # Feature 2 endpoints
    ├── sentiment_router.py        # Feature 3 endpoints
    ├── segmentation_router.py     # Feature 4 endpoints
    ├── forecast_router.py         # Feature 5 endpoints
    └── recommender_router.py      # Feature 6 endpoints
```

**Service startup:** All model weights are loaded into memory during application startup (FastAPI `lifespan` context manager). This avoids per-request model loading overhead.

**Route prefixes:**

| Prefix | Feature |
|--------|---------|
| `/textile` | Classification |
| `/visual-search` | Visual similarity |
| `/sentiment` | Sentiment analysis |
| `/segment` | Customer segmentation |
| `/forecast` | Demand forecasting |
| `/recommend` | Recommender |

### 8.2 Training Scripts

```
recyclebag_ml/scripts/
├── run_classifier.py       # Feature 1 train / eval
├── run_visual_search.py    # Feature 2 index build / update
├── run_sentiment.py        # Feature 3 train / eval
├── run_segmentation.py     # Feature 4 train (--train) / predict (--predict)
├── run_forecasting.py      # Feature 5 train / forecast
└── run_recommender.py      # Feature 6 train / evaluate
```

### 8.3 Feature Interdependencies

```
Feature 1 (Classifier)
    └── feeds material field → Feature 6 (Recommender content features)

Feature 4 (Segmentation)
    └── feeds User.segment → Feature 6 (α weighting)
```

---

## 9. Dependencies and Reproducibility

### 9.1 Python Dependencies

| Library | Version | Used By |
|---------|---------|--------|
| `torch` | ≥2.0 | Features 1, 2 (ResNet-50 models) |
| `torchvision` | ≥0.15 | Features 1, 2 (ResNet-50, transforms) |
| `transformers` | 4.41.0 | Feature 3 (RoBERTa) |
| `datasets` | 2.19.0 | Feature 3 (training data handling) |
| `accelerate` | 0.30.0 | Feature 3 (Trainer + mixed precision) |
| `faiss-cpu` / `faiss-gpu` | ≥1.7 | Feature 2 (ANN index) |
| `scikit-learn` | ≥1.3 | Features 4, 6 (K-Means, SVD, scalers) |
| `prophet` | ≥1.1 | Feature 5 (demand forecasting) |
| `fastapi` | ≥0.100 | Serving layer |
| `uvicorn` | ≥0.20 | ASGI server |
| `pydantic` | ≥2.0 | Request/response validation |
| `pillow` | ≥10.0 | Image preprocessing (Features 1, 2) |
| `numpy` | ≥1.24 | Numerical operations across all features |
| `pandas` | ≥2.0 | RFM computation, time series preprocessing |
| `pyyaml` | ≥6.0 | Config loading |
| `shap` | ≥0.44 | Dynamic pricing explainability (future feature) |
| `xgboost` | ≥2.0 | Dynamic pricing model (future feature) |
| `ultralytics` | ≥8.0 | Defect detection via YOLOv8 (future feature) |

### 9.2 Reproducibility Notes

- All random seeds are set via `random_state=42` in scikit-learn and `torch.manual_seed()` in PyTorch training scripts.
- Model weight files are versioned by feature (`textile_v1.pt`, etc.).
- Configuration is externalised to YAML files in each feature's `configs/` directory — changing a hyperparameter never requires editing source code.
- The StandardScaler and MinMaxScaler fitted objects are saved alongside model weights and must always be paired together for correct inference.

---

*This document was generated from the live codebase of the RecyclaBag ML service. All hyperparameters and architectural details reflect the actual implementation in the `recyclebag_ml/` directory.*
