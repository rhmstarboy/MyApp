import { type Airdrop, type InsertAirdrop, type ClaimedAirdrop, type InsertClaimedAirdrop } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  type User, type InsertUser,
  type Comment, type InsertComment,
  type CommentLike, type InsertCommentLike,
  users, comments, commentLikes
} from "@shared/schema";

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
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Comment methods
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
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