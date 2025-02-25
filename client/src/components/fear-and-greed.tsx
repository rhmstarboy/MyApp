import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudLightning, CloudDrizzle } from "lucide-react";

interface MarketSentiment {
  value: number;
  status: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  icon: typeof Sun;
  color: string;
}

export default function FearAndGreed() {
  const [sentiment, setSentiment] = useState<MarketSentiment>({
    value: 50,
    status: 'Neutral',
    icon: Cloud,
    color: 'text-yellow-500'
  });

  const calculateSentiment = (value: number): MarketSentiment => {
    if (value >= 75) return {
      value,
      status: 'Extreme Greed',
      icon: Sun,
      color: 'text-green-500'
    };
    if (value >= 60) return {
      value,
      status: 'Greed',
      icon: CloudDrizzle,
      color: 'text-emerald-500'
    };
    if (value >= 40) return {
      value,
      status: 'Neutral',
      icon: Cloud,
      color: 'text-yellow-500'
    };
    if (value >= 25) return {
      value,
      status: 'Fear',
      icon: CloudLightning,
      color: 'text-orange-500'
    };
    return {
      value,
      status: 'Extreme Fear',
      icon: CloudLightning,
      color: 'text-red-500'
    };
  };

  // Simulate sentiment changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.max(0, Math.min(100, 
        sentiment.value + (Math.random() * 20 - 10)
      ));
      setSentiment(calculateSentiment(newValue));
    }, 10000);

    return () => clearInterval(interval);
  }, [sentiment.value]);

  const Icon = sentiment.icon;

  return (
    <Card className="relative overflow-hidden bg-black/50 border-primary/20">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: sentiment.status.includes('Fear') ? [-5, 5, -5] : [0, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`p-2 rounded-full bg-primary/20 ${sentiment.color}`}
          >
            <Icon size={24} />
          </motion.div>
          <h3 className="text-lg font-semibold">Fear & Greed Index</h3>
        </div>

        <div className="text-center mb-4">
          <motion.div
            key={sentiment.value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl font-bold ${sentiment.color}`}
          >
            {sentiment.value}
          </motion.div>
          <motion.p
            key={sentiment.status}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-lg ${sentiment.color}`}
          >
            {sentiment.status}
          </motion.p>
        </div>

        {/* Animated weather effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0.1 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className={`w-full h-full border-2 ${sentiment.color} rounded-lg opacity-20`} />
        </motion.div>
      </div>
    </Card>
  );
}
