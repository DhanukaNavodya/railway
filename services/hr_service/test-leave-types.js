// Test script for Leave Types API
// Run with: node test-leave-types.js

const BASE_URL = 'http://localhost:5000/api/leave-types';

// Test data
const testLeaveType = {
  leave_type_name: "Test Annual Leave",
  days_allowed: 21,
  payment_type: "Paid",
  carry_forward: "Yes",
  carry_forward_days: 2,
  companyId: "TEST001",
  is_active: 1
};

const updatedLeaveType = {
  leave_type_name: "Test Annual Leave Updated",
  days_allowed: 25,
  payment_type: "Paid",
  carry_forward: "Yes",
  carry_forward_days: 3,
  companyId: "TEST001",
  is_active: 1
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    console.log(`\n${options.method || 'GET'} ${url}`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${url}:`, error.message);
    return { status: 'ERROR', data: null };
  }
}

// Test functions
async function testGetAllLeaveTypes() {
  console.log('\n=== Testing GET All Leave Types ===');
  await makeRequest(BASE_URL);
}

async function testGetActiveLeaveTypes() {
  console.log('\n=== Testing GET Active Leave Types ===');
  await makeRequest(`${BASE_URL}/active`);
}

async function testCreateLeaveType() {
  console.log('\n=== Testing CREATE Leave Type ===');
  const result = await makeRequest(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(testLeaveType)
  });
  return result.data?.id;
}

async function testGetLeaveTypeById(id) {
  console.log('\n=== Testing GET Leave Type by ID ===');
  await makeRequest(`${BASE_URL}/${id}`);
}

async function testUpdateLeaveType(id) {
  console.log('\n=== Testing UPDATE Leave Type ===');
  await makeRequest(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedLeaveType)
  });
}

async function testChangeLeaveTypeStatus(id) {
  console.log('\n=== Testing CHANGE Leave Type Status ===');
  await makeRequest(`${BASE_URL}/status/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ isActive: 0 })
  });
}

async function testGetLeaveTypesByCompany() {
  console.log('\n=== Testing GET Leave Types by Company ===');
  await makeRequest(`${BASE_URL}/company/TEST001`);
}

async function testDeleteLeaveType(id) {
  console.log('\n=== Testing DELETE Leave Type ===');
  await makeRequest(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Leave Types API Tests...\n');
  
  try {
    // Test 1: Get all leave types
    await testGetAllLeaveTypes();
    
    // Test 2: Get active leave types
    await testGetActiveLeaveTypes();
    
    // Test 3: Create a new leave type
    const createdId = await testCreateLeaveType();
    
    if (createdId) {
      // Test 4: Get leave type by ID
      await testGetLeaveTypeById(createdId);
      
      // Test 5: Update leave type
      await testUpdateLeaveType(createdId);
      
      // Test 6: Get updated leave type
      await testGetLeaveTypeById(createdId);
      
      // Test 7: Change status
      await testChangeLeaveTypeStatus(createdId);
      
      // Test 8: Get leave types by company
      await testGetLeaveTypesByCompany();
      
      // Test 9: Delete leave type
      await testDeleteLeaveType(createdId);
    }
    
    // Final test: Get all leave types again
    await testGetAllLeaveTypes();
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests }; 