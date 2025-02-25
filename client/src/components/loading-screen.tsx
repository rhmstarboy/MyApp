import { motion } from "framer-motion";
import { Bitcoin, CircleDollarSign } from "lucide-react";

const iconVariants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
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

export function LoadingScreen() {
  return (
    <motion.div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
    >
      <div className="relative">
        {/* Rotating outer circle */}
        <motion.div
          className="absolute inset-0 border-4 border-primary/20 rounded-full w-32 h-32"
          variants={iconVariants}
          animate="rotate"
        />
        
        {/* Floating icons */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            className="absolute"
            variants={floatVariants}
            animate="animate"
            style={{ top: "0%", left: "50%" }}
          >
            <Bitcoin className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.div
            className="absolute"
            variants={floatVariants}
            animate="animate"
            style={{ bottom: "30%", left: "10%" }}
          >
            <CircleDollarSign className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.div
            className="absolute"
            variants={floatVariants}
            animate="animate"
            style={{ bottom: "30%", right: "10%" }}
          >
            <CircleDollarSign className="w-8 h-8 text-primary" />
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.p 
          className="text-center mt-8 text-lg font-medium text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading market data...
        </motion.p>
      </div>
    </motion.div>
  );
}