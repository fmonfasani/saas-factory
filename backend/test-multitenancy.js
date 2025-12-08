const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Base URL for API
const BASE_URL = 'http://localhost:3000/api';

// Store tokens and IDs for tests
let authToken = '';
let userId = '';
let personalOrgId = '';
let testOrgId = '';
let projectId = '';

console.log('🧪 Starting Multitenancy Test Suite...\n');

/**
 * Helper function to make HTTP requests
 */
async function httpRequest(url, options = {}) {
  const fullUrl = `${BASE_URL}${url}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options
  };
  
  if (mergedOptions.body && typeof mergedOptions.body === 'object') {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }
  
  try {
    const response = await fetch(fullUrl, mergedOptions);
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return { response, data };
  } catch (error) {
    if (error.name === 'TypeError' && error.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to server. Make sure the backend is running.');
    }
    throw error;
  }
}

/**
 * Test 1: Signup a new user and verify personal organization is created
 */
async function testSignupAndPersonalOrg() {
  console.log('1️⃣ Testing Signup and Personal Organization Creation...');
  
  try {
    // Create a new user
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: 'SecurePass123!',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const { data: signupData } = await httpRequest('/auth/signup', {
      method: 'POST',
      body: userData
    });
    
    console.log('   ✅ Signup successful');
    
    // Sign in to get auth token
    const { data: signInData } = await httpRequest('/auth/signin', {
      method: 'POST',
      body: {
        email: userData.email,
        password: userData.password
      }
    });
    
    authToken = signInData.accessToken;
    userId = signInData.user.id;
    
    // Get user's organizations
    const { data: orgsData } = await httpRequest('/organizations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const organizations = orgsData.organizations;
    
    if (organizations.length === 0) {
      throw new Error('No organizations found for new user');
    }
    
    // Find the personal workspace
    const personalOrg = organizations.find(org => 
      org.name.includes('Workspace') || org.name.includes('Personal')
    );
    
    if (!personalOrg) {
      throw new Error('Personal organization not found');
    }
    
    personalOrgId = personalOrg.id;
    console.log(`   ✅ Personal organization found: ${personalOrg.name}`);
    return true;
  } catch (error) {
    console.error('   ❌ Signup test failed:', error.message);
    if (error.data) {
      console.error('   Details:', error.data);
    }
    return false;
  }
}

/**
 * Test 2: Organization CRUD operations
 */
async function testOrganizationCRUD() {
  console.log('\n2️⃣ Testing Organization CRUD Operations...');
  
  try {
    // Create a new organization
    const { data: createData } = await httpRequest('/organizations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        name: 'Test Company',
        logo: 'https://example.com/logo.png'
      }
    });
    
    testOrgId = createData.organization.id;
    console.log('   ✅ Organization created');
    
    // Get organization details
    const { data: getData } = await httpRequest(`/organizations/${testOrgId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (getData.organization.name !== 'Test Company') {
      throw new Error('Organization name mismatch');
    }
    console.log('   ✅ Organization details retrieved');
    
    // Update organization
    const { data: updateData } = await httpRequest(`/organizations/${testOrgId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        name: 'Updated Company'
      }
    });
    
    if (updateData.organization.name !== 'Updated Company') {
      throw new Error('Organization update failed');
    }
    console.log('   ✅ Organization updated');
    
    // List organizations
    const { data: listData } = await httpRequest('/organizations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const orgNames = listData.organizations.map(org => org.name);
    if (!orgNames.includes('Updated Company')) {
      throw new Error('Updated organization not found in list');
    }
    console.log('   ✅ Organization list verified');
    
    return true;
  } catch (error) {
    console.error('   ❌ Organization CRUD test failed:', error.message);
    if (error.data) {
      console.error('   Details:', error.data);
    }
    return false;
  }
}

/**
 * Test 3: Project CRUD operations
 */
async function testProjectCRUD() {
  console.log('\n3️⃣ Testing Project CRUD Operations...');
  
  try {
    // Create a project in the test organization
    const projectData = {
      name: 'My SaaS Idea',
      description: 'A revolutionary platform',
      idea: 'Solve X problem for Y audience',
      market: 'Target market description',
      coreFeatures: ['Feature 1', 'Feature 2'],
      techStack: ['React', 'Node.js'],
      mvpPlan: 'MVP implementation plan',
      gtmPlan: 'Go-to-market strategy'
    };
    
    const { data: createData } = await httpRequest(`/organizations/${testOrgId}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: projectData
    });
    
    projectId = createData.project.id;
    console.log('   ✅ Project created');
    
    // Get project details
    const { data: getData } = await httpRequest(`/organizations/${testOrgId}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (getData.project.name !== 'My SaaS Idea') {
      throw new Error('Project name mismatch');
    }
    console.log('   ✅ Project details retrieved');
    
    // Update project
    const { data: updateData } = await httpRequest(`/organizations/${testOrgId}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: { status: 'active' }
    });
    
    if (updateData.project.status !== 'active') {
      throw new Error('Project update failed');
    }
    console.log('   ✅ Project updated');
    
    // List projects
    const { data: listData } = await httpRequest(`/organizations/${testOrgId}/projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (listData.projects.length !== 1) {
      throw new Error('Project list count mismatch');
    }
    console.log('   ✅ Project list verified');
    
    // Delete project
    await httpRequest(`/organizations/${testOrgId}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('   ✅ Project deleted');
    
    // Verify project is deleted
    const { data: finalListData } = await httpRequest(`/organizations/${testOrgId}/projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (finalListData.projects.length !== 0) {
      throw new Error('Project deletion failed');
    }
    console.log('   ✅ Project deletion confirmed');
    
    return true;
  } catch (error) {
    console.error('   ❌ Project CRUD test failed:', error.message);
    if (error.data) {
      console.error('   Details:', error.data);
    }
    return false;
  }
}

/**
 * Test 4: Security tests
 */
async function testSecurity() {
  console.log('\n4️⃣ Testing Security...');
  
  try {
    // Create another user to test cross-tenant access
    const userData2 = {
      email: `test2-${Date.now()}@example.com`,
      password: 'SecurePass123!',
      firstName: 'Test2',
      lastName: 'User2'
    };
    
    await httpRequest('/auth/signup', {
      method: 'POST',
      body: userData2
    });
    
    // Try to access first user's organization with second user
    const { data: signInData2 } = await httpRequest('/auth/signin', {
      method: 'POST',
      body: {
        email: userData2.email,
        password: userData2.password
      }
    });
    
    const secondAuthToken = signInData2.accessToken;
    
    // Try to access first user's organization
    try {
      await httpRequest(`/organizations/${testOrgId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secondAuthToken}`
        }
      });
      
      console.error('   ❌ Security breach: Second user accessed first user\'s organization');
      return false;
    } catch (error) {
      if (error.status === 403) {
        console.log('   ✅ Cross-tenant organization access correctly blocked');
      } else {
        throw error;
      }
    }
    
    // Try to access without authentication
    try {
      await httpRequest(`/organizations/${testOrgId}/projects`, {
        method: 'POST',
        body: {
          name: 'Unauthorized Project'
        }
      });
      
      console.error('   ❌ Security breach: Unauthenticated access allowed');
      return false;
    } catch (error) {
      if (error.status === 401) {
        console.log('   ✅ Unauthenticated project creation correctly blocked');
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('   ❌ Security test failed:', error.message);
    if (error.data) {
      console.error('   Details:', error.data);
    }
    return false;
  }
}

/**
 * Cleanup test data
 */
async function cleanup() {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // Delete test organization if it exists
    if (testOrgId) {
      try {
        await httpRequest(`/organizations/${testOrgId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        console.log('   ✅ Test organization deleted');
      } catch (error) {
        // Ignore if already deleted
      }
    }
    
    // Delete test user if ID is available
    if (userId) {
      try {
        await prisma.user.delete({ where: { id: userId } });
        console.log('   ✅ Test user deleted');
      } catch (error) {
        // Ignore if already deleted
      }
    }
    
    console.log('   ✅ Cleanup completed');
  } catch (error) {
    console.error('   ❌ Cleanup failed:', error.message);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  let passedTests = 0;
  const totalTests = 4;
  
  try {
    // Run tests in sequence
    if (await testSignupAndPersonalOrg()) passedTests++;
    if (await testOrganizationCRUD()) passedTests++;
    if (await testProjectCRUD()) passedTests++;
    if (await testSecurity()) passedTests++;
    
    // Cleanup
    await cleanup();
    
    // Summary
    console.log('\n📊 Test Results:');
    console.log(`   Passed: ${passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      console.log('   🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('   ❌ Some tests failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Test suite crashed:', error.message);
    await cleanup();
    process.exit(1);
  }
}

// Run the tests
runTests();