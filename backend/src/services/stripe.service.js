const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  /**
   * Create a new customer in Stripe
   * @param {Object} userData - User information
   * @returns {Promise<Object>} Stripe customer object
   */
  async createCustomer(userData) {
    try {
      const customer = await stripe.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: {
          userId: userData.userId,
          createdAt: new Date().toISOString()
        }
      });
      return customer;
    } catch (error) {
      throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
  }

  /**
   * Create a checkout session for subscription
   * @param {string} customerId - Stripe customer ID
   * @param {string} priceId - Stripe price ID
   * @param {string} successUrl - URL to redirect on successful payment
   * @param {string} cancelUrl - URL to redirect on cancelled payment
   * @returns {Promise<Object>} Checkout session object
   */
  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        line_items: [{
          price: priceId,
          quantity: 1
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        subscription_data: {
          metadata: {
            createdAt: new Date().toISOString()
          }
        }
      });
      return session;
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  /**
   * Create a billing portal session
   * @param {string} customerId - Stripe customer ID
   * @param {string} returnUrl - URL to return to after portal session
   * @returns {Promise<Object>} Billing portal session object
   */
  async createPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });
      return session;
    } catch (error) {
      throw new Error(`Failed to create portal session: ${error.message}`);
    }
  }

  /**
   * Handle webhook events from Stripe
   * @param {string} payload - Webhook payload
   * @param {string} signature - Webhook signature
   * @param {string} endpointSecret - Webhook endpoint secret
   * @returns {Promise<Object>} Event object
   */
  async handleWebhook(payload, signature, endpointSecret) {
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return event;
    } catch (error) {
      throw new Error(`Webhook error: ${error.message}`);
    }
  }

  /**
   * Get subscription details
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<Object>} Subscription object
   */
  async getSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(`Failed to retrieve subscription: ${error.message}`);
    }
  }

  /**
   * Cancel a subscription
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<Object>} Cancelled subscription object
   */
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  /**
   * Get customer's subscriptions
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<Array>} Array of subscription objects
   */
  async getCustomerSubscriptions(customerId) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 100
      });
      return subscriptions.data;
    } catch (error) {
      throw new Error(`Failed to retrieve customer subscriptions: ${error.message}`);
    }
  }

  /**
   * Update subscription quantity
   * @param {string} subscriptionId - Stripe subscription ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated subscription object
   */
  async updateSubscriptionQuantity(subscriptionId, quantity) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          quantity: quantity
        }]
      });
      return updatedSubscription;
    } catch (error) {
      throw new Error(`Failed to update subscription quantity: ${error.message}`);
    }
  }
}

module.exports = new StripeService();