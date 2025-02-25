import type { Airdrop } from "@shared/schema";

export const sampleAirdrops: Airdrop[] = [
  {
    id: 1,
    name: "Jupiter Protocol",
    description: "Join the Jupiter Protocol airdrop and earn tokens for being an early supporter of the next-gen DeFi platform.",
    reward: "Up to 1000 JUP",
    totalValue: "$1000",
    logo: "https://cryptologos.cc/logos/jupiter-jup-logo.png",
    platform: "Solana",
    deadline: "2025-04-01",
    joinLink: "https://jupiter.io",
    isFeatured: true,
    steps: [
      "Connect your wallet",
      "Complete social tasks",
      "Trade on testnet",
      "Hold minimum SOL balance"
    ]
  },
  {
    id: 2,
    name: "LayerZero",
    description: "Participate in the LayerZero airdrop and get rewarded for supporting cross-chain interoperability.",
    reward: "Up to 2000 ZRO",
    totalValue: "$2000",
    logo: "https://cryptologos.cc/logos/layerzero-logo.png",
    platform: "Multi-chain",
    deadline: "2025-03-15",
    joinLink: "https://layerzero.network",
    isFeatured: true,
    steps: [
      "Bridge assets using LayerZero",
      "Join Discord community",
      "Follow on Twitter",
      "Complete testnet transactions"
    ]
  },
  {
    id: 3,
    name: "Celestia",
    description: "Get early access to Celestia tokens by participating in the network's testnet and community activities.",
    reward: "Up to 500 TIA",
    totalValue: "$750",
    logo: "https://cryptologos.cc/logos/celestia-logo.png",
    platform: "Celestia",
    deadline: "2025-03-30",
    joinLink: "https://celestia.org",
    isFeatured: false,
    steps: [
      "Run a Celestia node",
      "Participate in testnet",
      "Complete community tasks",
      "Hold minimum stake"
    ]
  }
];
