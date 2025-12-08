const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass123!',
  firstName: 'Test',
  lastName: 'User'
};
let accessToken = '';
let testOrgId = '';
let testProjectId = '';

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
  
  // Test Health Endpoint
  log('--- 0. Health Check ---', 'blue');
  results.total++;
  const healthResult = await testEndpoint('GET', '/../../health');
  if (healthResult.success) {
    results.passed++;
    log(`  Health check: OK`, 'green');
  } else {
    results.failed++;
  }
  
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
  
  // Re-signin for subsequent tests
  results.total++;
  const reSigninResult = await testEndpoint('POST', '/auth/signin', {
    email: testUser.email,
    password: testUser.password
  });
  if (reSigninResult.success) {
    results.passed++;
    accessToken = reSigninResult.data.accessToken;
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
  
  log('\n--- 3. Organization Endpoints (Protected) ---', 'blue');
  
  // Test 9: POST /organizations
  results.total++;
  const orgCreateResult = await testEndpoint('POST', '/organizations', {
    name: 'Test Organization',
    logo: 'https://example.com/logo.png'
  }, {
    'Authorization': `Bearer ${accessToken}`
  }, 201);
  if (orgCreateResult.success) {
    results.passed++;
    testOrgId = orgCreateResult.data.organization.id;
    log(`  Organization created: ${testOrgId}`, 'green');
  } else {
    results.failed++;
  }
  
  // Test 10: GET /organizations
  results.total++;
  const orgListResult = await testEndpoint('GET', '/organizations', null, {
    'Authorization': `Bearer ${accessToken}`
  });
  if (orgListResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 11: GET /organizations/:id
  if (testOrgId) {
    results.total++;
    const orgGetResult = await testEndpoint('GET', `/organizations/${testOrgId}`, null, {
      'Authorization': `Bearer ${accessToken}`
    });
    if (orgGetResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  // Test 12: PUT /organizations/:id
  if (testOrgId) {
    results.total++;
    const orgUpdateResult = await testEndpoint('PUT', `/organizations/${testOrgId}`, {
      name: 'Updated Test Organization'
    }, {
      'Authorization': `Bearer ${accessToken}`
    });
    if (orgUpdateResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  log('\n--- 4. Project Endpoints (Protected) ---', 'blue');
  
  // Test 13: POST /organizations/:orgId/projects
  if (testOrgId) {
    results.total++;
    const projectCreateResult = await testEndpoint('POST', `/organizations/${testOrgId}/projects`, {
      name: 'Test Project',
      description: 'A test project',
      idea: 'Test SaaS idea',
      market: 'Test market',
      coreFeatures: ['Feature 1', 'Feature 2'],
      techStack: ['Node.js', 'React'],
      mvpPlan: 'MVP plan',
      gtmPlan: 'Go-to-market plan'
    }, {
      'Authorization': `Bearer ${accessToken}`
    }, 201);
    if (projectCreateResult.success) {
      results.passed++;
      testProjectId = projectCreateResult.data.project.id;
      log(`  Project created: ${testProjectId}`, 'green');
    } else {
      results.failed++;
    }
  }
  
  // Test 14: GET /organizations/:orgId/projects
  if (testOrgId) {
    results.total++;
    const projectListResult = await testEndpoint('GET', `/organizations/${testOrgId}/projects`, null, {
      'Authorization': `Bearer ${accessToken}`
    });
    if (projectListResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  // Test 15: GET /organizations/:orgId/projects/:id
  if (testOrgId && testProjectId) {
    results.total++;
    const projectGetResult = await testEndpoint('GET', `/organizations/${testOrgId}/projects/${testProjectId}`, null, {
      'Authorization': `Bearer ${accessToken}`
    });
    if (projectGetResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  // Test 16: PUT /organizations/:orgId/projects/:id
  if (testOrgId && testProjectId) {
    results.total++;
    const projectUpdateResult = await testEndpoint('PUT', `/organizations/${testOrgId}/projects/${testProjectId}`, {
      name: 'Updated Test Project',
      description: 'An updated test project'
    }, {
      'Authorization': `Bearer ${accessToken}`
    });
    if (projectUpdateResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  log('\n--- 5. Generate API Endpoints ---', 'blue');
  
  // Test 17: POST /generate/analyze
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
  
  // Test 18: POST /generate/landing
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
  
  // Test 19: GET /generate/status/:jobId (non-existent job)
  results.total++;
  const statusResult = await testEndpoint('GET', '/generate/status/non-existent-job', null, {}, 404);
  if (statusResult.success || statusResult.status === 404) {
    results.passed++;
    logEndpoint('GET', '/generate/status/:jobId (not found)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('GET', '/generate/status/:jobId (not found)', 'FAIL');
  }
  
  // Test 20: GET /generate/ab-results
  results.total++;
  const abResults = await testEndpoint('GET', '/generate/ab-results');
  if (abResults.success) {
    results.passed++;
    log(`  A/B test results retrieved`, 'green');
  } else {
    results.failed++;
  }
  
  log('\n--- 6. Error Path Tests ---', 'blue');
  
  // Test 21: Signup with duplicate email
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
  
  // Test 22: Signin with wrong password
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
  
  // Test 23: Access protected endpoint without token
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
  
  // Test 24: Invalid email format
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
  
  // Test 25: Weak password
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
  
  // Test 26: POST /generate/analyze without prompt
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
  
  // Test 27: POST /generate/landing without saasData
  results.total++;
  log('\nTesting landing without saasData (should fail):', 'yellow');
  const noSaasDataResult = await testEndpoint('POST', '/generate/landing', {}, {}, 400);
  if (noSaasDataResult.success || noSaasDataResult.status === 400) {
    results.passed++;
    logEndpoint('POST', '/generate/landing (no saasData)', 'PASS');
  } else {
    results.failed++;
    logEndpoint('POST', '/generate/landing (no saasData)', 'FAIL');
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
log('⏳ Please ensure the backend server is running on http://localhost:5000\n', 'yellow');

setTimeout(() => {
  runTests().catch(error => {
    log(`\n❌ Test suite crashed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}, 1000);