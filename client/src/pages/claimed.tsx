import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import AirdropCard from "@/components/airdrop-card";
import type { ClaimedAirdrop } from "@shared/schema";

const Claimed = () => {
  const { data: claimed, isLoading } = useQuery<ClaimedAirdrop[]>({
    queryKey: ["/api/claimed"],
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold">Claimed Airdrops</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className="space-y-4">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                  ))
              : claimed?.map((claim) => (
                  <div key={claim.id} className="relative">
                    <AirdropCard airdrop={claim as any} />
                    <div className="absolute top-2 right-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                      {claim.status}
                    </div>
                  </div>
                ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Claimed;
