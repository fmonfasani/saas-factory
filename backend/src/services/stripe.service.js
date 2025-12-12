const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class StripeService {
  constructor() {
    // Fail silently if key is missing during dev to prevent crash, but warn
    this.stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (!this.stripe) console.warn('⚠️ Stripe Secret Key missing. Billing will not work.');
  }

  /**
   * Create or retrieve Stripe Customer for an Organization
   */
  async getOrCreateCustomer(organizationId, email, name) {
    if (!this.stripe) throw new Error('Stripe not configured');

    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (org.stripeCustomerId) {
      return org.stripeCustomerId;
    }

    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
        organizationId
      }
    });

    await prisma.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId: customer.id }
    });

    return customer.id;
  }

  /**
   * Create Checkout Session for Subscription
   */
  async createCheckoutSession(organizationId, userId, priceId) {
    // Default to env var if not provided
    const finalPriceId = priceId || process.env.STRIPE_PRICE_ID;

    if (!this.stripe) throw new Error('Stripe not configured');
    if (!finalPriceId) throw new Error('Price ID not provided and not configured in env');

    // Get user and org details
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const customerId = await this.getOrCreateCustomer(organizationId, user.email, `${user.firstName} ${user.lastName}`);

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: `${this.baseUrl}/dashboard?billing_success=true`,
      cancel_url: `${this.baseUrl}/pricing?canceled=true`,
      metadata: {
        organizationId
      }
    });

    return session.url;
  }

  /**
   * Create Customer Portal Session
   */
  async createPortalSession(organizationId) {
    if (!this.stripe) throw new Error('Stripe not configured');

    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!org.stripeCustomerId) {
      throw new Error('No billing account found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${this.baseUrl}/dashboard`,
    });

    return session.url;
  }

  /**
   * Handle Webhook Logic
   */
  async handleWebhook(signature, rawBody) {
    if (!this.stripe) throw new Error('Stripe not configured');
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this._handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this._handleSubscriptionUpdated(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  // Internal handlers
  async _handleCheckoutCompleted(session) {
    const organizationId = session.metadata.organizationId;
    const subscriptionId = session.subscription;

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: 'active',
        subscriptionPlanId: 'pro'
      }
    });
  }

  async _handleSubscriptionUpdated(subscription) {
    // Retrieve organization by customer ID as metadata might not be in subscription update event
    // In real app, might need to query by stripeSubscriptionId if we stored it
    const customerId = subscription.customer;
    const status = subscription.status;

    await prisma.organization.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        subscriptionStatus: status,
        stripeSubscriptionId: subscription.id
      }
    });
  }
}

module.exports = new StripeService();