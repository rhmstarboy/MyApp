import { useState } from "react";
import { useLocation } from "wouter";
import { LoadingScreen } from "@/components/loading-screen";

export default function LoadingTest() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <LoadingScreen onGetStarted={handleGetStarted} />
    </div>
  );
}