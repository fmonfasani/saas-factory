# Mercado Pago Payment Orchestrator

## Overview

This agent provides a complete implementation for handling both recurring subscriptions and one-time payments through Mercado Pago. It follows fintech best practices for security, reliability, and scalability.

## Features

1. **Recurring Subscriptions**
   - Subscription plan creation
   - User subscription management
   - Automatic renewal handling
   - Subscription status tracking

2. **One-time Payments**
   - Payment preference creation
   - Checkout flow integration
   - Payment status management

3. **Webhook Handling**
   - Secure notification endpoints
   - Signature verification
   - Event processing for subscriptions and payments

4. **Database Integration**
   - Subscription tracking with Prisma/PostgreSQL
   - Payment records management
   - Transaction logging for debugging

5. **Frontend Components**
   - Pricing tables with multiple payment options
   - Subscription management interface
   - Admin dashboard for monitoring

## Architecture

### Backend (Node.js/Express)

```
src/
├── services/
│   └── mercadopago.service.js     # Core MP integration
├── routes/
│   └── mercadopago.routes.js      # API endpoints
├── utils/
│   └── mp-debugger.js            # Debugging utilities
└── prisma/
    └── schema.prisma             # Database models
```

### Frontend (React/Next.js)

```
app/
├── pricing/
│   └── mp-pricing-page.tsx       # Pricing page with MP options
components/
├── MercadoPagoSubscriptionManager.tsx  # User subscription UI
└── admin/
    └── MercadoPagoDashboard.tsx        # Admin monitoring
lib/
└── api.ts                          # MP API clients
```

## API Endpoints

### Payment Creation
- `POST /api/billing/mp/create_preference` - Create one-time payment
- `POST /api/billing/mp/create_plan` - Create subscription plan
- `POST /api/billing/mp/subscribe` - Subscribe user to plan

### Subscription Management
- `GET /api/billing/mp/subscription/:id` - Get subscription status
- `POST /api/billing/mp/cancel/:id` - Cancel subscription

### Webhooks
- `POST /api/billing/mp/webhook` - Handle MP notifications

### Diagnostics
- `GET /api/billing/mp/diagnostic` - System health report

## Database Models

### Subscription
Tracks user subscriptions with Mercado Pago integration.

### Payment
Records one-time payment transactions.

### MPTransactionLog
Detailed logs for debugging and monitoring.

## Security Features

1. **Credential Protection**
   - Environment variable storage only
   - No hardcoded credentials
   - TLS encryption for all communications

2. **Webhook Validation**
   - Signature verification
   - Request authenticity checking
   - Replay attack prevention

3. **Access Control**
   - JWT authentication for all endpoints
   - Role-based access for admin functions
   - Organization isolation

## Implementation Flow

### One-time Payment
1. User selects payment option on pricing page
2. Frontend calls `/create_preference` with payment details
3. Backend creates MP preference and saves to database
4. Frontend redirects user to MP checkout
5. MP sends webhook notification on payment status change
6. Backend updates payment status in database

### Recurring Subscription
1. Admin creates subscription plan (or predefined plans)
2. User selects subscription plan
3. Frontend calls `/subscribe` with plan ID
4. Backend creates MP preapproval and saves subscription
5. Frontend redirects user to MP authorization
6. MP sends webhook notifications on subscription events
7. Backend updates subscription status in database

## Debugging & Monitoring

The system includes comprehensive logging and diagnostic capabilities:

1. **Transaction Logging**
   - All API calls logged with full request/response
   - Error tracking with stack traces
   - Performance metrics

2. **Diagnostic Endpoints**
   - Configuration validation
   - Recent activity reports
   - Failure analysis

3. **Admin Dashboard**
   - Real-time transaction monitoring
   - Error trend analysis
   - System health overview

## Best Practices Implemented

1. **Idempotency**
   - Duplicate request protection
   - Consistent state management

2. **Error Handling**
   - Graceful degradation
   - User-friendly error messages
   - Automated retry mechanisms

3. **Scalability**
   - Stateless service design
   - Database connection pooling
   - Asynchronous processing

4. **Compliance**
   - PCI DSS considerations
   - Data privacy protection
   - Audit trail maintenance

## Configuration

Required environment variables:
- `MP_ACCESS_TOKEN` - Mercado Pago access token
- `BACKEND_URL` - Public backend URL for webhooks
- `FRONTEND_URL` - Application frontend URL

## Testing

The implementation includes:
1. Unit tests for service methods
2. Integration tests for API endpoints
3. Webhook simulation for end-to-end testing
4. Load testing scripts for performance validation

This orchestrator provides a production-ready foundation for Mercado Pago integration with comprehensive features for both developers and business users.