# Test Endpoints Documentation

This document describes the test endpoints created for database testing and verification.

## Overview

A `test_items` table has been created with full CRUD operations to test database connectivity and RLS (Row Level Security) policies.

## Database Schema

### test_items Table
```sql
CREATE TABLE test_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    value INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## RLS Policies

- Backend has full access (service_role)
- Users can view, create, update, and delete their own test items
- RLS is enabled for security

## API Endpoints

Base URL: `http://localhost:3000/api/test`

### 1. Test Database Connection
```
GET /test-connection
```
**Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "timestamp": "2025-08-06T..."
}
```

### 2. Create Test Item
```
POST /items
```
**Body:**
```json
{
  "name": "Test Item Name",
  "description": "Optional description",
  "value": 100,
  "user_id": "optional-user-uuid"
}
```

### 3. Get All Test Items
```
GET /items
```
**Response:**
```json
{
  "success": true,
  "message": "Test items retrieved successfully",
  "data": [...],
  "count": 5
}
```

### 4. Get Test Item by ID
```
GET /items/:id
```

### 5. Update Test Item
```
PUT /items/:id
```
**Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "value": 200
}
```

### 6. Delete Test Item
```
DELETE /items/:id
```

### 7. Get Test Items by User ID
```
GET /users/:userId/items
```

### 8. Bulk Create Test Items
```
POST /items/bulk
```
**Body:**
```json
{
  "items": [
    {
      "name": "Item 1",
      "description": "First item",
      "value": 10
    },
    {
      "name": "Item 2",
      "description": "Second item", 
      "value": 20
    }
  ]
}
```

## Testing

### Run the Server
```bash
npm run dev
```

### Run Tests
1. Start the server first
2. Use the test script:
```bash
npx ts-node src/scripts/testEndpoints.ts
```

### Manual Testing with curl

```bash
# Test connection
curl http://localhost:3000/api/test/test-connection

# Create item
curl -X POST http://localhost:3000/api/test/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Testing","value":100}'

# Get all items
curl http://localhost:3000/api/test/items

# Update item (replace :id with actual ID)
curl -X PUT http://localhost:3000/api/test/items/:id \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item","value":200}'

# Delete item (replace :id with actual ID)
curl -X DELETE http://localhost:3000/api/test/items/:id
```

## Files Created/Modified

1. **Database Schema:** `src/scripts/sql/init_schema.sql` - Added test_items table
2. **RLS Policies:** `src/scripts/sql/rls_policies.sql` - Added RLS policies for test_items
3. **Service:** `src/services/testService.ts` - Database operations
4. **Controller:** `src/controllers/testController.ts` - API endpoint handlers
5. **Routes:** `src/routes/testRoutes.ts` - Route definitions
6. **Main Routes:** `src/routes/index.ts` - Added /test route
7. **Test Script:** `src/scripts/testEndpoints.ts` - Automated testing

## Usage Notes

- All endpoints return consistent JSON responses with `success`, `message`, and `data` fields
- Error handling is implemented for all operations
- The test_items table is isolated and safe for testing
- RLS policies ensure data security even in testing scenarios
- The bulk operations endpoint is useful for populating test data quickly
