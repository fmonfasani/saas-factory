# Stripe Integration Setup

## Overview
This document explains how to set up and configure the Stripe payment integration for the SaaS Factory backend.

## Prerequisites
1. A Stripe account (sign up at https://stripe.com)
2. Stripe CLI installed (optional, for testing webhooks locally)

## Environment Variables
Add the following variables to your `backend/.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FRONTEND_URL=http://localhost:3000
```

## Getting Stripe Keys
1. Log in to your Stripe Dashboard
2. Go to Developers > API keys
3. Copy your Secret key (starting with `sk_test_` for test mode)
4. For webhooks, go to Developers > Webhooks > Add endpoint
5. Create a webhook endpoint pointing to `https://yourdomain.com/api/billing/webhook`
6. Copy the webhook signing secret

## Testing
1. Install the Stripe package: `npm install stripe`
2. Run the test script: `node test-stripe.js`

## API Endpoints
The integration provides the following endpoints:

### POST /api/billing/checkout
Create a checkout session for subscription payment.

**Request Body:**
```json
{
  "customerId": "cus_...",
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

### POST /api/billing/webhook
Public endpoint for receiving Stripe webhook events.

## Webhook Events Handled
- `checkout.session.completed` - Updates organization subscription status

## Error Handling
All functions include proper error handling with try/catch blocks and meaningful error messages.