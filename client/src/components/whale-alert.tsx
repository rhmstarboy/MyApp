import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Waves } from "lucide-react";

interface WhaleTransaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  coin: string;
  timestamp: Date;
}

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatAmount = (amount: string) => {
  const num = parseFloat(amount);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return amount;
};

export default function WhaleAlert() {
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);

  // Simulate whale transactions for demo
  useEffect(() => {
    const coins = ["BTC", "ETH", "SOL"];
    const generateTransaction = (): WhaleTransaction => ({
      id: Math.random().toString(36).substring(7),
      from: "0x" + Math.random().toString(36).substr(2, 34),
      to: "0x" + Math.random().toString(36).substr(2, 34),
      amount: (Math.random() * 10000000).toFixed(2),
      coin: coins[Math.floor(Math.random() * coins.length)],
      timestamp: new Date(),
    });

    // Add initial transactions
    setTransactions([generateTransaction()]);

    // Add new transaction every 30 seconds
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTransaction = generateTransaction();
        return [newTransaction, ...prev].slice(0, 3);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden bg-black/50 border-primary/20">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="p-2 rounded-full bg-primary/20 text-primary"
          >
            <Waves size={24} />
          </motion.div>
          <h3 className="text-lg font-semibold">Whale Alert</h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative"
              >
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">
                      {formatAddress(tx.from)} → {formatAddress(tx.to)}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {formatAmount(tx.amount)} {tx.coin}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {/* Animated wave effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: 1.2,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut",
                  }}
                >
                  <div className="w-full h-full border-2 border-primary/20 rounded-lg" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
