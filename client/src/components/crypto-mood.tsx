import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SunIcon, CloudRainIcon, CloudLightningIcon, SunDimIcon } from "lucide-react";

interface MoodState {
  icon: typeof SunIcon;
  color: string;
  text: string;
  scale: number;
}

const moodStates: Record<string, MoodState> = {
  bullish: {
    icon: SunIcon,
    color: "text-green-500",
    text: "Super Bullish! 🚀",
    scale: 1.1,
  },
  positive: {
    icon: SunDimIcon,
    color: "text-emerald-400",
    text: "Looking Good! 😊",
    scale: 1.05,
  },
  neutral: {
    icon: CloudRainIcon,
    color: "text-yellow-400",
    text: "Market is Calm 😌",
    scale: 1,
  },
  bearish: {
    icon: CloudLightningIcon,
    color: "text-red-500",
    text: "Bear Market 🐻",
    scale: 0.95,
  },
};

interface CryptoMoodProps {
  gainersCount: number;
  losersCount: number;
}

export default function CryptoMood({ gainersCount, losersCount }: CryptoMoodProps) {
  const [currentMood, setCurrentMood] = useState<keyof typeof moodStates>("neutral");

  useEffect(() => {
    // Calculate market sentiment
    const ratio = gainersCount / (gainersCount + losersCount);
    
    let newMood: keyof typeof moodStates = "neutral";
    if (ratio >= 0.7) newMood = "bullish";
    else if (ratio >= 0.55) newMood = "positive";
    else if (ratio <= 0.3) newMood = "bearish";
    
    setCurrentMood(newMood);
  }, [gainersCount, losersCount]);

  const mood = moodStates[currentMood];
  const Icon = mood.icon;

  return (
    <Card className="relative overflow-hidden bg-black/50 border-primary/20">
      <motion.div
        className="p-4 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMood}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: mood.scale,
              rotate: 0,
              transition: { 
                type: "spring",
                stiffness: 200,
                damping: 15
              }
            }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            className={`p-3 rounded-full bg-primary/20 ${mood.color}`}
          >
            <Icon size={32} />
          </motion.div>
        </AnimatePresence>

        <div className="flex-1">
          <motion.h3
            className="text-lg font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Market Mood
          </motion.h3>
          <motion.p
            className={`text-sm ${mood.color}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {mood.text}
          </motion.p>
        </div>

        {/* Background animation */}
        <motion.div
          className={`absolute inset-0 ${mood.color} opacity-10`}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [1, 1.2, 1],
            transition: { 
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>
    </Card>
  );
}
