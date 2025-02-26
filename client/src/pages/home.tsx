import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AirdropCard from "@/components/airdrop-card";
import AirdropCarousel from "@/components/airdrop-carousel";
import CryptoPriceTracker from "@/components/crypto-price-tracker";
import { ErrorBoundary } from "@/components/error-boundary";
import Logo from "@/components/logo";
import type { Airdrop } from "@shared/schema";

const Home = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  // Check if user is logged in
  const userData = localStorage.getItem('userData');
  if (!userData) {
    window.location.href = "/";
    return null;
  }

  const { data: airdrops, isLoading, error } = useQuery<Airdrop[]>({
    queryKey: ["/api/airdrops"],
    queryFn: () => {
      // Static airdrop data for testing
      return [
        {
          id: 1,
          name: "Sonus Exchange",
          description: "Participate in the Sonus Exchange airdrop by providing liquidity in eligible pools and staking LP tokens. Earn points during Phase 2 to claim your veSONUS positions.",
          logo: "/attached_assets/IMG_7606.png",
          reward: "SONUS Tokens",
          totalValue: "200M SONUS",
          platform: "Soneium",
          status: "confirmed",
          isFeatured: true,
          joinLink: "https://sonus.exchange",
          deadline: new Date("2024-12-31"),
          steps: [
            "Create a Wallet: Set up a compatible wallet (like MetaMask)",
            "Connect to Soneium Mainnet and ensure you have ETH",
            "Visit Sonus Exchange through Soneium website",
            "Connect Your Wallet to Sonus Exchange",
            "Provide Liquidity in eligible pools (ETH-USDC, USDC-USDT, etc.)",
            "Stake Your LP Positions to maximize points",
            "Monitor Your Points on Sonus dashboard",
            "Maintain Position during Phase 2 period",
            "Claim veSONUS positions after TGE"
          ]
        },
        {
          id: 2,
          name: "Ethereal Season Zero",
          description: "Participate in Ethereal's Season Zero campaign to earn rewards and points by depositing USDe tokens. Earn additional rewards through referrals and optional boosting opportunities.",
          logo: "", // Will be filled with logo URL
          reward: "Points & Rewards",
          totalValue: "$500",
          platform: "Ethereum",
          status: "confirmed",
          isFeatured: false,
          joinLink: "https://deposit.ethereal.trade/points?ref=BMGTIU",
          deadline: new Date("2025-05-29"),
          steps: [
            "Acquire USDe Tokens from Binance",
            "Visit Ethereal Platform and connect Web3 wallet",
            "Make USDe deposit on the deposit page",
            "Confirm transaction to receive eUSDe tokens",
            "Generate and share referral link for 10% rewards",
            "Optional: Deposit in eUSDe Pendle pool for 1.6x points"
          ]
        }
      ];
    },
    retry: 3,
    retryDelay: 5000
  });

  const filteredAirdrops = airdrops?.filter((airdrop: Airdrop) =>
    airdrop.name.toLowerCase().includes(search.toLowerCase())
  );

  const featuredAirdrops = filteredAirdrops?.filter((a: Airdrop) => a.isFeatured);
  const confirmedAirdrops = filteredAirdrops?.filter((a: Airdrop) => a.status === "confirmed");
  const unconfirmedAirdrops = filteredAirdrops?.filter((a: Airdrop) => a.status === "unconfirmed");

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load airdrops</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  const handleViewMore = () => {
    toast({
      title: "Coming Soon",
      description: "Full airdrop listing will be available in the next update!",
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="border-b border-border bg-background/80 backdrop-blur-sm p-4">
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
                      <AirdropCarousel onViewMore={handleViewMore}>
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
                      <AirdropCarousel onViewMore={handleViewMore}>
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
                      <AirdropCarousel onViewMore={handleViewMore}>
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

        {/* Ad Space */}
        <div className="p-4">
          <div className="h-[100px] flex items-center justify-center mb-8">
            <div className="bg-black/20 w-full max-w-[320px] h-[50px] rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              Ad Space
            </div>
          </div>

          {/* Crypto Price Tracker wrapped in ErrorBoundary */}
          <ErrorBoundary>
            <div>
              <CryptoPriceTracker />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Home;