# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

All API endpoints (except health check and auth endpoints) require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Alternatively, you can use the admin secret for backend operations:
```
Authorization: Bearer <admin-secret>
```

## Response Format

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data"?: any,
  "message"?: string,
  "error"?: string
}
```

For paginated responses:
```typescript
{
  "success": boolean,
  "data": array,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## Endpoints

### 🏥 Health Check

#### GET /health
Check if the service is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-06T17:00:00.000Z",
  "version": "1.0.0"
}
```

---

### 🔐 Authentication

#### POST /auth/send-otp
Send OTP to a phone number for verification.

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid phone number format"
}
```

#### POST /auth/verify-otp
Verify OTP and receive authentication tokens.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "phone": "+1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "is_verified": true
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/refresh-token
Refresh an expired access token.

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token",
    "expiresIn": 3600
  }
}
```

---

### 👤 Users

#### GET /users/:id
Get user profile by ID.

**Parameters:**
- `id` (string): User UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "phone": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "profile_picture": "https://example.com/avatar.jpg",
    "is_verified": true,
    "role": "customer",
    "status": "active",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

#### PUT /users/:id
Update user profile.

**Parameters:**
- `id` (string): User UUID

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "profile_picture": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "phone": "+1234567890",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "profile_picture": "https://example.com/new-avatar.jpg",
    "is_verified": true,
    "role": "customer",
    "status": "active",
    "updated_at": "2025-08-06T17:00:00.000Z"
  }
}
```

#### GET /users/:id/bookings
Get user's booking history.

**Parameters:**
- `id` (string): User UUID

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by booking status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "booking-uuid",
      "user_id": "user-uuid",
      "package_id": "package-uuid",
      "pickup_location": "Airport",
      "destination": "Hotel Downtown",
      "pickup_datetime": "2025-08-10T09:00:00.000Z",
      "passengers": 2,
      "estimated_fare": 25.50,
      "actual_fare": 23.00,
      "status": "completed",
      "created_at": "2025-08-06T17:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

#### GET /users
List all users (Admin only).

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `role` (string, optional): Filter by user role
- `status` (string, optional): Filter by user status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "phone": "+1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "status": "active",
      "is_verified": true,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Error Codes

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Auth endpoints**: 5 requests per minute per IP
- **Other endpoints**: 100 requests per minute per user

## Testing

### Example cURL Commands

**Health Check:**
```bash
curl -X GET http://localhost:3000/health
# or through API route
curl -X GET http://localhost:3000/api/v1/health
```

**Send OTP:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "otp": "123456"}'
```

**Get User Profile:**
```bash
curl -X GET http://localhost:3000/api/v1/users/user-uuid \
  -H "Authorization: Bearer your-jwt-token"
```

**Update User Profile:**
```bash
curl -X PUT http://localhost:3000/api/v1/users/user-uuid \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "email": "john.smith@example.com"}'
```

**Get User Bookings:**
```bash
curl -X GET "http://localhost:3000/api/v1/users/user-uuid/bookings?page=1&limit=10" \
  -H "Authorization: Bearer your-jwt-token"
```

**List All Users (Admin):**
```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10&role=customer" \
  -H "Authorization: Bearer admin-secret-or-admin-jwt"
```

### Frontend Integration Examples

#### JavaScript/TypeScript Frontend

**Authentication Flow:**
```javascript
// Send OTP
const sendOTP = async (phone) => {
  const response = await fetch('/api/v1/auth/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });
  return response.json();
};

// Verify OTP
const verifyOTP = async (phone, otp) => {
  const response = await fetch('/api/v1/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, otp }),
  });
  const data = await response.json();
  
  if (data.success) {
    // Store tokens
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};

// API call with authentication
const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  // Handle token refresh if needed
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshResponse = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        localStorage.setItem('accessToken', refreshData.data.accessToken);
        // Retry original request
        return authenticatedFetch(url, options);
      }
    }
    // Redirect to login
    window.location.href = '/login';
    return;
  }
  
  return response.json();
};

// Get user profile
const getUserProfile = async (userId) => {
  return authenticatedFetch(`/api/v1/users/${userId}`);
};

// Update user profile
const updateUserProfile = async (userId, userData) => {
  return authenticatedFetch(`/api/v1/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};
```

**React Hook Example:**
```javascript
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (phone, otp) => {
    setLoading(true);
    try {
      const data = await verifyOTP(phone, otp);
      if (data.success) {
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, login, logout };
};
```

### Backend Admin Integration

#### Admin Authentication
For backend administrative operations, you can use either:

1. **Admin JWT Token** (recommended for web admin panels):
```bash
# Login as admin user first, then use the JWT token
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer admin-jwt-token"
```

2. **Admin Secret** (for server-to-server operations):
```bash
# Use the SUPABASE_SECRET directly
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer your-supabase-secret-key"
```

#### Admin Operations Examples

**List All Users with Filtering:**
```bash
# Get all customers
curl -X GET "http://localhost:3000/api/v1/users?role=customer&page=1&limit=50" \
  -H "Authorization: Bearer admin-secret"

# Get all drivers
curl -X GET "http://localhost:3000/api/v1/users?role=driver&status=active" \
  -H "Authorization: Bearer admin-secret"

# Get inactive users
curl -X GET "http://localhost:3000/api/v1/users?status=inactive" \
  -H "Authorization: Bearer admin-secret"
```

**User Management:**
```bash
# Get specific user details
curl -X GET http://localhost:3000/api/v1/users/user-uuid \
  -H "Authorization: Bearer admin-secret"

# Update user status (admin operation)
curl -X PUT http://localhost:3000/api/v1/users/user-uuid \
  -H "Authorization: Bearer admin-secret" \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended", "role": "customer"}'

# Get user booking history
curl -X GET "http://localhost:3000/api/v1/users/user-uuid/bookings?page=1&limit=20" \
  -H "Authorization: Bearer admin-secret"
```

#### Node.js Backend Integration

**Server-to-Server API Client:**
```javascript
class RVCabsAdminAPI {
  constructor(baseURL, adminSecret) {
    this.baseURL = baseURL;
    this.adminSecret = adminSecret;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.adminSecret}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User management
  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.makeRequest(`/api/v1/users?${params}`);
  }

  async getUser(userId) {
    return this.makeRequest(`/api/v1/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.makeRequest(`/api/v1/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserBookings(userId, filters = {}) {
    const params = new URLSearchParams(filters);
    return this.makeRequest(`/api/v1/users/${userId}/bookings?${params}`);
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

// Usage
const adminAPI = new RVCabsAdminAPI(
  'http://localhost:3000',
  process.env.SUPABASE_SECRET
);

// Get all active customers
const customers = await adminAPI.getUsers({ 
  role: 'customer', 
  status: 'active',
  page: 1,
  limit: 100 
});

// Get user details
const user = await adminAPI.getUser('user-uuid');

// Update user
const updatedUser = await adminAPI.updateUser('user-uuid', {
  name: 'Updated Name',
  status: 'active'
});
```

#### Python Backend Integration

**Python API Client:**
```python
import requests
import json

class RVCabsAdminAPI:
    def __init__(self, base_url, admin_secret):
        self.base_url = base_url
        self.admin_secret = admin_secret
        self.headers = {
            'Authorization': f'Bearer {admin_secret}',
            'Content-Type': 'application/json'
        }

    def make_request(self, endpoint, method='GET', data=None):
        url = f"{self.base_url}{endpoint}"
        
        response = requests.request(
            method=method,
            url=url,
            headers=self.headers,
            json=data if data else None
        )
        
        response.raise_for_status()
        return response.json()

    def get_users(self, **filters):
        params = '&'.join([f"{k}={v}" for k, v in filters.items()])
        endpoint = f"/api/v1/users?{params}" if params else "/api/v1/users"
        return self.make_request(endpoint)

    def get_user(self, user_id):
        return self.make_request(f"/api/v1/users/{user_id}")

    def update_user(self, user_id, user_data):
        return self.make_request(
            f"/api/v1/users/{user_id}", 
            method='PUT', 
            data=user_data
        )

    def get_user_bookings(self, user_id, **filters):
        params = '&'.join([f"{k}={v}" for k, v in filters.items()])
        endpoint = f"/api/v1/users/{user_id}/bookings"
        if params:
            endpoint += f"?{params}"
        return self.make_request(endpoint)

# Usage
admin_api = RVCabsAdminAPI(
    'http://localhost:3000',
    'your-supabase-secret'
)

# Get all customers
customers = admin_api.get_users(role='customer', status='active')

# Get user details
user = admin_api.get_user('user-uuid')

# Update user
updated_user = admin_api.update_user('user-uuid', {
    'name': 'Updated Name',
    'status': 'active'
})
```

### Postman Collection

For a complete Postman collection, import the following endpoints with proper headers and sample data:

1. **Environment Variables:**
   - `base_url`: `http://localhost:3000`
   - `admin_secret`: Your Supabase secret key
   - `access_token`: JWT token from auth

2. **Pre-request Scripts for Authentication:**
```javascript
// For admin endpoints
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('admin_secret')
});

// For user endpoints
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('access_token')
});
```

3. **Test Scripts:**
```javascript
// Save tokens from auth response
if (pm.response.json().success && pm.response.json().data.tokens) {
    pm.environment.set('access_token', pm.response.json().data.tokens.accessToken);
    pm.environment.set('refresh_token', pm.response.json().data.tokens.refreshToken);
}
```
