import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";
import { config } from "../config.js";

let conn = undefined;

if (config.db.url) {
  conn = drizzle({
    connection: {
      url: config.db.url,
    },
    schema: schema,
  });
  console.log("Connected to database");
}
else {
  console.log("Database URL is not set");
}

export const db = conn;

export function assertDbConnection() {
  if (!db) {
    throw new Error("Database connection is not available");
  }
}
