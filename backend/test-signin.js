const fetch = require('node-fetch');

async function testSignin() {
  try {
    console.log('🧪 Testing signin endpoint...');
    
    const response = await fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPass123!'
      })
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 401) {
      console.log('✅ Expected 401 for invalid credentials');
    } else if (response.status === 200) {
      console.log('✅ Successful signin');
    } else {
      console.log(`⚠️ Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSignin();