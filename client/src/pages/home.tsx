import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AirdropCard from "@/components/airdrop-card";
import { ErrorBoundary } from "@/components/error-boundary";
import Logo from "@/components/logo";
import { sampleAirdrops } from "@/data/airdrops";
import type { Airdrop } from "@shared/schema";

// Import widgets
import CryptoMood from "@/components/crypto-mood";
import HotTrends from "@/components/hot-trends";
import NetworkHealth from "@/components/network-health";
import WhaleAlert from "@/components/whale-alert";
import SocialSentiment from "@/components/social-sentiment";
import FearAndGreed from "@/components/fear-and-greed";
import GlobalTrading from "@/components/global-trading";

const Home = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  // Check if user is logged in
  const userData = localStorage.getItem('userData');
  if (!userData) {
    window.location.href = "/";
    return null;
  }

  const filteredAirdrops = sampleAirdrops.filter((airdrop) =>
    airdrop.name.toLowerCase().includes(search.toLowerCase())
  );

  const featuredAirdrops = filteredAirdrops.filter((a) => a.isFeatured);
  const confirmedAirdrops = filteredAirdrops;
  const unconfirmedAirdrops = filteredAirdrops;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm p-4 border-b border-border z-50">
          <div className="flex items-center justify-between mb-4">
            <Logo className="mr-4" />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search airdrops..."
                className="pl-9 bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="w-full bg-primary/20 border-none">
              <TabsTrigger value="featured" className="flex-1">Featured</TabsTrigger>
              <TabsTrigger value="confirmed" className="flex-1">Confirmed</TabsTrigger>
              <TabsTrigger value="unconfirmed" className="flex-1">Unconfirmed</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <TabsContent value="featured">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredAirdrops.map((airdrop) => (
                      <AirdropCard key={airdrop.id} airdrop={airdrop} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="confirmed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {confirmedAirdrops.map((airdrop) => (
                      <AirdropCard key={airdrop.id} airdrop={airdrop} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="unconfirmed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unconfirmedAirdrops.map((airdrop) => (
                      <AirdropCard key={airdrop.id} airdrop={airdrop} />
                    ))}
                  </div>
                </TabsContent>
              </div>

              {/* Sidebar Widgets */}
              <div className="lg:col-span-4 space-y-6">
                <ErrorBoundary>
                  <CryptoMood />
                </ErrorBoundary>

                <ErrorBoundary>
                  <HotTrends />
                </ErrorBoundary>

                <ErrorBoundary>
                  <NetworkHealth />
                </ErrorBoundary>

                <ErrorBoundary>
                  <WhaleAlert />
                </ErrorBoundary>

                <ErrorBoundary>
                  <SocialSentiment />
                </ErrorBoundary>

                <ErrorBoundary>
                  <FearAndGreed />
                </ErrorBoundary>

                <ErrorBoundary>
                  <GlobalTrading />
                </ErrorBoundary>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Ad Space */}
        <div className="p-4">
          <div className="h-[100px] flex items-center justify-center mb-8">
            <div className="bg-black/20 w-full max-w-[320px] h-[50px] rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              Ad Space
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;