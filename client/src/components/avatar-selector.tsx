import { useState } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Ethereum, Wallet, Coins, Gem, Crown, Diamond, Star } from "lucide-react";

const avatars = [
  { icon: Bitcoin, label: "Bitcoin" },
  { icon: Ethereum, label: "Ethereum" },
  { icon: Wallet, label: "Wallet" },
  { icon: Coins, label: "Coins" },
  { icon: Gem, label: "Gem" },
  { icon: Crown, label: "Crown" },
  { icon: Diamond, label: "Diamond" },
  { icon: Star, label: "Star" },
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {avatars.map(({ icon: Icon, label }) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(label)}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedAvatar === label
              ? "border-primary bg-primary/20"
              : "border-primary/20 hover:border-primary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Icon className="w-8 h-8" />
            <span className="text-sm">{label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
