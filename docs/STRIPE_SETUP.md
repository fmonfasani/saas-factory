# Stripe Setup Guide

This guide explains how to configure Stripe for the SaaS Factory billing system.

## Prerequisites

1. A Stripe account (sign up at https://dashboard.stripe.com/register)
2. Access to your project's environment variables

## Step 1: Obtain Stripe API Keys

1. Log in to your Stripe Dashboard
2. Navigate to **Developers** → **API keys**
3. Copy the following keys:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...your_publishable_key...
STRIPE_SECRET_KEY=sk_test_...your_secret_key...
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret...

# Frontend URL for redirecting after checkout
FRONTEND_URL=http://localhost:3000
```

## Step 3: Set up Webhook Endpoint

1. In your Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to:
   ```
   https://your-domain.com/api/billing/webhook
   ```
   (For local development: `http://localhost:3001/api/billing/webhook`)
4. Select the following events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 4: Create Products and Prices

1. In your Stripe Dashboard, go to **Products**
2. Click **Add product**
3. Fill in product details:
   - Name: e.g., "Basic Plan"
   - Description: e.g., "Basic features for individuals"
   - Price: e.g., $29/month
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`) for use in your application

## Step 5: Testing with Stripe Test Mode

Stripe provides test mode for development:

1. Use test API keys (start with `pk_test_` and `sk_test_`)
2. Use test card numbers:
   - `4242 4242 4242 4242` (Visa) - Succeeds
   - `4000 0025 0000 3155` (Visa) - Requires authentication
   - `4000 0000 0000 9995` (Visa) - Declined

## Available Billing Endpoints

### POST /api/billing/checkout
Create a checkout session for subscription

**Request Body:**
```json
{
  "priceId": "price_..."
}
```

**Response:**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

### POST /api/billing/portal
Create a billing portal session

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

### GET /api/billing/subscription
Get user's subscription status

**Response:**
```json
{
  "subscription": {
    "id": "sub_...",
    "status": "active",
    "current_period_end": 1234567890
  }
}
```

## Troubleshooting

### Webhook Issues
- Ensure your webhook URL is publicly accessible
- Verify the webhook signing secret matches
- Check Stripe Dashboard for webhook delivery logs

### Authentication Errors
- Confirm `STRIPE_SECRET_KEY` is correctly set
- Ensure the key has the necessary permissions

### Checkout Problems
- Verify the Price ID exists in your Stripe account
- Check that the Price ID is for a recurring product (subscription)

## Security Best Practices

1. Never expose secret keys in client-side code
2. Always verify webhook signatures
3. Use environment variables for all sensitive data
4. Regularly rotate API keys
5. Monitor Stripe Dashboard for suspicious activity

## Local Development

For local development, you can use Stripe CLI to test webhooks:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:3001/api/billing/webhook`
3. Use the provided webhook signing secret in your `.env` file