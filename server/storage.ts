import { 
  type User, type InsertUser, 
  type BusinessCard, type InsertBusinessCard, 
  type AiUsage, type InsertAiUsage,
  type PresetCollection, type InsertPresetCollection,
  type Template, type InsertTemplate,
  type AiJob, type InsertAiJob
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  insertUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  
  // Business Card operations
  getCardById(id: string): Promise<BusinessCard | undefined>;
  getUserCards(userId: string): Promise<BusinessCard[]>;
  insertBusinessCard(card: InsertBusinessCard): Promise<BusinessCard>;
  updateCard(id: string, updates: Partial<BusinessCard>): Promise<BusinessCard>;
  deleteCard(id: string): Promise<boolean>;
  getAllCards(): Promise<BusinessCard[]>;
  
  // AI Usage tracking
  insertAiUsage(usage: InsertAiUsage): Promise<AiUsage>;
  
  // Preset Collections
  getCollectionBySlug(slug: string): Promise<PresetCollection | undefined>;
  insertCollection(collection: InsertPresetCollection): Promise<PresetCollection>;
  getAllCollections(): Promise<PresetCollection[]>;
  
  // Templates
  getTemplateById(id: string): Promise<Template | undefined>;
  getTemplateBySlug(slug: string): Promise<Template | undefined>;
  getTemplatesByCollection(collectionId: string): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getAllTemplates(): Promise<Template[]>;
  getPremiumTemplates(): Promise<Template[]>;
  insertTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template>;
  
  // AI Jobs
  getJobById(id: string): Promise<AiJob | undefined>;
  getUserJobs(userId: string): Promise<AiJob[]>;
  insertJob(job: InsertAiJob): Promise<AiJob>;
  updateJob(id: string, updates: Partial<AiJob>): Promise<AiJob>;
  getActiveJobs(): Promise<AiJob[]>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAdminStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cards: Map<string, BusinessCard>;
  private aiUsage: Map<string, AiUsage>;
  private collections: Map<string, PresetCollection>;
  private templates: Map<string, Template>;
  private jobs: Map<string, AiJob>;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.aiUsage = new Map();
    this.collections = new Map();
    this.templates = new Map();
    this.jobs = new Map();
  }

  // User operations
  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async insertUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      name: insertUser.name,
      email: insertUser.email,
      googleId: insertUser.googleId ?? null,
      avatar: insertUser.avatar ?? null,
      role: insertUser.role ?? "user",
      createdAt: new Date(),
      lastLogin: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLogin = new Date();
      this.users.set(id, user);
    }
  }

  // Business Card operations
  async getCardById(id: string): Promise<BusinessCard | undefined> {
    return this.cards.get(id);
  }

  async getUserCards(userId: string): Promise<BusinessCard[]> {
    return Array.from(this.cards.values()).filter(card => card.userId === userId);
  }

  async insertBusinessCard(insertCard: InsertBusinessCard): Promise<BusinessCard> {
    const id = randomUUID();
    const card: BusinessCard = {
      id,
      userId: insertCard.userId,
      title: insertCard.title,
      prompt: insertCard.prompt ?? null,
      aiStyle: insertCard.aiStyle ?? null,
      aiGeneratedText: insertCard.aiGeneratedText ?? null,
      name: insertCard.name ?? null,
      jobTitle: insertCard.jobTitle ?? null,
      company: insertCard.company ?? null,
      email: insertCard.email ?? null,
      phone: insertCard.phone ?? null,
      website: insertCard.website ?? null,
      address: insertCard.address ?? null,
      backgroundColor: insertCard.backgroundColor ?? "#ffffff",
      textColor: insertCard.textColor ?? "#000000",
      accentColor: insertCard.accentColor ?? "#3b82f6",
      fontFamily: insertCard.fontFamily ?? "Inter",
      layout: insertCard.layout ?? "standard",
      elements: insertCard.elements ?? null,
      thumbnailUrl: insertCard.thumbnailUrl ?? null,
      imageUrl: insertCard.imageUrl ?? null,
      isPublic: insertCard.isPublic ?? false,
      tags: insertCard.tags ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, updates: Partial<BusinessCard>): Promise<BusinessCard> {
    const card = this.cards.get(id);
    if (!card) throw new Error("Card not found");
    
    const updatedCard = { 
      ...card, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  async getAllCards(): Promise<BusinessCard[]> {
    return Array.from(this.cards.values());
  }

  // AI Usage operations
  async insertAiUsage(insertUsage: InsertAiUsage): Promise<AiUsage> {
    const id = randomUUID();
    const usage: AiUsage = {
      id,
      userId: insertUsage.userId,
      cardId: insertUsage.cardId ?? null,
      provider: insertUsage.provider,
      prompt: insertUsage.prompt,
      tokensUsed: insertUsage.tokensUsed ?? null,
      responseTime: insertUsage.responseTime ?? null,
      success: insertUsage.success ?? true,
      errorMessage: insertUsage.errorMessage ?? null,
      createdAt: new Date(),
    };
    this.aiUsage.set(id, usage);
    return usage;
  }

  // Preset Collections
  async getCollectionBySlug(slug: string): Promise<PresetCollection | undefined> {
    return Array.from(this.collections.values()).find(c => c.slug === slug);
  }

  async insertCollection(insertCollection: InsertPresetCollection): Promise<PresetCollection> {
    const id = randomUUID();
    const collection: PresetCollection = {
      id,
      slug: insertCollection.slug,
      title: insertCollection.title,
      description: insertCollection.description ?? null,
      createdAt: new Date(),
    };
    this.collections.set(id, collection);
    return collection;
  }

  async getAllCollections(): Promise<PresetCollection[]> {
    return Array.from(this.collections.values());
  }

  // Templates
  async getTemplateById(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplateBySlug(slug: string): Promise<Template | undefined> {
    return Array.from(this.templates.values()).find(t => t.slug === slug);
  }

  async getTemplatesByCollection(collectionId: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.collectionId === collectionId);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getPremiumTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.isPremium);
  }

  async insertTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      id,
      slug: insertTemplate.slug,
      title: insertTemplate.title,
      category: insertTemplate.category,
      collectionId: insertTemplate.collectionId ?? null,
      front: insertTemplate.front,
      back: insertTemplate.back ?? null,
      thumbnailUrl: insertTemplate.thumbnailUrl,
      previewUrls: insertTemplate.previewUrls ?? null,
      exportHints: insertTemplate.exportHints ?? null,
      source: insertTemplate.source ?? "generated",
      tags: insertTemplate.tags ?? null,
      isPremium: insertTemplate.isPremium ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    const template = this.templates.get(id);
    if (!template) throw new Error("Template not found");
    
    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date(),
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  // AI Jobs
  async getJobById(id: string): Promise<AiJob | undefined> {
    return this.jobs.get(id);
  }

  async getUserJobs(userId: string): Promise<AiJob[]> {
    return Array.from(this.jobs.values()).filter(j => j.userId === userId);
  }

  async insertJob(insertJob: InsertAiJob): Promise<AiJob> {
    const id = randomUUID();
    const job: AiJob = {
      id,
      userId: insertJob.userId,
      promptText: insertJob.promptText,
      style: insertJob.style,
      targetFormatHints: insertJob.targetFormatHints ?? null,
      status: insertJob.status ?? "queued",
      progress: insertJob.progress ?? 0,
      templateId: insertJob.templateId ?? null,
      previewUrl: insertJob.previewUrl ?? null,
      errorMessage: insertJob.errorMessage ?? null,
      provider: insertJob.provider ?? null,
      estimatedSeconds: insertJob.estimatedSeconds ?? 6,
      createdAt: new Date(),
      completedAt: null,
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updates: Partial<AiJob>): Promise<AiJob> {
    const job = this.jobs.get(id);
    if (!job) throw new Error("Job not found");
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async getActiveJobs(): Promise<AiJob[]> {
    return Array.from(this.jobs.values()).filter(
      j => j.status === "queued" || j.status === "processing"
    );
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAdminStats(): Promise<any> {
    const users = Array.from(this.users.values());
    const cards = Array.from(this.cards.values());
    const usage = Array.from(this.aiUsage.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      totalUsers: users.length,
      totalCards: cards.length,
      totalAiGenerations: usage.length,
      activeUsersToday: users.filter(u => u.lastLogin && u.lastLogin >= today).length,
      cardsCreatedToday: cards.filter(c => c.createdAt >= today).length,
      aiUsageToday: usage.filter(u => u.createdAt >= today).length
    };
  }
}

export const storage = new MemStorage();
