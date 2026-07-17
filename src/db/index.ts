import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";
import { config } from "../config.js";
import { createClient } from "@libsql/client";

let conn = undefined;

if (config.db.url) {
  const client = createClient({
    url: config.db.url,
  });
  await client.execute("PRAGMA foreign_keys = ON;");
  conn = drizzle(client, {
    schema: schema,
  });
  console.log("Connected to database");
} else {
  console.log("Database URL is not set");
}

export const db = conn;

export function assertDbConnection() {
  if (!db) {
    throw new Error("Database connection is not available");
  }
}
