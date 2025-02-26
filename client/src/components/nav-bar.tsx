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
    { path: "/home", icon: Home, label: "Latest" },
    { path: "/games", icon: Gamepad2, label: "Games" },
    { path: "/tutorials", icon: Video, label: "Tutorials" },
    { path: "/support", icon: Heart, label: "Support" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 nav-gradient border-t border-border p-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              location === path
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;