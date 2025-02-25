import { type Airdrop, type InsertAirdrop, type ClaimedAirdrop, type InsertClaimedAirdrop } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  type User, type InsertUser,
  type Comment, type InsertComment,
  type CommentLike, type InsertCommentLike,
  users, comments, commentLikes
} from "@shared/schema";
import { moderateContent } from "./services/moderation";

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Comment methods
  createComment(comment: InsertComment): Promise<Comment>;
  getComment(id: number): Promise<Comment | undefined>;
  getComments(parentId?: number): Promise<Comment[]>;
  likeComment(like: InsertCommentLike): Promise<CommentLike>;
  unlikeComment(userId: number, commentId: number): Promise<void>;
  updateCommentModeration(commentId: number, status: string, flags: string[]): Promise<void>;

  // Keep existing methods
  getAirdrops(): Promise<Airdrop[]>;
  getAirdrop(id: number): Promise<Airdrop | undefined>;
  createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop>;
  getClaimedAirdrops(): Promise<ClaimedAirdrop[]>;
  createClaimedAirdrop(claimed: InsertClaimedAirdrop): Promise<ClaimedAirdrop>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log("Creating user:", insertUser.username);
      const [user] = await db.insert(users).values(insertUser).returning();
      console.log("User created successfully:", user.id);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      console.log("Fetching user by ID:", id);
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      console.log("Fetching user by username:", username);
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      console.log("Fetching user by email:", email);
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  // Comment methods
  async createComment(insertComment: InsertComment): Promise<Comment> {
    // First create the comment with pending moderation status
    const [comment] = await db.insert(comments)
      .values({
        ...insertComment,
        moderationStatus: 'pending',
        moderationFlags: []
      })
      .returning();

    // Start moderation in the background
    this.moderateComment(comment.id, comment.content).catch(console.error);

    return comment;
  }

  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment;
  }

  async getComments(parentId?: number): Promise<Comment[]> {
    return db.select()
      .from(comments)
      .where(parentId ? eq(comments.parentId, parentId) : eq(comments.parentId, null))
      .orderBy(comments.createdAt);
  }

  async likeComment(insertLike: InsertCommentLike): Promise<CommentLike> {
    const [like] = await db.insert(commentLikes).values(insertLike).returning();
    await db
      .update(comments)
      .set({ likes: comments.likes + 1 })
      .where(eq(comments.id, insertLike.commentId));
    return like;
  }

  async unlikeComment(userId: number, commentId: number): Promise<void> {
    await db
      .delete(commentLikes)
      .where(
        eq(commentLikes.userId, userId) &&
        eq(commentLikes.commentId, commentId)
      );
    await db
      .update(comments)
      .set({ likes: comments.likes - 1 })
      .where(eq(comments.id, commentId));
  }

  private async moderateComment(commentId: number, content: string): Promise<void> {
    try {
      console.log(`Starting moderation for comment ${commentId}`);
      const result = await moderateContent(content);
      console.log(`Moderation result for comment ${commentId}:`, result);
      await this.updateCommentModeration(commentId, result.status, result.flags);
    } catch (error) {
      console.error(`Error moderating comment ${commentId}:`, error);
      // If moderation fails, mark as flagged for manual review
      await this.updateCommentModeration(commentId, 'flagged', ['moderation_error']);
    }
  }

  async updateCommentModeration(commentId: number, status: string, flags: string[]): Promise<void> {
    try {
      await db.update(comments)
        .set({ 
          moderationStatus: status,
          moderationFlags: flags
        })
        .where(eq(comments.id, commentId));
      console.log(`Updated moderation status for comment ${commentId} to ${status}`);
    } catch (error) {
      console.error(`Error updating moderation status for comment ${commentId}:`, error);
      throw error;
    }
  }

  // Keep existing methods
  async getAirdrops(): Promise<Airdrop[]> {
    throw new Error("Method not implemented.");
  }
  async getAirdrop(id: number): Promise<Airdrop | undefined> {
    throw new Error("Method not implemented.");
  }
  async createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop> {
    throw new Error("Method not implemented.");
  }
  async getClaimedAirdrops(): Promise<ClaimedAirdrop[]> {
    throw new Error("Method not implemented.");
  }
  async createClaimedAirdrop(claimed: InsertClaimedAirdrop): Promise<ClaimedAirdrop> {
    throw new Error("Method not implemented.");
  }
}

export const storage = new DatabaseStorage();