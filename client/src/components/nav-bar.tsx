import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Heart, Video, User, LogOut, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    { path: "/home", icon: Home, label: "Home" },
    { path: "/games", icon: Gamepad2, label: "Games" },
    { path: "/tutorials", icon: Video, label: "Tutorials" },
    { path: "/support", icon: Heart, label: "Support" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 nav-gradient border border-border/50 rounded-full p-2 z-50 backdrop-blur-md shadow-lg">
      <div className="flex justify-around items-center gap-1">
        {items.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={cn(
              "flex flex-col items-center p-2 rounded-full transition-all duration-200 hover:scale-110",
              path === "/home" ? "px-6" : "px-3", // Make home button wider
              location === path
                ? "text-primary bg-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
          >
            <Icon size={path === "/home" ? 28 : 24} /> {/* Make home icon bigger */}
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 px-3 rounded-full transition-all duration-200 hover:scale-110 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;