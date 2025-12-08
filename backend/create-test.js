// Simple test script for the enhanced LLM service
const fs = require('fs');
const path = require('path');

// Read the LLM service file
const llmServicePath = path.join(__dirname, 'src', 'services', 'llm.service.js');
let llmServiceCode = fs.readFileSync(llmServicePath, 'utf8');

// Extract the class definition and create a test
const classMatch = llmServiceCode.match(/class LLMService \{[\s\S]*\}/);
if (classMatch) {
  // Create a simplified test version
  const testCode = `
${classMatch[0]}

const llmService = new LLMService();

async function test() {
  console.log('Testing enhanced LLM service...');
  
  const testPrompts = [
    "SaaS de gestión de tareas para freelancers",
    "AI-powered fitness tracking platform for personal trainers",
    "Booking system for restaurants with table management"
  ];
  
  for (const prompt of testPrompts) {
    console.log('\\n🔍 Testing prompt: "' + prompt + '"');
    try {
      const result = llmService.extractSaaSDataFromPrompt(prompt);
      console.log('✅ Success! Generated SaaS: ' + result.name);
      console.log('   Tagline: ' + result.tagline);
      console.log('   Market: ' + result.market);
      console.log('   Features: ' + result.features.slice(0, 3).join(', '));
      console.log('   CTA: ' + result.cta);
    } catch (error) {
      console.log('❌ Error: ' + error.message);
    }
  }
}

test();
`;
  
  // Write test file
  const testFilePath = path.join(__dirname, 'test-llm-simple.js');
  fs.writeFileSync(testFilePath, testCode);
  console.log('Created test file:', testFilePath);
} else {
  console.log('Could not find LLMService class in the file');
}