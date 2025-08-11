# How to Create Loan Types

This guide will walk you through creating and managing loan types in your HR system.

## Prerequisites

1. Make sure your database has the `loan_types` table created
2. Ensure your server is running
3. Have access to make API calls (Postman, curl, or your frontend application)

## Step 1: Create the Database Table

First, ensure you have the `loan_types` table in your database:

```sql
CREATE TABLE IF NOT EXISTS loan_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    loan_type VARCHAR(255) NOT NULL,
    interest_rate DECIMAL(5, 2) DEFAULT 0.00,
    max_amount DECIMAL(10, 2) NOT NULL,
    max_tenure_months INT NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    companyId VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Step 2: Update Loans Table

Update your `hr_loans` table to include the loan_type_id field:

```sql
ALTER TABLE hr_loans 
ADD COLUMN loan_type_id INT NOT NULL AFTER employee_id,
ADD FOREIGN KEY (loan_type_id) REFERENCES loan_types(id);
```

## Step 3: Create Loan Types

### Example 1: Personal Loan

```bash
curl -X POST http://localhost:5000/api/loan-types \
  -H "Content-Type: application/json" \
  -d '{
    "loan_type": "Personal Loan",
    "interest_rate": "5.50",
    "max_amount": "100000.00",
    "max_tenure_months": 60,
    "is_active": 1,
    "companyId": "COMP001"
  }'
```

### Example 2: Housing Loan

```bash
curl -X POST http://localhost:5000/api/loan-types \
  -H "Content-Type: application/json" \
  -d '{
    "loan_type": "Housing Loan",
    "interest_rate": "4.25",
    "max_amount": "5000000.00",
    "max_tenure_months": 240,
    "is_active": 1,
    "companyId": "COMP001"
  }'
```

### Example 3: Vehicle Loan

```bash
curl -X POST http://localhost:5000/api/loan-types \
  -H "Content-Type: application/json" \
  -d '{
    "loan_type": "Vehicle Loan",
    "interest_rate": "6.75",
    "max_amount": "2000000.00",
    "max_tenure_months": 84,
    "is_active": 1,
    "companyId": "COMP001"
  }'
```

### Example 4: Salary Advance (No Interest)

```bash
curl -X POST http://localhost:5000/api/loan-types \
  -H "Content-Type: application/json" \
  -d '{
    "loan_type": "Salary Advance",
    "interest_rate": "0.00",
    "max_amount": "50000.00",
    "max_tenure_months": 12,
    "is_active": 1,
    "companyId": "COMP001"
  }'
```

### Example 5: Education Loan

```bash
curl -X POST http://localhost:5000/api/loan-types \
  -H "Content-Type: application/json" \
  -d '{
    "loan_type": "Education Loan",
    "interest_rate": "3.50",
    "max_amount": "1000000.00",
    "max_tenure_months": 120,
    "is_active": 1,
    "companyId": "COMP001"
  }'
```

## Step 4: Verify Loan Types

### Get All Loan Types

```bash
curl -X GET http://localhost:5000/api/loan-types
```

### Get Active Loan Types Only

```bash
curl -X GET http://localhost:5000/api/loan-types/active/all
```

### Get Loan Type by ID

```bash
curl -X GET http://localhost:5000/api/loan-types/1
```

## Step 5: Create Loans Using Loan Types

Once you have created loan types, you can create loans using the loan_type_id:

### Create a Personal Loan for an Employee

```bash
curl -X POST http://localhost:5000/api/loans-advances \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 123,
    "loan_type_id": 1,
    "granted_amount": "50000.00",
    "granted_date": "2024-01-15",
    "period": 12,
    "closing_date": "2025-01-15",
    "total_deductions": "0.00",
    "outstanding_balance": "50000.00",
    "companyId": "COMP001"
  }'
```

## Step 6: Manage Loan Types

### Update a Loan Type

```bash
curl -X PUT http://localhost:5000/api/loan-types/1 \
  -H "Content-Type: application/json" \
  -d '{
    "loan_type": "Personal Loan",
    "interest_rate": "6.00",
    "max_amount": "120000.00",
    "max_tenure_months": 72,
    "is_active": 1,
    "companyId": "COMP001"
  }'
```

### Toggle Loan Type Status (Activate/Deactivate)

```bash
curl -X PUT http://localhost:5000/api/loan-types/1/toggle-status
```

### Delete a Loan Type (Only if not used by existing loans)

```bash
curl -X DELETE http://localhost:5000/api/loan-types/1
```

## JavaScript Examples

### Using Fetch API

```javascript
// Create a Personal Loan Type
const createPersonalLoanType = async () => {
  try {
    const response = await fetch('/api/loan-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loan_type: "Personal Loan",
        interest_rate: "5.50",
        max_amount: "100000.00",
        max_tenure_months: 60,
        is_active: 1,
        companyId: "COMP001"
      })
    });
    
    const result = await response.json();
    console.log('Loan type created:', result);
    return result;
  } catch (error) {
    console.error('Error creating loan type:', error);
  }
};

// Get all active loan types
const getActiveLoanTypes = async () => {
  try {
    const response = await fetch('/api/loan-types/active/all');
    const loanTypes = await response.json();
    console.log('Active loan types:', loanTypes);
    return loanTypes;
  } catch (error) {
    console.error('Error fetching loan types:', error);
  }
};

// Create a loan using loan type ID
const createLoan = async (employeeId, loanTypeId, amount) => {
  try {
    const response = await fetch('/api/loans-advances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_id: employeeId,
        loan_type_id: loanTypeId,
        granted_amount: amount,
        granted_date: new Date().toISOString().split('T')[0],
        period: 12,
        closing_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_deductions: "0.00",
        outstanding_balance: amount,
        companyId: "COMP001"
      })
    });
    
    const result = await response.json();
    console.log('Loan created:', result);
    return result;
  } catch (error) {
    console.error('Error creating loan:', error);
  }
};
```

## Common Loan Type Configurations

### 1. Personal Loan
- **Interest Rate**: 5.50% - 8.00%
- **Max Amount**: 100,000 - 500,000
- **Max Tenure**: 36 - 60 months
- **Use Case**: General personal expenses

### 2. Housing Loan
- **Interest Rate**: 4.00% - 6.00%
- **Max Amount**: 5,000,000 - 50,000,000
- **Max Tenure**: 180 - 300 months
- **Use Case**: Home purchase or construction

### 3. Vehicle Loan
- **Interest Rate**: 6.00% - 9.00%
- **Max Amount**: 1,000,000 - 5,000,000
- **Max Tenure**: 48 - 84 months
- **Use Case**: Car or motorcycle purchase

### 4. Education Loan
- **Interest Rate**: 3.50% - 5.50%
- **Max Amount**: 500,000 - 2,000,000
- **Max Tenure**: 60 - 120 months
- **Use Case**: Education expenses

### 5. Salary Advance
- **Interest Rate**: 0.00%
- **Max Amount**: 25,000 - 100,000
- **Max Tenure**: 6 - 12 months
- **Use Case**: Emergency cash needs

### 6. Emergency Loan
- **Interest Rate**: 2.00% - 4.00%
- **Max Amount**: 50,000 - 200,000
- **Max Tenure**: 12 - 24 months
- **Use Case**: Medical emergencies, urgent repairs

## Best Practices

1. **Start with Common Types**: Create the most commonly used loan types first (Personal, Housing, Vehicle)
2. **Set Realistic Limits**: Base maximum amounts on company policies and employee salary levels
3. **Use Appropriate Interest Rates**: Research market rates for similar loan types
4. **Consider Tenure**: Longer tenures for larger amounts, shorter for advances
5. **Test with Small Amounts**: Start with lower maximum amounts and adjust based on usage
6. **Monitor Usage**: Track which loan types are most popular and adjust accordingly
7. **Regular Reviews**: Periodically review and update loan type configurations

## Troubleshooting

### Common Issues

1. **"Cannot delete loan type" Error**: This means the loan type is being used by existing loans. You can only delete loan types that aren't referenced by any loans.

2. **Foreign Key Constraint Error**: Make sure the `loan_types` table exists and the foreign key relationship is properly set up.

3. **Invalid Interest Rate**: Interest rates should be decimal values (e.g., "5.50" for 5.5%).

4. **Invalid Amount**: Maximum amounts should be positive decimal values.

### Validation Rules

- **loan_type**: Required, unique within a company
- **interest_rate**: Decimal between 0.00 and 100.00
- **max_amount**: Positive decimal value
- **max_tenure_months**: Positive integer
- **is_active**: 0 or 1
- **companyId**: Required for multi-tenant support

## Next Steps

After creating loan types:

1. **Create Loans**: Use the loan type IDs to create loans for employees
2. **Set Up Deductions**: Implement automatic deduction tracking
3. **Generate Reports**: Create reports showing loan usage by type
4. **Monitor Performance**: Track loan performance and adjust types as needed
5. **Add Validation**: Implement frontend validation based on loan type limits 