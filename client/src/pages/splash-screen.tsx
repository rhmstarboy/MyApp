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
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <img 
          src="/assets/IMG_7608.png" 
          alt="Logo" 
          className="w-32 h-32"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button
          variant="outline"
          size="lg"
          className="text-lg font-semibold"
          onClick={() => setLocation('/auth')}
        >
          GET STARTED
        </Button>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
