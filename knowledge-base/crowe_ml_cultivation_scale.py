# crowe_ml_cultivation_scale.py
import glob, json, os, joblib, time
import pandas as pd
from joblib import Parallel, delayed
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_squared_error, r2_score

DATA_DIR   = "data"
MODEL_DIR  = "models"
LOG_PATH   = "logs/metrics.jsonl"   # one JSON per line

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs("logs", exist_ok=True)

# 1️⃣  List all dataset files
csv_paths = sorted(glob.glob(f"{DATA_DIR}/dataset_*.csv"))

def train_single(csv_path):
    ds_id = os.path.basename(csv_path).split(".")[0]   # dataset_0001
    df = pd.read_csv(csv_path)

    X = df[[
        "species", "substrate_type", "incubation_temp", "fruiting_temp",
        "humidity_avg", "co2_ppm", "light_hours", "flush_number"
    ]]
    y = df["yield_per_block"]

    numeric_feats   = ["incubation_temp", "fruiting_temp",
                       "humidity_avg", "co2_ppm", "light_hours", "flush_number"]
    categorical     = ["species", "substrate_type"]

    pre = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_feats),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical)
        ]
    )

    model = Pipeline([
        ("pre", pre),
        ("knn", KNeighborsRegressor(n_neighbors=5))
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42)

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    rmse = mean_squared_error(y_test, y_pred, squared=False)
    r2   = r2_score(y_test, y_pred)

    # Persist artefacts
    joblib.dump(model, f"{MODEL_DIR}/{ds_id}.pkl")

    # Write a tiny metrics record
    record = {
        "dataset": ds_id,
        "n_train": len(X_train),
        "n_test": len(X_test),
        "rmse": rmse,
        "r2": r2,
        "timestamp": time.time()
    }
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(record) + "\n")

    return record

# 2️⃣  Parallel execution (adjust n_jobs to your CPU)
metrics = Parallel(n_jobs=-1, verbose=10)(
    delayed(train_single)(p) for p in csv_paths
)

print("Finished training all datasets!")