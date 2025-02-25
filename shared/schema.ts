import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const airdrops = pgTable("airdrops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  description: text("description").notNull(),
  deadline: timestamp("deadline").notNull(),
  reward: text("reward").notNull(),
  isFeatured: boolean("is_featured").default(false),
  platform: text("platform").notNull(),
  totalValue: text("total_value").notNull(),
  joinLink: text("join_link").notNull(),
  steps: text("steps").array().notNull(),
});

export const claimedAirdrops = pgTable("claimed_airdrops", {
  id: serial("id").primaryKey(),
  airdropId: serial("airdrop_id").references(() => airdrops.id),
  status: text("status").notNull(),
  claimedAt: timestamp("claimed_at").defaultNow(),
});

export const insertAirdropSchema = createInsertSchema(airdrops).omit({ id: true });
export const insertClaimedAirdropSchema = createInsertSchema(claimedAirdrops).omit({ id: true });

export type Airdrop = typeof airdrops.$inferSelect;
export type InsertAirdrop = z.infer<typeof insertAirdropSchema>;
export type ClaimedAirdrop = typeof claimedAirdrops.$inferSelect;
export type InsertClaimedAirdrop = z.infer<typeof insertClaimedAirdropSchema>;