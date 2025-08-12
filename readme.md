# 📈 Financial Time Series Forecasting

## 📌 Overview

This project focuses on analyzing and forecasting the performance of **Tesla (TSLA)**, **Vanguard Total Bond Market ETF (BND)**, and **SPDR S\&P 500 ETF Trust (SPY)**.

It walks through **data preprocessing**, **exploratory data analysis (EDA)**, and **model building** using both **classical statistical methods** and **deep learning techniques**.

---

## ✨ Key Features

* 📊 **Data Acquisition** – Historical market data via [`yfinance`](https://pypi.org/project/yfinance/)
* 🧹 **Data Cleaning** – Handle missing values, ensure correct data types, and prepare time-series structure
* 🔍 **Exploratory Analysis** –

  * Price trend visualization
  * Daily returns calculation
  * Volatility analysis with rolling statistics
* 📉 **Stationarity Check** – Augmented Dickey-Fuller (ADF) test
* ⚖ **Risk Metrics** – Value at Risk (VaR) and Sharpe Ratio
* 🤖 **Forecasting Models** –

  * **ARIMA/SARIMA** (classical statistical modeling)
  * **LSTM** (deep learning for sequential data)
* 📏 **Model Evaluation** – MAE, RMSE, and MAPE for performance comparison

✅ **Result:** LSTM outperformed ARIMA, particularly for highly volatile assets like TSLA.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/crackingasto/Week-11
cd Week-11
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Run the Model

```bash
python model.py
```

---

## 🛠 Tech Stack

* **Python**
* **Data Analysis:** Pandas, NumPy
* **Visualization:** Matplotlib, Seaborn
* **Statistical Modeling:** Statsmodels
* **Machine Learning:** TensorFlow/Keras
* **Model Evaluation:** Scikit-learn

---

## 📂 Project Structure

```
Week-11/
│-- model.py           # Main script to run the forecasting models
│-- requirements.txt   # List of dependencies
│-- README.md          # Project documentation
│-- /data              # (Optional) Saved historical data
│-- /plots             # Generated charts and visualizations
```

---

## 📢 Notes

* Data is fetched directly from Yahoo Finance at runtime.
* Ensure you have a stable internet connection before execution.
* Forecasting models are trained using a **chronological train-test split** to preserve time-series integrity.
