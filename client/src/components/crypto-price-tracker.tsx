import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Major cryptocurrencies
const HOT_SYMBOLS = ["BITCOIN", "ETHEREUM", "SOLANA"];

const priceVariants = {
  initial: { scale: 1 },
  update: { 
    scale: [1, 1.1, 1],
    transition: { duration: 0.3 }
  }
};

const changeVariants = {
  hidden: { opacity: 0, y: 10 },
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
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    // Function to fetch market data through HTTP
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
        // Only show error if we don't have any prices yet
        if (Object.keys(prices).length === 0) {
          setConnectionError('Failed to fetch market data');
        }
      }
    };

    // Function to create WebSocket connection
    const connectWebSocket = () => {
      if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionError(null);
        // Clear reconnect timeout if connection successful
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
        }
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

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('WebSocket connection error');
        // Don't attempt immediate reconnection on error
        ws?.close();
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        // Only show connection error if we don't have polling data
        if (Object.keys(prices).length === 0) {
          setConnectionError('Connection closed');
        }
        // Attempt to reconnect after delay, but only if component is still mounted
        reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
    };

    // Initial market data fetch
    fetchMarketData();

    // Start WebSocket connection
    connectWebSocket();

    // Set up polling as fallback
    pollInterval = setInterval(fetchMarketData, 5000);

    // Cleanup
    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

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
      {connectionError && Object.keys(prices).length === 0 && (
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