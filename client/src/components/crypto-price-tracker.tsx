import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AirdropCarousel from "./airdrop-carousel";
import CryptoMood from "./crypto-mood";

interface CryptoPrice {
  symbol: string;
  price: string;
  change: number;
}

interface CryptoSymbols {
  gainers: string[];
  losers: string[];
}

// Hot coins are static as they're the major cryptocurrencies
const HOT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function CryptoPriceTracker() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
  const [symbols, setSymbols] = useState<CryptoSymbols>({ gainers: [], losers: [] });
  const { toast } = useToast();

  // Function to fetch top gainers and losers
  const fetchTopMovers = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();

      // Filter for USDT pairs and sort by price change percentage
      const usdtPairs = data.filter((pair: any) => pair.symbol.endsWith('USDT'));
      const sorted = usdtPairs.sort((a: any, b: any) =>
        Math.abs(parseFloat(b.priceChangePercent)) - Math.abs(parseFloat(a.priceChangePercent))
      );

      // Get top 3 gainers and losers
      const gainers = sorted
        .filter((pair: any) => parseFloat(pair.priceChangePercent) > 0)
        .slice(0, 3)
        .map((pair: any) => pair.symbol);

      const losers = sorted
        .filter((pair: any) => parseFloat(pair.priceChangePercent) < 0)
        .slice(0, 3)
        .map((pair: any) => pair.symbol);

      setSymbols({ gainers, losers });
    } catch (error) {
      console.error('Error fetching top movers:', error);
    }
  };

  useEffect(() => {
    // Fetch top movers initially and every 5 minutes
    fetchTopMovers();
    const interval = setInterval(fetchTopMovers, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws");

    ws.onopen = () => {
      const allSymbols = [...HOT_SYMBOLS, ...symbols.gainers, ...symbols.losers];
      const subscribeMsg = {
        method: "SUBSCRIBE",
        params: allSymbols.map(symbol => `${symbol.toLowerCase()}@ticker`),
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
  }, [symbols]);

  const handleViewMore = () => {
    toast({
      title: "Coming Soon",
      description: "Full market overview will be available in the next update!",
    });
  };

  const renderCryptoCards = (symbolList: string[]) => (
    <AirdropCarousel onViewMore={handleViewMore} viewMoreCardHeight="h-[200px]">
      {symbolList.map((symbol) => {
        const crypto = prices[symbol] || { symbol: symbol.replace("USDT", ""), price: "0.00", change: 0 };
        const isPositive = crypto.change >= 0;

        return (
          <div key={symbol} className="flex-[0_0_300px] px-2">
            <Card className="p-6 h-[200px] card-gradient hover:bg-black/70 transition-colors border-primary/20">
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
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Add CryptoMood component at the top */}
      <div className="mb-6">
        <CryptoMood 
          gainersCount={symbols.gainers.length}
          losersCount={symbols.losers.length}
        />
      </div>

      <Tabs defaultValue="hot" className="w-full">
        <TabsList className="w-full mb-6 bg-primary/20">
          <TabsTrigger value="hot" className="flex-1">Hot</TabsTrigger>
          <TabsTrigger value="gainers" className="flex-1">Gainers</TabsTrigger>
          <TabsTrigger value="losers" className="flex-1">Losers</TabsTrigger>
        </TabsList>

        <TabsContent value="hot">
          {renderCryptoCards(HOT_SYMBOLS)}
        </TabsContent>

        <TabsContent value="gainers">
          {renderCryptoCards(symbols.gainers)}
        </TabsContent>

        <TabsContent value="losers">
          {renderCryptoCards(symbols.losers)}
        </TabsContent>
      </Tabs>
    </div>
  );
}