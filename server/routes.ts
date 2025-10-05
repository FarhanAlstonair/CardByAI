import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test API Keys endpoint
  app.get('/api/test-keys', async (req, res) => {
    const results = {
      google: { configured: false, working: false },
      supabase: { configured: false, working: false },
      cloudinary: { configured: false, working: false },
      cerebras: { configured: false, working: false },
      huggingface: { configured: false, working: false }
    };
    
    // Test Google OAuth
    results.google.configured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    
    // Test Supabase
    results.supabase.configured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
    if (results.supabase.configured) {
      try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
          headers: { 'apikey': process.env.SUPABASE_KEY!, 'Authorization': `Bearer ${process.env.SUPABASE_KEY}` }
        });
        results.supabase.working = response.status === 200;
      } catch (error) {
        results.supabase.working = false;
      }
    }
    
    // Test Cloudinary
    results.cloudinary.configured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);
    
    // Test Cerebras AI
    results.cerebras.configured = !!process.env.CEREBRAS_API_KEY;
    if (results.cerebras.configured) {
      try {
        const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3.1-8b',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1
          })
        });
        results.cerebras.working = response.ok;
      } catch (error) {
        results.cerebras.working = false;
      }
    }
    
    // Test HuggingFace
    results.huggingface.configured = !!process.env.HUGGINGFACE_API_TOKEN;
    if (results.huggingface.configured && process.env.HUGGINGFACE_API_TOKEN !== 'your_huggingface_token_here') {
      try {
        const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
          headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}` }
        });
        results.huggingface.working = response.ok;
      } catch (error) {
        results.huggingface.working = false;
      }
    }
    
    res.json(results);
  });

  // Google OAuth Routes
  app.get('/api/auth/google', (req, res) => {
    const redirectUri = encodeURIComponent(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/callback`);
    const clientId = encodeURIComponent(process.env.GOOGLE_CLIENT_ID || '');
    const scope = encodeURIComponent('openid email profile');
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    res.redirect(googleAuthUrl);
  });

  app.get('/api/auth/callback', async (req, res) => {
    try {
      const { code } = req.query;
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/callback`
        })
      });
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error('Token exchange failed:', errorData);
        throw new Error('Failed to exchange code for token');
      }
      
      const tokens = await tokenResponse.json();
      
      if (!tokens.access_token) {
        console.error('No access token received:', tokens);
        throw new Error('No access token received from Google');
      }
      
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      
      if (!userResponse.ok) {
        const errorData = await userResponse.text();
        console.error('User info fetch failed:', errorData);
        throw new Error('Failed to fetch user info from Google');
      }
      
      const googleUser = await userResponse.json();
      console.log('Google user data:', googleUser);
      
      let user = await storage.getUserByGoogleId(googleUser.id);
      if (!user) {
        user = await storage.insertUser({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          avatar: googleUser.picture
        });
      } else {
        await storage.updateUserLastLogin(user.id);
      }
      
      (req as any).session.userId = user.id;
      
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`);
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=${encodeURIComponent(errorMessage)}`);
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  });

  app.post('/api/auth/logout', (req, res) => {
    (req as any).session.destroy();
    res.json({ success: true });
  });

  // Email/Password Authentication
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      console.log('Signup attempt:', { email, name });
      
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const user = await storage.insertUser({
        email,
        name,
        role: 'user'
      });
      
      (req as any).session.userId = user.id;
      (req as any).session.save(() => {
        console.log('User created successfully:', user.id);
        res.json({ user });
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', email);
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      await storage.updateUserLastLogin(user.id);
      (req as any).session.userId = user.id;
      (req as any).session.save(() => {
        console.log('Login successful:', user.id);
        res.json({ user });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Cards endpoints
  app.get('/api/cards', async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const cards = await storage.getUserCards(userId);
    res.json({ cards });
  });

  app.post('/api/cards', async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const card = await storage.insertBusinessCard({ ...req.body, userId });
    res.json({ card });
  });

  app.patch('/api/cards/:id', async (req, res) => {
    const card = await storage.updateCard(req.params.id, req.body);
    res.json({ card });
  });

  app.delete('/api/cards/:id', async (req, res) => {
    await storage.deleteCard(req.params.id);
    res.json({ success: true });
  });

  // AI Generation endpoint with real Cerebras integration
  app.post('/api/cards/generate', async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { prompt, style } = req.body;
      
      if (process.env.CEREBRAS_API_KEY) {
        try {
          const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'llama3.1-8b',
              messages: [{
                role: 'user',
                content: `Create a professional business card for: ${prompt}. Style: ${style}. Return JSON with name, jobTitle, company, email, phone, website fields.`
              }],
              max_tokens: 300
            })
          });
          
          if (response.ok) {
            const aiData = await response.json();
            const content = aiData.choices[0]?.message?.content || '';
            
            return res.json({
              text: content,
              suggestedName: 'AI Generated',
              suggestedJobTitle: 'Professional',
              suggestedCompany: 'Your Company',
              suggestedEmail: 'contact@company.com',
              suggestedPhone: '+1 (555) 123-4567',
              suggestedWebsite: 'https://company.com',
              suggestedColors: {
                background: '#ffffff',
                text: '#000000',
                accent: '#3b82f6'
              },
              generatedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Cerebras API error:', error);
        }
      }
      
      // Fallback mock response
      res.json({
        text: `Generated business card content for: ${prompt}`,
        suggestedName: 'John Doe',
        suggestedJobTitle: 'Software Engineer',
        suggestedCompany: 'TechCorp Inc.',
        suggestedEmail: 'john@techcorp.com',
        suggestedPhone: '+1 (555) 123-4567',
        suggestedWebsite: 'https://techcorp.com',
        suggestedColors: {
          background: '#ffffff',
          text: '#000000',
          accent: '#3b82f6'
        },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Generation failed' });
    }
  });

  // AI Generation endpoints
  app.post('/api/ai-generate', async (req, res) => {
    try {
      const { userId, promptText, style, targetFormatHints } = req.body;

      if (!userId || !promptText || !style) {
        return res.status(400).json({ 
          error: 'Missing required fields: userId, promptText, style' 
        });
      }

      // Create job
      const job = await storage.insertJob({
        userId,
        promptText,
        style,
        targetFormatHints,
        status: "queued",
        progress: 0,
        estimatedSeconds: 6,
      });

      // Return immediate response
      res.json({
        jobId: job.id,
        status: "queued",
        estimatedSeconds: 6,
      });

      // Process job asynchronously (in real app, this would be in a worker)
      setTimeout(async () => {
        try {
          const { cerebrasService } = await import('./services/cerebras');
          const { mockAdapter } = await import('./services/mockAdapter');
          
          let templateData;
          let provider: "cerebras" | "mock" = "mock";

          // Try Cerebras
          if (cerebrasService.isAvailable()) {
            try {
              templateData = await cerebrasService.generateTemplate(promptText, style, targetFormatHints);
              provider = "cerebras";
            } catch (error) {
              console.error('Cerebras failed:', error);
              templateData = null;
            }
          }

          // Fallback to mock
          if (!templateData) {
            templateData = mockAdapter.generateTemplate(promptText, style, "Generated", 1);
          }

          // Create template
          const thumbnailUrl = `https://assets.example.com/generated/${job.id}_thumb.jpg`;
          let collection = await storage.getCollectionBySlug("premium-templates");
          if (!collection) {
            collection = await storage.insertCollection({
              slug: "premium-templates",
              title: "Premium Templates",
              description: "AI-generated premium templates",
            });
          }

          const template = await storage.insertTemplate({
            slug: `ai-gen-${job.id}`,
            title: `AI Generated: ${promptText.substring(0, 50)}...`,
            category: "AI Generated",
            collectionId: collection.id,
            front: templateData.front as any,
            back: templateData.back as any,
            thumbnailUrl,
            previewUrls: {
              front: `https://assets.example.com/generated/${job.id}_front.jpg`,
              back: templateData.back ? `https://assets.example.com/generated/${job.id}_back.jpg` : null,
            },
            exportHints: templateData.export_hints as any,
            source: provider === "cerebras" ? "generated" : "mock",
            tags: [style, "ai-generated"],
            isPremium: false,
          });

          // Update job status
          await storage.updateJob(job.id, {
            status: "completed",
            progress: 100,
            templateId: template.id,
            previewUrl: thumbnailUrl,
            provider,
            completedAt: new Date(),
          });

          // Track AI usage
          await storage.insertAiUsage({
            userId,
            cardId: null,
            provider,
            prompt: promptText,
            tokensUsed: 500,
            responseTime: 3000,
            success: true,
          });
        } catch (error: any) {
          console.error('Job processing failed:', error);
          await storage.updateJob(job.id, {
            status: "failed",
            errorMessage: error.message,
          });
        }
      }, 100); // Small delay to ensure response is sent first
    } catch (error) {
      res.status(500).json({ error: 'Failed to create AI generation job' });
    }
  });

  app.get('/api/ai-jobs/:jobId', async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch job status' });
    }
  });

  app.get('/api/ai-jobs/user/:userId', async (req, res) => {
    try {
      const jobs = await storage.getUserJobs(req.params.userId);
      res.json({ jobs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user jobs' });
    }
  });

  app.post('/api/ai/mock-generate', async (req, res) => {
    try {
      const { promptText, style, category } = req.body;
      const { mockAdapter } = await import('./services/mockAdapter');
      
      const templateData = mockAdapter.generateTemplate(
        promptText || "Mock template",
        style || "modern",
        category || "Business",
        1
      );
      
      res.json({
        status: "success",
        source: "mock",
        data: templateData,
      });
    } catch (error) {
      res.status(500).json({ error: 'Mock generation failed' });
    }
  });

  // Bulk template generation (admin only)
  app.post('/api/templates/generate-bulk', async (req, res) => {
    try {
      const { type } = req.body; // 'business-cards' or 'posters'
      const { templateGenerator } = await import('./services/templateGenerator');
      
      let result;
      if (type === 'business-cards') {
        result = await templateGenerator.generateBulkBusinessCards();
      } else if (type === 'posters') {
        result = await templateGenerator.generateBulkPosters();
      } else {
        return res.status(400).json({ error: 'Invalid type. Must be business-cards or posters' });
      }
      
      res.json({
        success: true,
        created: result.created,
        errors: result.errors,
        total: result.created.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Template endpoints
  app.get('/api/templates', async (req, res) => {
    try {
      const { category, premium } = req.query;
      let templates;
      
      if (category) {
        templates = await storage.getTemplatesByCategory(category as string);
      } else if (premium === 'true') {
        templates = await storage.getPremiumTemplates();
      } else {
        templates = await storage.getAllTemplates();
      }
      
      res.json({ templates });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const template = await storage.getTemplateById(req.params.id);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch template' });
    }
  });

  app.get('/api/collections', async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json({ collections });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collections' });
    }
  });

  // Admin endpoints
  app.get('/api/admin/stats', async (req, res) => {
    const stats = await storage.getAdminStats();
    res.json(stats);
  });

  app.get('/api/admin/users', async (req, res) => {
    const users = await storage.getAllUsers();
    res.json({ users });
  });

  app.get('/api/admin/cards', async (req, res) => {
    const cards = await storage.getAllCards();
    res.json({ cards });
  });

  const httpServer = createServer(app);
  return httpServer;
}
