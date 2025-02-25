import { LoadingScreen } from "@/components/loading-screen";

export default function LoadingTest() {
  // Render only the loading screen without any other components or contexts
  return (
    <div className="min-h-screen bg-background">
      <LoadingScreen />
    </div>
  );
}