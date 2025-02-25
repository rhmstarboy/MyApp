import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import AirdropCard from "@/components/airdrop-card";
import type { Airdrop } from "@shared/schema";

const Home = () => {
  const [search, setSearch] = useState("");

  const { data: airdrops, isLoading } = useQuery<Airdrop[]>({
    queryKey: ["/api/airdrops"],
  });

  const filteredAirdrops = airdrops?.filter((airdrop) =>
    airdrop.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-md mx-auto p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search airdrops..."
              className="pl-9 bg-muted/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Featured Airdrops</h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                  ))
              : filteredAirdrops?.map((airdrop) => (
                  <AirdropCard key={airdrop.id} airdrop={airdrop} />
                ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Home;
