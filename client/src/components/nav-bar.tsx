import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Heart, Video, User, LogOut, Gamepad2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setLocation('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const items = [
    { path: "/games", icon: Gamepad2, label: "Games" },
    { path: "/tutorials", icon: Video, label: "Tutorials" },
    { path: "/home", icon: Home, label: "Home" },
    { path: "/support", icon: Heart, label: "Support" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 nav-gradient border border-border/50 rounded-full p-2 z-50 backdrop-blur-md shadow-lg max-w-[95vw]">
      <div className="flex justify-center items-center gap-2">
        {items.map(({ path, icon: Icon, label }) => {
          const isHome = path === "/home";
          return (
            <button
              key={path}
              onClick={() => setLocation(path)}
              className={cn(
                "flex flex-col items-center p-2 rounded-full transition-all duration-200 hover:scale-110",
                isHome ? "px-5" : "px-3",
                location === path
                  ? "text-primary bg-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              <Icon size={isHome ? 28 : 22} />
              <span className="text-[10px] mt-0.5">{label}</span>
            </button>
          );
        })}

        {/* Privacy Policy Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="flex flex-col items-center p-2 px-3 rounded-full transition-all duration-200 hover:scale-110 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Shield size={22} />
              <span className="text-[10px] mt-0.5">Privacy</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Privacy Policy for AirDropor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">Last Updated: Feb, 2025</p>

              <p>Thank you for using AirDropor. Your privacy is important to us. This Privacy Policy explains how we handle your information when you use our app.</p>

              <div>
                <h3 className="font-semibold mb-2">Information We Do Not Collect</h3>
                <p>AirDropor does not collect, store, or process any personal information from its users. We do not require registration, and no personal data (such as name, email, phone number, or wallet address) is requested or accessed.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How We Operate</h3>
                <p>AirDropor is designed to provide updates on crypto airdrops without requiring any user information. The app functions as a notification service for upcoming and new coin airdrops.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Third-Party Links</h3>
                <p>The app may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies before providing any personal information.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Changes to This Policy</h3>
                <p>We may update this Privacy Policy from time to time. Any changes will be posted here, and we encourage you to review this policy periodically.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at support@airdropor.com.</p>
              </div>

              <p>By using AirDropor, you agree to the terms outlined in this Privacy Policy.</p>

              <p className="text-center text-primary font-semibold">Thank you for trusting AirDropor! 🚀</p>
            </div>
          </DialogContent>
        </Dialog>
        {/* <button onClick={handleLogout} className="flex flex-col items-center p-2 rounded-full transition-all duration-200 hover:scale-110 text-muted-foreground hover:text-red-500">
          <LogOut size={22} />
          <span className="text-[10px] mt-0.5">Logout</span>
        </button> */}
      </div>
    </nav>
  );
};

export default NavBar;