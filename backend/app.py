
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
import joblib
from keras.models import load_model
import os

app = FastAPI()

MODELS_PATH = "../models"
SEQ_LENGTH = 30

class PredictRequest(BaseModel):
    date_str: str

def load_asset_series_yf(ticker):
    df = yf.download(ticker, start='2015-07-01', end='2025-07-31')
    if df.empty or 'Close' not in df.columns:
        raise FileNotFoundError(f"Could not fetch data for {ticker}.")
    return df['Close']

def predict_for_date(date_str, asset_series, seq_length, ticker):
    scaler_path = os.path.join(MODELS_PATH, f'lstm_{ticker}_scaler.pkl')
    model_path = os.path.join(MODELS_PATH, f'lstm_{ticker}_model.h5')
    if not os.path.exists(scaler_path) or not os.path.exists(model_path):
        raise FileNotFoundError(f"Model files for {ticker} not found.")
    scaler = joblib.load(scaler_path)
    model = load_model(model_path)
    try:
        date_idx = asset_series.index.get_loc(pd.to_datetime(date_str))
    except KeyError:
        raise HTTPException(status_code=404, detail="Date not found in asset series.")
    if date_idx < seq_length - 1:
        raise HTTPException(status_code=400, detail="Not enough historical data before the given date.")
    seq = asset_series.values[date_idx-seq_length+1:date_idx+1].reshape(-1, 1)
    seq_scaled = scaler.transform(seq)
    seq_scaled = seq_scaled.reshape(1, seq_length, 1)
    pred_scaled = model.predict(seq_scaled)
    pred = scaler.inverse_transform(pred_scaled)
    return float(pred[0, 0])

@app.post("/predict/tsla")
def predict_tsla(request: PredictRequest):
    try:
        asset_series = load_asset_series_yf('TSLA')
        price = predict_for_date(request.date_str, asset_series, SEQ_LENGTH, 'TSLA')
        return {"ticker": "TSLA", "date": request.date_str, "predicted_price": price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/btc")
def predict_btc(request: PredictRequest):
    try:
        asset_series = load_asset_series_yf('BTC-USD')
        price = predict_for_date(request.date_str, asset_series, SEQ_LENGTH, 'BTC-USD')
        return {"ticker": "BTC-USD", "date": request.date_str, "predicted_price": price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/usdt")
def predict_usdt(request: PredictRequest):
    try:
        asset_series = load_asset_series_yf('USDT-USD')
        price = predict_for_date(request.date_str, asset_series, SEQ_LENGTH, 'USDT-USD')
        return {"ticker": "USDT-USD", "date": request.date_str, "predicted_price": price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))