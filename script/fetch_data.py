# Financial Data Analysis Notebook
import yfinance as yf

# Define tickers and date range
tickers = ['TSLA', 'BND', 'SPY']
start_date = '2015-07-01'
end_date = '2025-07-31'

# Fetch data
def fetch_data(tickers, start_date, end_date):
    data = yf.download(tickers, start=start_date, end=end_date, group_by='ticker')
    return data

print("Fetching data from Yahoo Finance...")
stock_data = fetch_data(tickers, start_date, end_date)
