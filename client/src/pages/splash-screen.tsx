import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const SplashScreen = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If user is already logged in, redirect to home
    const userData = localStorage.getItem('userData');
    if (userData) {
      setLocation('/home');
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-black py-20">
      <div /> {/* Empty div for spacing */}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="/assets/new-logo.png" 
          alt="Logo" 
          className="w-36 h-36 object-contain"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button
          className="bg-primary/20 hover:bg-primary/30 text-lg font-semibold px-8 py-6"
          onClick={() => setLocation('/auth')}
        >
          GET STARTED
        </Button>
      </motion.div>
    </div>
  );
};

export default SplashScreen;