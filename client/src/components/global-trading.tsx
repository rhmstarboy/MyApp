import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Globe, Sun, Moon } from "lucide-react";

interface TradingRegion {
  name: string;
  timezone: string;
  isActive: boolean;
  volume: string;
  hour: number;
}

export default function GlobalTrading() {
  const [regions, setRegions] = useState<TradingRegion[]>([
    { name: "Asia Pacific", timezone: "Asia/Tokyo", isActive: false, volume: "0", hour: 0 },
    { name: "Europe", timezone: "Europe/London", isActive: false, volume: "0", hour: 0 },
    { name: "Americas", timezone: "America/New_York", isActive: false, volume: "0", hour: 0 },
  ]);

  // Simulate trading activity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setRegions(prev => prev.map(region => {
        const hour = new Date(now.toLocaleString("en-US", { timeZone: region.timezone })).getHours();
        const isActive = hour >= 9 && hour <= 17;
        const volume = isActive 
          ? (Math.random() * 100000 + 50000).toFixed(0) 
          : (Math.random() * 10000).toFixed(0);
        
        return {
          ...region,
          isActive,
          volume,
          hour
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden bg-black/50 border-primary/20">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="p-2 rounded-full bg-primary/20 text-primary"
          >
            <Globe size={24} />
          </motion.div>
          <h3 className="text-lg font-semibold">Global Trading Hours</h3>
        </div>

        <div className="space-y-4">
          {regions.map((region) => (
            <motion.div
              key={region.name}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {region.hour >= 6 && region.hour <= 18 ? (
                      <Sun size={16} className="text-yellow-500" />
                    ) : (
                      <Moon size={16} className="text-blue-400" />
                    )}
                    <span className="font-medium">{region.name}</span>
                  </div>
                  <span className={`text-sm ${region.isActive ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {region.hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Volume: ${Number(region.volume).toLocaleString()}
                  </span>
                  <span className={`text-xs ${region.isActive ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {region.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Active region indicator */}
                {region.isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ scale: 0.8, opacity: 0.1 }}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-full h-full border-2 border-green-500 rounded-lg opacity-20" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
