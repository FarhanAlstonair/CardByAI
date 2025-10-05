// Professional Business Card Templates
// Each template is fully editable and can be customized

export interface Template {
  id: string;
  name: string;
  category: 'business' | 'creative' | 'minimal' | 'modern' | 'professional' | 'tech' | 'artistic';
  description: string;
  thumbnail: string;
  tags: string[];
  canvasData: {
    width: number;
    height: number;
    backgroundColor: string;
    elements: any[];
  };
}

export const templates: Template[] = [
  // BUSINESS CATEGORY
  {
    id: 'business-classic',
    name: 'Executive Pro',
    category: 'business',
    description: 'Premium executive business card with sophisticated layout',
    thumbnail: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    tags: ['executive', 'premium', 'sophisticated'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#0f172a',
      elements: [
        { type: 'rect', id: 'accent-line', x: 0, y: 0, width: 1050, height: 8, fill: '#3b82f6' },
        { type: 'rect', id: 'logo-container', x: 60, y: 80, width: 120, height: 120, fill: '#1e293b', borderRadius: 60 },
        { type: 'text', id: 'logo', x: 105, y: 125, content: 'EP', fontSize: 36, fontFamily: 'Inter', fontWeight: 'bold', fill: '#3b82f6', textAlign: 'center' },
        { type: 'text', id: 'name', x: 250, y: 120, content: 'Alexander Mitchell', fontSize: 32, fontFamily: 'Inter', fontWeight: '700', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 250, y: 165, content: 'Chief Executive Officer', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', fill: '#3b82f6' },
        { type: 'text', id: 'company', x: 250, y: 200, content: 'Mitchell & Partners LLC', fontSize: 16, fontFamily: 'Inter', fontWeight: '400', fill: '#94a3b8' },
        { type: 'rect', id: 'contact-bg', x: 60, y: 280, width: 930, height: 240, fill: '#1e293b', borderRadius: 16 },
        { type: 'text', id: 'phone-label', x: 100, y: 320, content: 'PHONE', fontSize: 12, fontFamily: 'Inter', fontWeight: '600', fill: '#64748b', letterSpacing: 1 },
        { type: 'text', id: 'phone', x: 100, y: 345, content: '+1 (555) 847-2910', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', fill: '#ffffff' },
        { type: 'text', id: 'email-label', x: 350, y: 320, content: 'EMAIL', fontSize: 12, fontFamily: 'Inter', fontWeight: '600', fill: '#64748b', letterSpacing: 1 },
        { type: 'text', id: 'email', x: 350, y: 345, content: 'alexander@mitchell-partners.com', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', fill: '#ffffff' },
        { type: 'text', id: 'website-label', x: 100, y: 400, content: 'WEBSITE', fontSize: 12, fontFamily: 'Inter', fontWeight: '600', fill: '#64748b', letterSpacing: 1 },
        { type: 'text', id: 'website', x: 100, y: 425, content: 'www.mitchell-partners.com', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', fill: '#3b82f6' },
        { type: 'text', id: 'address-label', x: 350, y: 400, content: 'ADDRESS', fontSize: 12, fontFamily: 'Inter', fontWeight: '600', fill: '#64748b', letterSpacing: 1 },
        { type: 'text', id: 'address', x: 350, y: 425, content: '1250 Executive Plaza, Floor 42', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', fill: '#ffffff' },
        { type: 'rect', id: 'qr-bg', x: 800, y: 320, width: 140, height: 140, fill: '#ffffff', borderRadius: 12 },
        { type: 'text', id: 'qr-placeholder', x: 870, y: 380, content: 'QR', fontSize: 24, fontFamily: 'Inter', fontWeight: 'bold', fill: '#0f172a', textAlign: 'center' },
      ]
    }
  },
  {
    id: 'business-executive',
    name: 'Executive Suite',
    category: 'business',
    description: 'Premium executive business card with gold accents',
    thumbnail: 'linear-gradient(135deg, #000000 0%, #374151 100%)',
    tags: ['executive', 'premium', 'luxury'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#000000',
      elements: [
        { type: 'rect', id: 'line', x: 0, y: 0, width: 1050, height: 8, fill: '#fbbf24' },
        { type: 'circle', id: 'logo-circle', x: 80, y: 80, radius: 40, fill: '#fbbf24' },
        { type: 'text', id: 'logo', x: 95, y: 130, text: 'GV', fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold', fill: '#000000' },
        { type: 'text', id: 'name', x: 80, y: 220, text: 'Michael Chen', fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 280, text: 'Managing Director', fontSize: 22, fill: '#fbbf24' },
        { type: 'text', id: 'company', x: 80, y: 320, text: 'Global Ventures Ltd.', fontSize: 20, fill: '#d1d5db' },
        { type: 'rect', id: 'contact-bg', x: 650, y: 200, width: 320, height: 300, fill: '#1a1a1a', borderRadius: 12 },
        { type: 'text', id: 'contact-header', x: 680, y: 240, text: 'CONTACT', fontSize: 14, fontFamily: 'Inter', fontWeight: 'bold', fill: '#fbbf24', letterSpacing: 2 },
        { type: 'text', id: 'email', x: 680, y: 280, text: 'michael.chen@globalventures.com', fontSize: 14, fill: '#ffffff' },
        { type: 'text', id: 'phone', x: 680, y: 320, text: '+44 20 7123 4567', fontSize: 14, fill: '#ffffff' },
        { type: 'text', id: 'linkedin', x: 680, y: 360, text: 'linkedin.com/in/michaelchen', fontSize: 14, fill: '#fbbf24' },
        { type: 'text', id: 'address', x: 680, y: 400, text: 'London Financial District', fontSize: 12, fill: '#9ca3af' },
      ]
    }
  },

  // CREATIVE CATEGORY
  {
    id: 'creative-bold',
    name: 'Bold Creative',
    category: 'creative',
    description: 'Eye-catching design for creative professionals',
    thumbnail: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    tags: ['creative', 'colorful', 'artistic'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#ffffff',
      elements: [
        { type: 'rect', id: 'shape1', x: 0, y: 0, width: 1050, height: 200, fill: '#f59e0b' },
        { type: 'circle', id: 'circle', x: 850, y: 300, radius: 180, fill: '#ec4899', opacity: 0.3 },
        { type: 'rect', id: 'logo-container', x: 80, y: 40, width: 120, height: 40, fill: '#ffffff', borderRadius: 20 },
        { type: 'text', id: 'logo', x: 120, y: 70, text: 'CREATIVE', fontSize: 16, fontFamily: 'Inter', fontWeight: 'bold', fill: '#f59e0b' },
        { type: 'text', id: 'name', x: 80, y: 140, text: 'Sofia Rodriguez', fontSize: 52, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 280, text: 'Creative Director & Designer', fontSize: 26, fill: '#1f2937' },
        { type: 'rect', id: 'contact-card', x: 80, y: 340, width: 400, height: 180, fill: '#f8fafc', borderRadius: 16, stroke: '#e2e8f0', strokeWidth: 1 },
        { type: 'text', id: 'email-label', x: 110, y: 370, text: 'Email', fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', fill: '#64748b' },
        { type: 'text', id: 'email', x: 110, y: 395, text: 'sofia@creativestudio.co', fontSize: 16, fill: '#374151' },
        { type: 'text', id: 'phone-label', x: 110, y: 430, text: 'Phone', fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', fill: '#64748b' },
        { type: 'text', id: 'phone', x: 110, y: 455, text: '+1 (555) 987-6543', fontSize: 16, fill: '#374151' },
        { type: 'text', id: 'website-label', x: 110, y: 480, text: 'Portfolio', fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', fill: '#64748b' },
        { type: 'text', id: 'website', x: 110, y: 505, text: 'creativestudio.co', fontSize: 16, fill: '#ec4899' },
      ]
    }
  },
  {
    id: 'creative-gradient',
    name: 'Gradient Flow',
    category: 'creative',
    description: 'Modern gradient design with flowing aesthetics',
    thumbnail: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
    tags: ['modern', 'gradient', 'vibrant'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      elements: [
        { type: 'text', id: 'name', x: 80, y: 180, text: 'Emma Wilson', fontSize: 56, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 250, text: 'Brand Strategist', fontSize: 24, fill: '#f0f9ff' },
        { type: 'text', id: 'email', x: 80, y: 360, text: 'emma@brandcreative.io', fontSize: 18, fill: '#ffffff' },
        { type: 'text', id: 'phone', x: 80, y: 400, text: '+1 (555) 246-8135', fontSize: 18, fill: '#ffffff' },
        { type: 'text', id: 'website', x: 80, y: 440, text: 'brandcreative.io', fontSize: 18, fill: '#ffffff' },
      ]
    }
  },

  // MINIMAL CATEGORY
  {
    id: 'minimal-clean',
    name: 'Clean Minimal',
    category: 'minimal',
    description: 'Simple and elegant minimalist design',
    thumbnail: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
    tags: ['minimal', 'clean', 'simple'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#ffffff',
      elements: [
        { type: 'line', id: 'line1', x1: 80, y1: 150, x2: 970, y2: 150, stroke: '#000000', strokeWidth: 2 },
        { type: 'text', id: 'name', x: 80, y: 250, text: 'David Kim', fontSize: 48, fontFamily: 'Inter', fontWeight: '600', fill: '#000000' },
        { type: 'text', id: 'title', x: 80, y: 310, text: 'Architect', fontSize: 20, fill: '#6b7280' },
        { type: 'text', id: 'email', x: 80, y: 400, text: 'david@architecture.com', fontSize: 16, fill: '#374151' },
        { type: 'text', id: 'phone', x: 80, y: 435, text: '+1 (555) 369-2580', fontSize: 16, fill: '#374151' },
      ]
    }
  },
  {
    id: 'minimal-border',
    name: 'Bordered Minimal',
    category: 'minimal',
    description: 'Minimalist card with bold border',
    thumbnail: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
    tags: ['minimal', 'border', 'modern'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#ffffff',
      elements: [
        { type: 'rect', id: 'border', x: 40, y: 40, width: 970, height: 520, fill: 'transparent', stroke: '#000000', strokeWidth: 4 },
        { type: 'text', id: 'name', x: 100, y: 220, text: 'Anna Park', fontSize: 52, fontFamily: 'Inter', fontWeight: 'bold', fill: '#000000' },
        { type: 'text', id: 'title', x: 100, y: 280, text: 'UX Researcher', fontSize: 22, fill: '#4b5563' },
        { type: 'text', id: 'email', x: 100, y: 360, text: 'anna.park@research.io', fontSize: 18, fill: '#6b7280' },
        { type: 'text', id: 'phone', x: 100, y: 400, text: '+1 (555) 159-7532', fontSize: 18, fill: '#6b7280' },
      ]
    }
  },

  // MODERN CATEGORY
  {
    id: 'modern-tech',
    name: 'Tech Modern',
    category: 'modern',
    description: 'Contemporary design for tech professionals',
    thumbnail: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    tags: ['tech', 'modern', 'professional'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#0f172a',
      elements: [
        { type: 'rect', id: 'accent', x: 0, y: 0, width: 12, height: 600, fill: '#0ea5e9' },
        { type: 'text', id: 'name', x: 80, y: 180, text: 'Alex Turner', fontSize: 50, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 245, text: 'Full Stack Developer', fontSize: 24, fill: '#0ea5e9' },
        { type: 'text', id: 'company', x: 80, y: 290, text: 'TechVentures Inc.', fontSize: 20, fill: '#94a3b8' },
        { type: 'text', id: 'email', x: 80, y: 370, text: 'alex.turner@techventures.com', fontSize: 17, fill: '#cbd5e1' },
        { type: 'text', id: 'phone', x: 80, y: 410, text: '+1 (555) 753-9514', fontSize: 17, fill: '#cbd5e1' },
        { type: 'text', id: 'website', x: 80, y: 450, text: 'github.com/alexturner', fontSize: 17, fill: '#cbd5e1' },
      ]
    }
  },
  {
    id: 'modern-duo',
    name: 'Duotone Modern',
    category: 'modern',
    description: 'Two-color modern design',
    thumbnail: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    tags: ['modern', 'duotone', 'colorful'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#ffffff',
      elements: [
        { type: 'rect', id: 'shape1', x: 0, y: 0, width: 525, height: 600, fill: '#6366f1' },
        { type: 'text', id: 'name', x: 580, y: 200, text: 'Lisa Chen', fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1f2937' },
        { type: 'text', id: 'title', x: 580, y: 260, text: 'Product Manager', fontSize: 22, fill: '#6366f1' },
        { type: 'text', id: 'email', x: 580, y: 340, text: 'lisa@productco.com', fontSize: 18, fill: '#374151' },
        { type: 'text', id: 'phone', x: 580, y: 380, text: '+1 (555) 842-1597', fontSize: 18, fill: '#374151' },
      ]
    }
  },

  // PROFESSIONAL CATEGORY
  {
    id: 'pro-consultant',
    name: 'Professional Consultant',
    category: 'professional',
    description: 'Sophisticated design for consultants',
    thumbnail: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    tags: ['professional', 'consultant', 'business'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#1e293b',
      elements: [
        { type: 'rect', id: 'line', x: 0, y: 550, width: 1050, height: 50, fill: '#0ea5e9' },
        { type: 'text', id: 'name', x: 80, y: 200, text: 'Robert Martinez', fontSize: 46, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 260, text: 'Business Consultant', fontSize: 24, fill: '#0ea5e9' },
        { type: 'text', id: 'company', x: 80, y: 300, text: 'Strategic Solutions Group', fontSize: 20, fill: '#cbd5e1' },
        { type: 'text', id: 'email', x: 80, y: 380, text: 'robert@strategicsolutions.com', fontSize: 18, fill: '#e2e8f0' },
        { type: 'text', id: 'phone', x: 80, y: 420, text: '+1 (555) 654-3210', fontSize: 18, fill: '#e2e8f0' },
      ]
    }
  },
  {
    id: 'pro-lawyer',
    name: 'Legal Professional',
    category: 'professional',
    description: 'Traditional design for legal professionals',
    thumbnail: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    tags: ['professional', 'legal', 'traditional'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#ffffff',
      elements: [
        { type: 'rect', id: 'header', x: 0, y: 0, width: 1050, height: 120, fill: '#7c3aed' },
        { type: 'text', id: 'name', x: 80, y: 65, text: 'Jennifer Thompson', fontSize: 36, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 200, text: 'Attorney at Law', fontSize: 28, fill: '#7c3aed' },
        { type: 'text', id: 'company', x: 80, y: 250, text: 'Thompson & Associates', fontSize: 22, fill: '#374151' },
        { type: 'text', id: 'email', x: 80, y: 340, text: 'jennifer@thompsonlaw.com', fontSize: 18, fill: '#4b5563' },
        { type: 'text', id: 'phone', x: 80, y: 380, text: '+1 (555) 321-7890', fontSize: 18, fill: '#4b5563' },
        { type: 'text', id: 'address', x: 80, y: 420, text: '123 Legal Plaza, Suite 400', fontSize: 16, fill: '#6b7280' },
      ]
    }
  },

  // TECH CATEGORY
  {
    id: 'tech-startup',
    name: 'Startup Tech',
    category: 'tech',
    description: 'Fresh design for startup teams',
    thumbnail: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    tags: ['tech', 'startup', 'innovative'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#f0fdf4',
      elements: [
        { type: 'rect', id: 'shape', x: 700, y: 0, width: 350, height: 600, fill: '#10b981' },
        { type: 'rect', id: 'logo-bg', x: 80, y: 80, width: 100, height: 100, fill: '#ffffff', borderRadius: 20, stroke: '#10b981', strokeWidth: 3 },
        { type: 'text', id: 'logo-icon', x: 115, y: 120, text: '🌱', fontSize: 32 },
        { type: 'text', id: 'logo-text', x: 105, y: 155, text: 'GT', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', fill: '#10b981' },
        { type: 'text', id: 'name', x: 80, y: 240, text: 'Marcus Johnson', fontSize: 50, fontFamily: 'Inter', fontWeight: 'bold', fill: '#065f46' },
        { type: 'text', id: 'title', x: 80, y: 305, text: 'Founder & CTO', fontSize: 24, fill: '#10b981' },
        { type: 'text', id: 'company', x: 80, y: 350, text: 'GreenTech Solutions', fontSize: 22, fill: '#047857' },
        { type: 'rect', id: 'qr-placeholder', x: 750, y: 80, width: 120, height: 120, fill: '#ffffff', borderRadius: 12 },
        { type: 'text', id: 'qr-text', x: 785, y: 150, text: 'QR CODE', fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', fill: '#10b981' },
        { type: 'text', id: 'contact-header', x: 750, y: 250, text: 'GET IN TOUCH', fontSize: 14, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff', letterSpacing: 1 },
        { type: 'text', id: 'email', x: 750, y: 290, text: 'marcus@greentech.io', fontSize: 16, fill: '#ffffff' },
        { type: 'text', id: 'phone', x: 750, y: 330, text: '+1 (555) 987-1234', fontSize: 16, fill: '#ffffff' },
        { type: 'text', id: 'website', x: 750, y: 370, text: 'greentech.io', fontSize: 16, fill: '#ffffff' },
        { type: 'text', id: 'tagline', x: 80, y: 430, text: '"Sustainable Innovation for Tomorrow"', fontSize: 16, fontStyle: 'italic', fill: '#047857' },
      ]
    }
  },
  {
    id: 'tech-developer',
    name: 'Developer Card',
    category: 'tech',
    description: 'Code-inspired design for developers',
    thumbnail: 'linear-gradient(135deg, #000000 0%, #14b8a6 100%)',
    tags: ['tech', 'developer', 'code'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#0a0a0a',
      elements: [
        { type: 'text', id: 'code', x: 80, y: 80, text: '// Developer', fontSize: 18, fontFamily: 'monospace', fill: '#14b8a6' },
        { type: 'text', id: 'name', x: 80, y: 200, text: 'Sarah Zhang', fontSize: 52, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 265, text: 'Senior Software Engineer', fontSize: 22, fill: '#14b8a6' },
        { type: 'text', id: 'company', x: 80, y: 305, text: 'CodeCraft Inc.', fontSize: 20, fill: '#94a3b8' },
        { type: 'text', id: 'email', x: 80, y: 380, text: 'sarah.zhang@codecraft.dev', fontSize: 17, fill: '#cbd5e1' },
        { type: 'text', id: 'github', x: 80, y: 420, text: 'github.com/sarahzhang', fontSize: 17, fill: '#14b8a6' },
      ]
    }
  },

  // ARTISTIC CATEGORY
  {
    id: 'artistic-photographer',
    name: 'Photographer Card',
    category: 'artistic',
    description: 'Visual design for photographers',
    thumbnail: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    tags: ['artistic', 'photographer', 'visual'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#fffbeb',
      elements: [
        { type: 'rect', id: 'frame', x: 600, y: 100, width: 350, height: 400, fill: '#000000' },
        { type: 'text', id: 'name', x: 80, y: 220, text: 'Maya Patel', fontSize: 54, fontFamily: 'Inter', fontWeight: 'bold', fill: '#92400e' },
        { type: 'text', id: 'title', x: 80, y: 285, text: 'Wedding Photographer', fontSize: 24, fill: '#b45309' },
        { type: 'text', id: 'email', x: 80, y: 360, text: 'maya@mayaphoto.com', fontSize: 18, fill: '#78350f' },
        { type: 'text', id: 'phone', x: 80, y: 400, text: '+1 (555) 741-8520', fontSize: 18, fill: '#78350f' },
        { type: 'text', id: 'website', x: 80, y: 440, text: 'mayaphoto.com', fontSize: 18, fill: '#78350f' },
      ]
    }
  },
  {
    id: 'artistic-designer',
    name: 'Visual Designer',
    category: 'artistic',
    description: 'Colorful design for visual artists',
    thumbnail: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    tags: ['artistic', 'designer', 'colorful'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#ffffff',
      elements: [
        { type: 'circle', id: 'circle1', x: 150, y: 150, radius: 120, fill: '#ec4899', opacity: 0.3 },
        { type: 'circle', id: 'circle2', x: 900, y: 400, radius: 100, fill: '#f97316', opacity: 0.3 },
        { type: 'text', id: 'name', x: 80, y: 320, text: 'Oliver Wright', fontSize: 50, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1f2937' },
        { type: 'text', id: 'title', x: 80, y: 380, text: 'Visual Designer', fontSize: 26, fill: '#ec4899' },
        { type: 'text', id: 'email', x: 80, y: 460, text: 'oliver@design.studio', fontSize: 18, fill: '#374151' },
        { type: 'text', id: 'website', x: 80, y: 500, text: 'oliverwright.design', fontSize: 18, fill: '#374151' },
      ]
    }
  },

  // Additional Templates
  {
    id: 'minimal-monochrome',
    name: 'Monochrome',
    category: 'minimal',
    description: 'Black and white simplicity',
    thumbnail: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    tags: ['minimal', 'monochrome', 'simple'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#000000',
      elements: [
        { type: 'text', id: 'name', x: 80, y: 220, text: 'Taylor Brooks', fontSize: 56, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff' },
        { type: 'text', id: 'title', x: 80, y: 290, text: 'Art Director', fontSize: 24, fill: '#d1d5db' },
        { type: 'text', id: 'email', x: 80, y: 380, text: 'taylor@artdirection.co', fontSize: 18, fill: '#ffffff' },
        { type: 'text', id: 'phone', x: 80, y: 420, text: '+1 (555) 852-9630', fontSize: 18, fill: '#ffffff' },
      ]
    }
  },
  {
    id: 'modern-neon',
    name: 'Neon Glow',
    category: 'modern',
    description: 'Vibrant neon-inspired design',
    thumbnail: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    tags: ['modern', 'neon', 'vibrant'],
    canvasData: {
      width: 1050,
      height: 600,
      backgroundColor: '#18181b',
      elements: [
        { type: 'text', id: 'name', x: 80, y: 200, text: 'Jordan Lee', fontSize: 54, fontFamily: 'Inter', fontWeight: 'bold', fill: '#a855f7' },
        { type: 'text', id: 'title', x: 80, y: 265, text: 'Digital Artist', fontSize: 26, fill: '#ec4899' },
        { type: 'text', id: 'email', x: 80, y: 360, text: 'jordan@digitalart.io', fontSize: 19, fill: '#f0abfc' },
        { type: 'text', id: 'phone', x: 80, y: 400, text: '+1 (555) 963-7410', fontSize: 19, fill: '#f0abfc' },
        { type: 'text', id: 'website', x: 80, y: 440, text: 'jordanlee.art', fontSize: 19, fill: '#f0abfc' },
      ]
    }
  }
];

export const getTemplatesByCategory = (category: string) => {
  return templates.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find(t => t.id === id);
};

export const getAllCategories = () => {
  return Array.from(new Set(templates.map(t => t.category)));
};
