import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AirdropCarousel from "./airdrop-carousel";
import CryptoMood from "./crypto-mood";
import WhaleAlert from "./whale-alert";
import NetworkHealth from "./network-health";
import GlobalTrading from "./global-trading";
import SocialSentiment from "./social-sentiment";

interface CryptoPrice {
  symbol: string;
  price: number;
  change: number;
  previousPrice?: number;
}

// Hot coins are static as they're the major cryptocurrencies
const HOT_SYMBOLS = ["BITCOIN", "ETHEREUM", "SOLANA"];

const priceVariants = {
  initial: { scale: 1 },
  update: { 
    scale: [1, 1.1, 1],
    transition: { duration: 0.3 }
  }
};

const changeVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

export default function CryptoPriceTracker() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial market data fetch
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market/ticker');
        if (!response.ok) throw new Error('Failed to fetch market data');

        const data = await response.json();
        setPrices(prev => {
          const newPrices: Record<string, CryptoPrice> = {};
          data.forEach((item: any) => {
            newPrices[item.symbol] = {
              symbol: item.symbol,
              price: item.price,
              change: item.change,
              previousPrice: prev[item.symbol]?.price
            };
          });
          return newPrices;
        });
        setConnectionError(null);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setConnectionError('Failed to fetch market data');
        toast({
          title: "Error",
          description: "Failed to fetch market data. Retrying...",
          variant: "destructive",
        });
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Fallback polling every 30s

    // WebSocket setup
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'market_update') {
          setPrices(prev => {
            const newPrices: Record<string, CryptoPrice> = {};
            message.data.forEach((item: any) => {
              newPrices[item.symbol] = {
                symbol: item.symbol,
                price: item.price,
                change: item.change,
                previousPrice: prev[item.symbol]?.price
              };
            });
            return newPrices;
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = () => {
      setConnectionError('WebSocket connection error');
    };

    ws.onclose = () => {
      setConnectionError('WebSocket connection closed');
    };

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [toast]);

  const handleViewMore = () => {
    toast({
      title: "Coming Soon",
      description: "Full market overview will be available in the next update!",
    });
  };

  const renderCryptoCard = (symbol: string) => {
    const crypto = prices[symbol];
    if (!crypto) return null;

    const isPositive = crypto.change >= 0;
    const hasChanged = crypto.previousPrice !== crypto.price;

    return (
      <div key={symbol} className="flex-[0_0_300px] px-2">
        <Card className="p-6 h-[200px] card-gradient hover:bg-black/70 transition-colors border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold">{symbol}</span>
            <motion.div
              animate={hasChanged ? "update" : "initial"}
              variants={{
                update: {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.3 }
                }
              }}
            >
              {isPositive ? (
                <ArrowUp className="h-6 w-6 text-green-500" />
              ) : (
                <ArrowDown className="h-6 w-6 text-red-500" />
              )}
            </motion.div>
          </div>
          <div className="space-y-4">
            <motion.div
              key={crypto.price}
              variants={priceVariants}
              initial="initial"
              animate={hasChanged ? "update" : "initial"}
              className="text-3xl font-bold text-primary"
            >
              ${crypto.price.toLocaleString(undefined, { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={crypto.change}
                variants={changeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`text-lg ${isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {isPositive ? "+" : ""}{crypto.change.toFixed(2)}%
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {connectionError && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4 text-sm">
          {connectionError}. Attempting to reconnect...
        </div>
      )}

      {/* Market insight widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CryptoMood data={prices} />
        <WhaleAlert />
        <NetworkHealth />
        <GlobalTrading />
        <SocialSentiment />
      </div>

      <Tabs defaultValue="hot" className="w-full">
        <TabsList className="w-full mb-6 bg-primary/20">
          <TabsTrigger value="hot" className="flex-1">Hot</TabsTrigger>
        </TabsList>

        <TabsContent value="hot">
          <AirdropCarousel onViewMore={handleViewMore}>
            {HOT_SYMBOLS.map(symbol => renderCryptoCard(symbol))}
          </AirdropCarousel>
        </TabsContent>
      </Tabs>
    </div>
  );
}