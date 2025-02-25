import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MessageCircle, TrendingUp, Smile, Meh, Frown } from "lucide-react";

interface SocialMention {
  topic: string;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  trending: boolean;
  change: number;
}

const sentimentIcons = {
  positive: { icon: Smile, color: 'text-green-500' },
  neutral: { icon: Meh, color: 'text-yellow-500' },
  negative: { icon: Frown, color: 'text-red-500' },
};

export default function SocialSentiment() {
  const [mentions, setMentions] = useState<SocialMention[]>([]);

  // Simulate social media mentions and sentiment
  useEffect(() => {
    const topics = [
      { topic: '#Bitcoin', base: 15000 },
      { topic: '#Ethereum', base: 12000 },
      { topic: '#Solana', base: 8000 },
      { topic: '#NFTs', base: 5000 },
    ];

    const updateMentions = () => {
      const newMentions = topics.map(({ topic, base }) => {
        const change = Math.floor(Math.random() * 1000) - 500;
        const mentions = base + change;
        const sentiment = change > 200 ? 'positive' : change < -200 ? 'negative' : 'neutral';
        
        return {
          topic,
          mentions,
          sentiment,
          trending: change > 0,
          change: (change / base) * 100,
        };
      });

      setMentions(newMentions.sort((a, b) => b.mentions - a.mentions));
    };

    // Initial update
    updateMentions();

    // Update every 30 seconds
    const interval = setInterval(updateMentions, 30000);
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
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="p-2 rounded-full bg-primary/20 text-primary"
          >
            <MessageCircle size={24} />
          </motion.div>
          <h3 className="text-lg font-semibold">Social Sentiment</h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {mentions.map((mention) => {
              const SentimentIcon = sentimentIcons[mention.sentiment].icon;
              return (
                <motion.div
                  key={mention.topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative"
                >
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{mention.topic}</span>
                        {mention.trending && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <SentimentIcon 
                          className={`h-5 w-5 ${sentimentIcons[mention.sentiment].color}`} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {mention.mentions.toLocaleString()} mentions
                      </span>
                      <span className={`text-xs ${mention.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {mention.change >= 0 ? '+' : ''}{mention.change.toFixed(1)}%
                      </span>
                    </div>

                    {/* Background animation */}
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
                      <div className={`w-full h-full border-2 ${sentimentIcons[mention.sentiment].color} rounded-lg opacity-20`} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
