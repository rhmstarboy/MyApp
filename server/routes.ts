import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all comments
  app.get("/api/comments", async (_req, res) => {
    try {
      const comments = await storage.getComments();
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Create a new comment
  app.post("/api/comments", async (req, res) => {
    try {
      const parsedComment = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(parsedComment);
      res.json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Like a comment
  app.post("/api/comments/:id/like", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const userId = 1; // This will be replaced with actual user ID once auth is implemented
      const like = await storage.likeComment({ userId, commentId });
      res.json(like);
    } catch (error) {
      console.error('Error liking comment:', error);
      res.status(500).json({ message: "Failed to like comment" });
    }
  });

  // Unlike a comment
  app.post("/api/comments/:id/unlike", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const userId = 1; // This will be replaced with actual user ID once auth is implemented
      await storage.unlikeComment(userId, commentId);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error unliking comment:', error);
      res.status(500).json({ message: "Failed to unlike comment" });
    }
  });

  // Keep existing routes
  app.get("/api/airdrops", async (_req, res) => {
    try {
      const airdrops = await storage.getAirdrops();
      res.json(airdrops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch airdrops" });
    }
  });

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