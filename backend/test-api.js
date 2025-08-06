const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health:', health.data);
    console.log('');

    // Test 2: Send OTP
    console.log('2️⃣ Testing send OTP...');
    const otpResponse = await axios.post(`${API_BASE}/auth/send-otp`, {
      mobile: '+919876543210' // Using one of our dummy users
    });
    console.log('✅ OTP sent:', otpResponse.data);
    console.log('');

    // Test 3: Test booking API (should require auth)
    console.log('3️⃣ Testing bookings endpoint (should fail without auth)...');
    try {
      const bookings = await axios.get(`${API_BASE}/bookings`);
      console.log('❌ Unexpected success:', bookings.data);
    } catch (err) {
      console.log('✅ Expected auth error:', err.response?.status, err.response?.data?.error);
    }
    console.log('');

    // Test 4: Fare estimate (public endpoint)
    console.log('4️⃣ Testing fare estimate (public endpoint)...');
    const fareParams = new URLSearchParams({
      booking_type: 'one_way',
      vehicle_type: 'sedan',
      pickup_location: 'Delhi',
      drop_location: 'Gurgaon'
    });
    const fare = await axios.get(`${API_BASE}/bookings/fare-estimate?${fareParams}`);
    console.log('✅ Fare estimate:', fare.data);
    console.log('');

    // Test 5: Test logout endpoint (should fail without auth)
    console.log('5️⃣ Testing logout endpoint (should fail without auth)...');
    try {
      const logout = await axios.post(`${API_BASE}/auth/logout`);
      console.log('❌ Unexpected success:', logout.data);
    } catch (err) {
      console.log('✅ Expected auth error for logout:', err.response?.status, err.response?.data?.error);
    }
    console.log('');

    console.log('🎉 API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.data);
    }
  }
}

testAPI();