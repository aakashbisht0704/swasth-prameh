"""Train RandomForest models for Ayurvedic diagnosis using AyurGenixAI_Dataset.csv.
Saves a pipeline with preprocessing + classifier to dosha_model.pkl
"""
from __future__ import annotations

import os
from typing import Tuple

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from .utils import preprocess_dataframe, build_pipeline, save_model

DATA_PATH = os.environ.get("AYUR_DATA_PATH", os.path.join(os.path.dirname(__file__), "data", "AyurGenixAI_Dataset.csv"))
MODEL_PATH = os.environ.get("DOSHA_MODEL_PATH", os.path.join(os.path.dirname(__file__), "dosha_model.pkl"))


def train() -> Tuple[Pipeline, dict]:
    df = pd.read_csv(DATA_PATH)
    X, y = preprocess_dataframe(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if len(y) else None
    )

    pipe = build_pipeline()
    clf = RandomForestClassifier(n_estimators=300, random_state=42)
    pipe.steps.append(("clf", clf))

    pipe.fit(X_train.values, y_train.values)

    y_pred = pipe.predict(X_test.values)
    report = classification_report(y_test.values, y_pred, output_dict=True, zero_division=0)

    save_model(pipe, MODEL_PATH)

    return pipe, report


if __name__ == "__main__":
    pipe, report = train()
    print("Trained. Classification report (macro F1):", report.get("macro avg", {}).get("f1-score"))
    print("Saved to:", MODEL_PATH)


