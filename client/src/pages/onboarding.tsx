import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const Onboarding = () => {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-black via-background to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4"
      >
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setLocation("/home")}
        >
          Skip
        </Button>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <img
            src="https://images.unsplash.com/photo-1641317139750-4a25ddc7e304"
            alt="Crypto illustration"
            className="w-64 h-64 mx-auto mb-8 rounded-full object-cover"
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
          >
            Explore, Claim, and Earn Free Crypto!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground mb-8"
          >
            Stay updated with the latest crypto airdrops and claim free tokens effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setLocation("/home")}
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 pb-16">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
