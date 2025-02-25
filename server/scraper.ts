import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";
import { storage } from "./storage";
import type { InsertAirdrop } from "@shared/schema";
import { log } from "./vite";

export class AirdropScraper {
  private isRunning = false;

  async scrapeAirdrops(url: string) {
    if (this.isRunning) {
      log("Scraper is already running", "scraper");
      return;
    }

    try {
      this.isRunning = true;
      log(`Starting scrape from ${url}`, "scraper");

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // This is a template scraping logic - adjust selectors based on the target website
      const airdrops: InsertAirdrop[] = [];

      // Example: Find all airdrop cards/sections
      $(".airdrop-card").each((_, element) => {
        const name = $(element).find(".name").text().trim();
        const description = $(element).find(".description").text().trim();
        const reward = $(element).find(".reward").text().trim();
        
        // Only add if we found required fields
        if (name && description && reward) {
          airdrops.push({
            name,
            description,
            reward,
            logo: $(element).find("img").attr("src") || "https://via.placeholder.com/150",
            deadline: new Date("2025-12-31"), // Adjust based on actual data
            platform: "eth", // Default, adjust based on actual data
            totalValue: "n/a",
            isFeatured: false,
            joinLink: $(element).find(".join-link").attr("href") || "#",
            status: "unconfirmed",
            steps: ["Connect Wallet", "Complete Tasks", "Claim Airdrop"], // Default steps
          });
        }
      });

      // Add new airdrops to storage
      for (const airdrop of airdrops) {
        await storage.createAirdrop(airdrop);
      }

      log(`Successfully scraped ${airdrops.length} airdrops`, "scraper");
    } catch (error) {
      log(`Error scraping airdrops: ${error}`, "scraper");
    } finally {
      this.isRunning = false;
    }
  }

  startScheduledScraping(url: string, cronSchedule = "*/30 * * * *") { // Default: every 30 minutes
    cron.schedule(cronSchedule, () => {
      this.scrapeAirdrops(url);
    });
    
    // Run initial scrape
    this.scrapeAirdrops(url);
    
    log(`Scheduled scraping started with schedule: ${cronSchedule}`, "scraper");
  }
}

export const airdropScraper = new AirdropScraper();
