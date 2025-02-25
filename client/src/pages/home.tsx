import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AirdropCard from "@/components/airdrop-card";
import AirdropCarousel from "@/components/airdrop-carousel";
import CryptoPriceTracker from "@/components/crypto-price-tracker";
import Logo from "@/components/logo";
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
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search airdrops..."
                className="pl-9 bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Logo className="ml-4" />
          </div>

          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="featured" className="flex-1">Featured</TabsTrigger>
              <TabsTrigger value="confirmed" className="flex-1">Confirmed</TabsTrigger>
              <TabsTrigger value="unconfirmed" className="flex-1">Unconfirmed</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[280px] w-[300px] rounded-lg" />
                  ))}
                </div>
              ) : (
                <>
                  <TabsContent value="featured">
                    {featuredAirdrops && featuredAirdrops.length > 0 && (
                      <AirdropCarousel>
                        {featuredAirdrops.map((airdrop) => (
                          <div key={airdrop.id} className="flex-[0_0_300px] px-2">
                            <AirdropCard airdrop={airdrop} />
                          </div>
                        ))}
                      </AirdropCarousel>
                    )}
                  </TabsContent>

                  <TabsContent value="confirmed">
                    {confirmedAirdrops && confirmedAirdrops.length > 0 && (
                      <AirdropCarousel>
                        {confirmedAirdrops.map((airdrop) => (
                          <div key={airdrop.id} className="flex-[0_0_300px] px-2">
                            <AirdropCard airdrop={airdrop} />
                          </div>
                        ))}
                      </AirdropCarousel>
                    )}
                  </TabsContent>

                  <TabsContent value="unconfirmed">
                    {unconfirmedAirdrops && unconfirmedAirdrops.length > 0 && (
                      <AirdropCarousel>
                        {unconfirmedAirdrops.map((airdrop) => (
                          <div key={airdrop.id} className="flex-[0_0_300px] px-2">
                            <AirdropCard airdrop={airdrop} />
                          </div>
                        ))}
                      </AirdropCarousel>
                    )}
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Fixed bottom section containing both Ad and Crypto */}
      <div className="fixed bottom-[80px] left-0 right-0 bg-gradient-to-t from-background via-background to-transparent">
        {/* Ad Space */}
        <div className="max-w-4xl mx-auto">
          <div className="h-[100px] flex items-center justify-center">
            <div className="bg-black/20 w-full max-w-[320px] h-[50px] rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              Ad Space
            </div>
          </div>
        </div>

        {/* Crypto Price Tracker */}
        <div className="mt-4">
          <CryptoPriceTracker />
        </div>
      </div>
    </div>
  );
};

export default Home;