const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe.service');

const passport = require('passport');

// Middleware for authentication check
const ensureAuthenticated = passport.authenticate('jwt', { session: false });

/**
 * POST /api/billing/checkout
 * Create Checkout Session
 */
router.post('/checkout', ensureAuthenticated, async (req, res) => {
  try {
    const { priceId } = req.body;
    // Fallback to env variable if not passed
    const finalPriceId = priceId || process.env.STRIPE_PRICE_ID;

    if (!finalPriceId) {
      return res.status(500).json({ error: 'Price ID not configured' });
    }

    const sessionUrl = await stripeService.createCheckoutSession(
      req.user.organizationId,
      req.user.id,
      finalPriceId
    );

    res.json({ url: sessionUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/portal
 * Manage Subscription
 */
router.post('/portal', ensureAuthenticated, async (req, res) => {
  try {
    const sessionUrl = await stripeService.createPortalSession(req.user.organizationId);
    res.json({ url: sessionUrl });
  } catch (error) {
    console.error('Portal error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/billing/webhook
 * Stripe Webhook
 * NOTE: This route expects express.raw() middleware to be applied in app.js or locally
 * Here we handle the logic assuming req.body is the raw buffer if configured, or handled upstream
 */
router.post('/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    await stripeService.handleWebhook(signature, req.body);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;