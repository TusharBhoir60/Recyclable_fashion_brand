# scripts/build_recommender.py

"""
Usage:
  python scripts/build_recommender.py --synthetic   # dev — fake data
  python scripts/build_recommender.py --train       # uses real data from DB
  python scripts/build_recommender.py --evaluate    # run precision@K
"""

import argparse, os, sys
import pandas as pd

sys.path.append('feature_6_recommender')

from collaborative import (build_interaction_matrix, train_svd,
                            save_cf_model)
from content_based  import (build_product_feature_matrix,
                             compute_content_similarity, save_content_model)
from predict        import generate_synthetic_data, recommend
from evaluate       import evaluate_recommender


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--synthetic', action='store_true')
    parser.add_argument('--train',     action='store_true')
    parser.add_argument('--evaluate',  action='store_true')
    args = parser.parse_args()

    # Step 1 — data
    if args.synthetic:
        products_df, interactions_df = generate_synthetic_data()
    elif args.train:
        products_df      = pd.read_csv(
            'feature_6_recommender/data/processed/products.csv'
        )
        interactions_df  = pd.read_csv(
            'feature_6_recommender/data/processed/interactions.csv',
            parse_dates=['created_at']
        )
    else:
        print("Pass --synthetic or --train")
        return

    # Step 2 — collaborative filtering
    print("\n=== Building collaborative filter ===")
    matrix, user_idx, prod_idx, users, products = build_interaction_matrix(
        interactions_df
    )
    svd, user_factors = train_svd(matrix)
    save_cf_model(svd, user_factors, user_idx, prod_idx, users, products)

    # Step 3 — content-based
    print("\n=== Building content similarity ===")
    feature_matrix = build_product_feature_matrix(products_df)
    content_sim    = compute_content_similarity(feature_matrix)
    save_content_model(content_sim)

    # Step 4 — smoke test
    print("\n=== Smoke test ===")
    test_user = users[0] if users else 'user_000'
    recs      = recommend(
        user_id=test_user,
        segment='Champions',
        bought_product_ids=[products[0]] if products else [],
        top_k=5,
    )
    print(f"Recs for {test_user}: {[r['product_id'] for r in recs]}")

    # Step 5 — evaluate
    if args.evaluate:
        print("\n=== Running evaluation ===")
        evaluate_recommender(
            recommend_fn=lambda user_id, top_k: recommend(
                user_id=user_id, top_k=top_k
            ),
            test_interactions=interactions_df,
            k=8,
        )

    print("\nDone.")


if __name__ == '__main__':
    main()