import { storage } from "./storage";
import { templateGenerator } from "./services/templateGenerator";

export async function initializeApp() {
  console.log("🚀 Initializing CardCraft AI...");

  try {
    // Check if premium templates already exist
    const existingTemplates = await storage.getPremiumTemplates();
    
    if (existingTemplates.length > 0) {
      console.log(`✅ Found ${existingTemplates.length} existing premium templates`);
      return;
    }

    console.log("📦 No templates found. Generating sample premium templates...");

    // Generate sample business card templates (15 templates)
    const businessVerticals = ["Tech Founder", "Photographer", "Lawyer", "Designer", "Doctor"];
    const styles = ["luxury", "minimal", "modern"];
    
    let createdCount = 0;
    let errorCount = 0;
    let templateIndex = 1;

    for (const vertical of businessVerticals) {
      for (const style of styles) {
        try {
          await templateGenerator.generateAndInsert({
            category: vertical,
            style,
            index: templateIndex++,
            isPremium: true,
            isPoster: false,
          });
          createdCount++;
          console.log(`✓ Created ${vertical} - ${style}`);
        } catch (error) {
          errorCount++;
          console.error(`✗ Failed ${vertical} - ${style}:`, error);
        }
      }
    }

    // Generate sample poster templates (5 templates)
    const posterCategories = ["Event Poster", "Product Launch", "Workshop", "Sale", "Conference"];
    const posterStyles = ["modern", "bold", "minimal", "creative", "luxury"];

    for (let i = 0; i < posterCategories.length; i++) {
      try {
        await templateGenerator.generateAndInsert({
          category: posterCategories[i],
          style: posterStyles[i],
          index: templateIndex++,
          isPremium: true,
          isPoster: true,
        });
        createdCount++;
        console.log(`✓ Created ${posterCategories[i]} poster`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed ${posterCategories[i]} poster:`, error);
      }
    }

    console.log(`\n✅ Template generation complete!`);
    console.log(`   Created: ${createdCount} templates`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount} templates failed`);
    }
    console.log(`   Source: ${process.env.CEREBRAS_API_KEY ? 'Cerebras AI' : 'Mock adapter'}\n`);
  } catch (error) {
    console.error("❌ Initialization failed:", error);
  }
}
