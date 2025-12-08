const express = require('express');
const router = express.Router();
const orchestratorServiceModule = require('../services/orchestrator.service');
const orchestratorService = orchestratorServiceModule.default || orchestratorServiceModule;
const { emitEvent } = require('../services/orchestrator.service');
const abTestingServiceModule = require('../services/ab-testing.service');
const abTestingService = abTestingServiceModule.default || abTestingServiceModule;

// Middleware to create job for requests that need streaming
router.use((req, res, next) => {
  // Only create job for POST requests that are not the stream endpoint
  if (req.method === 'POST' && !req.path.includes('/stream')) {
    const jobId = orchestratorService.createJob(
      req.body.prompt || JSON.stringify(req.body)
    );
    req.jobId = jobId;
  }
  next();
});

/**
 * Analyze prompt and return SaaS structure
 */
router.post('/analyze', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required' 
      });
    }
    
    // Emit SSE event for agent start
    emitEvent(req.jobId, {
      type: 'agent_started',
      agent: 'ai-feature-builder',
      message: 'Analyzing your SaaS idea...'
    });
    
    const result = await orchestratorService.analyzePrompt(prompt);
    
    if (result.success) {
      // Emit SSE event for completion
      emitEvent(req.jobId, {
        type: 'agent_completed',
        agent: 'ai-feature-builder',
        message: 'SaaS structure analysis complete',
        data: result.data
      });
      
      res.json({
        ...result,
        jobId: req.jobId
      });
    } else {
      // Emit SSE event for error
      emitEvent(req.jobId, {
        type: 'agent_error',
        agent: 'ai-feature-builder',
        message: 'Failed to analyze SaaS idea',
        error: result.error
      });
      
      res.status(500).json(result);
    }
  } catch (error) {
    emitEvent(req.jobId, {
      type: 'agent_error',
      agent: 'ai-feature-builder',
      message: 'Error analyzing SaaS idea',
      error: error.message
    });
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Generate landing page HTML
 */
router.post('/landing', async (req, res) => {
  try {
    const { saasData, variant } = req.body;
    
    if (!saasData) {
      return res.status(400).json({ 
        success: false, 
        error: 'SaaS data is required' 
      });
    }
    
    // Emit SSE event for agent start
    emitEvent(req.jobId, {
      type: 'agent_started',
      agent: 'landing-generator',
      message: 'Generating landing page...'
    });
    
    // Track generation time
    const startTime = Date.now();
    
    const result = await orchestratorService.generateLandingPage(saasData, variant);
    
    const generationTime = Date.now() - startTime;
    
    // Record generation metrics
    if (result.variant) {
      abTestingService.recordGeneration(result.variant, generationTime);
    }
    
    if (result.success) {
      // Emit SSE event for completion
      emitEvent(req.jobId, {
        type: 'agent_completed',
        agent: 'landing-generator',
        message: 'Landing page generated successfully',
        data: { html: result.html, variant: result.variant }
      });
      
      // Emit preview ready event
      emitEvent(req.jobId, {
        type: 'preview_ready',
        message: 'Preview ready',
        data: { html: result.html, variant: result.variant }
      });
      
      res.json({
        ...result,
        jobId: req.jobId
      });
    } else {
      // Emit SSE event for error
      emitEvent(req.jobId, {
        type: 'agent_error',
        agent: 'landing-generator',
        message: 'Failed to generate landing page',
        error: result.error
      });
      
      res.status(500).json(result);
    }
  } catch (error) {
    emitEvent(req.jobId, {
      type: 'agent_error',
      agent: 'landing-generator',
      message: 'Error generating landing page',
      error: error.message
    });
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get job status
 */
router.get('/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = orchestratorService.getJobStatus(jobId);
  
  if (!job) {
    return res.status(404).json({ 
      success: false, 
      error: 'Job not found' 
    });
  }
  
  res.json({ 
    success: true, 
    data: job 
  });
});

/**
 * Stream generation events using Server-Sent Events
 */
router.get('/stream/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Store response reference for sending events
  orchestratorService.addClientToJob(jobId, res);
  
  // Send initial connection event
  res.write(`data: ${JSON.stringify({ 
    type: 'connection_established', 
    message: 'Connected to event stream' 
  })}\n\n`);
  
  // Clean up on client disconnect
  req.on('close', () => {
    orchestratorService.removeClientFromJob(jobId, res);
  });
});

/**
 * Submit user rating for a generated landing page
 */
router.post('/rate', (req, res) => {
  try {
    const { jobId, rating, variant } = req.body;
    
    if (!jobId || !rating || !variant) {
      return res.status(400).json({ 
        success: false, 
        error: 'Job ID, rating, and variant are required' 
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rating must be between 1 and 5' 
      });
    }
    
    // Record the rating
    abTestingService.recordRating(variant, rating);
    
    res.json({ 
      success: true, 
      message: 'Rating submitted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get A/B test results
 */
router.get('/ab-results', (req, res) => {
  try {
    const results = abTestingService.getResults();
    res.json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;