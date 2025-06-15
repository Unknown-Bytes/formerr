import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { user as userTable } from "@/db/schema";

export interface User {
  id: string;
  email: string;
  githubId: number;
  username: string;
  name: string;
}

export async function createUser(githubId: number, email: string, username: string, name: string): Promise<User> {
  try {
    const [newUser] = await db
      .insert(userTable)
      .values({
        githubId,
        email,
        username,
        name
      })
      .returning();

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return {
      id: newUser.id,
      githubId: newUser.githubId,
      email: newUser.email,
      username: newUser.username,
      name: newUser.name
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error("Failed to create user");
  }
}

export async function getUserFromGitHubId(githubId: number): Promise<User | null> {
  try {
    const [userData] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.githubId, githubId))
      .limit(1);

    if (!userData) {
      return null;
    }

    return {
      id: userData.id,
      githubId: userData.githubId,
      email: userData.email,
      username: userData.username,
      name: userData.name
    };
  } catch (error) {
    console.error('Error getting user by GitHub ID:', error);
    return null;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const [userData] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!userData) {
      return null;
    }

    return {
      id: userData.id,
      githubId: userData.githubId,
      email: userData.email,
      username: userData.username,
      name: userData.name
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}
