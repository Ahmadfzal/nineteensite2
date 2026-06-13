import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const adminTable = pgTable("admin", {
  id: serial("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Admin = typeof adminTable.$inferSelect;
