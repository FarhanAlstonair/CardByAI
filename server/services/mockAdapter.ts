import type { TemplateCanvas, TemplateElement } from "@shared/schema";
import type { CerebrasResponse } from "./cerebras";

export class MockAdapter {
  generateTemplate(
    promptText: string,
    style: string,
    category: string,
    index: number
  ): CerebrasResponse {
    const width = 1050;
    const height = 600;
    const dpi = 300;

    const styleColors = {
      luxury: { bg: "#1a1a1a", text: "#d4af37", accent: "#ffffff" },
      minimal: { bg: "#ffffff", text: "#000000", accent: "#666666" },
      bold: { bg: "#ff4500", text: "#ffffff", accent: "#000000" },
      creative: { bg: "#9b59b6", text: "#ffffff", accent: "#f39c12" },
      modern: { bg: "#2c3e50", text: "#ecf0f1", accent: "#3498db" },
      classic: { bg: "#f5f5f5", text: "#333333", accent: "#8b7355" },
    };

    const colors = styleColors[style as keyof typeof styleColors] || styleColors.modern;

    // Generate deterministic mock data
    const frontElements: TemplateElement[] = [
      {
        type: "text",
        id: `text-name-${index}`,
        left: 50,
        top: 180,
        width: 400,
        height: 60,
        rotation: 0,
        style: {
          fontFamily: "Inter",
          fontSize: 36,
          color: colors.text,
          fill: colors.text,
        },
        content: `${category} ${index}`,
      },
      {
        type: "text",
        id: `text-title-${index}`,
        left: 50,
        top: 260,
        width: 400,
        height: 30,
        rotation: 0,
        style: {
          fontFamily: "Inter",
          fontSize: 18,
          color: colors.accent,
          fill: colors.accent,
        },
        content: `Professional ${category}`,
      },
      {
        type: "text",
        id: `text-contact-${index}`,
        left: 50,
        top: 450,
        width: 400,
        height: 80,
        rotation: 0,
        style: {
          fontFamily: "Inter",
          fontSize: 14,
          color: colors.text,
          fill: colors.text,
        },
        content: "contact@example.com\n+1 (555) 123-4567",
      },
      {
        type: "rect",
        id: `accent-rect-${index}`,
        left: 600,
        top: 50,
        width: 400,
        height: 500,
        rotation: 0,
        style: {
          fill: colors.accent,
        },
      },
    ];

    const backElements: TemplateElement[] = [
      {
        type: "text",
        id: `text-back-tagline-${index}`,
        left: 50,
        top: 250,
        width: 950,
        height: 100,
        rotation: 0,
        style: {
          fontFamily: "Inter",
          fontSize: 24,
          color: colors.text,
          fill: colors.text,
        },
        content: `Excellence in ${category}`,
      },
    ];

    return {
      front: {
        width,
        height,
        dpi,
        backgroundColor: colors.bg,
        elements: frontElements,
      },
      back: {
        width,
        height,
        dpi,
        backgroundColor: colors.bg,
        elements: backElements,
      },
      assets: [
        {
          type: "svg",
          url: `https://assets.example.com/icons/${category.toLowerCase().replace(/\s+/g, '-')}.svg`,
          svgPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
          purpose: "logo",
        },
      ],
      palette: [colors.bg, colors.text, colors.accent],
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      export_hints: {
        recommendedDPI: 600,
        vectorPreferred: true,
        safeArea: { top: 10, right: 10, bottom: 10, left: 10 },
      },
    };
  }

  generatePosterTemplate(
    category: string,
    index: number,
    style: string
  ): CerebrasResponse {
    const width = 2100;
    const height = 2970; // A4 at 300 DPI
    const dpi = 300;

    const styleColors = {
      luxury: { bg: "#1a1a1a", text: "#d4af37", accent: "#ffffff" },
      minimal: { bg: "#ffffff", text: "#000000", accent: "#666666" },
      bold: { bg: "#ff4500", text: "#ffffff", accent: "#000000" },
      creative: { bg: "#9b59b6", text: "#ffffff", accent: "#f39c12" },
      modern: { bg: "#2c3e50", text: "#ecf0f1", accent: "#3498db" },
      classic: { bg: "#f5f5f5", text: "#333333", accent: "#8b7355" },
    };

    const colors = styleColors[style as keyof typeof styleColors] || styleColors.modern;

    const elements: TemplateElement[] = [
      {
        type: "text",
        id: `poster-title-${index}`,
        left: 100,
        top: 800,
        width: 1900,
        height: 200,
        rotation: 0,
        style: {
          fontFamily: "Inter",
          fontSize: 96,
          color: colors.text,
          fill: colors.text,
        },
        content: `${category} Poster ${index}`,
      },
      {
        type: "text",
        id: `poster-subtitle-${index}`,
        left: 100,
        top: 1100,
        width: 1900,
        height: 100,
        rotation: 0,
        style: {
          fontFamily: "Inter",
          fontSize: 48,
          color: colors.accent,
          fill: colors.accent,
        },
        content: "Professional Design",
      },
      {
        type: "rect",
        id: `poster-accent-${index}`,
        left: 100,
        top: 2500,
        width: 1900,
        height: 20,
        rotation: 0,
        style: {
          fill: colors.accent,
        },
      },
    ];

    return {
      front: {
        width,
        height,
        dpi,
        backgroundColor: colors.bg,
        elements,
      },
      assets: [],
      palette: [colors.bg, colors.text, colors.accent],
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      export_hints: {
        recommendedDPI: 600,
        vectorPreferred: true,
        safeArea: { top: 50, right: 50, bottom: 50, left: 50 },
      },
    };
  }
}

export const mockAdapter = new MockAdapter();
