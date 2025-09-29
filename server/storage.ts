import { type User, type InsertUser, type BusinessCard, type InsertBusinessCard, type AiUsage, type InsertAiUsage } from "@shared/schema";
import { randomUUID } from "crypto";

// Updated storage interface for the AI Business Card SaaS
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Business Card operations
  getCard(id: string): Promise<BusinessCard | undefined>;
  getUserCards(userId: string): Promise<BusinessCard[]>;
  createCard(card: InsertBusinessCard): Promise<BusinessCard>;
  updateCard(id: string, updates: Partial<BusinessCard>): Promise<BusinessCard>;
  deleteCard(id: string): Promise<boolean>;
  getPublicCards(): Promise<BusinessCard[]>;
  
  // AI Usage tracking
  createAiUsage(usage: InsertAiUsage): Promise<AiUsage>;
  getUserAiUsage(userId: string): Promise<AiUsage[]>;
  getAiUsageStats(): Promise<{
    totalUsage: number;
    todayUsage: number;
    avgResponseTime: number;
    successRate: number;
  }>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllCards(): Promise<BusinessCard[]>;
  getAllAiUsage(): Promise<AiUsage[]>;
  getUserStats(): Promise<{
    totalUsers: number;
    activeToday: number;
    newToday: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cards: Map<string, BusinessCard>;
  private aiUsage: Map<string, AiUsage>;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.aiUsage = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
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

  // Business Card operations
  async getCard(id: string): Promise<BusinessCard | undefined> {
    return this.cards.get(id);
  }

  async getUserCards(userId: string): Promise<BusinessCard[]> {
    return Array.from(this.cards.values()).filter(card => card.userId === userId);
  }

  async createCard(insertCard: InsertBusinessCard): Promise<BusinessCard> {
    const id = randomUUID();
    const card: BusinessCard = {
      ...insertCard,
      id,
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

  async getPublicCards(): Promise<BusinessCard[]> {
    return Array.from(this.cards.values()).filter(card => card.isPublic);
  }

  // AI Usage operations
  async createAiUsage(insertUsage: InsertAiUsage): Promise<AiUsage> {
    const id = randomUUID();
    const usage: AiUsage = {
      ...insertUsage,
      id,
      createdAt: new Date(),
    };
    this.aiUsage.set(id, usage);
    return usage;
  }

  async getUserAiUsage(userId: string): Promise<AiUsage[]> {
    return Array.from(this.aiUsage.values()).filter(usage => usage.userId === userId);
  }

  async getAiUsageStats(): Promise<{
    totalUsage: number;
    todayUsage: number;
    avgResponseTime: number;
    successRate: number;
  }> {
    const allUsage = Array.from(this.aiUsage.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayUsage = allUsage.filter(usage => 
      usage.createdAt >= today
    );

    const successfulUsage = allUsage.filter(usage => usage.success);
    const avgResponseTime = allUsage.reduce((sum, usage) => 
      sum + (usage.responseTime || 0), 0) / allUsage.length || 0;

    return {
      totalUsage: allUsage.length,
      todayUsage: todayUsage.length,
      avgResponseTime: Math.round(avgResponseTime),
      successRate: allUsage.length > 0 ? successfulUsage.length / allUsage.length : 0,
    };
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllCards(): Promise<BusinessCard[]> {
    return Array.from(this.cards.values());
  }

  async getAllAiUsage(): Promise<AiUsage[]> {
    return Array.from(this.aiUsage.values());
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeToday: number;
    newToday: number;
  }> {
    const users = Array.from(this.users.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeToday = users.filter(user => 
      user.lastLogin && user.lastLogin >= today
    );
    
    const newToday = users.filter(user => 
      user.createdAt >= today
    );

    return {
      totalUsers: users.length,
      activeToday: activeToday.length,
      newToday: newToday.length,
    };
  }
}

export const storage = new MemStorage();