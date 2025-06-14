import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cache } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { user, session as sessionTable } from "@/db/schema";
import type { User } from "./user";
import { v4 as uuidv4 } from "uuid";

interface Session {
  id: string;
  expiresAt: Date;
  userId: string; // Changed to string to match UUID type
}

type SessionValidationResult = 
  | { session: Session; user: User } 
  | { session: null; user: null };

export async function validateSessionId(id: string): Promise<SessionValidationResult> {
  const now = Math.floor(Date.now() / 1000);
  
  const sessionResult = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, id))
    .limit(1);

  if (sessionResult.length === 0) {
    return { session: null, user: null };
  }
  
  const sessionData = sessionResult[0];
  const expiresAt = new Date(sessionData.expiresAt * 1000);
  
  if (Date.now() >= expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, id)); 
    return { session: null, user: null };
  }
  
  const userResult = await db
    .select()
    .from(user)
    .where(eq(user.id, sessionData.userId))
    .limit(1);
  
  if (userResult.length === 0) {
    await db.delete(sessionTable).where(eq(sessionTable.id, id)); 
    return { session: null, user: null };
  }
  
  return {
    session: { id, userId: sessionData.userId, expiresAt },
    user: { id: userResult[0].id, email: userResult[0].email, username: userResult[0].username, githubId: userResult[0].githubId }
  };
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return { session: null, user: null };
  }
  
  return validateSessionId(sessionId);
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db
    .delete(sessionTable)
    .where(eq(sessionTable.id, sessionId));
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  await db
    .delete(sessionTable)
    .where(eq(sessionTable.userId, userId));
}

export async function setSessionIdCookie(id: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: id,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires: expiresAt.getTime()
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0
  });
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  return encodeBase32(tokenBytes).toLowerCase();
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const expiresAtUnix = Math.floor(expiresAt.getTime() / 1000);
  
  await db.insert(sessionTable).values({
    id: sessionId,
    userId,
    expiresAt: expiresAtUnix
  });

  return {
    id: sessionId,
    userId,
    expiresAt
  };
}
