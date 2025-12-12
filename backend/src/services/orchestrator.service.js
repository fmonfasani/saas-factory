const llmService = require('./llm.service');
const abTestingService = require('./ab-testing.service').default;

// In-memory storage for jobs (in production, use Redis or database)
const jobs = new Map();

/**
 * Helper function to emit events to connected clients
 * @param {string} jobId - Job identifier
 * @param {Object} eventData - Event data to send
 */
function emitEvent(jobId, eventData) {
  const job = jobs.get(jobId);
  if (job && job.clients && job.clients.length > 0) {
    const eventDataString = `data: ${JSON.stringify(eventData)}\n\n`;
    job.clients.forEach(client => {
      try {
        client.write(eventDataString);
      } catch (error) {
        console.error('Error sending event to client:', error);
      }
    });
  }
}

class OrchestratorService {
  constructor() {
    // Jobs are stored in module-level map
  }

  /**
   * Analyze user prompt and extract SaaS structure
   * @param {string} prompt - User's SaaS idea description
   * @returns {Promise<Object>} Structured SaaS data
   */
  async analyzePrompt(prompt) {
    try {
      // Generate structured data from prompt using LLM
      const saasData = await llmService.generateLandingPageContent(prompt);

      // Also generate database schema in parallel or sequential
      let schema = null;
      try {
        console.log('Generating schema for prompt:', prompt);
        schema = await llmService.generateDatabaseSchema(prompt);
      } catch (schemaError) {
        console.error('Schema generation failed (non-fatal):', schemaError);
        // We continue even if schema fails, user can try again
      }

      return {
        success: true,
        data: {
          ...saasData,
          generatedSchema: schema // Include schema in response
        }
      };
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate database schema from prompt
   * @param {string} prompt - User's SaaS idea description
   * @returns {Promise<Object>} Generated Prisma schema
   */
  async generateDatabaseSchema(prompt) {
    try {
      const schema = await llmService.generateDatabaseSchema(prompt);
      return {
        success: true,
        schema: schema
      };
    } catch (error) {
      console.error('Error generating schema:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate landing page HTML from SaaS data
   * @param {Object} saasData - Structured SaaS data
   * @param {string} variant - Template variant ('A' or 'B')
   * @returns {Promise<Object>} Generated HTML and metadata
   */
  async generateLandingPage(saasData, variant = null) {
    try {
      // Track generation time
      const startTime = Date.now();

      // Generate HTML using the specified variant or let it be assigned randomly
      const result = this.generateHTMLFromTemplate(saasData, variant);

      const generationTime = Date.now() - startTime;

      // Record generation metrics
      abTestingService.recordGeneration(result.variant, generationTime);

      return {
        success: true,
        html: result.html,
        metadata: saasData,
        generationTime: generationTime,
        variant: result.variant
      };
    } catch (error) {
      console.error('Error generating landing page:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new generation job
   * @param {string} prompt - User's SaaS idea description
   * @returns {string} Job ID
   */
  createJob(prompt) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const job = {
      id: jobId,
      prompt,
      status: 'created',
      createdAt: new Date(),
      events: [],
      clients: []
    };

    jobs.set(jobId, job);
    return jobId;
  }

  /**
   * Add event to job
   * @param {string} jobId - Job identifier
   * @param {Object} event - Event data
   */
  addEventToJob(jobId, event) {
    const job = jobs.get(jobId);
    if (job) {
      job.events.push({
        ...event,
        timestamp: new Date()
      });
    }
  }

  /**
   * Get job status and events
   * @param {string} jobId - Job identifier
   * @returns {Object|null} Job data or null if not found
   */
  getJobStatus(jobId) {
    return jobs.get(jobId) || null;
  }

  /**
   * Add client to job for event streaming
   * @param {string} jobId - Job identifier
   * @param {Object} client - Client response object
   */
  addClientToJob(jobId, client) {
    if (!jobs.has(jobId)) {
      jobs.set(jobId, {
        id: jobId,
        status: 'created',
        createdAt: new Date(),
        events: [],
        clients: []
      });
    }

    const job = jobs.get(jobId);
    if (job && !job.clients) {
      job.clients = [];
    }

    job.clients.push(client);
  }

  /**
   * Remove client from job
   * @param {string} jobId - Job identifier
   * @param {Object} client - Client response object
   */
  removeClientFromJob(jobId, client) {
    const job = jobs.get(jobId);
    if (job && job.clients) {
      const index = job.clients.indexOf(client);
      if (index > -1) {
        job.clients.splice(index, 1);
      }
    }
  }

  /**
   * Generate HTML from template
   * @param {Object} data - SaaS data
   * @param {string} variant - Template variant ('A' or 'B'), if not provided will use default
   * @returns {Object} Object containing generated HTML and the variant used
   */
  generateHTMLFromTemplate(data, variant = null) {
    // If no variant specified, assign one randomly for A/B testing
    const usedVariant = variant || abTestingService.assignVariant();

    // Record preview view for this variant
    abTestingService.recordPreviewView(usedVariant);

    // Get the appropriate template function
    const templateFn = abTestingService.getTemplate(usedVariant);

    // Generate HTML using the selected template
    const html = templateFn(data);

    return {
      html: html,
      variant: usedVariant
    };
  }
}

const orchestratorService = new OrchestratorService();

module.exports = orchestratorService;
module.exports.emitEvent = emitEvent;
module.exports.default = orchestratorService;