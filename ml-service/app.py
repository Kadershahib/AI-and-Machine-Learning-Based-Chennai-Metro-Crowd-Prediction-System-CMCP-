"""
Flask API — Chennai Metro Crowd Prediction ML Service
Exposes the trained XGBoost model over HTTP for the Node.js backend to consume.

Run:
    python app.py
Default port: 5001
"""

import os
import json
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

from src.explain import explain_prediction

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

model = None
le_weather = None
le_line = None
le_target = None
metadata = None


def load_artifacts():
    global model, le_weather, le_line, le_target, metadata
    model = joblib.load(os.path.join(MODEL_DIR, "xgboost_crowd_model.pkl"))
    le_weather = joblib.load(os.path.join(MODEL_DIR, "le_weather.pkl"))
    le_line = joblib.load(os.path.join(MODEL_DIR, "le_line.pkl"))
    le_target = joblib.load(os.path.join(MODEL_DIR, "le_target.pkl"))
    with open(os.path.join(MODEL_DIR, "model_metadata.json")) as f:
        metadata = json.load(f)


# Load the model as soon as this file is imported — this covers both
# `python app.py` (local dev) AND `gunicorn app:app` (production on Render).
# Without this line, gunicorn never runs the __main__ block below, so the
# model would never actually load in production.
load_artifacts()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


@app.route("/metadata", methods=["GET"])
def get_metadata():
    return jsonify(metadata)


@app.route("/predict", methods=["POST"])
def predict():
    """
    Body:
    {
      "weekday": 0-6, "is_weekend": 0/1, "hour": 5-22,
      "station_tier": 1-5, "is_interchange": 0/1, "is_it_corridor": 0/1,
      "is_festival": 0/1, "weather": "Clear", "line": "Blue"
    }
    """
    body = request.get_json(force=True)
    try:
        weather_encoded = le_weather.transform([body["weather"]])[0]
        line_encoded = le_line.transform([body["line"]])[0]
    except ValueError as e:
        return jsonify({"error": f"Unknown category: {e}"}), 400

    row = pd.DataFrame([{
        "weekday": body["weekday"],
        "is_weekend": body["is_weekend"],
        "hour": body["hour"],
        "station_tier": body["station_tier"],
        "is_interchange": body["is_interchange"],
        "is_it_corridor": body["is_it_corridor"],
        "is_festival": body["is_festival"],
        "weather_encoded": weather_encoded,
        "line_encoded": line_encoded,
    }])

    proba = model.predict_proba(row)[0]
    pred_idx = int(proba.argmax())
    pred_label = le_target.inverse_transform([pred_idx])[0]

    explanation = explain_prediction(model, row, pred_idx)

    return jsonify({
        "crowd_level": pred_label,
        "confidence": round(float(proba[pred_idx]), 4),
        "probabilities": {
            cls: round(float(p), 4) for cls, p in zip(le_target.classes_, proba)
        },
        "explanation": explanation,
    })


@app.route("/predict/batch", methods=["POST"])
def predict_batch():
    """Body: { "items": [ {...same shape as /predict...}, ... ] }"""
    body = request.get_json(force=True)
    items = body.get("items", [])
    results = []
    for item in items:
        weather_encoded = le_weather.transform([item["weather"]])[0]
        line_encoded = le_line.transform([item["line"]])[0]
        row = pd.DataFrame([{
            "weekday": item["weekday"],
            "is_weekend": item["is_weekend"],
            "hour": item["hour"],
            "station_tier": item["station_tier"],
            "is_interchange": item["is_interchange"],
            "is_it_corridor": item["is_it_corridor"],
            "is_festival": item["is_festival"],
            "weather_encoded": weather_encoded,
            "line_encoded": line_encoded,
        }])
        proba = model.predict_proba(row)[0]
        pred_idx = int(proba.argmax())
        results.append({
            "station": item.get("station"),
            "hour": item["hour"],
            "crowd_level": le_target.inverse_transform([pred_idx])[0],
            "confidence": round(float(proba[pred_idx]), 4),
        })
    return jsonify({"results": results})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)