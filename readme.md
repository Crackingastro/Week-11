# 📈 Financial Time Series Forecasting

## 🔎 Overview

This project analyzes and forecasts the performance of three financial assets:

* **Tesla (TSLA)**
* **BitCoin (BTC)**
* **Vanguard Total Bond Market ETF (BND)**
* **SPDR S\&P 500 ETF Trust (SPY)**

The workflow covers **data acquisition**, **preprocessing**, **exploratory data analysis (EDA)**, and **model building** using both **classical statistical approaches** and **deep learning methods**.

➡️ **Key Finding:** LSTM models demonstrated superior forecasting performance over ARIMA, especially for highly volatile assets like **TSLA**.

---

## ✨ Features

* 📊 **Data Acquisition** – Fetch historical data with [`yfinance`](https://pypi.org/project/yfinance/)
* 🧹 **Preprocessing & Cleaning** – Handle missing values, enforce time-series structure, and fix data types
* 🔍 **Exploratory Analysis** –

  * Price trend visualization
  * Daily returns computation
  * Rolling statistics for volatility
* 📉 **Stationarity Check** – Augmented Dickey-Fuller (ADF) test
* ⚖ **Risk Metrics** – Value at Risk (VaR) & Sharpe Ratio
* 🤖 **Forecasting Models** –

  * **ARIMA / SARIMA** (time-series statistical models)
  * **LSTM** (deep learning for sequential forecasting)
* 📏 **Model Evaluation** – Compare MAE, RMSE, and MAPE

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Crackingastro/Week-11.git
cd Week-11
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🛠 Tech Stack

* **Language:** Python
* **Data Analysis:** Pandas, NumPy
* **Visualization:** Matplotlib, Seaborn
* **Statistical Modeling:** Statsmodels
* **Deep Learning:** TensorFlow / Keras
* **Evaluation Metrics:** Scikit-learn

---

## 📂 Project Structure
```
Week-11/
│-- .github/              # GitHub-related configs/workflows
│-- backend/              # Backend implementation (APIs, logic, etc.)
│-- front/                # Frontend implementation (UI components, etc.)
│-- models/               # Pre-trained models & scalers
│   │-- lstm_BTC-USD_model.h5
│   │-- lstm_BTC-USD_scaler.pkl
│   │-- lstm_TSLA_model.h5
│   │-- lstm_TSLA_scaler.pkl
│   │-- lstm_USDT-USD_model.h5
│   │-- lstm_USDT-USD_scaler.pkl
│
│-- notebooks/            # Jupyter notebooks for analysis & experiments
│   │-- EDA.ipynb
│   │-- model.ipynb
│   │-- model_Updated.ipynb
│   └── visualizaiton/    # Visualization-specific notebooks/scripts
│
│-- script/               # Helper scripts (data processing, etc.)
│-- .gitignore            # Git ignore file
│-- readme.md             # Project documentation
│-- requiremnt.txt        # Dependencies list
```

---

## 📢 Notes

* Data is **downloaded at runtime** directly from Yahoo Finance.
* Ensure you have a **stable internet connection** before running.
* Models are trained using a **chronological train-test split** to maintain time-series integrity.

---

## 📊 Example Outputs

Some visualizations generated during analysis:

* Asset price trends
* Rolling volatility plots
* Forecast vs. actual price comparison

---

## 🤝 Contribution

Contributions, suggestions, and improvements are welcome! Feel free to **open an issue** or **submit a pull request**.
