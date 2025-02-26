import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, TrendingUp, Database, Brain } from "lucide-react";

const games = [
  {
    id: 1,
    title: "Price Prediction",
    description: "Predict if crypto prices will go up or down in this exciting trading simulator",
    icon: TrendingUp,
    color: "text-green-500",
    comingSoon: true
  },
  {
    id: 2,
    title: "Blockchain Explorer",
    description: "Explore how transactions work on the blockchain through an interactive simulation",
    icon: Database,
    color: "text-blue-500",
    comingSoon: true
  },
  {
    id: 3,
    title: "Crypto Terms",
    description: "Test your knowledge of cryptocurrency terms and concepts",
    icon: Brain,
    color: "text-purple-500",
    comingSoon: true
  },
];

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold">Learning Games</h1>
          <p className="text-sm text-muted-foreground">
            Learn about crypto through interactive games
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="grid gap-4">
          {games.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden bg-black/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`${game.color} p-3 rounded-lg bg-white/10`}>
                      <game.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{game.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {game.description}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedGame(game.id)}
                      className="ml-2"
                      disabled={game.comingSoon}
                    >
                      {game.comingSoon ? "Coming Soon" : "Play"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;