const express = require('express');
const router = express.Router();
const passport = require('passport');
const mpService = require('../services/mercadopago.service');

// Middleware
const ensureAuthenticated = passport.authenticate('jwt', { session: false });

/**
 * POST /api/billing/mp/create_preference
 * Create a one-time payment link
 */
router.post('/create_preference', ensureAuthenticated, async (req, res) => {
  try {
    const { title, price, options } = req.body;
    const userEmail = req.user.email;

    // Default values if not provided
    const productTitle = title || 'SaaS Factory Pro Plan';
    const unitPrice = price || 29000; // Example ARS

    const preference = await mpService.createPreference(
      productTitle,
      unitPrice,
      userEmail,
      options,
      req.user.id,
      req.user.organizationId
    );

    res.json({
      preferenceId: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/mp/create_plan
 * Create a recurring subscription plan
 */
router.post('/create_plan', ensureAuthenticated, async (req, res) => {
  try {
    const planData = req.body;

    const plan = await mpService.createSubscriptionPlan(
      planData,
      req.user.id,
      req.user.organizationId
    );

    res.json({
      planId: plan.id,
      ...plan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/mp/subscribe
 * Subscribe user to a plan
 */
router.post('/subscribe', ensureAuthenticated, async (req, res) => {
  try {
    const { reason, amount } = req.body;
    const userEmail = req.user.email;

    // 1. Get or Create Plan (Reason and Amount are key here)
    const planId = await mpService.getOrCreatePlan(reason || 'SaaS Factory Pro', amount || 29000);

    // 2. Create Subscription
    const userData = {
      reason: reason || 'SaaS Factory Pro',
      external_reference: `org_${req.user.organizationId}`,
      organizationId: req.user.organizationId
    };

    const subscription = await mpService.createSubscription(
      planId,
      userEmail,
      userData,
      req.user.id,
      req.user.organizationId
    );

    res.json({
      init_point: subscription.init_point,
      id: subscription.id
    });
  } catch (error) {
    console.error('Subscribe endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/billing/mp/subscription/:id
 * Get subscription status
 */
router.get('/subscription/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await mpService.getSubscriptionStatus(
      id,
      req.user.id,
      req.user.organizationId
    );

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/mp/cancel/:id
 * Cancel subscription
 */
router.post('/cancel/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await mpService.cancelSubscription(
      id,
      req.user.id,
      req.user.organizationId
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/mp/webhook
 * Handle Mercado Pago webhooks
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const body = JSON.parse(req.body.toString());
    await mpService.handleWebhook(body, req.headers);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

/**
 * GET /api/billing/mp/diagnostic
 * Get diagnostic report (admin only)
 */
router.get('/diagnostic', ensureAuthenticated, async (req, res) => {
  try {
    // In a real implementation, you would check if user is admin
    const report = await mpService.generateDiagnosticReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;