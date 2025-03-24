import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib/protected-route";
import NavBar from "@/components/nav-bar";
import { CryptoMascot } from "@/components/crypto-mascot";
import Home from "@/pages/home";
import Support from "@/pages/support";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import PrivacyPolicy2 from "@/pages/privacy-policy2";
import { useLocation } from "wouter";

function Router() {
  const [location] = useLocation();
  const showNav = !['/', '/auth', '/privacy-policy2'].includes(location);

  return (
    <>
      {showNav && <NavBar />}
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/privacy-policy2" component={PrivacyPolicy2} />

        {/* Protected routes */}
        <ProtectedRoute path="/home" component={Home} />
        <ProtectedRoute path="/support" component={Support} />
        <ProtectedRoute path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  const isLoggedIn = !!localStorage.getItem('userData');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen page-gradient text-foreground">
        <Router />
        {isLoggedIn && <CryptoMascot />}
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;