import { useEffect } from "react";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the external privacy policy page
    window.location.href = 'https://airdropor.icu/privacy';
  }, []);

  return (
    <div className="min-h-screen w-full py-8 px-4 flex items-center justify-center">
      <p className="text-center">
        Redirecting to privacy policy...
      </p>
    </div>
  );
}