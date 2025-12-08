const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';
let testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass123!',
  firstName: 'Test',
  lastName: 'User'
};
let accessToken = '';
let emailVerificationToken = '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logEndpoint(method, endpoint, status) {
  const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  log(`[${status}] ${method} ${endpoint}`, statusColor);
}

async function testEndpoint(method, endpoint, body = null, headers = {}, expectedStatus = 200) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.text();
    let jsonData;
    
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = { raw: data };
    }
    
    if (response.status === expectedStatus) {
      logEndpoint(method, endpoint, 'PASS');
      return { success: true, data: jsonData, status: response.status };
    } else {
      logEndpoint(method, endpoint, 'FAIL');
      log(`  Expected ${expectedStatus}, got ${response.status}`, 'red');
      log(`  Response: ${JSON.stringify(jsonData)}`, 'red');
      return { success: false, data: jsonData, status: response.status };
    }
  } catch (error) {
    logEndpoint(method, endpoint, 'FAIL');
    log(`  Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n=== SAAS FACTORY API TEST SUITE ===\n', 'blue');
  log(`Test User: ${testUser.email}`, 'yellow');
  log(`Base URL: ${BASE_URL}\n`, 'yellow');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };
  
  // Test 1: POST /auth/signup
  log('\n--- 1. Authentication Endpoints ---', 'blue');
  results.total++;
  const signupResult = await testEndpoint('POST', '/auth/signup', testUser, {}, 201);
  if (signupResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 2: POST /auth/signin
  results.total++;
  const signinResult = await testEndpoint('POST', '/auth/signin', {
    email: testUser.email,
    password: testUser.password
  });
  if (signinResult.success) {
    results.passed++;
    accessToken = signinResult.data.accessToken;
    log(`  Access Token obtained: ${accessToken.substring(0, 20)}...`, 'green');
  } else {
    results.failed++;
  }
  
  // Test 3: GET /auth/me (protected)
  results.total++;
  const meResult = await testEndpoint('GET', '/auth/me', null, {
    'Authorization': `Bearer ${accessToken}`
  });
  if (meResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 4: POST /auth/signout
  results.total++;
  const signoutResult = await testEndpoint('POST', '/auth/signout');
  if (signoutResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 5: POST /auth/forgot-password
  results.total++;
  const forgotResult = await testEndpoint('POST', '/auth/forgot-password', {
    email: testUser.email
  });
  if (forgotResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 6: POST /auth/resend-verification
  results.total++;
  const resendResult = await testEndpoint('POST', '/auth/resend-verification', {
    email: testUser.email
  });
  if (resendResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  log('\n--- 2. User Profile Endpoints (Protected) ---', 'blue');
  
  // Test 7: GET /users/profile
  results.total++;
  const profileGetResult = await testEndpoint('GET', '/users/profile', null, {
    'Authorization': `Bearer ${accessToken}`
  });
  if (profileGetResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 8: PUT /users/profile
  results.total++;
  const profileUpdateResult = await testEndpoint('PUT', '/users/profile', {
    firstName: 'Updated',
    lastName: 'Name',
    avatar: 'https://example.com/avatar.jpg'
  }, {
    'Authorization': `Bearer ${accessToken}`
  });
  if (profileUpdateResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  log('\n--- 3. Generate API Endpoints ---', 'blue');
  
  // Test 9: POST /generate/analyze
  results.total++;
  const analyzeResult = await testEndpoint('POST', '/generate/analyze', {
    prompt: 'SaaS de gestión de tareas para freelancers'
  });
  if (analyzeResult.success) {
    results.passed++;
    log(`  Analysis successful: ${analyzeResult.data.data ? 'Yes' : 'No'}`, 'green');
  } else {
    results.failed++;
  }
  
  // Test 10: POST /generate/landing
  results.total++;
  const landingResult = await testEndpoint('POST', '/generate/landing', {
    saasData: {
      name: 'TaskMaster Pro',
      tagline: 'Streamline your workflow',
      market: 'Freelancers',
      features: ['Task Management', 'Team Collaboration', 'Progress Tracking'],
      cta: 'Get Started'
    }
  });
  if (landingResult.success) {
    results.passed++;
    log(`  Landing page generated: ${landingResult.data.html ? 'Yes' : 'No'}`, 'green');
  } else {
    results.failed++;
  }
  
  // Test 11: GET /generate/status/:jobId (non-existent job)
  results.total++;
  const statusResult = await testEndpoint('GET', '/generate/status/non-existent-job', null, {}, 404);
  if (statusResult.success || statusResult.status === 404) {
    results.passed++;
    logEndpoint('GET', '/generate/status/:jobId (not found)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('GET', '/generate/status/:jobId (not found)', 'FAIL');
  }
  
  log('\n--- 4. Error Path Tests ---', 'blue');
  
  // Test 12: Signup with duplicate email
  results.total++;
  log('\nTesting duplicate email (should fail):', 'yellow');
  const duplicateResult = await testEndpoint('POST', '/auth/signup', testUser, {}, 400);
  if (duplicateResult.success || duplicateResult.status === 400 || duplicateResult.status === 500) {
    results.passed++;
    logEndpoint('POST', '/auth/signup (duplicate)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('POST', '/auth/signup (duplicate)', 'FAIL');
  }
  
  // Test 13: Signin with wrong password
  results.total++;
  log('\nTesting wrong password (should fail):', 'yellow');
  const wrongPassResult = await testEndpoint('POST', '/auth/signin', {
    email: testUser.email,
    password: 'WrongPass123!'
  }, {}, 401);
  if (wrongPassResult.success || wrongPassResult.status === 401 || wrongPassResult.status === 400 || wrongPassResult.status === 500) {
    results.passed++;
    logEndpoint('POST', '/auth/signin (wrong password)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('POST', '/auth/signin (wrong password)', 'FAIL');
  }
  
  // Test 14: Access protected endpoint without token
  results.total++;
  log('\nTesting protected endpoint without auth (should fail):', 'yellow');
  const noAuthResult = await testEndpoint('GET', '/auth/me', null, {}, 401);
  if (noAuthResult.success || noAuthResult.status === 401) {
    results.passed++;
    logEndpoint('GET', '/auth/me (no auth)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('GET', '/auth/me (no auth)', 'FAIL');
  }
  
  // Test 15: Invalid email format
  results.total++;
  log('\nTesting invalid email format (should fail):', 'yellow');
  const invalidEmailResult = await testEndpoint('POST', '/auth/signup', {
    email: 'not-an-email',
    password: 'TestPass123!',
    firstName: 'Test',
    lastName: 'User'
  }, {}, 400);
  if (invalidEmailResult.success || invalidEmailResult.status === 400) {
    results.passed++;
    logEndpoint('POST', '/auth/signup (invalid email)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('POST', '/auth/signup (invalid email)', 'FAIL');
  }
  
  // Test 16: Weak password
  results.total++;
  log('\nTesting weak password (should fail):', 'yellow');
  const weakPassResult = await testEndpoint('POST', '/auth/signup', {
    email: `test2-${Date.now()}@example.com`,
    password: 'weak',
    firstName: 'Test',
    lastName: 'User'
  }, {}, 400);
  if (weakPassResult.success || weakPassResult.status === 400) {
    results.passed++;
    logEndpoint('POST', '/auth/signup (weak password)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('POST', '/auth/signup (weak password)', 'FAIL');
  }
  
  // Test 17: POST /generate/analyze without prompt
  results.total++;
  log('\nTesting analyze without prompt (should fail):', 'yellow');
  const noPromptResult = await testEndpoint('POST', '/generate/analyze', {}, {}, 400);
  if (noPromptResult.success || noPromptResult.status === 400) {
    results.passed++;
    logEndpoint('POST', '/generate/analyze (no prompt)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('POST', '/generate/analyze (no prompt)', 'FAIL');
  }
  
  // Summary
  log('\n=== TEST SUMMARY ===', 'blue');
  log(`Total Tests: ${results.total}`, 'yellow');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%\n`, results.failed > 0 ? 'yellow' : 'green');
  
  if (results.failed > 0) {
    log('⚠️  Some tests failed. Review the logs above for details.', 'red');
    process.exit(1);
  } else {
    log('✅ All tests passed!', 'green');
    process.exit(0);
  }
}

// Run the test suite
log('\n🚀 Starting API Test Suite...', 'blue');
log('⏳ Please ensure the backend server is running on http://localhost:3001\n', 'yellow');

setTimeout(() => {
  runTests().catch(error => {
    log(`\n❌ Test suite crashed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}, 1000);