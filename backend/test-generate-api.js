const API_URL = 'http://localhost:3001/api';

async function testGenerateApi() {
    console.log('🧪 Starting Generate API Test...');
    console.log('Target:', API_URL);
    
    // More comprehensive test prompts to showcase enhanced LLM service
    const TEST_PROMPTS = [
        "SaaS de gestión de tareas para freelancers",
        "AI-powered fitness tracking platform for personal trainers",
        "Booking system for restaurants with table management",
        "Financial analytics tool for small businesses"
    ];

    for (const [index, prompt] of TEST_PROMPTS.entries()) {
        console.log(`\n📝 Test Case ${index + 1}: "${prompt}"`);
        
        try {
            // 1. Test Analyze Prompt
            console.log('\n1️⃣ Testing Analyze Prompt...');
            const analyzeRes = await fetch(`${API_URL}/generate/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt })
            });
            const analyzeData = await analyzeRes.json();
            
            if (!analyzeRes.ok) throw new Error(`Analyze failed: ${JSON.stringify(analyzeData)}`);
            console.log('✅ Analyze successful!');
            
            // Display key generated data
            console.log('Generated SaaS Name:', analyzeData.data?.name || 'N/A');
            console.log('Market:', analyzeData.data?.market || 'N/A');
            console.log('Tagline:', analyzeData.data?.tagline || 'N/A');
            console.log('Features Count:', analyzeData.data?.features?.length || 0);
            
            // 2. Test Generate Landing Page
            console.log('\n2️⃣ Testing Generate Landing Page...');
            const landingRes = await fetch(`${API_URL}/generate/landing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saasData: analyzeData.data })
            });
            const landingData = await landingRes.json();
            
            if (!landingRes.ok) throw new Error(`Landing generation failed: ${JSON.stringify(landingData)}`);
            console.log('✅ Landing generation successful!');
            console.log('HTML Generated:', landingData.html ? 'Yes' : 'No');
            console.log('HTML Length:', landingData.html?.length || 0);
            
        } catch (error) {
            console.error('❌ Test Failed!', error.message);
        }
        
        // Add separator between tests
        if (index < TEST_PROMPTS.length - 1) {
            console.log('\n' + '='.repeat(50));
        }
    }
    
    // 3. Test Stream Endpoint (basic check)
    console.log('\n3️⃣ Testing Stream Endpoint...');
    try {
        const streamRes = await fetch(`${API_URL}/generate/stream/test-job-id`);
        console.log('Stream endpoint accessible:', streamRes.status === 200 ? 'Yes' : 'No');
    } catch (error) {
        console.error('❌ Stream endpoint test failed:', error.message);
    }
    
    console.log('\n🏁 Generate API Test Complete!');
}

testGenerateApi();