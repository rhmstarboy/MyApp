import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import AirdropCarousel from "./airdrop-carousel";

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
      <AirdropCarousel>
        {SYMBOLS.map((symbol) => {
          const crypto = prices[symbol] || { symbol: symbol.replace("USDT", ""), price: "0.00", change: 0 };
          const isPositive = crypto.change >= 0;

          return (
            <div key={symbol} className="flex-[0_0_300px] px-2">
              <Card className="p-6 h-[200px] card-gradient hover:bg-black/70 transition-colors border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold">{crypto.symbol}</span>
                  {isPositive ? (
                    <ArrowUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <ArrowDown className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">${crypto.price}</div>
                  <div className={`text-lg ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{crypto.change.toFixed(2)}%
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </AirdropCarousel>
    </div>
  );
}