import { motion } from "framer-motion";

const avatars = [
  { emoji: "🦸", label: "Superhero" },
  { emoji: "🧙", label: "Wizard" },
  { emoji: "🦊", label: "Fox" },
  { emoji: "🐼", label: "Panda" },
  { emoji: "🦁", label: "Lion" },
  { emoji: "🐯", label: "Tiger" },
  { emoji: "🐉", label: "Dragon" },
  { emoji: "🦄", label: "Unicorn" }
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {avatars.map(({ emoji, label }) => (
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
            <span className="text-4xl" role="img" aria-label={label}>
              {emoji}
            </span>
            <span className="text-sm">{label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}