import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/nav-bar";
import Onboarding from "@/pages/onboarding";
import Home from "@/pages/home";
import Comments from "@/pages/comments";
import Tutorials from "@/pages/tutorials";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/home" component={Home} />
      <Route path="/comments" component={Comments} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen page-gradient text-foreground">
        <Router />
        <NavBar />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;