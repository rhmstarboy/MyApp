import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Bell, Shield, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdBanner } from "@/components/ad-banner"; // Added import

// Avatar mapping (keep in sync with avatar-selector.tsx)
const avatarEmojis: Record<string, string> = {
  "Superhero": "🦸",
  "Wizard": "🧙",
  "Fox": "🦊",
  "Panda": "🐼",
  "Lion": "🦁",
  "Tiger": "🐯",
  "Dragon": "🐉",
  "Unicorn": "🦄"
};

const Profile = () => {
  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const initials = user?.username.slice(0, 2).toUpperCase() || "UN";

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setLocation('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
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
                <AvatarFallback className="text-2xl flex items-center justify-center">
                  {user?.avatar ? avatarEmojis[user.avatar] : initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                <p className="text-sm text-muted-foreground">@{user?.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-2xl font-bold text-primary">{user?.claimedAirdrops || 0}</p>
                <p className="text-sm text-muted-foreground">Claimed</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-2xl font-bold text-primary">${user?.totalValue || 0}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {[
            { icon: Settings, label: "Settings", onClick: () => {} },
            { 
              icon: Shield, 
              label: "Privacy Policy", 
              onClick: () => {},
              isDialog: true,
              dialog: (
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
              )
            },
            { icon: Bell, label: "Notifications", onClick: () => {} },
            { icon: LogOut, label: "Logout", onClick: handleLogout },
          ].map(({ icon: Icon, label, onClick, isDialog, dialog }) => (
            isDialog ? (
              <Dialog key={label}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base h-12"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {label}
                  </Button>
                </DialogTrigger>
                {dialog}
              </Dialog>
            ) : (
              <Button
                key={label}
                variant="ghost"
                className="w-full justify-start text-base h-12"
                onClick={onClick}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </Button>
            )
          ))}
        </div>

        {/* Ad Banner Section */}
        <div className="mt-8">
          <AdBanner className="w-full h-[100px]" format="horizontal" />
        </div>
      </div>
    </div>
  );
};

export default Profile;