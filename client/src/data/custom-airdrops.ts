
import type { Airdrop } from "@shared/schema";

export const customAirdrops: Airdrop[] = [
  {
    id: "custom-sunder",
    name: "Sunder Protocol",
    description: "Participate in the Sunder Protocol airdrop and maximize your chances of receiving SUNDER tokens.",
    reward: "SUNDER Tokens",
    logo: "https://pbs.twimg.com/profile_images/1768614683506520064/vS1adZT4_400x400.jpg",
    deadline: new Date(2024, 12, 31).toISOString(),
    platform: "HyperLiquid",
    totalValue: "$100M",
    isFeatured: false,
    joinLink: "https://www.sunder.finance/swap",
    status: "confirmed",
    steps: [
      "Visit Sunder Protocol website and connect your wallet",
      "Acquire HYPE tokens from Hyperliquid",
      "Transfer HYPE to HyperEVM",
      "Swap HYPE to WHYPE and/or SUNDER",
      "Provide liquidity to the WHYPE/SUNDER pool",
      "Lock SUNDER tokens to create a veSUNDER position",
      "Participate in governance voting"
    ]
  },
  {
    id: "custom-sedra",
    name: "SedraCoin",
    description: "Join the SedraCoin airdrop campaign and maximize your chances of receiving SDR tokens.",
    reward: "SDR Tokens",
    logo: "https://pbs.twimg.com/profile_images/1722232220839260160/Jyd-2hQ1_400x400.jpg",
    deadline: new Date(2024, 12, 31).toISOString(),
    platform: "OwnChain",
    totalValue: "$100M",
    isFeatured: false,
    joinLink: "https://zealy.io/cw/sedracoin/questboard",
    status: "confirmed",
    steps: [
      "Create a Zealy Account",
      "Join the SedraCoin Campaign",
      "Connect Your Social Media Accounts",
      "Complete Social Tasks",
      "Earn XP Points",
      "Verify Task Completion",
      "Monitor Your Progress",
      "Stay Active"
    ]
  },
  {
    id: "custom-lisk",
    name: "Lisk",
    description: "Participate in the Lisk Airdrop by meeting eligibility criteria and completing verification steps.",
    reward: "LSK Tokens",
    logo: "https://pbs.twimg.com/profile_images/1724751071284981760/XYmFoSGg_400x400.jpg",
    deadline: new Date(2024, 12, 31).toISOString(),
    platform: "OwnChain",
    totalValue: "$100M",
    isFeatured: true,
    joinLink: "https://portal.lisk.com/airdrop",
    status: "confirmed",
    steps: [
      "Visit the official Lisk Airdrop portal",
      "Connect Your EVM-compatible wallet",
      "Add Lisk Mainnet to your wallet",
      "Complete Guild Verification",
      "Enter Referral Code 'QiOjwC' if needed",
      "Complete required verification steps",
      "Wait for token distribution"
    ]
  },
];
