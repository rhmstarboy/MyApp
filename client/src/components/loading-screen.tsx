import { motion } from "framer-motion";
import { Bitcoin, CircleDollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

const floatVariants = {
  animate: (custom: number) => ({
    y: [0, -10, 0],
    x: [0, custom, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: custom * 0.2
    }
  })
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

// Candlestick animation variants
const candlestickVariants = {
  animate: (custom: number) => ({
    scaleY: [0.5, 1.5, 0.5],
    backgroundColor: [
      "hsl(130, 85%, 65%)", // Green
      "hsl(280, 85%, 65%)", // Primary
      "hsl(0, 85%, 65%)"    // Red
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: custom * 0.3
    }
  })
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

        {/* Candlesticks background */}
        <div className="absolute -inset-4 flex justify-around items-center opacity-20">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-12 rounded-sm"
              variants={candlestickVariants}
              animate="animate"
              custom={i}
            />
          ))}
        </div>

        {/* Floating icons */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            className="absolute"
            variants={floatVariants}
            animate="animate"
            custom={5}
            style={{ top: "0%", left: "50%" }}
          >
            <Bitcoin className="h-8 w-8 text-primary" />
          </motion.div>

          <motion.div
            className="absolute"
            variants={floatVariants}
            animate="animate"
            custom={-5}
            style={{ bottom: "30%", left: "10%" }}
          >
            <ArrowUpRight className="h-8 w-8 text-green-500" />
          </motion.div>

          <motion.div
            className="absolute"
            variants={floatVariants}
            animate="animate"
            custom={5}
            style={{ bottom: "30%", right: "10%" }}
          >
            <ArrowDownRight className="h-8 w-8 text-red-500" />
          </motion.div>

          <motion.div
            className="absolute"
            variants={floatVariants}
            animate="animate"
            custom={-5}
            style={{ top: "30%", right: "0%" }}
          >
            <CircleDollarSign className="h-8 w-8 text-primary" />
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