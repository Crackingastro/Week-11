"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Zap, Calendar, Activity } from "lucide-react"

interface PredictionData {
  ticker: string
  date: string
  predicted_price: number
}

interface ChartDataPoint {
  date: string
  price: number
  predicted?: number
}

const ASSETS = [
  {
    id: "tsla",
    name: "Tesla",
    symbol: "TSLA",
    icon: Zap,
    color: "var(--chart-1)",
    description: "Electric Vehicle Pioneer",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC-USD",
    icon: Bitcoin,
    color: "var(--chart-2)",
    description: "Digital Gold",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT-USD",
    icon: DollarSign,
    color: "var(--chart-3)",
    description: "Stable Cryptocurrency",
  },
]

export default function FinancialDashboard() {
  const [selectedDate, setSelectedDate] = useState("")
  const [predictions, setPredictions] = useState<Record<string, PredictionData>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [historicalData, setHistoricalData] = useState<Record<string, ChartDataPoint[]>>({})

  // Generate mock historical data for demonstration
  useEffect(() => {
    const generateMockData = (basePrice: number, volatility: number) => {
      const data: ChartDataPoint[] = []
      let price = basePrice

      for (let i = 30; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        // Add some realistic price movement
        const change = (Math.random() - 0.5) * volatility
        price = Math.max(price + change, basePrice * 0.5)

        data.push({
          date: date.toISOString().split("T")[0],
          price: Math.round(price * 100) / 100,
        })
      }
      return data
    }

    setHistoricalData({
      tsla: generateMockData(250, 15),
      btc: generateMockData(45000, 2000),
      usdt: generateMockData(1.0, 0.02),
    })
  }, [])

  const handlePredict = async (assetId: string) => {
    if (!selectedDate) return

    setLoading((prev) => ({ ...prev, [assetId]: true }))

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`/api/predict/${assetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date_str: selectedDate }),
      })

      if (!response.ok) throw new Error("Prediction failed")

      const data: PredictionData = await response.json()
      setPredictions((prev) => ({ ...prev, [assetId]: data }))
    } catch (error) {
      console.error("Prediction error:", error)
      // Mock prediction for demo
      const mockPrice =
        assetId === "tsla"
          ? 280 + Math.random() * 40
          : assetId === "btc"
            ? 47000 + Math.random() * 6000
            : 1.0 + (Math.random() - 0.5) * 0.04

      setPredictions((prev) => ({
        ...prev,
        [assetId]: {
          ticker: ASSETS.find((a) => a.id === assetId)?.symbol || "",
          date: selectedDate,
          predicted_price: Math.round(mockPrice * 100) / 100,
        },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [assetId]: false }))
    }
  }

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes("BTC")) return `$${price.toLocaleString()}`
    if (symbol.includes("USDT")) return `$${price.toFixed(4)}`
    return `$${price.toFixed(2)}`
  }

  const getCurrentPrice = (assetId: string) => {
    const data = historicalData[assetId]
    return data?.[data.length - 1]?.price || 0
  }

  const getPriceChange = (assetId: string) => {
    const data = historicalData[assetId]
    if (!data || data.length < 2) return 0
    const current = data[data.length - 1].price
    const previous = data[data.length - 2].price
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-foreground">AI Trading Dashboard</h1>
              <p className="text-muted-foreground mt-1">Advanced machine learning price predictions</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Activity className="w-4 h-4 mr-1" />
              Live Predictions
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Date Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prediction Date
            </CardTitle>
            <CardDescription>Select a date to generate AI-powered price predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-xs">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => ASSETS.forEach((asset) => handlePredict(asset.id))}
                disabled={!selectedDate || Object.values(loading).some(Boolean)}
                className="px-6"
              >
                Predict All Assets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Asset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {ASSETS.map((asset) => {
            const Icon = asset.icon
            const currentPrice = getCurrentPrice(asset.id)
            const priceChange = getPriceChange(asset.id)
            const prediction = predictions[asset.id]

            return (
              <Card key={asset.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{asset.name}</CardTitle>
                        <CardDescription>{asset.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={priceChange >= 0 ? "default" : "destructive"}>
                      {priceChange >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(priceChange).toFixed(2)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="text-2xl font-bold">{formatPrice(currentPrice, asset.symbol)}</p>
                    </div>

                    {prediction && (
                      <div className="p-3 bg-accent/10 rounded-lg border">
                        <p className="text-sm text-muted-foreground">AI Prediction for {prediction.date}</p>
                        <p className="text-xl font-semibold text-accent-foreground">
                          {formatPrice(prediction.predicted_price, asset.symbol)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(((prediction.predicted_price - currentPrice) / currentPrice) * 100).toFixed(2)}% change
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => handlePredict(asset.id)}
                      disabled={!selectedDate || loading[asset.id]}
                      variant="outline"
                      className="w-full"
                    >
                      {loading[asset.id] ? "Predicting..." : "Get Prediction"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="tsla" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {ASSETS.map((asset) => (
              <TabsTrigger key={asset.id} value={asset.id} className="flex items-center gap-2">
                <asset.icon className="w-4 h-4" />
                {asset.symbol}
              </TabsTrigger>
            ))}
          </TabsList>

          {ASSETS.map((asset) => (
            <TabsContent key={asset.id} value={asset.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <asset.icon className="w-5 h-5" style={{ color: asset.color }} />
                    {asset.name} Price History
                  </CardTitle>
                  <CardDescription>30-day price movement with smooth trend visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData[asset.id] || []}>
                        <defs>
                          <linearGradient id={`gradient-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={asset.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={asset.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                          dataKey="date"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickFormatter={(value) => formatPrice(value, asset.symbol)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [formatPrice(value, asset.symbol), "Price"]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={asset.color}
                          strokeWidth={2}
                          fill={`url(#gradient-${asset.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
