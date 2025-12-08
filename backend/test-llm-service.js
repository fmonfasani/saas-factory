const llmService = require('./src/services/llm.service');

async function testLLMService() {
  console.log('Testing enhanced LLM service...\n');
  
  // Test cases
  const testPrompts = [
    "SaaS de gestión de tareas para freelancers",
    "AI-powered fitness tracking platform for personal trainers",
    "Booking system for restaurants with table management",
    "Financial analytics tool for small businesses",
    "Project management software for remote teams"
  ];
  
  for (const prompt of testPrompts) {
    console.log(`🔍 Testing prompt: "${prompt}"`);
    try {
      const result = await llmService.generateLandingPageContent(prompt);
      console.log(`✅ Success! Generated SaaS: ${result.name}`);
      console.log(`   Tagline: ${result.tagline}`);
      console.log(`   Market: ${result.market}`);
      console.log(`   Features: ${result.features.join(', ')}`);
      console.log(`   CTA: ${result.cta}\n`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
}

testLLMService();