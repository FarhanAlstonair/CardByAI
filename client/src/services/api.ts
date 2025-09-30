import type { AiGenerationRequest, AiGenerationResponse, BusinessCard, User } from '@shared/schema';

const API_BASE = '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async getMe(): Promise<{ user: User }> {
    return this.request('/auth/me');
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
  }

  // Cards
  async generateCard(request: AiGenerationRequest): Promise<AiGenerationResponse> {
    return this.request('/cards/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCards(): Promise<{ cards: BusinessCard[] }> {
    return this.request('/cards');
  }

  async getCard(id: string): Promise<{ card: BusinessCard }> {
    return this.request(`/cards/${id}`);
  }

  async createCard(card: Partial<BusinessCard>): Promise<{ card: BusinessCard }> {
    return this.request('/cards', {
      method: 'POST',
      body: JSON.stringify(card),
    });
  }

  async updateCard(id: string, updates: Partial<BusinessCard>): Promise<{ card: BusinessCard }> {
    return this.request(`/cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCard(id: string): Promise<void> {
    await this.request(`/cards/${id}`, { method: 'DELETE' });
  }

  async exportCard(id: string, imageData: string): Promise<{ imageUrl: string }> {
    return this.request(`/cards/${id}/export`, {
      method: 'POST',
      body: JSON.stringify({ imageData }),
    });
  }

  // Admin
  async getAdminStats(): Promise<any> {
    return this.request('/admin/stats');
  }

  async getAdminUsers(): Promise<{ users: User[] }> {
    return this.request('/admin/users');
  }

  async getAdminCards(): Promise<{ cards: BusinessCard[] }> {
    return this.request('/admin/cards');
  }

  // Test API Keys
  async testApiKeys(): Promise<any> {
    return this.request('/test-keys');
  }
}

export const api = new ApiService();