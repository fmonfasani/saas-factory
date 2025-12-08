const stripeService = require('../services/stripe.service');

// Middleware to get current user from request (this would typically come from your auth system)
const getCurrentUser = (req) => {
  return req.user;
};

/**
 * Create a checkout session for subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createCheckoutSession(req, res) {
  try {
    const { priceId } = req.body;
    const user = getCurrentUser(req);
    
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Get or create customer
    let customer;
    if (user.stripeCustomerId) {
      customer = { id: user.stripeCustomerId };
    } else {
      customer = await stripeService.createCustomer({
        email: user.email,
        name: user.name,
        userId: user.id
      });
      
      // In a real implementation, you would update the user record with the stripeCustomerId
      // await userService.updateUser(user.id, { stripeCustomerId: customer.id });
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      customer.id,
      priceId,
      `${process.env.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.FRONTEND_URL}/billing/cancel`
    );

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Create a billing portal session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createPortalSession(req, res) {
  try {
    const user = getCurrentUser(req);
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer found for user' });
    }

    const session = await stripeService.createPortalSession(
      user.stripeCustomerId,
      `${process.env.FRONTEND_URL}/billing`
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get user's subscription status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getSubscription(req, res) {
  try {
    const user = getCurrentUser(req);
    
    if (!user.stripeCustomerId) {
      return res.json({ subscription: null });
    }

    const subscriptions = await stripeService.getCustomerSubscriptions(user.stripeCustomerId);
    
    // Get the most recent active subscription
    const activeSubscriptions = subscriptions.filter(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    );
    
    const subscription = activeSubscriptions.length > 0 ? activeSubscriptions[0] : null;

    res.json({ subscription });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = await stripeService.handleWebhook(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handle subscription changes
        // In a real implementation, you would update your database accordingly
        console.log(`Subscription event: ${event.type}`);
        break;
      case 'invoice.payment_succeeded':
        // Handle successful payment
        console.log('Payment succeeded');
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

module.exports = {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  handleWebhook
};