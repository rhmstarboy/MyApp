import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/nav-bar";
import Onboarding from "@/pages/onboarding";
import Home from "@/pages/home";
import Claimed from "@/pages/claimed";
import Tutorials from "@/pages/tutorials";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/home" component={Home} />
      <Route path="/claimed" component={Claimed} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Router />
        <NavBar />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
