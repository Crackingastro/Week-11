# 📈 Financial Time Series Forecasting

## Overview

This project analyzes and forecasts financial data for **Tesla (TSLA)**, **Vanguard Total Bond Market ETF (BND)**, and **SPDR S\&P 500 ETF Trust (SPY)**.
It covers **data preprocessing, exploratory analysis, and model building** using both statistical and deep learning methods.

---

## Features

* 📊 **Data from Yahoo Finance** using `yfinance`
* 🧹 **Data Cleaning**: handle missing values & format for analysis
* 🔍 **EDA**: price trends, daily returns, volatility analysis
* 📉 **Stationarity Test** with Augmented Dickey-Fuller
* ⚖ **Risk Metrics**: VaR & Sharpe Ratio
* 🤖 **Models**: ARIMA & LSTM
* 📏 **Model Evaluation**: MAE, RMSE, MAPE


✅ **LSTM outperformed ARIMA**, showing better accuracy for volatile assets like TSLA.

---

## How to Run

```bash
git clone https://github.com/crackingasto/Week-11
cd Week-11
python model.py
```

---

## Tech Stack

* Python
* Pandas, NumPy
* Matplotlib, Seaborn
* Statsmodels
* TensorFlow/Keras
* Scikit-learn
