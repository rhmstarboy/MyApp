import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";
import { storage } from "./storage";
import type { InsertAirdrop } from "@shared/schema";
import { log } from "./vite";

export class AirdropScraper {
  private isRunning = false;
  private baseUrl = "https://airdrops.io";

  private async scrapeSection(url: string): Promise<InsertAirdrop[]> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const airdrops: InsertAirdrop[] = [];

      // Each airdrop is in an article element
      $("article.b-airdrop").each((_, element) => {
        const $el = $(element);
        const name = $el.find("h3.b-airdrop__title").text().trim();
        const description = $el.find(".b-airdrop__description").text().trim();
        const reward = $el.find(".b-airdrop__reward").text().trim() || "n/a";
        const platform = $el.find(".b-airdrop__network").text().trim().toLowerCase() || "eth";
        const totalValue = $el.find(".b-airdrop__value").text().trim() || "n/a";
        const joinLink = $el.find("a.b-airdrop__link").attr("href") || "#";

        // Get deadline if available
        const deadlineText = $el.find(".b-airdrop__end-date").text().trim();
        const deadline = deadlineText ? new Date(deadlineText) : new Date("2025-12-31");

        // Get requirements/steps
        const steps: string[] = [];
        $el.find(".b-airdrop__requirements li").each((_, step) => {
          steps.push($(step).text().trim());
        });

        // Only add if we have the minimum required fields
        if (name && description) {
          airdrops.push({
            name,
            description,
            reward,
            logo: $el.find(".b-airdrop__logo img").attr("src") || "https://via.placeholder.com/150",
            deadline,
            platform,
            totalValue,
            isFeatured: false,
            joinLink,
            status: url.includes("confirmed") ? "confirmed" : "unconfirmed",
            steps: steps.length > 0 ? steps : ["Connect Wallet", "Complete Tasks", "Claim Airdrop"],
          });
        }
      });

      return airdrops;
    } catch (error) {
      log(`Error scraping section ${url}: ${error}`, "scraper");
      return [];
    }
  }

  async scrapeAirdrops() {
    if (this.isRunning) {
      log("Scraper is already running", "scraper");
      return;
    }

    try {
      this.isRunning = true;
      log("Starting airdrop scrape", "scraper");

      // Scrape different sections
      const sections = [
        { url: `${this.baseUrl}/latest`, isFeatured: true },
        { url: `${this.baseUrl}/confirmed`, isFeatured: false },
        { url: `${this.baseUrl}/unconfirmed`, isFeatured: false },
      ];

      for (const section of sections) {
        const airdrops = await this.scrapeSection(section.url);

        // Mark latest airdrops as featured
        if (section.isFeatured) {
          airdrops.forEach(airdrop => {
            airdrop.isFeatured = true;
          });
        }

        // Add new airdrops to storage
        for (const airdrop of airdrops) {
          await storage.createAirdrop(airdrop);
        }

        log(`Successfully scraped ${airdrops.length} airdrops from ${section.url}`, "scraper");
      }
    } catch (error) {
      log(`Error during scraping: ${error}`, "scraper");
    } finally {
      this.isRunning = false;
    }
  }

  startScheduledScraping(cronSchedule = "*/30 * * * *") { // Default: every 30 minutes
    cron.schedule(cronSchedule, () => {
      this.scrapeAirdrops();
    });

    // Run initial scrape
    this.scrapeAirdrops();

    log(`Scheduled scraping started with schedule: ${cronSchedule}`, "scraper");
  }
}

export const airdropScraper = new AirdropScraper();