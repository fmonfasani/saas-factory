const fs = require('fs').promises;
const path = require('path');

// In-memory storage for A/B test results (in production, use a database)
const abTestResults = new Map();

class ABTestingService {
  constructor() {
    this.templates = {
      A: this.templateA,
      B: this.templateB
    };
    
    // Initialize results tracking
    this.initializeResults();
  }

  initializeResults() {
    // Initialize counters for each template
    abTestResults.set('A', {
      views: 0,
      generationTime: 0,
      totalGenerations: 0,
      ratings: [],
      previewViews: 0
    });
    
    abTestResults.set('B', {
      views: 0,
      generationTime: 0,
      totalGenerations: 0,
      ratings: [],
      previewViews: 0
    });
  }

  /**
   * Randomly assign a user to template A or B
   * @returns {string} Template variant ('A' or 'B')
   */
  assignVariant() {
    // Simple random assignment (50/50 split)
    return Math.random() < 0.5 ? 'A' : 'B';
  }

  /**
   * Get template function by variant
   * @param {string} variant - Template variant ('A' or 'B')
   * @returns {Function} Template function
   */
  getTemplate(variant) {
    return this.templates[variant] || this.templates.A;
  }

  /**
   * Record a preview view for a template
   * @param {string} variant - Template variant ('A' or 'B')
   */
  recordPreviewView(variant) {
    if (abTestResults.has(variant)) {
      const stats = abTestResults.get(variant);
      stats.previewViews += 1;
      abTestResults.set(variant, stats);
    }
  }

  /**
   * Record generation metrics
   * @param {string} variant - Template variant ('A' or 'B')
   * @param {number} generationTime - Time taken to generate in milliseconds
   */
  recordGeneration(variant, generationTime) {
    if (abTestResults.has(variant)) {
      const stats = abTestResults.get(variant);
      stats.totalGenerations += 1;
      stats.generationTime += generationTime;
      abTestResults.set(variant, stats);
    }
  }

  /**
   * Record user rating
   * @param {string} variant - Template variant ('A' or 'B')
   * @param {number} rating - User rating (1-5)
   */
  recordRating(variant, rating) {
    if (abTestResults.has(variant) && rating >= 1 && rating <= 5) {
      const stats = abTestResults.get(variant);
      stats.ratings.push(rating);
      abTestResults.set(variant, stats);
    }
  }

  /**
   * Get A/B test results
   * @returns {Object} Test results for both variants
   */
  getResults() {
    const results = {};
    
    for (const [variant, stats] of abTestResults.entries()) {
      const avgGenerationTime = stats.totalGenerations > 0 
        ? stats.generationTime / stats.totalGenerations 
        : 0;
      
      const avgRating = stats.ratings.length > 0
        ? stats.ratings.reduce((sum, rating) => sum + rating, 0) / stats.ratings.length
        : 0;
      
      results[variant] = {
        views: stats.views,
        totalGenerations: stats.totalGenerations,
        avgGenerationTime: parseFloat(avgGenerationTime.toFixed(2)),
        totalRatings: stats.ratings.length,
        avgRating: parseFloat(avgRating.toFixed(2)),
        previewViews: stats.previewViews
      };
    }
    
    return results;
  }

  /**
   * Template A - Original design with gradient header
   * @param {Object} data - SaaS data
   * @returns {string} Generated HTML
   */
  templateA(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name || 'SaaS Generator'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 3rem 1rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        .tagline {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-top: 0.5rem;
        }
        .cta-button {
            background-color: #ff6b6b;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 1.1rem;
            border-radius: 50px;
            cursor: pointer;
            margin-top: 1.5rem;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        .feature-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .feature-card h3 {
            color: #667eea;
            margin-top: 0;
        }
        footer {
            text-align: center;
            margin-top: 3rem;
            padding: 1rem;
            color: #666;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <header>
        <h1>${data.name || 'Your SaaS Idea'}</h1>
        <p class="tagline">${data.tagline || 'Your innovative solution'}</p>
        <button class="cta-button">${data.cta || 'Get Started'}</button>
    </header>

    <section class="features">
        ${(data.features || []).map(feature => `
        <div class="feature-card">
            <h3>${feature}</h3>
            <p>Detailed description of this feature and how it benefits your target market.</p>
        </div>
        `).join('')}
    </section>

    <footer>
        <p>© ${new Date().getFullYear()} ${data.name || 'SaaS Generator'}. All rights reserved.</p>
    </footer>
</body>
</html>`;
  }

  /**
   * Template B - Card-based design with modern aesthetics
   * @param {Object} data - SaaS data
   * @returns {string} Generated HTML
   */
  templateB(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name || 'SaaS Generator'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #fafafa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        header {
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            padding: 1rem 0;
        }
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2563eb;
        }
        .hero {
            padding: 5rem 0;
            text-align: center;
            background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #1e40af;
        }
        .hero p {
            font-size: 1.25rem;
            color: #4b5563;
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
            font-size: 1rem;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
        .features {
            padding: 5rem 0;
        }
        .section-title {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 3rem;
            color: #1e293b;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        .feature-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        .feature-icon {
            width: 50px;
            height: 50px;
            background-color: #dbeafe;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            color: #2563eb;
            font-size: 1.5rem;
        }
        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        footer {
            background-color: #1e293b;
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <header>
        <div class="container navbar">
            <div class="logo">${data.name || 'SaaS Generator'}</div>
            <nav>
                <a href="#" class="btn">Get Started</a>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>${data.name || 'Your SaaS Idea'}</h1>
            <p>${data.tagline || 'Your innovative solution'}</p>
            <button class="btn">${data.cta || 'Get Started'}</button>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2 class="section-title">Key Features</h2>
            <div class="features-grid">
                ${(data.features || []).map(feature => `
                <div class="feature-card">
                    <div class="feature-icon">★</div>
                    <h3>${feature}</h3>
                    <p>Detailed description of this feature and how it benefits your target market.</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>© ${new Date().getFullYear()} ${data.name || 'SaaS Generator'}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }
}

const abTestingService = new ABTestingService();

module.exports = abTestingService;
module.exports.default = abTestingService;