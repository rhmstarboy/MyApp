import { useCallback } from "react";

export function useVibrate() {
  const vibrate = useCallback((duration: number = 50) => {
    // Check if vibration is supported and enabled
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }, []);

  return vibrate;
}
