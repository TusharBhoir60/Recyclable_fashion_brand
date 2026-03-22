# run this inline in a notebook or save as a one-off script

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)
n_users = 200
today   = datetime.now()

rows = []
for i in range(n_users):
    n_orders = np.random.randint(1, 15)
    for j in range(n_orders):
        rows.append({
            'user_id':      f'user_{i:03d}',
            'created_at':   today - timedelta(days=np.random.randint(1, 365)),
            'total_amount': round(np.random.uniform(299, 4999), 2),
            'status':       'PAID',
        })

df = pd.DataFrame(rows)
df.to_csv('feature_4_segmentation/data/processed/synthetic_orders.csv', index=False)
print(f"Generated {len(df)} orders for {n_users} users")