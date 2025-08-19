import joblib
from keras.models import load_model
import numpy as np
import pandas as pd

def test_model_and_scaler_load():
    model = load_model("../models/lstm_TSLA_model.h5")
    scaler = joblib.load("../models/lstm_TSLA_scaler.pkl")
    assert model is not None
    assert scaler is not None

def test_model_prediction_shape():
    model = load_model("../models/lstm_TSLA_model.h5")
    # Fake input: shape (1, seq_length, 1)
    seq_length = 30
    X = np.random.rand(1, seq_length, 1)
    pred = model.predict(X)
    assert pred.shape == (1, 1)

def test_scaler_inverse_transform():
    scaler = joblib.load("../models/lstm_TSLA_scaler.pkl")
    arr = np.array([[0.5]])
    inv = scaler.inverse_transform(arr)
    assert inv.shape == (1, 1)