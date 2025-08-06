/**
 * Example usage of the Unified API v1
 * This demonstrates how both frontend users and backend admin can use the same endpoints
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Example JWT token (would come from authentication)
const USER_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Admin secret from environment variables
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your_admin_secret_here';

/**
 * Frontend User Example - Access own data only
 */
async function frontendUserExample() {
  console.log('=== Frontend User Example ===');
  
  try {
    // 1. Send OTP (public endpoint)
    const otpResponse = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobile: '+1234567890'
      })
    });
    const otpData = await otpResponse.json();
    console.log('1. OTP Sent:', otpData);

    // 2. Verify OTP (public endpoint)
    const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobile: '+1234567890',
        otp: '123456',
        sessionId: otpData.data?.sessionId
      })
    });
    const verifyData = await verifyResponse.json();
    console.log('2. OTP Verified:', verifyData);

    const userToken = verifyData.data?.token;
    const userId = verifyData.data?.user?.id;

    // 3. Get own profile (authenticated endpoint)
    const profileResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    const profileData = await profileResponse.json();
    console.log('3. User Profile:', profileData);

    // 4. Update own profile (authenticated endpoint)
    const updateResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Updated Name',
        email: 'updated@example.com'
      })
    });
    const updateData = await updateResponse.json();
    console.log('4. Profile Updated:', updateData);

    // 5. Get own bookings (authenticated endpoint)
    const bookingsResponse = await fetch(`${API_BASE_URL}/users/${userId}/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    const bookingsData = await bookingsResponse.json();
    console.log('5. User Bookings:', bookingsData);

  } catch (error) {
    console.error('Frontend User Example Error:', error);
  }
}

/**
 * Backend Admin Example - Access any user's data
 */
async function backendAdminExample() {
  console.log('\n=== Backend Admin Example ===');
  
  try {
    const targetUserId = 'some-user-id-here';

    // 1. Get any user's profile (admin endpoint)
    const profileResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_SECRET}`,
        'Content-Type': 'application/json'
      }
    });
    const profileData = await profileResponse.json();
    console.log('1. Admin - User Profile:', profileData);

    // 2. Update any user's profile (admin endpoint)
    const updateResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ADMIN_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'verified',
        admin_notes: 'Account verified by admin'
      })
    });
    const updateData = await updateResponse.json();
    console.log('2. Admin - Profile Updated:', updateData);

    // 3. Get any user's bookings (admin endpoint)
    const bookingsResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_SECRET}`,
        'Content-Type': 'application/json'
      }
    });
    const bookingsData = await bookingsResponse.json();
    console.log('3. Admin - User Bookings:', bookingsData);

  } catch (error) {
    console.error('Backend Admin Example Error:', error);
  }
}

/**
 * Comparison Example - Same endpoint, different access levels
 */
async function comparisonExample() {
  console.log('\n=== Comparison Example ===');
  console.log('Same endpoint "/api/v1/users/:id" with different authorization:');
  
  const userId = 'user-123';
  
  // Frontend user trying to access their own data
  console.log('Frontend User Request:');
  console.log(`GET ${API_BASE_URL}/users/${userId}`);
  console.log('Authorization: Bearer <JWT_TOKEN>');
  console.log('Result: ✅ Success (can access own data via RLS)');
  
  // Frontend user trying to access another user's data
  console.log('\nFrontend User Request (different user):');
  console.log(`GET ${API_BASE_URL}/users/other-user-456`);
  console.log('Authorization: Bearer <JWT_TOKEN>');
  console.log('Result: ❌ 403 Forbidden (cannot access other user\'s data)');
  
  // Admin accessing any user's data
  console.log('\nAdmin Request:');
  console.log(`GET ${API_BASE_URL}/users/${userId}`);
  console.log('Authorization: Bearer <ADMIN_SECRET>');
  console.log('Result: ✅ Success (admin can access any data via service role)');
}

/**
 * Run examples
 */
async function runExamples() {
  console.log('Unified API v1 Examples\n');
  console.log('Base URL:', API_BASE_URL);
  console.log('Admin Secret:', ADMIN_SECRET ? '[SET]' : '[NOT SET]');
  
  // Note: These examples show the API structure but won't actually run
  // without a real server and valid tokens
  
  await comparisonExample();
  
  console.log('\n=== API Documentation ===');
  console.log('For full API documentation, visit: GET /api');
  console.log('For health check, visit: GET /health');
}

// Export for use in other scripts
module.exports = {
  frontendUserExample,
  backendAdminExample,
  comparisonExample,
  runExamples
};

// Run if called directly
if (require.main === module) {
  runExamples();
}
