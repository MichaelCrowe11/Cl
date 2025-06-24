// Test script for AI functionality
// Run with: node scripts/test-ai.js

async function testAI() {
  const API_URL = process.env.API_URL || 'http://localhost:3000/api/ai';
  
  console.log('🧪 Testing AI API at:', API_URL);
  console.log('-----------------------------------');
  
  const testPrompts = [
    {
      prompt: "What's the optimal temperature for growing oyster mushrooms?",
      model: "claude-3-opus"
    },
    {
      prompt: "Explain contamination prevention in mushroom cultivation",
      model: "gpt-4"
    }
  ];
  
  for (const test of testPrompts) {
    console.log(`\n📝 Testing ${test.model}:`);
    console.log(`Prompt: "${test.prompt}"`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: test.prompt,
          model: test.model,
          temperature: 0.3,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.log('❌ Error:', data.error);
      } else {
        console.log('✅ Response received!');
        console.log('Model used:', data.model);
        console.log('Response preview:', data.response.substring(0, 200) + '...');
        
        if (data.response.includes('placeholder response') || data.response.includes('Configure your AI model')) {
          console.log('⚠️  WARNING: This is a mock response! Add API keys to get real AI responses.');
        }
      }
      
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
  }
  
  console.log('\n-----------------------------------');
  console.log('📋 Test Summary:');
  console.log('- If you see mock responses, add API keys to .env.local');
  console.log('- If you see real AI responses, your setup is complete!');
  console.log('- Check QUICK_SETUP_GUIDE.md for detailed instructions');
}

// Check if running in Node.js
if (typeof window === 'undefined') {
  testAI().catch(console.error);
} else {
  console.log('This script should be run with Node.js');
} 