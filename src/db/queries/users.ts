import { eq } from "drizzle-orm";
import { assertDbConnection, db } from "../index.js";
import { type NewUser, usersTable } from "../schema.js";

export async function createUser(user: NewUser) {
  assertDbConnection();
  const rows = await db!.insert(usersTable).values(user).returning();
  if (rows.length === 0) {
    throw new Error("Failed to create user");
  }

  return rows[0];
}

export async function findUserByEmail(email: string) {
  assertDbConnection();
  const rows = await db!
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return rows[0];
}

export async function findUserbyId(id: string) {
  assertDbConnection();
  const rows = await db!.select().from(usersTable).where(eq(usersTable.id, id));
  if (rows.length === 0) {
    throw new Error("User not found!");
  }

  return rows[0];
}
