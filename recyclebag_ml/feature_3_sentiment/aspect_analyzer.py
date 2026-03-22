# feature_3_sentiment/aspect_analyzer.py

"""
Strategy: run the overall sentiment model once per aspect context window.
No separate model needed. We feed BERT a focused prompt that anchors it
to one aspect at a time.

Template: "Regarding [ASPECT]: [REVIEW TEXT]"

BERT reads the aspect keyword right next to [CLS], so its summary vector
is heavily influenced by that aspect. The resulting prediction is effectively
"what does this review say about [ASPECT]?"

This is called zero-shot aspect-level sentiment — it works surprisingly well
with a fine-tuned model because BERT has learned sentiment in context.
"""

from predict import SentimentPredictor

ASPECTS = {
    'durability':             'the bag durability and material quality',
    'aesthetics':             'the bag design and appearance',
    'value':                  'the price and value for money',
    'customization_quality':  'the customization and printing quality',
    'packaging':              'the packaging and unboxing experience',
}


def analyze_aspects(review_text: str) -> dict:
    """
    Returns overall sentiment + per-aspect breakdown.

    Example output:
    {
      'overall': { 'label': 'positive', 'confidence': 0.89 },
      'aspects': {
        'durability':            { 'label': 'positive',  'confidence': 0.82 },
        'aesthetics':            { 'label': 'positive',  'confidence': 0.91 },
        'value':                 { 'label': 'neutral',   'confidence': 0.67 },
        'customization_quality': { 'label': 'positive',  'confidence': 0.88 },
        'packaging':             { 'label': 'negative',  'confidence': 0.74 },
      },
      'summary': 'Great bag and customization, but packaging needs work.',
    }
    """
    predictor = SentimentPredictor()

    # 1. Overall sentiment
    overall = predictor.predict(review_text)

    # 2. Per-aspect — build context-focused prompt for each
    aspect_prompts = [
        f"Regarding {desc}: {review_text}"
        for desc in ASPECTS.values()
    ]
    aspect_results = predictor.predict_batch(aspect_prompts)

    aspects = {
        aspect: result
        for aspect, result in zip(ASPECTS.keys(), aspect_results)
    }

    # 3. Generate a natural language summary for the admin dashboard
    positives = [a for a, r in aspects.items() if r['label'] == 'positive' and r['confidence'] > 0.70]
    negatives = [a for a, r in aspects.items() if r['label'] == 'negative' and r['confidence'] > 0.70]

    summary_parts = []
    if positives:
        readable = [a.replace('_', ' ') for a in positives]
        summary_parts.append(f"Positive: {', '.join(readable)}")
    if negatives:
        readable = [a.replace('_', ' ') for a in negatives]
        summary_parts.append(f"Needs work: {', '.join(readable)}")

    return {
        'overall': overall,
        'aspects': aspects,
        'summary': '. '.join(summary_parts) if summary_parts else 'Mixed feedback.',
    } 