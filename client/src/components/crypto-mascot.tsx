import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface MascotMessage {
  id: string;
  text: string;
  action?: string;
  actionLink?: string;
}

const mascotEmoji = "🦊"; // Friendly fox mascot

export function CryptoMascot() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null);

  // Get user data to check if they're new
  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;
  const isNewUser = user && new Date().getTime() - new Date(user.createdAt).getTime() < 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (isNewUser) {
      setCurrentMessage({
        id: "welcome",
        text: `Welcome to CryptoLearn, ${user.fullName}! I'm Crypto Fox, your guide to the exciting world of cryptocurrency. Would you like a quick tour of our features?`,
        action: "Start Tour",
        actionLink: "/tutorials"
      });
    }
  }, [isNewUser, user?.fullName]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <Card className="w-[300px] p-4 bg-primary/5 border-primary/20">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-start gap-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="text-4xl"
            >
              {mascotEmoji}
            </motion.div>
            
            <div className="flex-1">
              <p className="text-sm mb-3">{currentMessage.text}</p>
              {currentMessage.action && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (currentMessage.actionLink) {
                      window.location.href = currentMessage.actionLink;
                    }
                  }}
                >
                  {currentMessage.action}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
