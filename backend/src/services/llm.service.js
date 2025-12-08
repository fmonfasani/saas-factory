// Mock LLM service - in a real implementation, this would connect to OpenAI/Claude API
class LLMService {
  /**
   * Generate landing page content from user prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {Promise<Object>} Structured SaaS data
   */
  async generateLandingPageContent(prompt) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would call OpenAI/Claude API
    // For now, we'll generate enhanced mock data based on the prompt
    return this.extractSaaSDataFromPrompt(prompt);
  }
  
  /**
   * Extract SaaS data from prompt with enhanced analysis
   * @param {string} prompt - User's SaaS idea description
   * @returns {Object} Structured SaaS data
   */
  extractSaaSDataFromPrompt(prompt) {
    // Enhanced prompt analysis using contextual understanding
    const lowerPrompt = prompt.toLowerCase();
    
    // Advanced SaaS name generation based on domain context
    let name = this.generateSaaSName(prompt);
    
    // Context-aware tagline generation
    let tagline = this.generateTagline(prompt);
    
    // Sophisticated market identification
    let market = this.identifyMarket(prompt);
    
    // Comprehensive feature set generation
    let features = this.generateFeatures(prompt);
    
    // Contextual CTA generation
    let cta = this.generateCTA(prompt);
    
    // Additional SaaS data fields for richer generation
    let description = this.generateDescription(prompt);
    let problemStatement = this.generateProblemStatement(prompt);
    let solution = this.generateSolution(prompt);
    let targetAudience = this.identifyTargetAudience(prompt);
    let pricingModel = this.determinePricingModel(prompt);
    let usp = this.generateUSP(prompt);
    let mvpFeatures = this.generateMVPFeatures(features);
    
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
      promptAnalysis: `Enhanced analysis of your prompt: "${prompt}". Generated comprehensive SaaS concept with market insights.`
    };
  }
  
  /**
   * Generate a contextual SaaS name based on the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Generated SaaS name
   */
  generateSaaSName(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Industry-specific naming patterns
    const namingPatterns = [
      // Task/Productivity
      { keywords: ['task', 'productivity', 'workflow', 'project'], names: ['TaskFlow', 'Productivix', 'WorkflowPro', 'ProjectPilot'] },
      // Booking/Reservation
      { keywords: ['book', 'reserve', 'schedule', 'appointment'], names: ['Bookr', 'Reservio', 'ScheduleSync', 'Appointly'] },
      // Freelance/Business
      { keywords: ['freelance', 'business', 'consult', 'client'], names: ['FreelanceHub', 'BizBoost', 'ConsultPro', 'ClientConnect'] },
      // Restaurant/Hospitality
      { keywords: ['restaurant', 'food', 'meal', 'dine'], names: ['DineEase', 'FoodFlow', 'MealMaster', 'RestaurantRx'] },
      // Fitness/Health
      { keywords: ['fitness', 'health', 'workout', 'gym'], names: ['FitForge', 'HealthHub', 'WorkoutWise', 'GymGenie'] },
      // Finance/Accounting
      { keywords: ['finance', 'money', 'account', 'budget'], names: ['Financia', 'MoneyMind', 'AccountAce', 'BudgetBot'] },
      // Education/Learning
      { keywords: ['learn', 'education', 'course', 'teach'], names: ['LearnLaunch', 'EduEdge', 'CourseCraft', 'TeachTools'] },
      // E-commerce/Retail
      { keywords: ['shop', 'store', 'sell', 'retail'], names: ['ShopSphere', 'StoreSync', 'SellSmart', 'RetailReach'] },
      // Marketing/Digital
      { keywords: ['market', 'digital', 'social', 'ad'], names: ['MarketMaven', 'DigitalDrive', 'SocialSpark', 'AdApt'] },
      // Analytics/Data
      { keywords: ['analy', 'data', 'insight', 'metric'], names: ['DataDash', 'InsightIQ', 'MetricMind', 'Analytix'] }
    ];
    
    // Find matching pattern
    for (const pattern of namingPatterns) {
      if (pattern.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        const randomIndex = Math.floor(Math.random() * pattern.names.length);
        return pattern.names[randomIndex];
      }
    }
    
    // Default naming approach
    const defaultNames = ['SaaSForge', 'InnovateX', 'Solutionary', 'NextGen Labs', 'VentureVault'];
    const randomIndex = Math.floor(Math.random() * defaultNames.length);
    return defaultNames[randomIndex];
  }
  
  /**
   * Generate a contextual tagline based on the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Generated tagline
   */
  generateTagline(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Tagline templates based on intent
    const taglineTemplates = [
      // Simplification/Solving complexity
      { keywords: ['easy', 'simple', 'manage', 'handle'], 
        templates: ['Simplify your {domain}', 'Make {domain} effortless', 'Handle {domain} with ease'] },
      // Empowerment/Control
      { keywords: ['control', 'empower', 'command', 'master'], 
        templates: ['Take control of your {domain}', 'Empower your {domain}', 'Master your {domain}'] },
      // Optimization/Improvement
      { keywords: ['boost', 'improve', 'optimize', 'enhance'], 
        templates: ['Optimize your {domain}', 'Boost your {domain}', 'Enhance your {domain}'] },
      // Automation
      { keywords: ['auto', 'automate', 'smart', 'intelligent'], 
        templates: ['Automate your {domain}', 'Smart {domain} solutions', 'Intelligent {domain} platform'] },
      // Time-saving
      { keywords: ['time', 'quick', 'fast', 'save'], 
        templates: ['Save time on {domain}', 'Quick {domain} solutions', 'Fast-track your {domain}'] }
    ];
    
    // Extract domain/context words from prompt
    const domainWords = this.extractDomainWords(prompt);
    const domain = domainWords.length > 0 ? domainWords[0] : 'business';
    
    // Find matching template
    for (const template of taglineTemplates) {
      if (template.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        const randomIndex = Math.floor(Math.random() * template.templates.length);
        return template.templates[randomIndex].replace('{domain}', domain);
      }
    }
    
    // Default taglines
    const defaultTaglines = [
      `Revolutionize your ${domain}`,
      `The smart way to handle ${domain}`,
      `Next-generation ${domain} platform`,
      `Transform your ${domain} experience`
    ];
    const randomIndex = Math.floor(Math.random() * defaultTaglines.length);
    return defaultTaglines[randomIndex];
  }
  
  /**
   * Identify the target market from the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Identified market
   */
  identifyMarket(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Market identification patterns
    const markets = [
      { keywords: ['freelance', 'freelancer', 'contractor'], market: 'Freelancers & Independent Contractors' },
      { keywords: ['small business', 'smb', 'startup'], market: 'Small Businesses & Startups' },
      { keywords: ['enterprise', 'corporate', 'large company'], market: 'Enterprise & Large Corporations' },
      { keywords: ['restaurant', 'cafe', 'food service'], market: 'Restaurants & Food Services' },
      { keywords: ['fitness', 'gym', 'health'], market: 'Fitness Centers & Health Professionals' },
      { keywords: ['education', 'school', 'university'], market: 'Educational Institutions' },
      { keywords: ['healthcare', 'hospital', 'clinic'], market: 'Healthcare Providers' },
      { keywords: ['real estate', 'property'], market: 'Real Estate Professionals' },
      { keywords: ['ecommerce', 'online store', 'shop'], market: 'E-commerce Businesses' },
      { keywords: ['marketing', 'advertising'], market: 'Marketing Agencies' },
      { keywords: ['nonprofit', 'ngo', 'charity'], market: 'Non-Profit Organizations' }
    ];
    
    // Find matching market
    for (const marketEntry of markets) {
      if (marketEntry.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        return marketEntry.market;
      }
    }
    
    // Default markets based on general context
    if (lowerPrompt.includes('task') || lowerPrompt.includes('productivity')) {
      return 'Professionals & Teams';
    } else if (lowerPrompt.includes('finance') || lowerPrompt.includes('account')) {
      return 'Financial Professionals & Individuals';
    } else if (lowerPrompt.includes('project')) {
      return 'Project Managers & Teams';
    }
    
    return 'General Business Market';
  }
  
  /**
   * Identify the target audience from the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Identified target audience
   */
  identifyTargetAudience(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Audience identification patterns
    const audiences = [
      { keywords: ['freelance', 'freelancer'], audience: 'Freelancers and independent professionals seeking efficient tools' },
      { keywords: ['small business', 'smb'], audience: 'Small business owners and entrepreneurs' },
      { keywords: ['manager', 'team lead'], audience: 'Managers and team leaders' },
      { keywords: ['developer', 'programmer'], audience: 'Software developers and technical teams' },
      { keywords: ['designer', 'creative'], audience: 'Designers and creative professionals' },
      { keywords: ['student'], audience: 'Students and educational professionals' },
      { keywords: ['teacher', 'instructor'], audience: 'Teachers and instructors' },
      { keywords: ['hr', 'human resource'], audience: 'HR professionals and recruiters' },
      { keywords: ['sales'], audience: 'Sales professionals and account managers' }
    ];
    
    // Find matching audience
    for (const audience of audiences) {
      if (audience.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        return audience.audience;
      }
    }
    
    return 'Business professionals and teams looking for efficient solutions';
  }
  
  /**
   * Generate features based on the prompt context
   * @param {string} prompt - User's SaaS idea description
   * @returns {Array<string>} Generated features
   */
  generateFeatures(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Feature sets based on domain context
    const featureSets = [
      // Task/Project Management
      { 
        keywords: ['task', 'project', 'workflow'], 
        features: [
          'Intuitive Task Management Dashboard',
          'Real-time Team Collaboration',
          'Progress Tracking & Analytics',
          'Customizable Workflows',
          'Deadline & Milestone Tracking',
          'File Sharing & Document Management',
          'Time Tracking Integration',
          'Mobile Accessibility'
        ] 
      },
      // Booking/Scheduling
      { 
        keywords: ['book', 'reserve', 'schedule', 'appointment'], 
        features: [
          'Automated Booking System',
          'Calendar Synchronization',
          'Customizable Availability',
          'Email & SMS Notifications',
          'Payment Processing Integration',
          'Resource Management',
          'Customer Self-Service Portal',
          'Analytics & Reporting'
        ] 
      },
      // Freelance/Business
      { 
        keywords: ['freelance', 'business', 'client'], 
        features: [
          'Client Management Dashboard',
          'Invoice Generation & Tracking',
          'Time & Expense Tracking',
          'Project Portfolio Showcase',
          'Contract Management',
          'Payment Processing',
          'Performance Analytics',
          'Proposal Creation Tools'
        ] 
      },
      // Fitness/Health
      { 
        keywords: ['fitness', 'health', 'workout'], 
        features: [
          'Personalized Workout Plans',
          'Progress Tracking & Analytics',
          'Nutrition Guidance',
          'Goal Setting & Achievement',
          'Community Support Platform',
          'Integration with Wearables',
          'Video Exercise Library',
          'Health Data Visualization'
        ] 
      },
      // Finance/Accounting
      { 
        keywords: ['finance', 'money', 'account', 'budget'], 
        features: [
          'Expense Tracking & Categorization',
          'Budget Planning & Monitoring',
          'Financial Reporting Dashboard',
          'Investment Portfolio Tracking',
          'Bill Reminder & Payment',
          'Multi-account Sync',
          'Tax Preparation Assistance',
          'Financial Goal Setting'
        ] 
      },
      // Education/Learning
      { 
        keywords: ['learn', 'education', 'course', 'teach'], 
        features: [
          'Interactive Course Creation',
          'Progress Assessment Tools',
          'Student Performance Analytics',
          'Discussion Forums',
          'Resource Library',
          'Certification Management',
          'Multi-device Access',
          'Gamified Learning Paths'
        ] 
      }
    ];
    
    // Find matching feature set
    for (const featureSet of featureSets) {
      if (featureSet.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        // Return a random selection of 5-7 features
        const shuffled = [...featureSet.features].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5 + Math.floor(Math.random() * 3)); // 5-7 features
      }
    }
    
    // Default feature set
    const defaultFeatures = [
      'User-friendly Dashboard',
      'Advanced Analytics',
      'Secure Cloud Storage',
      'Cross-platform Compatibility',
      'Customizable Settings',
      '24/7 Customer Support',
      'Regular Feature Updates'
    ];
    
    // Return a random selection of 5-7 features
    const shuffled = [...defaultFeatures].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5 + Math.floor(Math.random() * 3)); // 5-7 features
  }
  
  /**
   * Generate MVP features from the full feature set
   * @param {Array<string>} features - Full feature set
   * @returns {Array<string>} MVP features (subset of full features)
   */
  generateMVPFeatures(features) {
    if (!Array.isArray(features) || features.length === 0) {
      return ['Core Dashboard', 'Basic User Management', 'Essential Functionality'];
    }
    
    // Take the first 3 features as MVP
    return features.slice(0, 3);
  }
  
  /**
   * Generate CTA based on the prompt context
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Generated CTA
   */
  generateCTA(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // CTA variations based on context
    if (lowerPrompt.includes('free')) {
      return 'Start Free Trial';
    } else if (lowerPrompt.includes('demo') || lowerPrompt.includes('show')) {
      return 'Request Demo';
    } else if (lowerPrompt.includes('early') || lowerPrompt.includes('beta')) {
      return 'Join Beta Program';
    } else if (lowerPrompt.includes('download') || lowerPrompt.includes('app')) {
      return 'Download Now';
    }
    
    // Default CTAs
    const defaultCTAs = ['Get Started', 'Try It Free', 'Sign Up Today', 'Learn More'];
    const randomIndex = Math.floor(Math.random() * defaultCTAs.length);
    return defaultCTAs[randomIndex];
  }
  
  /**
   * Generate a brief description based on the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Generated description
   */
  generateDescription(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const domainWords = this.extractDomainWords(prompt);
    const domain = domainWords.length > 0 ? domainWords.join(', ') : 'business processes';
    
    const templates = [
      `An innovative solution designed to streamline ${domain} and boost productivity.`,
      `A cutting-edge platform that transforms how teams handle ${domain}.`,
      `Revolutionary software that simplifies ${domain} for modern businesses.`,
      `The ultimate tool for managing ${domain} efficiently and effectively.`
    ];
    
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }
  
  /**
   * Generate a problem statement based on the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Generated problem statement
   */
  generateProblemStatement(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('task') || lowerPrompt.includes('productivity')) {
      return 'Teams struggle with inefficient task management, leading to missed deadlines, miscommunication, and reduced productivity.';
    } else if (lowerPrompt.includes('book') || lowerPrompt.includes('reserve')) {
      return 'Manual booking systems cause scheduling conflicts, double bookings, and poor customer experiences.';
    } else if (lowerPrompt.includes('freelance')) {
      return 'Freelancers waste time on administrative tasks instead of focusing on their core services.';
    } else if (lowerPrompt.includes('fitness')) {
      return 'People struggle to maintain consistent fitness routines without personalized guidance and progress tracking.';
    } else if (lowerPrompt.includes('finance')) {
      return 'Individuals and businesses lack clear visibility into their financial health and spending patterns.';
    }
    
    return 'Organizations face challenges in efficiently managing their core operations, leading to wasted time and resources.';
  }
  
  /**
   * Generate a solution statement based on the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Generated solution statement
   */
  generateSolution(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const name = this.generateSaaSName(prompt);
    
    if (lowerPrompt.includes('task') || lowerPrompt.includes('productivity')) {
      return `${name} centralizes task management, automates workflows, and enhances team collaboration to maximize productivity.`;
    } else if (lowerPrompt.includes('book') || lowerPrompt.includes('reserve')) {
      return `${name} automates the booking process, eliminates scheduling conflicts, and improves customer satisfaction.`;
    } else if (lowerPrompt.includes('freelance')) {
      return `${name} handles invoicing, time tracking, and client management so freelancers can focus on their craft.`;
    } else if (lowerPrompt.includes('fitness')) {
      return `${name} provides personalized workout plans, tracks progress, and motivates users to achieve their fitness goals.`;
    } else if (lowerPrompt.includes('finance')) {
      return `${name} offers comprehensive financial insights, automated expense tracking, and budget planning tools.`;
    }
    
    return `${name} provides an intuitive platform that solves core operational challenges and drives efficiency.`;
  }
  
  /**
   * Generate a unique selling proposition based on the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Generated USP
   */
  generateUSP(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const name = this.generateSaaSName(prompt);
    
    if (lowerPrompt.includes('ai') || lowerPrompt.includes('intelligent')) {
      return `The only ${name} with advanced AI-driven insights and automation`;
    } else if (lowerPrompt.includes('simple') || lowerPrompt.includes('easy')) {
      return `The simplest way to manage your ${this.extractDomainWords(prompt)[0] || 'business'} processes`;
    } else if (lowerPrompt.includes('powerful') || lowerPrompt.includes('advanced')) {
      return `Powerful features in an intuitive interface`;
    }
    
    return `The complete solution for modern ${this.extractDomainWords(prompt)[0] || 'business'} challenges`;
  }
  
  /**
   * Determine pricing model based on the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Determined pricing model
   */
  determinePricingModel(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('freelance') || lowerPrompt.includes('small business')) {
      return 'Freemium model with tiered subscriptions for individuals and small teams';
    } else if (lowerPrompt.includes('enterprise') || lowerPrompt.includes('corporate')) {
      return 'Custom enterprise pricing with dedicated support';
    }
    
    return 'Tiered subscription model with monthly and annual plans';
  }
  
  /**
   * Extract domain/context words from the prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {Array<string>} Extracted domain words
   */
  extractDomainWords(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const stopWords = ['the', 'and', 'for', 'with', 'to', 'of', 'in', 'on', 'at', 'by', 'an', 'a', 'is', 'are'];
    const words = lowerPrompt.split(/\s+/).filter(word => word.length > 3 && !stopWords.includes(word));
    return [...new Set(words)]; // Remove duplicates
  }
}

module.exports = new LLMService();