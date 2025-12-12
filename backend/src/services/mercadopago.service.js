const { MercadoPagoConfig, Preference, PreApproval, PreApprovalPlan } = require('mercadopago');
const { PrismaClient } = require('@prisma/client');
const MercadoPagoDebugger = require('../utils/mp-debugger');
const prisma = new PrismaClient();

class MercadoPagoService {
  constructor() {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (accessToken) {
      this.client = new MercadoPagoConfig({ accessToken: accessToken });
      this.preference = new Preference(this.client);
      this.preapproval = new PreApproval(this.client);
      this.preapprovalPlan = new PreApprovalPlan(this.client);
    } else {
      console.warn('⚠️ Mercado Pago Access Token missing (MP_ACCESS_TOKEN).');
    }

    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    this.webhookUrl = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/billing/mp/webhook` : null;
  }

  /**
   * Create a recurring subscription plan
   */
  async createSubscriptionPlan(planData, userId, organizationId) {
    if (!this.client) throw new Error('Mercado Pago not configured');

    const planBody = {
      reason: planData.reason,
      auto_recurring: {
        frequency: planData.frequency,
        frequency_type: planData.frequency_type,
        repetitions: planData.repetitions,
        billing_day: planData.billing_day,
        billing_day_proportional: planData.billing_day_proportional,
        free_trial: planData.free_trial,
        transaction_amount: planData.transaction_amount,
        currency_id: planData.currency_id
      },
      payment_methods_allowed: planData.payment_methods_allowed,
      back_url: planData.back_url
    };

    try {
      const result = await this.preapprovalPlan.create({ body: planBody });

      // Log successful creation
      await MercadoPagoDebugger.logTransaction('preapproval_plan', {
        status: 'success',
        planId: result.id,
        planData: planBody
      }, userId, organizationId);

      return result;
    } catch (error) {
      // Log error
      await MercadoPagoDebugger.logTransaction('preapproval_plan', {
        status: 'error',
        error: MercadoPagoDebugger.formatError(error),
        planData: planBody
      }, userId, organizationId);

      console.error('Error creating MP subscription plan:', error);
      throw error;
    }
  }

  /**
   * Subscribe user to a plan
   */
  async getOrCreatePlan(reason = 'SaaS Factory Pro', amount = 29000) {
    if (!this.client) throw new Error('Mercado Pago not configured');

    try {
      // 1. Search if plan exists
      const searchResult = await this.preapprovalPlan.search({
        options: { reason, status: 'active', limit: 1 }
      });

      if (searchResult.results && searchResult.results.length > 0) {
        return searchResult.results[0].id;
      }

      // 2. Create Plan
      const plan = await this.preapprovalPlan.create({
        body: {
          reason,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: amount,
            currency_id: 'ARS'
          },
          back_url: `${this.baseUrl}/dashboard?mp_subscription=success`,
          status: 'active'
        }
      });

      return plan.id;
    } catch (error) {
      console.error('Error getting/creating MP Plan:', error);
      throw error;
    }
  }

  async createSubscription(planId, payerEmail, userData, userId, organizationId) {
    if (!this.client) throw new Error('Mercado Pago not configured');

    const preapprovalBody = {
      preapproval_plan_id: planId,
      payer_email: payerEmail,
      back_url: `${this.baseUrl}/dashboard?subscription=success`,
      reason: userData.reason,
      external_reference: userData.external_reference
    };

    try {
      const result = await this.preapproval.create({ body: preapprovalBody });

      // Save subscription to database
      if (organizationId) {
        await prisma.subscription.create({
          data: {
            organizationId: organizationId,
            planType: userData.planType || 'pro',
            status: 'pending',
            startDate: new Date(),
            mpPreapprovalId: result.id,
            mpPlanId: planId
          }
        });
      }

      // Log successful creation
      if (MercadoPagoDebugger) {
        await MercadoPagoDebugger.logTransaction('preapproval', {
          status: 'success',
          subscriptionId: result.id,
          preapprovalBody
        }, userId, organizationId);
      }

      return result;
    } catch (error) {
      // Log error
      if (MercadoPagoDebugger) {
        await MercadoPagoDebugger.logTransaction('preapproval', {
          status: 'error',
          error: MercadoPagoDebugger.formatError ? MercadoPagoDebugger.formatError(error) : error.message,
          preapprovalBody
        }, userId, organizationId);
      }

      console.error('Error creating MP subscription:', error);
      throw error;
    }
  }

  /**
   * Create a one-time payment preference
   */
  async createPreference(title, price, userEmail, options = {}, userId, organizationId) {
    if (!this.client) throw new Error('Mercado Pago not configured');

    const preferenceData = {
      items: [
        {
          id: options.itemId || 'saas-pro',
          title: title,
          quantity: 1,
          unit_price: Number(price),
          currency_id: options.currency_id || 'ARS',
        },
      ],
      payer: {
        email: userEmail,
      },
      back_urls: {
        success: options.success_url || `${this.baseUrl}/dashboard?payment=success`,
        failure: options.failure_url || `${this.baseUrl}/pricing?payment=failure`,
        pending: options.pending_url || `${this.baseUrl}/pricing?payment=pending`,
      },
      auto_return: 'approved',
      notification_url: this.webhookUrl,
      external_reference: options.external_reference
    };

    try {
      const result = await this.preference.create({ body: preferenceData });

      // Create payment record in database
      if (organizationId) {
        await prisma.payment.create({
          data: {
            organizationId: organizationId,
            amount: Number(price),
            currency: options.currency_id || 'ARS',
            status: 'pending',
            mpPaymentId: result.id,
            description: title
          }
        });
      }

      // Log successful creation
      await MercadoPagoDebugger.logTransaction('preference', {
        status: 'success',
        preferenceId: result.id,
        preferenceData
      }, userId, organizationId);

      return result;
    } catch (error) {
      // Log error
      await MercadoPagoDebugger.logTransaction('preference', {
        status: 'error',
        error: MercadoPagoDebugger.formatError(error),
        preferenceData
      }, userId, organizationId);

      console.error('Error creating MP preference:', error);
      throw error;
    }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(preapprovalId, userId, organizationId) {
    if (!this.client) throw new Error('Mercado Pago not configured');

    try {
      const result = await this.preapproval.get({ id: preapprovalId });

      // Log successful retrieval
      await MercadoPagoDebugger.logTransaction('preapproval_get', {
        status: 'success',
        subscriptionId: preapprovalId,
        result
      }, userId, organizationId);

      return result;
    } catch (error) {
      // Log error
      await MercadoPagoDebugger.logTransaction('preapproval_get', {
        status: 'error',
        error: MercadoPagoDebugger.formatError(error),
        subscriptionId: preapprovalId
      }, userId, organizationId);

      console.error('Error getting MP subscription status:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(preapprovalId, userId, organizationId) {
    if (!this.client) throw new Error('Mercado Pago not configured');

    try {
      const result = await this.preapproval.update({
        id: preapprovalId,
        body: { status: 'cancelled' }
      });

      // Update database subscription status
      await prisma.subscription.updateMany({
        where: { mpPreapprovalId: preapprovalId },
        data: { status: 'canceled' }
      });

      // Log successful cancellation
      await MercadoPagoDebugger.logTransaction('preapproval_cancel', {
        status: 'success',
        subscriptionId: preapprovalId,
        result
      }, userId, organizationId);

      return result;
    } catch (error) {
      // Log error
      await MercadoPagoDebugger.logTransaction('preapproval_cancel', {
        status: 'error',
        error: MercadoPagoDebugger.formatError(error),
        subscriptionId: preapprovalId
      }, userId, organizationId);

      console.error('Error cancelling MP subscription:', error);
      throw error;
    }
  }

  /**
   * Handle webhook notifications
   */
  async handleWebhook(body, headers) {
    try {
      // Log incoming webhook
      await MercadoPagoDebugger.logTransaction('webhook_received', {
        body,
        headers: {
          'x-request-id': headers['x-request-id'],
          'content-type': headers['content-type']
        }
      }, null, null);

      // Verify webhook signature (if implemented)
      // const signature = headers['x-signature'];
      // const isValid = this.verifyWebhookSignature(body, signature);
      // if (!isValid) throw new Error('Invalid webhook signature');

      const topic = body.topic;
      const resourceId = body.resource_id || body.id;

      switch (topic) {
        case 'preapproval':
          await this.handleSubscriptionUpdate(resourceId);
          break;
        case 'payment':
          await this.handlePaymentUpdate(resourceId);
          break;
        default:
          console.log(`Unhandled webhook topic: ${topic}`);
      }

      // Log successful processing
      await MercadoPagoDebugger.logTransaction('webhook_processed', {
        status: 'success',
        topic,
        resourceId
      }, null, null);

      return { success: true };
    } catch (error) {
      // Log error
      await MercadoPagoDebugger.logTransaction('webhook_processed', {
        status: 'error',
        error: MercadoPagoDebugger.formatError(error),
        body
      }, null, null);

      console.error('Error handling MP webhook:', error);
      throw error;
    }
  }

  /**
   * Handle subscription updates
   */
  async handleSubscriptionUpdate(preapprovalId) {
    try {
      const mpSubscription = await this.getSubscriptionStatus(preapprovalId);

      // Update database subscription status
      await prisma.subscription.updateMany({
        where: { mpPreapprovalId: preapprovalId },
        data: {
          status: mpSubscription.status,
          endDate: mpSubscription.end_date ? new Date(mpSubscription.end_date) : null
        }
      });

      return mpSubscription;
    } catch (error) {
      console.error('Error handling subscription update:', error);
      throw error;
    }
  }

  /**
   * Handle payment updates
   */
  async handlePaymentUpdate(paymentId) {
    // Implementation for handling payment updates
    console.log(`Payment update for ID: ${paymentId}`);
    // Would typically update payment status in database
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body, signature) {
    // Implementation for signature verification
    // This would use crypto to verify the signature
    // For now, returning true for development
    return true;
  }

  /**
   * Generate diagnostic report
   */
  async generateDiagnosticReport() {
    return await MercadoPagoDebugger.generateDiagnosticReport();
  }
}

module.exports = new MercadoPagoService();