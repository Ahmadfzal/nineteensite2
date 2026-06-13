import { pgTable, serial, text, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 15, scale: 2 }).notNull(),
  discount: integer("discount"),
  description: text("description").notNull(),
  categoryId: integer("category_id"),
  images: text("images").array().notNull().default([]),
  features: text("features").array().notNull().default([]),
  status: text("status").notNull().default("active"),
  whatsappNumber: text("whatsapp_number").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
