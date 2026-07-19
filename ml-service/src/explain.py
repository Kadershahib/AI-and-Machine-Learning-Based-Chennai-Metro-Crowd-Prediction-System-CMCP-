"""
SHAP-based explainability for a single crowd prediction.
Returns the top contributing features so the frontend can show
"why is this station predicted busy" in plain language.
"""

import shap
import numpy as np
import pandas as pd

FEATURE_LABELS = {
    "weekday": "Day of week",
    "is_weekend": "Weekend",
    "hour": "Hour of day",
    "station_tier": "Station size/importance",
    "is_interchange": "Interchange station",
    "is_it_corridor": "IT corridor location",
    "is_festival": "Festival/event day",
    "weather_encoded": "Weather condition",
    "line_encoded": "Metro line",
}

_explainer_cache = {}


def get_explainer(model):
    key = id(model)
    if key not in _explainer_cache:
        _explainer_cache[key] = shap.TreeExplainer(model)
    return _explainer_cache[key]


def explain_prediction(model, feature_row: pd.DataFrame, predicted_class_idx: int, top_n: int = 4):
    """
    feature_row: single-row DataFrame with the same columns used in training.
    predicted_class_idx: index of the predicted class in the model's class list.
    """
    explainer = get_explainer(model)
    shap_values = explainer.shap_values(feature_row)

    # xgboost multiclass with TreeExplainer returns array shaped
    # (n_classes, n_samples, n_features) or (n_samples, n_features, n_classes)
    # depending on shap version — normalize to a flat 1D array for our row/class.
    sv = np.array(shap_values)
    if sv.ndim == 3:
        if sv.shape[0] == feature_row.shape[0]:
            row_values = sv[0, :, predicted_class_idx]
        else:
            row_values = sv[predicted_class_idx, 0, :]
    else:
        row_values = sv[0]

    contributions = list(zip(feature_row.columns, row_values))
    contributions.sort(key=lambda x: abs(x[1]), reverse=True)

    result = []
    for feat, val in contributions[:top_n]:
        result.append({
            "feature": FEATURE_LABELS.get(feat, feat),
            "impact": round(float(val), 4),
            "direction": "increases" if val > 0 else "decreases",
        })
    return result
