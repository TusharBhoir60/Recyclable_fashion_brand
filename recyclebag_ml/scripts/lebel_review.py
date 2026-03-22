# scripts/label_reviews.py  — replace the entire file with this

from datasets import load_dataset
import pandas as pd

ds = load_dataset('yelp_polarity', split='train')
df = ds.to_pandas()

# yelp_polarity actual labels: 0 = negative, 1 = positive
# Map to our 3-class scheme:   0 = negative, 2 = positive
# (neutral samples we generate manually below)
print("Raw label counts:", df['label'].value_counts().to_dict())

df['label'] = df['label'].map({0: 0, 1: 2})

neg = df[df['label'] == 0].sample(500, random_state=42)
pos = df[df['label'] == 2].sample(500, random_state=42)

print(f"Negative samples: {len(neg)}")
print(f"Positive samples: {len(pos)}")

# Neutral samples — handcrafted seed sentences
# These represent "it's okay / average" product reviews
neutral_texts = [
    "The bag is decent for the price, nothing special.",
    "It arrived on time. Quality is average.",
    "Not great, not terrible. Does the job.",
    "Okay product. Expected better stitching.",
    "It is fine. Neither impressed nor disappointed.",
    "Average quality. The colour was as shown.",
    "Works as described. Nothing to complain about.",
    "Reasonable quality for the price paid.",
    "The bag is acceptable. Would not buy again though.",
    "Mediocre product. Customization was okay.",
    "Delivery was okay. Bag feels average quality.",
    "Nothing extraordinary. Just a regular bag.",
    "It is what it is. Average in every way.",
    "Moderate quality. The zip works fine.",
    "Fairly ordinary bag. Gets the job done.",
    "Not bad but not impressive either.",
    "Middle of the road. Expected more from the photos.",
    "Passable quality. Not premium but usable.",
    "So-so. The printing quality is just okay.",
    "Average bag. The material feels standard.",
]

neutral_df = pd.DataFrame({
    'text':  neutral_texts,
    'label': [1] * len(neutral_texts),
})

print(f"Neutral samples: {len(neutral_df)}")

# Train/val split — 80/20
train_df = pd.concat([
    neg[:400], pos[:400], neutral_df[:16]
]).sample(frac=1, random_state=42).reset_index(drop=True)

val_df = pd.concat([
    neg[400:], pos[400:], neutral_df[16:]
]).sample(frac=1, random_state=42).reset_index(drop=True)

# scripts/label_reviews.py  — add this block right before the to_csv calls

from pathlib import Path

# Create directories if they don't exist
Path('feature_3_sentiment/data/processed').mkdir(parents=True, exist_ok=True)

train_df[['text', 'label']].to_csv(
    'feature_3_sentiment/data/processed/train.csv', index=False
)
val_df[['text', 'label']].to_csv(
    'feature_3_sentiment/data/processed/val.csv', index=False
)

train_df[['text', 'label']].to_csv(
    'feature_3_sentiment/data/processed/train.csv', index=False
)
val_df[['text', 'label']].to_csv(
    'feature_3_sentiment/data/processed/val.csv', index=False
)

print(f"\nTrain: {len(train_df)} samples")
print(train_df['label'].value_counts().rename({0:'negative', 1:'neutral', 2:'positive'}))
print(f"\nVal:   {len(val_df)} samples")
print(val_df['label'].value_counts().rename({0:'negative', 1:'neutral', 2:'positive'}))
print("\nDone. CSVs written to feature_3_sentiment/data/processed/")