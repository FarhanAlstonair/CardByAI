import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Create client with fallback for development
export const supabase = supabaseUrl.includes('demo') ? null : createClient(supabaseUrl, supabaseKey);

export interface CardProject {
  id: string;
  user_id: string;
  title: string;
  canvas_data: any;
  thumbnail_url?: string;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

export const cardProjectsApi = {
  async getAll(userId: string): Promise<CardProject[]> {
    if (!supabase) {
      // Return mock data for development
      return [
        {
          id: '1',
          user_id: userId,
          title: 'Sample Business Card',
          canvas_data: { elements: [] },
          width: 400,
          height: 240,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
    
    const { data, error } = await supabase
      .from('card_projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(project: Omit<CardProject, 'id' | 'created_at' | 'updated_at'>): Promise<CardProject> {
    if (!supabase) {
      // Return mock data for development
      return {
        ...project,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('card_projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<CardProject>): Promise<CardProject> {
    if (!supabase) {
      // Return mock data for development
      return {
        id,
        user_id: 'dev-user',
        title: 'Updated Card',
        canvas_data: updates.canvas_data || {},
        width: 400,
        height: 240,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      };
    }
    
    const { data, error } = await supabase
      .from('card_projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      // Mock delete for development
      console.log('Mock delete project:', id);
      return;
    }
    
    const { error } = await supabase
      .from('card_projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};