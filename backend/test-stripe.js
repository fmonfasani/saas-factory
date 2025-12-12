// Test script for Stripe integration
require('dotenv').config();
const stripeService = require('./src/services/stripe.service');

async function testStripeIntegration() {
  try {
    console.log('Testing Stripe integration...');
    
    // Test 1: Create a customer
    console.log('Creating customer...');
    const customerId = await stripeService.createCustomer(
      'test@example.com',
      'Test Customer'
    );
    console.log('Customer created:', customerId);
    
    console.log('Stripe integration test completed successfully!');
  } catch (error) {
    console.error('Stripe integration test failed:', error.message);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testStripeIntegration();
}

module.exports = { testStripeIntegration };