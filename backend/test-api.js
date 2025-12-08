const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
};

async function testApi() {
    console.log('🧪 Starting API Test...');
    console.log('Target:', API_URL);

    try {
        // 1. Test Signup
        console.log('\n1️⃣ Testing Signup...');
        const signupRes = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const signupData = await signupRes.json();

        if (!signupRes.ok) throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
        console.log('✅ Signup successful!');
        console.log('Response:', signupData);

        // 2. Test Signin
        console.log('\n2️⃣ Testing Signin...');
        const signinRes = await fetch(`${API_URL}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_USER.email,
                password: TEST_USER.password
            })
        });
        const signinData = await signinRes.json();

        if (!signinRes.ok) throw new Error(`Signin failed: ${JSON.stringify(signinData)}`);
        console.log('✅ Signin successful!');
        console.log('Access Token:', signinData.accessToken ? 'Present' : 'Missing');

        // 3. Test Protected Route (Get Me)
        console.log('\n3️⃣ Testing Protected Route (/me)...');
        const token = signinData.accessToken;
        const meRes = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const meData = await meRes.json();

        if (!meRes.ok) throw new Error(`Get Me failed: ${JSON.stringify(meData)}`);
        console.log('✅ Get Me successful!');
        console.log('User:', meData.user.email);

    } catch (error) {
        console.error('❌ API Test Failed!', error.message);
    }
}

testApi();
