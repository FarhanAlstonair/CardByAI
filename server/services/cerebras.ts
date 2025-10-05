import type { TemplateCanvas, TemplateElement } from "@shared/schema";

export interface CerebrasResponse {
  front: TemplateCanvas;
  back?: TemplateCanvas;
  assets: Array<{
    type: "svg" | "png";
    url: string;
    svgPath?: string;
    dpi?: number;
    purpose: string;
  }>;
  palette: string[];
  fonts: { heading: string; body: string };
  export_hints: {
    recommendedDPI: number;
    vectorPreferred: boolean;
    safeArea?: { top: number; right: number; bottom: number; left: number };
  };
}

export class CerebrasService {
  private apiKey: string | undefined;
  private baseUrl = "https://api.cerebras.ai/v1";

  constructor() {
    this.apiKey = process.env.CEREBRAS_API_KEY;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateTemplate(
    promptText: string,
    style: string,
    targetFormatHints?: any
  ): Promise<CerebrasResponse> {
    if (!this.apiKey) {
      throw new Error("CEREBRAS_API_KEY not configured");
    }

    const systemPrompt = `You are a professional print & UI designer. Return EXACTLY one JSON object matching this schema:
{
  "front": {
    "width": number,
    "height": number,
    "dpi": number,
    "backgroundColor": string,
    "elements": [{
      "type": "text" | "image" | "rect" | "circle" | "path",
      "id": string,
      "left": number,
      "top": number,
      "width": number,
      "height": number,
      "rotation": number,
      "style": {
        "fontFamily": string,
        "fontSize": number,
        "color": string,
        "fill": string,
        "stroke": string,
        "strokeWidth": number,
        "shadow": string
      },
      "content": string,
      "src": string,
      "svgPath": string
    }]
  },
  "back": { same as front },
  "assets": [{
    "type": "svg" | "png",
    "url": string,
    "svgPath": string,
    "dpi": number,
    "purpose": string
  }],
  "palette": [hex colors],
  "fonts": { "heading": font name, "body": font name },
  "export_hints": {
    "recommendedDPI": number (>=300, prefer 600),
    "vectorPreferred": boolean,
    "safeArea": { top, right, bottom, left }
  }
}

Use SVG paths for icons/logos when possible. If not, use high-res PNG (>=600 DPI).`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3.1-8b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: promptText }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cerebras API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("No content in Cerebras response");
      }

      // Parse the JSON response from Cerebras
      const parsed = JSON.parse(content);
      return parsed as CerebrasResponse;
    } catch (error) {
      console.error("Cerebras generation failed:", error);
      throw error;
    }
  }
}

export const cerebrasService = new CerebrasService();
