from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
import joblib
from keras.models import load_model
import os
from typing import List, Optional
from datetime import datetime, timedelta
import numpy as np

app = FastAPI()

MODELS_PATH = "../models"
SEQ_LENGTH = 30

class PredictRequest(BaseModel):
    date_str: str

class PredictRangeRequest(BaseModel):
    start_date: str
    end_date: str
    ticker: str

class HistoricalDataRequest(BaseModel):
    ticker: str
    days: Optional[int] = 365

class PredictionResponse(BaseModel):
    ticker: str
    date: str
    predicted_price: float
    actual_price: Optional[float] = None

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

@app.post("/predict/range")
def predict_range(request: PredictRangeRequest):
    try:
        asset_series = load_asset_series_yf(request.ticker)
        start_date = pd.to_datetime(request.start_date)
        end_date = pd.to_datetime(request.end_date)
        
        predictions = []
        current_date = start_date
        
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            try:
                predicted_price = predict_for_date(date_str, asset_series, SEQ_LENGTH, request.ticker)
                actual_price = None
                if current_date in asset_series.index:
                    actual_price = float(asset_series[current_date])
                
                predictions.append({
                    "ticker": request.ticker,
                    "date": date_str,
                    "predicted_price": predicted_price,
                    "actual_price": actual_price
                })
            except:
                pass  # Skip dates that can't be predicted
            
            current_date += timedelta(days=1)
        
        return {"predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/historical/{ticker}")
def get_historical_data(ticker: str, days: int = 365):
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        df = yf.download(ticker, start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"No data found for {ticker}")
        
        historical_data = []
        for date, row in df.iterrows():
            historical_data.append({
                "date": date.strftime('%Y-%m-%d'),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": int(row['Volume'])
            })
        
        return {"ticker": ticker, "data": historical_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
