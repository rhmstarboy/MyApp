import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AirdropCard from "@/components/airdrop-card";
import AirdropCarousel from "@/components/airdrop-carousel";
import type { Airdrop } from "@shared/schema";

const Home = () => {
  const [search, setSearch] = useState("");

  const { data: airdrops, isLoading } = useQuery<Airdrop[]>({
    queryKey: ["/api/airdrops"],
  });

  const filteredAirdrops = airdrops?.filter((airdrop) =>
    airdrop.name.toLowerCase().includes(search.toLowerCase())
  );

  const featuredAirdrops = filteredAirdrops?.filter((a) => a.isFeatured);
  const confirmedAirdrops = filteredAirdrops?.filter((a) => a.status === "confirmed");
  const unconfirmedAirdrops = filteredAirdrops?.filter((a) => a.status === "unconfirmed");

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

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {featuredAirdrops && featuredAirdrops.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Featured Airdrops</h2>
                <AirdropCarousel>
                  {featuredAirdrops.map((airdrop) => (
                    <div key={airdrop.id} className="flex-[0_0_300px]">
                      <AirdropCard airdrop={airdrop} />
                    </div>
                  ))}
                </AirdropCarousel>
              </section>
            )}

            {confirmedAirdrops && confirmedAirdrops.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Confirmed Airdrops</h2>
                <AirdropCarousel>
                  {confirmedAirdrops.map((airdrop) => (
                    <div key={airdrop.id} className="flex-[0_0_300px]">
                      <AirdropCard airdrop={airdrop} />
                    </div>
                  ))}
                </AirdropCarousel>
              </section>
            )}

            {unconfirmedAirdrops && unconfirmedAirdrops.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Unconfirmed Airdrops</h2>
                <AirdropCarousel>
                  {unconfirmedAirdrops.map((airdrop) => (
                    <div key={airdrop.id} className="flex-[0_0_300px]">
                      <AirdropCard airdrop={airdrop} />
                    </div>
                  ))}
                </AirdropCarousel>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;