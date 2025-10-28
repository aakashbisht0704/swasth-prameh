"""Utility functions for ML preprocessing and model I/O."""
from __future__ import annotations

import re
from typing import Dict, Any, Tuple

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


TEXT_COLUMNS = [
    "Constitution/Prakriti", "Nadi", "Mutra", "Mala", "Jihwa", "Shabda",
    "Sparsha", "Drik", "Akriti", "Lifestyle", "Diet", "Symptoms",
    "Allergies", "Age_Group", "Gender", "Medical_History", "Risk_Factors",
]
TARGET_COL = "Dominant_Dosha"


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    value = str(value)
    value = value.strip().lower()
    value = re.sub(r"\s+", " ", value)
    return value


def preprocess_dataframe(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    df = df.copy()
    for col in TEXT_COLUMNS + [TARGET_COL]:
        if col in df.columns:
            df[col] = df[col].map(normalize_text)
        else:
            df[col] = ""

    y = df[TARGET_COL] if TARGET_COL in df.columns else pd.Series([], dtype=str)
    X = df[TEXT_COLUMNS]
    return X, y


def build_pipeline() -> Pipeline:
    # scikit-learn >= 1.2 uses `sparse_output` instead of `sparse`
    ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    pre = ColumnTransformer([
        ("ohe", ohe, list(range(len(TEXT_COLUMNS))))
    ])
    return Pipeline(steps=[
        ("pre", pre),
    ])


def save_model(pipe: Pipeline, path: str) -> None:
    joblib.dump(pipe, path)


def load_model(path: str) -> Pipeline:
    return joblib.load(path)


def preprocess_inference_features(features: Dict[str, Any]) -> pd.DataFrame:
    mapping = {
        "Constitution": "Constitution/Prakriti",
    }
    canonical: Dict[str, Any] = {}
    for key in TEXT_COLUMNS:
        src_key = key if key in features else None
        if not src_key:
            for k, v in mapping.items():
                if v == key and k in features:
                    src_key = k
                    break
        canonical[key] = normalize_text(features.get(src_key, ""))

    return pd.DataFrame([canonical])


