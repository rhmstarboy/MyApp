import { randomBytes } from "crypto";
import { db } from "../db";
import { verificationTokens } from "@shared/schema";
import { eq, and, lt } from "drizzle-orm";
import { sendVerificationEmail } from "./email";

export async function generateOTP(email: string): Promise<string> {
  // Generate a 6-digit OTP
  const otp = randomBytes(3).toString("hex").toUpperCase();
  
  // Set expiration to 10 minutes from now
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10);

  // Delete any existing tokens for this email
  await db.delete(verificationTokens)
    .where(eq(verificationTokens.email, email));

  // Store the new token
  await db.insert(verificationTokens).values({
    email,
    token: otp,
    expires,
  });

  // Send the verification email
  const emailSent = await sendVerificationEmail(email, otp);
  if (!emailSent) {
    throw new Error("Failed to send verification email");
  }

  return otp;
}

export async function verifyOTP(email: string, token: string): Promise<boolean> {
  const now = new Date();

  // Find the token
  const [storedToken] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.email, email),
        eq(verificationTokens.token, token),
        lt(now, verificationTokens.expires)
      )
    );

  if (!storedToken) {
    return false;
  }

  // Delete the used token
  await db.delete(verificationTokens)
    .where(eq(verificationTokens.id, storedToken.id));

  // Mark the user as verified
  await db.update(users)
    .set({ isVerified: true })
    .where(eq(users.email, email));

  return true;
}
