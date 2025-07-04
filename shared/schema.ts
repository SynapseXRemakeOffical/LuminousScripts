import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Users table for admin management
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  discordId: text("discord_id").unique().notNull(),
  username: text("username").notNull(),
  discriminator: text("discriminator").notNull(),
  avatar: text("avatar"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Games table
export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  popularity: integer("popularity").default(50).notNull(),
  image: text("image").notNull(),
  gameLink: text("game_link").notNull(),
  status: text("status").default("active").notNull(), // active, updating, maintenance
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Settings table
export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Key system providers table
export const keySystemProviders = pgTable("key_system_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  checkpoints: integer("checkpoints").default(2).notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertGameSchema = createInsertSchema(games);
export const selectGameSchema = createSelectSchema(games);

export const insertSettingSchema = createInsertSchema(settings);
export const selectSettingSchema = createSelectSchema(settings);

export const insertKeySystemProviderSchema = createInsertSchema(keySystemProviders);
export const selectKeySystemProviderSchema = createSelectSchema(keySystemProviders);