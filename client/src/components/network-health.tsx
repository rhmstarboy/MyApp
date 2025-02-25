import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface NetworkStats {
  tps: number;
  avgFee: number;
  blockTime: number;
  status: 'healthy' | 'moderate' | 'congested';
}

export default function NetworkHealth() {
  const [stats, setStats] = useState<NetworkStats>({
    tps: 30,
    avgFee: 2.5,
    blockTime: 12,
    status: 'healthy'
  });

  // Simulate network stats
  useEffect(() => {
    const interval = setInterval(() => {
      const tps = 25 + Math.random() * 15;
      const avgFee = 1.5 + Math.random() * 3;
      const blockTime = 10 + Math.random() * 4;
      
      const status = 
        tps > 35 && avgFee < 3 ? 'healthy' :
        tps > 25 && avgFee < 4 ? 'moderate' : 'congested';

      setStats({ tps, avgFee, blockTime, status });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    healthy: 'text-green-500',
    moderate: 'text-yellow-500',
    congested: 'text-red-500'
  };

  const pulseSpeed = {
    healthy: 0.8,
    moderate: 1.2,
    congested: 1.5
  };

  return (
    <Card className="relative overflow-hidden bg-black/50 border-primary/20">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: pulseSpeed[stats.status],
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`p-2 rounded-full bg-primary/20 ${statusColors[stats.status]}`}
          >
            <Activity size={24} />
          </motion.div>
          <h3 className="text-lg font-semibold">Network Health</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">TPS</p>
            <p className="text-lg font-bold">{stats.tps.toFixed(1)}</p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Avg Fee</p>
            <p className="text-lg font-bold">${stats.avgFee.toFixed(2)}</p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Block Time</p>
            <p className="text-lg font-bold">{stats.blockTime.toFixed(1)}s</p>
          </div>
        </div>

        <div className={`text-center p-2 rounded-lg ${statusColors[stats.status]} bg-primary/10`}>
          Network Status: {stats.status.charAt(0).toUpperCase() + stats.status.slice(1)}
        </div>

        {/* Animated pulse effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: pulseSpeed[stats.status],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className={`w-full h-full border-2 ${statusColors[stats.status]} rounded-lg opacity-20`} />
        </motion.div>
      </div>
    </Card>
  );
}
