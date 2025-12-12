const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:5000/api';

// Test user credentials (you'll need to create a test user first)
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!'
};

let authToken = '';
let testOrganizationId = '';
let testProjectId = '';

async function loginTestUser() {
  try {
    console.log('Logging in test user...');
    const response = await axios.post(`${BASE_URL}/auth/signin`, TEST_USER);
    authToken = response.data.accessToken;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetOrganizations() {
  try {
    console.log('\nTesting GET /api/organizations...');
    const response = await axios.get(`${BASE_URL}/organizations`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ GET /api/organizations successful');
    console.log(`   Found ${response.data.organizations.length} organizations`);
    return response.data.organizations;
  } catch (error) {
    console.error('❌ GET /api/organizations failed:', error.response?.data || error.message);
    return [];
  }
}

async function testCreateOrganization() {
  try {
    console.log('\nTesting POST /api/organizations...');
    const orgData = {
      name: 'Test Organization ' + Date.now(),
      logo: 'https://example.com/logo.png'
    };
    
    const response = await axios.post(`${BASE_URL}/organizations`, orgData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testOrganizationId = response.data.organization.id;
    console.log('✅ POST /api/organizations successful');
    console.log(`   Created organization: ${response.data.organization.name}`);
    return response.data.organization;
  } catch (error) {
    console.error('❌ POST /api/organizations failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetOrganizationById() {
  if (!testOrganizationId) {
    console.log('\n⚠️  Skipping GET /api/organizations/:id - no organization ID');
    return null;
  }
  
  try {
    console.log('\nTesting GET /api/organizations/:id...');
    const response = await axios.get(`${BASE_URL}/organizations/${testOrganizationId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ GET /api/organizations/:id successful');
    console.log(`   Retrieved organization: ${response.data.organization.name}`);
    return response.data.organization;
  } catch (error) {
    console.error('❌ GET /api/organizations/:id failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetProjects() {
  if (!testOrganizationId) {
    console.log('\n⚠️  Skipping GET /api/organizations/:id/projects - no organization ID');
    return [];
  }
  
  try {
    console.log('\nTesting GET /api/organizations/:id/projects...');
    const response = await axios.get(`${BASE_URL}/organizations/${testOrganizationId}/projects`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ GET /api/organizations/:id/projects successful');
    console.log(`   Found ${response.data.projects.length} projects`);
    return response.data.projects;
  } catch (error) {
    console.error('❌ GET /api/organizations/:id/projects failed:', error.response?.data || error.message);
    return [];
  }
}

async function testCreateProject() {
  if (!testOrganizationId) {
    console.log('\n⚠️  Skipping POST /api/organizations/:id/projects - no organization ID');
    return null;
  }
  
  try {
    console.log('\nTesting POST /api/organizations/:id/projects...');
    const projectData = {
      name: 'Test Project ' + Date.now(),
      description: 'A test project for API validation',
      idea: 'A revolutionary SaaS platform',
      market: 'Tech startups',
      coreFeatures: ['Feature 1', 'Feature 2', 'Feature 3'],
      techStack: ['Node.js', 'React', 'PostgreSQL'],
      mvpPlan: 'Build MVP in 3 months',
      gtmPlan: 'Launch with beta users',
      status: 'draft'
    };
    
    const response = await axios.post(`${BASE_URL}/organizations/${testOrganizationId}/projects`, projectData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testProjectId = response.data.project.id;
    console.log('✅ POST /api/organizations/:id/projects successful');
    console.log(`   Created project: ${response.data.project.name}`);
    return response.data.project;
  } catch (error) {
    console.error('❌ POST /api/organizations/:id/projects failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetProjectById() {
  if (!testOrganizationId || !testProjectId) {
    console.log('\n⚠️  Skipping GET /api/organizations/:id/projects/:projectId - missing IDs');
    return null;
  }
  
  try {
    console.log('\nTesting GET /api/organizations/:id/projects/:projectId...');
    const response = await axios.get(`${BASE_URL}/organizations/${testOrganizationId}/projects/${testProjectId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ GET /api/organizations/:id/projects/:projectId successful');
    console.log(`   Retrieved project: ${response.data.project.name}`);
    return response.data.project;
  } catch (error) {
    console.error('❌ GET /api/organizations/:id/projects/:projectId failed:', error.response?.data || error.message);
    return null;
  }
}

async function testUpdateProject() {
  if (!testOrganizationId || !testProjectId) {
    console.log('\n⚠️  Skipping PUT /api/organizations/:id/projects/:projectId - missing IDs');
    return null;
  }
  
  try {
    console.log('\nTesting PUT /api/organizations/:id/projects/:projectId...');
    const updateData = {
      name: 'Updated Test Project',
      description: 'An updated test project description',
      status: 'active'
    };
    
    const response = await axios.put(`${BASE_URL}/organizations/${testOrganizationId}/projects/${testProjectId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ PUT /api/organizations/:id/projects/:projectId successful');
    console.log(`   Updated project: ${response.data.project.name}`);
    return response.data.project;
  } catch (error) {
    console.error('❌ PUT /api/organizations/:id/projects/:projectId failed:', error.response?.data || error.message);
    return null;
  }
}

async function testDeleteProject() {
  if (!testOrganizationId || !testProjectId) {
    console.log('\n⚠️  Skipping DELETE /api/organizations/:id/projects/:projectId - missing IDs');
    return false;
  }
  
  try {
    console.log('\nTesting DELETE /api/organizations/:id/projects/:projectId...');
    const response = await axios.delete(`${BASE_URL}/organizations/${testOrganizationId}/projects/${testProjectId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ DELETE /api/organizations/:id/projects/:projectId successful');
    return true;
  } catch (error) {
    console.error('❌ DELETE /api/organizations/:id/projects/:projectId failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting Organization & Project API integration tests...\n');
  
  // First, we need to login
  const loginSuccess = await loginTestUser();
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed with tests without authentication');
    return;
  }
  
  // Test 1: GET /api/organizations
  await testGetOrganizations();
  
  // Test 2: POST /api/organizations
  await testCreateOrganization();
  
  // Test 3: GET /api/organizations/:id
  await testGetOrganizationById();
  
  // Test 4: GET /api/organizations/:id/projects
  await testGetProjects();
  
  // Test 5: POST /api/organizations/:id/projects
  const project = await testCreateProject();
  
  // Test 6: GET /api/organizations/:id/projects/:projectId
  await testGetProjectById();
  
  // Test 7: PUT /api/organizations/:id/projects/:projectId
  await testUpdateProject();
  
  // Test 8: DELETE /api/organizations/:id/projects/:projectId
  await testDeleteProject();
  
  console.log('\n🏁 Organization & Project API integration tests completed');
}

// Run the tests
runTests().catch(console.error);