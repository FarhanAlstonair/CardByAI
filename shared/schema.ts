import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with Google OAuth integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  googleId: text("google_id").unique(),
  avatar: text("avatar"), // Profile picture URL from Google
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastLogin: timestamp("last_login"),
});

// Business Cards table
export const businessCards = pgTable("business_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  
  // AI Generation data
  prompt: text("prompt"), // Original AI prompt
  aiStyle: text("ai_style", { enum: ["modern", "classic", "minimal", "creative"] }),
  aiGeneratedText: text("ai_generated_text"), // Raw AI-generated content
  
  // Card content
  name: text("name"),
  jobTitle: text("job_title"),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  
  // Design properties
  backgroundColor: text("background_color").default("#ffffff"),
  textColor: text("text_color").default("#000000"),
  accentColor: text("accent_color").default("#3b82f6"),
  fontFamily: text("font_family").default("Inter"),
  layout: text("layout", { enum: ["standard", "modern", "minimal", "creative"] }).default("standard"),
  
  // Canvas/editor data
  elements: jsonb("elements"), // Store positioned elements for drag-and-drop editor
  
  // Image storage
  thumbnailUrl: text("thumbnail_url"), // Small preview
  imageUrl: text("image_url"), // Full resolution export
  
  // Metadata
  isPublic: boolean("is_public").default(false),
  tags: text("tags").array(), // Array of tags for categorization
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// AI Usage tracking for admin analytics
export const aiUsage = pgTable("ai_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cardId: varchar("card_id").references(() => businessCards.id),
  provider: text("provider", { enum: ["cerebras", "huggingface"] }).notNull(),
  prompt: text("prompt").notNull(),
  tokensUsed: integer("tokens_used"),
  responseTime: integer("response_time"), // in milliseconds
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertBusinessCardSchema = createInsertSchema(businessCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Add custom validation rules
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

export const insertAiUsageSchema = createInsertSchema(aiUsage).omit({
  id: true,
  createdAt: true,
});

// Inferred types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBusinessCard = z.infer<typeof insertBusinessCardSchema>;
export type BusinessCard = typeof businessCards.$inferSelect;

export type InsertAiUsage = z.infer<typeof insertAiUsageSchema>;
export type AiUsage = typeof aiUsage.$inferSelect;

// Card element type for drag-and-drop editor
export interface CardElement {
  id: string;
  type: "text" | "image" | "shape" | "icon";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
}

// AI Generation request/response types
export interface AiGenerationRequest {
  prompt: string;
  style: "modern" | "classic" | "minimal" | "creative";
  color?: string;
  layout?: string;
  industry?: string;
}

export interface AiGenerationResponse {
  text: string;
  suggestedName?: string;
  suggestedJobTitle?: string;
  suggestedCompany?: string;
  suggestedEmail?: string;
  suggestedPhone?: string;
  suggestedWebsite?: string;
  suggestedColors?: {
    background: string;
    text: string;
    accent: string;
  };
  generatedAt: string;
}

// Admin dashboard analytics types
export interface AdminStats {
  totalUsers: number;
  totalCards: number;
  totalAiGenerations: number;
  activeUsersToday: number;
  cardsCreatedToday: number;
  aiUsageToday: number;
  topUsedStyles: Array<{ style: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  aiProviderStats: Array<{ provider: string; usage: number; avgResponseTime: number }>;
}