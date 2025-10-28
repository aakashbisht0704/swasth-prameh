"""FastAPI server to serve dosha prediction and optional retraining."""
from __future__ import annotations

import os
import json
from typing import Any, Dict

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from .utils import load_model, preprocess_inference_features

MODEL_PATH = os.path.join(os.path.dirname(__file__), "dosha_model.pkl")
SUPABASE_URL = os.environ.get("SUPABASE_PROJECT_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

app = FastAPI(title="SwasthPrameh ML Service", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    user_id: str
    features: Dict[str, Any]


@app.on_event("startup")
async def load_on_startup():
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model not found at {MODEL_PATH}. Please train first.")


@app.post("/predict")
async def predict(req: PredictRequest):
    try:
        model = load_model(MODEL_PATH)
        X = preprocess_inference_features(req.features)
        proba = model.predict_proba(X.values)
        classes = list(model.named_steps["clf"].classes_)
        idx = int(proba.argmax())
        dosha = classes[idx]
        probs = {str(c): float(proba[0][i]) for i, c in enumerate(classes)}

        diet_rec = "Prefer warm, lightly spiced meals; avoid excess sugar and processed foods."
        life_rec = "30 minutes brisk walk; 10 minutes breathing practice; regular sleep schedule."
        remedies = "Herbal teas (ginger/cinnamon) and adequate hydration; consult practitioner."
        prognosis = "With balanced lifestyle and diet adherence, improvement expected in 2-4 weeks."

        payload = {
            "user_id": req.user_id,
            "features": req.features,
            "dosha": dosha,
            "probabilities": probs,
            "diet_recommendation": diet_rec,
            "lifestyle_recommendation": life_rec,
            "remedies": remedies,
            "prognosis": prognosis,
            "model_version": "v1.0",
        }

        if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
            r = requests.post(
                f"{SUPABASE_URL}/rest/v1/diagnosis",
                headers={
                    "apikey": SUPABASE_SERVICE_ROLE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                },
                data=json.dumps(payload),
                timeout=20,
            )
            if not r.ok:
                print("Supabase insert error:", r.status_code, r.text)

        return payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class RetrainRequest(BaseModel):
    csv_path: str | None = None


@app.post("/retrain")
async def retrain(req: RetrainRequest):
    from .train_model import train
    pipe, report = train()
    return {"status": "ok", "report": report}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8001)))


