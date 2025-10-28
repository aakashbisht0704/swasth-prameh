# DEPRECATED: Diabetes Prediction ML Service

⚠️ **This ML service is deprecated and should not be used.**

## What was this?
This folder contains legacy code for a diabetes prediction ML service using RandomForest classification on Ayurvedic parameters.

## Why deprecated?
The SwasthPrameh app has pivoted from diabetes prediction to Prakriti scoring and AI-assisted recommendations for existing diabetics/prediabetics. The ML prediction component is no longer needed.

## What to do?
- **DO NOT** use the `/predict` endpoint for diabetes prediction
- **DO NOT** call the ML service from the frontend
- The files are kept for potential future reference but are not maintained
- Use the new Prakriti scoring system instead

## Replacement
The app now uses:
- **Prakriti Scoring**: Client-side calculation of Vata/Pitta/Kapha scores (0-6 scale)
- **AI Assistant**: LLM-powered recommendations based on user's Prakriti and health data
- **No ML Prediction**: Users are expected to already know their diabetes status

## Files in this folder (all deprecated):
- `train_model.py` - ML model training
- `server.py` - FastAPI prediction endpoint  
- `utils.py` - ML utilities
- `Dockerfile` - ML service containerization
- `data/` - Training datasets

**Last updated:** January 2025
