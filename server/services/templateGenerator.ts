import { storage } from "../storage";
import { cerebrasService } from "./cerebras";
import { mockAdapter } from "./mockAdapter";
import type { InsertTemplate } from "@shared/schema";

export interface GenerateTemplateOptions {
  category: string;
  style: string;
  index: number;
  isPremium: boolean;
  isPoster?: boolean;
}

export class TemplateGenerator {
  async generateAndInsert(options: GenerateTemplateOptions): Promise<string> {
    const { category, style, index, isPremium, isPoster } = options;
    const slug = `${category.toLowerCase().replace(/\s+/g, '-')}-${style}-${index}`;

    try {
      let templateData;
      let source: "generated" | "mock" = "mock";

      // Try Cerebras first
      if (cerebrasService.isAvailable()) {
        try {
          const promptText = isPoster 
            ? `Create a professional ${category} poster template in ${style} style. Include title, subtitle, and accent elements. Make it print-ready at 300 DPI.`
            : `Create a premium business card for a ${category} in ${style} style. Include name, title, contact info, and professional design elements. Make it print-ready at 600 DPI.`;
          
          templateData = await cerebrasService.generateTemplate(promptText, style);
          source = "generated";
        } catch (error) {
          console.warn(`Cerebras failed for ${slug}, using mock:`, error);
          templateData = null;
        }
      }

      // Fallback to mock
      if (!templateData) {
        templateData = isPoster
          ? mockAdapter.generatePosterTemplate(category, index, style)
          : mockAdapter.generateTemplate(`Create ${category} card`, style, category, index);
      }

      // Create thumbnail URL (mock or Cloudinary)
      const thumbnailUrl = `https://assets.example.com/premium/${slug}_thumb.jpg`;

      // Get the premium-templates collection
      let collection = await storage.getCollectionBySlug("premium-templates");
      if (!collection) {
        collection = await storage.insertCollection({
          slug: "premium-templates",
          title: "Premium Templates",
          description: "Professional templates for business cards and posters",
        });
      }

      // Insert template
      const template: InsertTemplate = {
        slug,
        title: `${category} - ${style} ${index}`,
        category,
        collectionId: collection.id,
        front: templateData.front as any,
        back: templateData.back as any,
        thumbnailUrl,
        previewUrls: {
          front: `https://assets.example.com/premium/${slug}_front.jpg`,
          back: templateData.back ? `https://assets.example.com/premium/${slug}_back.jpg` : null,
          animated: `https://assets.example.com/premium/${slug}_animated.gif`,
        },
        exportHints: templateData.export_hints as any,
        source,
        tags: [category, style, isPoster ? "poster" : "business-card"],
        isPremium,
      };

      const inserted = await storage.insertTemplate(template);
      return inserted.id;
    } catch (error) {
      console.error(`Failed to generate template ${slug}:`, error);
      throw error;
    }
  }

  async generateBulkBusinessCards(): Promise<{ created: string[]; errors: string[] }> {
    const verticals = [
      "Tech Founder",
      "Photographer",
      "Lawyer",
      "Real Estate Agent",
      "Consultant",
      "Restaurant Owner",
      "Doctor",
      "Fitness Trainer",
      "Designer",
      "Startup VP",
    ];

    const styles = ["luxury", "minimal", "bold", "creative", "modern", "classic", "luxury", "minimal", "bold", "creative"];

    const created: string[] = [];
    const errors: string[] = [];

    for (const vertical of verticals) {
      for (let i = 0; i < 10; i++) {
        try {
          const style = styles[i];
          const id = await this.generateAndInsert({
            category: vertical,
            style,
            index: i + 1,
            isPremium: true,
            isPoster: false,
          });
          created.push(`${vertical}-${style}-${i + 1}`);
        } catch (error) {
          errors.push(`${vertical}-${i + 1}: ${error}`);
        }
      }
    }

    return { created, errors };
  }

  async generateBulkPosters(): Promise<{ created: string[]; errors: string[] }> {
    const categories = [
      "Event Poster",
      "Product Launch",
      "Workshop",
      "Sale",
      "Conference",
    ];

    const styles = ["luxury", "minimal", "bold", "creative", "modern"];

    const created: string[] = [];
    const errors: string[] = [];

    for (const category of categories) {
      for (let i = 0; i < 5; i++) {
        try {
          const style = styles[i];
          const id = await this.generateAndInsert({
            category,
            style,
            index: i + 1,
            isPremium: true,
            isPoster: true,
          });
          created.push(`${category}-${style}-${i + 1}`);
        } catch (error) {
          errors.push(`${category}-${i + 1}: ${error}`);
        }
      }
    }

    return { created, errors };
  }
}

export const templateGenerator = new TemplateGenerator();
