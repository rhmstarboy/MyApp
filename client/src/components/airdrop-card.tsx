import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import ShareButton from "./share-button";
import { useToast } from "@/hooks/use-toast";
import type { Airdrop } from "@shared/schema";

interface Airdrop extends Airdrop {
  icon?: React.ComponentType<{ size: number }>; // Added icon property
}

interface AirdropCardProps {
  airdrop: Airdrop;
}

const AirdropCard = ({ airdrop }: AirdropCardProps) => {
  const [isStepsOpen, setIsStepsOpen] = useState(false);
  const { toast } = useToast();

  const handleJoin = () => {
    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) return;

    const userData = JSON.parse(userDataStr);

    const updatedUserData = {
      ...userData,
      claimedAirdrops: (userData.claimedAirdrops || 0) + 1,
      totalValue: (userData.totalValue || 0) + parseFloat(airdrop.totalValue.replace(/[^0-9.]/g, ''))
    };

    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    window.open(airdrop.joinLink, '_blank');

    toast({
      title: "Airdrop Claimed!",
      description: "The airdrop has been added to your profile.",
    });
  };

  return (
    <>
    <Card className="h-[280px] w-[300px] overflow-hidden border-primary/20 card-gradient hover:bg-black/70 transition-colors flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 p-4 h-[72px]">
        <Avatar className="h-12 w-12 shrink-0 ring-2 ring-primary/20">
          {airdrop.icon ? (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/20 text-primary">
              <airdrop.icon size={24} />
            </div>
          ) : (
            <>
              <AvatarImage src={airdrop.logo} alt={airdrop.name} />
              <AvatarFallback>{airdrop.name[0]}</AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{airdrop.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{airdrop.reward}</p>
        </div>
        {airdrop.isFeatured && (
          <Badge variant="secondary" className="bg-primary/20 text-primary shrink-0">
            Featured
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{airdrop.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-sm font-medium truncate">{airdrop.totalValue}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Platform</p>
            <p className="text-sm font-medium truncate">{airdrop.platform}</p>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-muted-foreground">
            Deadline: {format(new Date(airdrop.deadline), "MMM d, yyyy")}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2 h-[60px]">
        <Dialog open={isStepsOpen} onOpenChange={setIsStepsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex-1 bg-black/20">
              View More
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>How to Participate</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {airdrop.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2">
          <ShareButton 
            title={airdrop.name}
            description={airdrop.description}
            url={airdrop.joinLink}
          />
          <Button 
            className="bg-primary/20 hover:bg-primary/30"
            onClick={handleJoin}
          >
            Join <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
    </>
  );
};

export default AirdropCard;