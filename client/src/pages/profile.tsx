import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Bell, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Profile = () => {
  const { user, logoutMutation } = useAuth();
  const initials = user?.username.slice(0, 2).toUpperCase() || "UN";

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card className="bg-black/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">Claimed</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-2xl font-bold text-primary">$530</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {[
            { icon: Settings, label: "Settings", onClick: () => {} },
            { icon: Bell, label: "Notifications", onClick: () => {} },
            { icon: Shield, label: "Security", onClick: () => {} },
            { icon: LogOut, label: "Logout", onClick: handleLogout },
          ].map(({ icon: Icon, label, onClick }) => (
            <Button
              key={label}
              variant="ghost"
              className="w-full justify-start text-base h-12"
              onClick={onClick}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;