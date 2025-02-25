import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all airdrops
  app.get("/api/airdrops", async (_req, res) => {
    try {
      const airdrops = await storage.getAirdrops();
      res.json(airdrops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch airdrops" });
    }
  });

  // Get all claimed airdrops
  app.get("/api/claimed", async (_req, res) => {
    try {
      const claimed = await storage.getClaimedAirdrops();
      res.json(claimed);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claimed airdrops" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}