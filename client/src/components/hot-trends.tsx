import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface TrendingCoin {
  symbol: string;
  name: string;
  change: number;
  mentions: number;
}

export default function HotTrends() {
  const [trends, setTrends] = useState<TrendingCoin[]>([]);

  // Simulate trending data
  useEffect(() => {
    const coins = [
      { symbol: "BTC", name: "Bitcoin", change: 5.2, mentions: 1200 },
      { symbol: "ETH", name: "Ethereum", change: 3.8, mentions: 800 },
      { symbol: "SOL", name: "Solana", change: 8.5, mentions: 600 },
    ];

    setTrends(coins);

    // Update trend data every minute
    const interval = setInterval(() => {
      setTrends(prev => prev.map(coin => ({
        ...coin,
        change: +(coin.change + (Math.random() * 2 - 1)).toFixed(1),
        mentions: coin.mentions + Math.floor(Math.random() * 100),
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden bg-black/50 border-primary/20">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="p-2 rounded-full bg-primary/20 text-primary"
          >
            <Flame size={24} />
          </motion.div>
          <h3 className="text-lg font-semibold">Hot Trends</h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {trends.map((coin) => (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="font-medium">{coin.symbol}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {coin.name}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.change >= 0 ? '+' : ''}{coin.change}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {coin.mentions.toLocaleString()} social mentions
                  </div>

                  {/* Animated fire effect */}
                  <motion.div
                    className="absolute top-0 right-0 pointer-events-none"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Flame size={24} className="text-primary/20" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
