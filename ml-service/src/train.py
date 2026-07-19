"""
Train XGBoost crowd-level classifier for Chennai Metro Crowd Prediction System.

Run from ml-service/:
    python src/train.py
"""

import pandas as pd
import numpy as np
import joblib
import json
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "synthetic_ridership.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

FEATURES = [
    "weekday", "is_weekend", "hour", "station_tier",
    "is_interchange", "is_it_corridor", "is_festival",
    "weather_encoded", "line_encoded",
]
TARGET = "crowd_level"


def main():
    df = pd.read_csv(DATA_PATH)

    le_weather = LabelEncoder()
    le_line = LabelEncoder()
    le_target = LabelEncoder()

    df["weather_encoded"] = le_weather.fit_transform(df["weather"])
    df["line_encoded"] = le_line.fit_transform(df["line"])
    df["target_encoded"] = le_target.fit_transform(df[TARGET])

    X = df[FEATURES]
    y = df["target_encoded"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        objective="multi:softprob",
        num_class=len(le_target.classes_),
        eval_metric="mlogloss",
        random_state=42,
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=le_target.classes_, output_dict=True)
    cm = confusion_matrix(y_test, y_pred).tolist()

    print(f"Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, target_names=le_target.classes_))

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, "xgboost_crowd_model.pkl"))
    joblib.dump(le_weather, os.path.join(MODEL_DIR, "le_weather.pkl"))
    joblib.dump(le_line, os.path.join(MODEL_DIR, "le_line.pkl"))
    joblib.dump(le_target, os.path.join(MODEL_DIR, "le_target.pkl"))

    metadata = {
        "features": FEATURES,
        "target_classes": le_target.classes_.tolist(),
        "weather_classes": le_weather.classes_.tolist(),
        "line_classes": le_line.classes_.tolist(),
        "accuracy": round(acc, 4),
        "classification_report": report,
        "confusion_matrix": cm,
        "model": "XGBClassifier",
        "n_estimators": 300,
        "max_depth": 6,
    }
    with open(os.path.join(MODEL_DIR, "model_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nSaved model + metadata to {MODEL_DIR}/")


if __name__ == "__main__":
    main()
