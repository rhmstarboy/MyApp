import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Airdrop } from "@shared/schema";

interface AirdropCardProps {
  airdrop: Airdrop;
}

const AirdropCard = ({ airdrop }: AirdropCardProps) => {
  return (
    <Card className="overflow-hidden border-border/50 bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={airdrop.logo} alt={airdrop.name} />
          <AvatarFallback>{airdrop.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{airdrop.name}</h3>
          <p className="text-sm text-muted-foreground">{airdrop.reward}</p>
        </div>
        {airdrop.isFeatured && (
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            Featured
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-2">{airdrop.description}</p>
        <p className="text-xs text-muted-foreground">
          Deadline: {format(new Date(airdrop.deadline), "MMM d, yyyy")}
        </p>
      </CardContent>
    </Card>
  );
};

export default AirdropCard;
