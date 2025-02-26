import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const fadeInVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const logoVariants = {
  animate: {
    scale: [0.9, 1, 0.9],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

interface LoadingScreenProps {
  onGetStarted?: () => void;
}

export function LoadingScreen({ onGetStarted }: LoadingScreenProps) {
  return (
    <motion.div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4"
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
    >
      <div className="relative max-w-md w-full mx-auto text-center">
        {/* Pulsing rings */}
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0 border-2 border-primary/20 rounded-full w-32 h-32 mx-auto"
            variants={pulseVariants}
            animate="animate"
            style={{ 
              animationDelay: `${index * 0.3}s`,
              scale: 1 + index * 0.1
            }}
          />
        ))}

        {/* Logo */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center"
          variants={logoVariants}
          animate="animate"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full" />
          <PartyPopper className="h-16 w-16 text-primary" />
        </motion.div>

        {/* Text Content */}
        <motion.div 
          variants={fadeInVariants}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-primary">
            Airdropor
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to Airdropor
          </p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Get airdrop updates and make more money 💰
          </p>

          {onGetStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="mt-8 bg-primary/20 hover:bg-primary/30 border-primary/20"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}