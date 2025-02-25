import { motion } from "framer-motion";
import { Bitcoin } from "lucide-react";

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
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const textVariants = {
  animate: {
    color: [
      "hsl(280, 85%, 65%)", // Primary color
      "hsl(210, 85%, 65%)", // Blue
      "hsl(130, 85%, 65%)", // Green
      "hsl(280, 85%, 65%)"  // Back to primary
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export function LoadingScreen() {
  return (
    <motion.div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
    >
      <div className="relative">
        {/* Pulsing rings */}
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0 border-2 border-primary/20 rounded-full w-32 h-32"
            variants={pulseVariants}
            animate="animate"
            style={{ 
              animationDelay: `${index * 0.3}s`,
              scale: 1 + index * 0.1
            }}
          />
        ))}

        {/* Centered Bitcoin icon with rotate and scale animation */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Bitcoin className="h-12 w-12 text-primary" />
          </motion.div>
        </div>

        {/* Loading text with color animation */}
        <motion.p 
          className="text-center mt-8 text-lg font-medium"
          variants={textVariants}
          animate="animate"
        >
          Loading market data...
        </motion.p>
      </div>
    </motion.div>
  );
}