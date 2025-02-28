import { motion } from "framer-motion";

interface StatusDotProps {
  className?: string;
}

export function StatusDot({ className }: StatusDotProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full bg-green-500/30"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.2, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {/* Static dot */}
      <div className="w-2 h-2 rounded-full bg-green-500" />
    </div>
  );
}
