"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CalendarIcon, TrendingUpIcon, DollarSignIcon, BarChart3Icon } from "lucide-react"

interface PredictionData {
  ticker: string
  date: string
  predicted_price: number
  actual_price?: number
}

interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function PricePredictionDashboard() {
  const [selectedTicker, setSelectedTicker] = useState("TSLA")
  const [singleDate, setSingleDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const tickers = [
    { value: "TSLA", label: "Tesla (TSLA)", color: "#dc2626" },
    { value: "BTC-USD", label: "Bitcoin (BTC-USD)", color: "#f59e0b" },
    { value: "USDT-USD", label: "Tether (USDT-USD)", color: "#10b981" },
  ]

  const getCurrentTicker = () => tickers.find((t) => t.value === selectedTicker) || tickers[0]

  // Load historical data on ticker change
  useEffect(() => {
    loadHistoricalData()
  }, [selectedTicker])

  const loadHistoricalData = async () => {
    try {
      setLoading(true)
      // Simulated API call - replace with actual endpoint
      const mockHistoricalData: HistoricalData[] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        const basePrice = selectedTicker === "TSLA" ? 250 : selectedTicker === "BTC-USD" ? 45000 : 1
        const variation = Math.random() * 0.1 - 0.05
        const price = basePrice * (1 + variation)

        return {
          date: date.toISOString().split("T")[0],
          open: price * 0.99,
          high: price * 1.02,
          low: price * 0.98,
          close: price,
          volume: Math.floor(Math.random() * 1000000),
        }
      })

      setHistoricalData(mockHistoricalData)
    } catch (err) {
      setError("Failed to load historical data")
    } finally {
      setLoading(false)
    }
  }

  const handleSinglePrediction = async () => {
    if (!singleDate) return

    try {
      setLoading(true)
      setError("")

      // Simulated API call - replace with actual endpoint
      const mockPrediction: PredictionData = {
        ticker: selectedTicker,
        date: singleDate,
        predicted_price: selectedTicker === "TSLA" ? 275.5 : selectedTicker === "BTC-USD" ? 47500.25 : 1.001,
      }

      setPredictions([mockPrediction])
    } catch (err) {
      setError("Failed to get prediction")
    } finally {
      setLoading(false)
    }
  }

  const handleRangePrediction = async () => {
    if (!startDate || !endDate) return

    try {
      setLoading(true)
      setError("")

      // Simulated API call - replace with actual endpoint
      const start = new Date(startDate)
      const end = new Date(endDate)
      const mockPredictions: PredictionData[] = []

      const current = new Date(start)
      while (current <= end) {
        const basePrice = selectedTicker === "TSLA" ? 250 : selectedTicker === "BTC-USD" ? 45000 : 1
        const variation = Math.random() * 0.1 - 0.05

        mockPredictions.push({
          ticker: selectedTicker,
          date: current.toISOString().split("T")[0],
          predicted_price: basePrice * (1 + variation),
          actual_price: Math.random() > 0.5 ? basePrice * (1 + variation * 0.8) : undefined,
        })

        current.setDate(current.getDate() + 1)
      }

      setPredictions(mockPredictions)
    } catch (err) {
      setError("Failed to get range predictions")
    } finally {
      setLoading(false)
    }
  }

  const chartData =
    predictions.length > 0
      ? predictions.map((p) => ({
          date: p.date,
          predicted: p.predicted_price,
          actual: p.actual_price || null,
        }))
      : historicalData.map((h) => ({
          date: h.date,
          price: h.close,
          volume: h.volume,
        }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">AI Price Prediction Dashboard</h1>
          <p className="text-slate-600">Advanced LSTM models for cryptocurrency and stock price forecasting</p>
        </div>

        {/* Ticker Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5" />
              Asset Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {tickers.map((ticker) => (
                <Button
                  key={ticker.value}
                  variant={selectedTicker === ticker.value ? "default" : "outline"}
                  onClick={() => setSelectedTicker(ticker.value)}
                  className="flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ticker.color }} />
                  {ticker.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single">Single Prediction</TabsTrigger>
            <TabsTrigger value="range">Range Prediction</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Single Date Prediction
                </CardTitle>
                <CardDescription>
                  Get price prediction for {getCurrentTicker().label} on a specific date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="single-date">Select Date</Label>
                    <Input
                      id="single-date"
                      type="date"
                      value={singleDate}
                      onChange={(e) => setSingleDate(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSinglePrediction} disabled={loading || !singleDate}>
                    {loading ? "Predicting..." : "Get Prediction"}
                  </Button>
                </div>

                {predictions.length === 1 && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Predicted Price for {predictions[0].date}</p>
                        <p className="text-2xl font-bold" style={{ color: getCurrentTicker().color }}>
                          ${predictions[0].predicted_price.toFixed(2)}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <TrendingUpIcon className="h-4 w-4 mr-1" />
                        AI Prediction
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="range" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5" />
                  Range Prediction
                </CardTitle>
                <CardDescription>
                  Get price predictions for {getCurrentTicker().label} over a date range
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <Button onClick={handleRangePrediction} disabled={loading || !startDate || !endDate}>
                    {loading ? "Predicting..." : "Get Predictions"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {predictions.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prediction vs Actual Prices</CardTitle>
                  <CardDescription>
                    Comparing AI predictions with actual market prices for {getCurrentTicker().label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      predicted: {
                        label: "Predicted Price",
                        color: getCurrentTicker().color,
                      },
                      actual: {
                        label: "Actual Price",
                        color: "#64748b",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke={getCurrentTicker().color}
                          strokeWidth={2}
                          name="Predicted Price"
                        />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#64748b"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Actual Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSignIcon className="h-5 w-5" />
                  Historical Price Data
                </CardTitle>
                <CardDescription>Recent price movements for {getCurrentTicker().label}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    price: {
                      label: "Close Price",
                      color: getCurrentTicker().color,
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={getCurrentTicker().color}
                        fill={getCurrentTicker().color}
                        fillOpacity={0.1}
                        strokeWidth={2}
                        name="Close Price"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
