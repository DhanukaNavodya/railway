import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testEmployee = {
  EmployeeID: `EMP${Date.now()}`,
  Name: 'Test Employee Education',
  NIC: `TEST${Date.now()}V`,
  Contact_Details: '+94 71 123 4567',
  department_id: 1,
  designation_id: 1,
  Basic_Salary: 50000,
  companyId: 'COMP001',
  educationQualification: [
    'O/L',
    'A/L',
    'Bachelor\'s Degree in Computer Science',
    'Master\'s Degree in Business Administration'
  ],
  additions: [],
  deductions: [],
  shifts: [],
  documents: []
};

async function testEducationQualifications() {
  console.log('🧪 Testing Employee Education Qualifications API\n');

  try {
    // Test 1: Create employee with education qualifications
    console.log('1. Creating employee with education qualifications...');
    const createResponse = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEmployee)
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create employee: ${createResponse.status} ${createResponse.statusText}`);
    }

    const createResult = await createResponse.json();
    console.log('✅ Employee created successfully:', createResult);
    const employeeId = createResult.id;

    // Test 2: Get employee details (should include education qualifications)
    console.log('\n2. Getting employee details...');
    const getResponse = await fetch(`${BASE_URL}/employees/${employeeId}`);
    
    if (!getResponse.ok) {
      throw new Error(`Failed to get employee: ${getResponse.status} ${getResponse.statusText}`);
    }

    const employeeDetails = await getResponse.json();
    console.log('✅ Employee details retrieved successfully');
    console.log('Education qualifications:', employeeDetails.education_qualifications);
    console.log('Total education count:', employeeDetails.summary.total_education_count);

    // Test 3: Get education qualifications separately
    console.log('\n3. Getting education qualifications separately...');
    const educationResponse = await fetch(`${BASE_URL}/employees/${employeeId}/education`);
    
    if (!educationResponse.ok) {
      throw new Error(`Failed to get education: ${educationResponse.status} ${educationResponse.statusText}`);
    }

    const educationData = await educationResponse.json();
    console.log('✅ Education qualifications retrieved successfully:', educationData);

    // Test 4: Add new education qualification
    console.log('\n4. Adding new education qualification...');
    const newEducation = {
      qualification: 'PhD in Computer Science',
      companyId: 'COMP001'
    };

    const addEducationResponse = await fetch(`${BASE_URL}/employees/${employeeId}/education`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEducation)
    });

    if (!addEducationResponse.ok) {
      throw new Error(`Failed to add education: ${addEducationResponse.status} ${addEducationResponse.statusText}`);
    }

    const addEducationResult = await addEducationResponse.json();
    console.log('✅ Education qualification added successfully:', addEducationResult);

    // Test 5: Update education qualification
    console.log('\n5. Updating education qualification...');
    const updateData = {
      qualification: 'PhD in Computer Science (Updated)',
      companyId: 'COMP001'
    };

    const updateEducationResponse = await fetch(`${BASE_URL}/employees/education/${addEducationResult.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!updateEducationResponse.ok) {
      throw new Error(`Failed to update education: ${updateEducationResponse.status} ${updateEducationResponse.statusText}`);
    }

    const updateEducationResult = await updateEducationResponse.json();
    console.log('✅ Education qualification updated successfully:', updateEducationResult);

    // Test 6: Verify updated education qualifications
    console.log('\n6. Verifying updated education qualifications...');
    const verifyResponse = await fetch(`${BASE_URL}/employees/${employeeId}/education`);
    const verifyData = await verifyResponse.json();
    console.log('✅ Updated education qualifications:', verifyData);

    // Test 7: Delete education qualification
    console.log('\n7. Deleting education qualification...');
    const deleteEducationResponse = await fetch(`${BASE_URL}/employees/education/${addEducationResult.id}`, {
      method: 'DELETE'
    });

    if (!deleteEducationResponse.ok) {
      throw new Error(`Failed to delete education: ${deleteEducationResponse.status} ${deleteEducationResponse.statusText}`);
    }

    const deleteEducationResult = await deleteEducationResponse.json();
    console.log('✅ Education qualification deleted successfully:', deleteEducationResult);

    // Test 8: Verify final education qualifications
    console.log('\n8. Verifying final education qualifications...');
    const finalResponse = await fetch(`${BASE_URL}/employees/${employeeId}/education`);
    const finalData = await finalResponse.json();
    console.log('✅ Final education qualifications:', finalData);

    // Test 9: Clean up - Delete test employee
    console.log('\n9. Cleaning up - Deleting test employee...');
    const deleteEmployeeResponse = await fetch(`${BASE_URL}/employees/${employeeId}`, {
      method: 'DELETE'
    });

    if (!deleteEmployeeResponse.ok) {
      console.warn('⚠️ Failed to delete test employee:', deleteEmployeeResponse.status);
    } else {
      console.log('✅ Test employee deleted successfully');
    }

    console.log('\n🎉 All education qualification tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the tests
testEducationQualifications();
