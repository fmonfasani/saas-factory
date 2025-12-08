const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../auth/middleware/auth.middleware');
const {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  handleWebhook
} = require('../controllers/billing.controller');

/**
 * @route   POST /billing/checkout
 * @desc    Create a checkout session for subscription
 * @access  Private
 */
router.post('/checkout', authenticateJWT, createCheckoutSession);

/**
 * @route   POST /billing/portal
 * @desc    Create a billing portal session
 * @access  Private
 */
router.post('/portal', authenticateJWT, createPortalSession);

/**
 * @route   GET /billing/subscription
 * @desc    Get user's subscription status
 * @access  Private
 */
router.get('/subscription', authenticateJWT, getSubscription);

/**
 * @route   POST /billing/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public
 */
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;