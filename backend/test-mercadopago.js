// backend/test-mercadopago.js
const mpService = require('./src/services/mercadopago.service');

async function testMercadoPagoIntegration() {
  console.log('Testing Mercado Pago Integration...\n');
  
  // Validate configuration
  console.log('1. Validating configuration...');
  const config = mpService.constructor.validateConfiguration();
  console.log('   Configuration valid:', config.valid);
  if (!config.valid) {
    console.log('   Missing environment variables:', config.missingEnvVars);
    return;
  }
  console.log('   Webhook URL:', config.webhookUrl);
  
  // Test diagnostic report
  console.log('\n2. Generating diagnostic report...');
  try {
    const report = await mpService.generateDiagnosticReport();
    console.log('   Report generated successfully');
    console.log('   Total logs:', report.summary.totalLogs);
    console.log('   Failed logs:', report.summary.failedLogs);
    console.log('   Success rate:', report.summary.successRate);
  } catch (error) {
    console.error('   Error generating report:', error.message);
  }
  
  console.log('\nMercado Pago integration test completed.');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testMercadoPagoIntegration().catch(console.error);
}

module.exports = { testMercadoPagoIntegration };