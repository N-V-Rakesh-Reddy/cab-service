// Test Script for Database Endpoints
// Run this after starting the server with: npm run dev

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testItems = [
  {
    name: 'Test Item 1',
    description: 'First test item for database testing',
    value: 100
  },
  {
    name: 'Test Item 2',
    description: 'Second test item with different value',
    value: 250
  },
  {
    name: 'Test Item 3',
    description: 'Third test item for bulk operations',
    value: 50
  }
];

async function makeRequest(url: string, options: any = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${url}:`, error);
    return { status: 500, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function runTests() {
  console.log('🚀 Starting Database Endpoint Tests...\n');

  // Test 1: Database Connection
  console.log('1️⃣ Testing Database Connection...');
  const connectionTest = await makeRequest(`${BASE_URL}/test/test-connection`);
  console.log('Response:', connectionTest);
  console.log('---\n');

  // Test 2: Create Test Items
  console.log('2️⃣ Creating Test Items...');
  const createdItems = [];
  
  for (const item of testItems) {
    const createResponse = await makeRequest(`${BASE_URL}/test/items`, {
      method: 'POST',
      body: JSON.stringify(item)
    });
    console.log(`Created item "${item.name}":`, createResponse);
    if (createResponse.data?.data?.id) {
      createdItems.push(createResponse.data.data);
    }
  }
  console.log('---\n');

  // Test 3: Get All Test Items
  console.log('3️⃣ Retrieving All Test Items...');
  const getAllResponse = await makeRequest(`${BASE_URL}/test/items`);
  console.log('All items:', getAllResponse);
  console.log('---\n');

  // Test 4: Get Specific Item by ID
  if (createdItems.length > 0) {
    console.log('4️⃣ Getting Item by ID...');
    const firstItemId = createdItems[0].id;
    const getByIdResponse = await makeRequest(`${BASE_URL}/test/items/${firstItemId}`);
    console.log(`Item ${firstItemId}:`, getByIdResponse);
    console.log('---\n');

    // Test 5: Update Item
    console.log('5️⃣ Updating Test Item...');
    const updateResponse = await makeRequest(`${BASE_URL}/test/items/${firstItemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Test Item',
        description: 'This item has been updated',
        value: 999
      })
    });
    console.log('Update response:', updateResponse);
    console.log('---\n');

    // Test 6: Delete Item
    console.log('6️⃣ Deleting Test Item...');
    const deleteResponse = await makeRequest(`${BASE_URL}/test/items/${firstItemId}`, {
      method: 'DELETE'
    });
    console.log('Delete response:', deleteResponse);
    console.log('---\n');
  }

  // Test 7: Bulk Create
  console.log('7️⃣ Testing Bulk Create...');
  const bulkCreateResponse = await makeRequest(`${BASE_URL}/test/items/bulk`, {
    method: 'POST',
    body: JSON.stringify({
      items: [
        { name: 'Bulk Item 1', description: 'First bulk item', value: 10 },
        { name: 'Bulk Item 2', description: 'Second bulk item', value: 20 },
        { name: 'Bulk Item 3', description: 'Third bulk item', value: 30 }
      ]
    })
  });
  console.log('Bulk create response:', bulkCreateResponse);
  console.log('---\n');

  // Test 8: Final Count
  console.log('8️⃣ Final Item Count...');
  const finalCountResponse = await makeRequest(`${BASE_URL}/test/items`);
  console.log('Final count:', finalCountResponse);

  console.log('\n✅ All tests completed!');
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, makeRequest };
}

// Auto-run if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runTests().catch(console.error);
}
