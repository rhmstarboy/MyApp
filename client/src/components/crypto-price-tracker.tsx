import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface CryptoPrice {
  symbol: string;
  price: string;
  change: number;
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

export default function CryptoPriceTracker() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws");

    ws.onopen = () => {
      // Subscribe to ticker streams for all symbols
      const subscribeMsg = {
        method: "SUBSCRIBE",
        params: SYMBOLS.map(symbol => `${symbol.toLowerCase()}@ticker`),
        id: 1
      };
      ws.send(JSON.stringify(subscribeMsg));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.s && data.c && data.p) {
        setPrices(prev => ({
          ...prev,
          [data.s]: {
            symbol: data.s.replace("USDT", ""),
            price: parseFloat(data.c).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: parseFloat(data.p)
          }
        }));
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Live Crypto Prices</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {SYMBOLS.map((symbol) => {
          const crypto = prices[symbol] || { symbol: symbol.replace("USDT", ""), price: "0.00", change: 0 };
          const isPositive = crypto.change >= 0;

          return (
            <Card key={symbol} className="p-4 card-gradient">
              <div className="flex items-center justify-between">
                <span className="font-medium">{crypto.symbol}</span>
                {isPositive ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold">${crypto.price}</div>
                <div className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? "+" : ""}{crypto.change.toFixed(2)}%
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
