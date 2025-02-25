import { type Airdrop, type InsertAirdrop, type ClaimedAirdrop, type InsertClaimedAirdrop } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Airdrop methods
  getAirdrops(): Promise<Airdrop[]>;
  getAirdrop(id: number): Promise<Airdrop | undefined>;
  createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop>;

  // Claimed airdrop methods
  getClaimedAirdrops(): Promise<ClaimedAirdrop[]>;
  createClaimedAirdrop(claimed: InsertClaimedAirdrop): Promise<ClaimedAirdrop>;

  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private airdrops: Map<number, Airdrop>;
  private claimedAirdrops: Map<number, ClaimedAirdrop>;
  private currentId: number;
  private currentAirdropId: number;
  private currentClaimedId: number;

  constructor() {
    this.users = new Map();
    this.airdrops = new Map();
    this.claimedAirdrops = new Map();
    this.currentId = 1;
    this.currentAirdropId = 1;
    this.currentClaimedId = 1;

    // Add some sample airdrops
    this.createAirdrop({
      name: "SpaceX Token",
      logo: "https://images.unsplash.com/photo-1641317139750-4a25ddc7e304",
      description: "Join the SpaceX community and get early access to token distribution",
      deadline: new Date("2025-03-25"),
      reward: "100 SXT",
      isFeatured: true
    });

    this.createAirdrop({
      name: "CryptoKitties NFT",
      logo: "https://images.unsplash.com/photo-1639815189096-f75717eaecfe",
      description: "Claim your exclusive CryptoKitties NFT",
      deadline: new Date("2025-04-01"),
      reward: "1 NFT",
      isFeatured: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAirdrops(): Promise<Airdrop[]> {
    return Array.from(this.airdrops.values());
  }

  async getAirdrop(id: number): Promise<Airdrop | undefined> {
    return this.airdrops.get(id);
  }

  async createAirdrop(insertAirdrop: InsertAirdrop): Promise<Airdrop> {
    const id = this.currentAirdropId++;
    const airdrop: Airdrop = { ...insertAirdrop, id };
    this.airdrops.set(id, airdrop);
    return airdrop;
  }

  async getClaimedAirdrops(): Promise<ClaimedAirdrop[]> {
    return Array.from(this.claimedAirdrops.values());
  }

  async createClaimedAirdrop(insertClaimed: InsertClaimedAirdrop): Promise<ClaimedAirdrop> {
    const id = this.currentClaimedId++;
    const claimed: ClaimedAirdrop = { ...insertClaimed, id };
    this.claimedAirdrops.set(id, claimed);
    return claimed;
  }
}

export const storage = new MemStorage();