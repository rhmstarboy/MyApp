import { motion } from "framer-motion";

interface StatusDotProps {
  className?: string;
}

export function StatusDot({ className }: StatusDotProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Multiple animated pulse rings */}
      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 rounded-full bg-green-500/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3
          }}
        />
      ))}
      {/* Static dot */}
      <motion.div 
        className="w-2 h-2 rounded-full bg-green-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}