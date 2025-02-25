import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Gift, Video, User } from "lucide-react";

const NavBar = () => {
  const [location] = useLocation();

  const items = [
    { path: "/home", icon: Home, label: "Latest" },
    { path: "/claimed", icon: Gift, label: "Claimed" },
    { path: "/tutorials", icon: Video, label: "Tutorials" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (location === "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-border p-2">
      <div className="max-w-md mx-auto bg-black/90 rounded-full border border-border p-2">
        <div className="flex justify-around items-center">
          {items.map(({ path, icon: Icon, label }) => (
            <a
              key={path}
              href={path}
              className={cn(
                "flex flex-col items-center p-2 rounded-full transition-all",
                location === path
                  ? "text-primary scale-110 bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:scale-105"
              )}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;