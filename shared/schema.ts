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
  provider: text("provider", { enum: ["cerebras", "huggingface", "mock"] }).notNull(),
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

// Preset Collections for templates
export const presetCollections = pgTable("preset_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Templates table for premium templates
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(), // Tech Founder, Photographer, etc.
  collectionId: varchar("collection_id").references(() => presetCollections.id),
  
  // Canvas data for front and back
  front: jsonb("front").notNull(), // Fabric.js compatible JSON
  back: jsonb("back"), // Optional back side
  
  // Preview and assets
  thumbnailUrl: text("thumbnail_url").notNull(),
  previewUrls: jsonb("preview_urls"), // {front: url, back: url, animated: url}
  
  // Export hints for quality
  exportHints: jsonb("export_hints"), // {recommendedDPI, vectorPreferred, safeArea}
  
  // Metadata
  source: text("source", { enum: ["generated", "manual", "mock"] }).default("generated"),
  tags: text("tags").array(),
  isPremium: boolean("is_premium").default(false),
  
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// AI Generation Jobs for queue
export const aiJobs = pgTable("ai_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Job details
  promptText: text("prompt_text").notNull(),
  style: text("style", { enum: ["luxury", "minimal", "bold", "creative", "modern", "classic"] }).notNull(),
  targetFormatHints: jsonb("target_format_hints"), // {preferredDPI, vectorPreferred, canvasSize}
  
  // Job status
  status: text("status", { enum: ["queued", "processing", "completed", "failed"] }).default("queued"),
  progress: integer("progress").default(0), // 0-100
  
  // Results
  templateId: varchar("template_id").references(() => templates.id),
  previewUrl: text("preview_url"),
  errorMessage: text("error_message"),
  
  // Metadata
  provider: text("provider", { enum: ["cerebras", "huggingface", "mock"] }),
  estimatedSeconds: integer("estimated_seconds").default(6),
  
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertPresetCollectionSchema = createInsertSchema(presetCollections).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiJobSchema = createInsertSchema(aiJobs).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Inferred types
export type PresetCollection = typeof presetCollections.$inferSelect;
export type InsertPresetCollection = z.infer<typeof insertPresetCollectionSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type AiJob = typeof aiJobs.$inferSelect;
export type InsertAiJob = z.infer<typeof insertAiJobSchema>;

// Template element type for Fabric.js compatibility
export interface TemplateElement {
  type: "text" | "image" | "rect" | "circle" | "path" | "group";
  id: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  rotation?: number;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    shadow?: string;
  };
  content?: string; // For text elements
  src?: string; // For image elements
  svgPath?: string; // For vector icons
}

export interface TemplateCanvas {
  width: number;
  height: number;
  dpi: number;
  backgroundColor?: string;
  elements: TemplateElement[];
}

export interface ExportHints {
  recommendedDPI: number;
  vectorPreferred: boolean;
  safeArea?: { top: number; right: number; bottom: number; left: number };
  bleedMarks?: boolean;
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