const http = require('http');

async function testQuery(q, history = []) {
  const postData = JSON.stringify({ query: q, conversation_history: history });
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/rag/ask',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('=== VERIFYING FRONTEND CLIENT CALLS TO BACKEND ===');
  const r1 = await testQuery('hi');
  console.log('1. User: "hi"');
  console.log('   Bot Response:', r1.answer);
  console.log('   Model:', r1.model);
  
  const r2 = await testQuery('how are you?');
  console.log('\n2. User: "how are you?"');
  console.log('   Bot Response:', r2.answer);
  console.log('   Model:', r2.model);

  const r3 = await testQuery('what is SIP?');
  console.log('\n3. User: "what is SIP?"');
  console.log('   Bot Response:', r3.answer.substring(0, 120) + '...');
  console.log('   Citations:', JSON.stringify(r3.citations));

  const r4 = await testQuery('explain more', [{ role: 'user', content: 'what is SIP?' }, { role: 'assistant', content: r3.answer }]);
  console.log('\n4. User: "explain more" (Follow-up)');
  console.log('   Bot Response:', r4.answer.substring(0, 120) + '...');

  const r5 = await testQuery("today's gold price");
  console.log('\n5. User: "today\'s gold price"');
  console.log('   Bot Response:', r5.answer.substring(0, 120) + '...');

  const r6 = await testQuery("how much did I spend this month?");
  console.log('\n6. User: "how much did I spend this month?"');
  console.log('   Bot Response:', r6.answer);
}

run().catch(console.error);
