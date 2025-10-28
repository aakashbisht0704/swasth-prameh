FROM python:3.11-slim

WORKDIR /app

COPY src/ml/data/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY src/ml /app/src/ml

ENV DOSHA_MODEL_PATH=/app/src/ml/dosha_model.pkl
EXPOSE 8001

CMD ["python", "-m", "src.ml.server"]


