import { type User, type InsertUser, type BusinessCard, type InsertBusinessCard, type AiUsage, type InsertAiUsage } from "@shared/schema";
import { randomUUID } from "crypto";

// Updated storage interface for the AI Business Card SaaS
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
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAdminStats(): Promise<any>;
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



  // AI Usage operations
  async insertAiUsage(insertUsage: InsertAiUsage): Promise<AiUsage> {
    const id = randomUUID();
    const usage: AiUsage = {
      ...insertUsage,
      id,
      createdAt: new Date(),
    };
    this.aiUsage.set(id, usage);
    return usage;
  }



  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllCards(): Promise<BusinessCard[]> {
    return Array.from(this.cards.values());
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