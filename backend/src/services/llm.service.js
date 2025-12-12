const OpenAI = require('openai');
const { SYSTEM_PROMPTS } = require('../utils/prompt.templates');

class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.client = this.apiKey ? new OpenAI({ apiKey: this.apiKey }) : null;

    if (!this.apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not found. LLMService will use mock data.');
    } else {
      console.log('✅ OpenAI initialized successfully.');
    }
  }

  /**
   * Generate landing page content from user prompt using OpenAI
   * @param {string} prompt - User's SaaS idea description
   * @returns {Promise<Object>} Structured SaaS data
   */
  async generateLandingPageContent(prompt) {
    // If no API key, use fallback mock
    if (!this.client) {
      console.log('🤖 Using Mock LLM for Landing Page (No API Key)');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return this.extractSaaSDataFromPrompt(prompt);
    }

    try {
      console.log('🧠 Calling OpenAI for Landing Page Generation...');

      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini", // Cost-effective and fast
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.LANDING_PAGE },
          { role: "user", content: `Generate SaaS landing page data for this idea: "${prompt}"` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      const data = JSON.parse(content);

      console.log('✨ OpenAI Generation Successful');
      return data;

    } catch (error) {
      console.error('❌ OpenAI API Error:', error.message);
      console.log('⚠️ Falling back to Mock LLM');
      return this.extractSaaSDataFromPrompt(prompt);
    }
  }

  /**
   * Generate Database Schema from prompt
   * @param {string} prompt - SaaS idea
   * @returns {Promise<string>} Prisma Schema (models only)
   */
  async generateDatabaseSchema(prompt) {
    if (!this.client) {
      throw new Error('OpenAI API Key is required for Schema Generation');
    }

    try {
      console.log('🗄️ Calling OpenAI for Database Schema...');

      const completion = await this.client.chat.completions.create({
        model: "gpt-4o", // Better for code/schema generation
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.DB_SCHEMA },
          { role: "user", content: `Generate Prisma schema for: "${prompt}"` }
        ],
        temperature: 0.2, // Lower temperature for deterministic code
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('❌ Schema Generation Error:', error);
      throw error;
    }
  }

  /**
   * Generate API Endpoints structure
   * @param {string} prompt - SaaS idea
   * @returns {Promise<Array>} List of API endpoints
   */
  async generateApiEndpoints(prompt) {
    if (!this.client) return [];

    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.API_STRUCTURE },
          { role: "user", content: `Define REST API for: "${prompt}"` }
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      const data = JSON.parse(content);
      return data.routes || data.endpoints || [];
    } catch (error) {
      console.error('❌ API Generation Error:', error);
      return [];
    }
  }

  /**
   * Refine HTML based on user instruction
   * @param {string} currentHtml - Current HTML content
   * @param {string} instruction - User's instruction for refinement
   * @returns {Promise<string>} Refined HTML content
   */
  async refineHtml(currentHtml, instruction) {
    // If no API key, return current HTML unchanged
    if (!this.client) {
      console.log('🤖 Using Mock LLM for HTML Refinement (No API Key)');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return currentHtml; // Return unchanged in mock mode
    }

    try {
      console.log('🧠 Calling OpenAI for HTML Refinement...');

      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.HTML_REFINEMENT },
          { role: "user", content: `Current HTML:\n${currentHtml}\n\nInstruction: ${instruction}\n\nReturn only the refined HTML.` }
        ],
        temperature: 0.7,
      });

      const refinedHtml = completion.choices[0].message.content;
      console.log('✨ HTML Refinement Successful');
      return refinedHtml;

    } catch (error) {
      console.error('❌ HTML Refinement Error:', error.message);
      throw error;
    }
  }

  // ==========================================
  // MOCK FALLBACK METHODS (Legacy Logic)
  // ==========================================

  extractSaaSDataFromPrompt(prompt) {
    // Enhanced prompt analysis using contextual understanding
    const lowerPrompt = prompt.toLowerCase();

    let name = this.generateSaaSName(prompt);
    let tagline = this.generateTagline(prompt);
    let market = this.identifyMarket(prompt);
    let features = this.generateFeatures(prompt);
    let cta = this.generateCTA(prompt);
    let description = this.generateDescription(prompt);
    let problemStatement = this.generateProblemStatement(prompt);
    let solution = this.generateSolution(prompt);
    let targetAudience = this.identifyTargetAudience(prompt);
    let pricingModel = this.determinePricingModel(prompt);
    let usp = this.generateUSP(prompt);
    // Take first 3 features as MVP
    let mvpFeatures = features.slice(0, 3);

    return {
      name,
      tagline,
      description,
      market,
      targetAudience,
      problemStatement,
      solution,
      features,
      mvpFeatures,
      usp,
      pricingModel,
      cta,
      promptAnalysis: `[MOCK MODE] Generated from basic analysis of: "${prompt}". Configure OpenAI API Key for AI-powered results.`
    };
  }

  generateSaaSName(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('task')) return 'TaskFlow';
    if (lowerPrompt.includes('book')) return 'Bookr';
    if (lowerPrompt.includes('fitness')) return 'FitForge';
    return 'SaaSForge'; // Default
  }

  generateTagline(prompt) {
    return `The smart solution for your needs.`;
  }

  identifyMarket(prompt) {
    return 'General Market';
  }

  generateFeatures(prompt) {
    return ['Dashboard', 'Analytics', 'User Management', 'Settings', 'Notifications'];
  }

  generateCTA(prompt) {
    return 'Get Started';
  }

  generateDescription(prompt) {
    return `A comprehensive solution to manage your business efficiently.`;
  }

  generateProblemStatement(prompt) {
    return 'Managing processes manually is inefficient and prone to errors.';
  }

  generateSolution(prompt) {
    return 'Our platform automates workflows and centralizes data.';
  }

  identifyTargetAudience(prompt) {
    return 'Business Owners';
  }

  determinePricingModel(prompt) {
    return 'Freemium';
  }

  generateUSP(prompt) {
    return 'All-in-one platform';
  }

  extractDomainWords(prompt) {
    return ['business'];
  }
}

module.exports = new LLMService();