import pytest
from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_predict_tsla_valid():
    response = client.post("/predict/tsla", json={"date_str": "2024-07-31"})
    assert response.status_code == 200
    assert "predicted_price" in response.json()

def test_predict_btc_valid():
    response = client.post("/predict/btc", json={"date_str": "2022-07-31"})
    assert response.status_code == 200
    assert "predicted_price" in response.json()

def test_predict_usdt_valid():
    response = client.post("/predict/usdt", json={"date_str": "2022-07-31"})
    assert response.status_code == 200
    assert "predicted_price" in response.json()

def test_predict_invalid_date():
    response = client.post("/predict/tsla", json={"date_str": "1900-01-01"})
    assert response.status_code == 500 or response.status_code == 404

def test_predict_invalid_ticker():
    # This endpoint doesn't exist, should 404
    response = client.post("/predict/invalid", json={"date_str": "2022-07-31"})
    assert response.status_code == 404