/**
 * Test script for Unified API v1
 * This script tests both frontend user and admin access patterns
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  error?: string;
  data?: any;
}

class UnifiedApiTester {
  private results: TestResult[] = [];
  private adminSecret: string;
  private userToken: string = '';

  constructor() {
    this.adminSecret = process.env.ADMIN_SECRET || 'test_admin_secret';
  }

  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<TestResult> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const data = await response.json();
      
      const result: TestResult = {
        endpoint,
        method: options.method || 'GET',
        status: response.status,
        success: response.ok,
        data
      };

      if (!response.ok) {
        result.error = data.error || 'Request failed';
      }

      this.results.push(result);
      return result;

    } catch (error) {
      const result: TestResult = {
        endpoint,
        method: options.method || 'GET',
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      this.results.push(result);
      return result;
    }
  }

  async testPublicEndpoints() {
    console.log('\n🔓 Testing Public Endpoints');
    
    // Test API documentation
    await this.makeRequest('/api');
    
    // Test health check
    await this.makeRequest('/health');
  }

  async testAuthenticationFlow() {
    console.log('\n🔐 Testing Authentication Flow');
    
    // Test send OTP
    const otpResult = await this.makeRequest('/api/v1/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile: '+1234567890' })
    });

    if (otpResult.success) {
      // Test verify OTP (would fail without real OTP, but tests the endpoint)
      await this.makeRequest('/api/v1/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          mobile: '+1234567890',
          otp: '123456',
          sessionId: otpResult.data?.data?.sessionId
        })
      });
    }
  }

  async testUserEndpointsWithoutAuth() {
    console.log('\n❌ Testing User Endpoints Without Authentication');
    
    const testUserId = 'test-user-123';
    
    // Should fail without authentication
    await this.makeRequest(`/api/v1/users/${testUserId}`);
    await this.makeRequest(`/api/v1/users/${testUserId}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test User' })
    });
    await this.makeRequest(`/api/v1/users/${testUserId}/bookings`);
  }

  async testAdminEndpoints() {
    console.log('\n👑 Testing Admin Endpoints');
    
    const testUserId = 'test-user-123';
    const adminHeaders = {
      'Authorization': `Bearer ${this.adminSecret}`
    };

    // Test admin access to user data
    await this.makeRequest(`/api/v1/users/${testUserId}`, {
      headers: adminHeaders
    });

    await this.makeRequest(`/api/v1/users/${testUserId}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ 
        name: 'Updated by Admin',
        admin_notes: 'Test update from admin'
      })
    });

    await this.makeRequest(`/api/v1/users/${testUserId}/bookings`, {
      headers: adminHeaders
    });
  }

  async testInvalidAuthentication() {
    console.log('\n🚫 Testing Invalid Authentication');
    
    const testUserId = 'test-user-123';
    
    // Test with invalid JWT
    await this.makeRequest(`/api/v1/users/${testUserId}`, {
      headers: {
        'Authorization': 'Bearer invalid_jwt_token'
      }
    });

    // Test with invalid admin secret
    await this.makeRequest(`/api/v1/users/${testUserId}`, {
      headers: {
        'Authorization': 'Bearer invalid_admin_secret'
      }
    });
  }

  async testDatabaseEndpoints() {
    console.log('\n🗄️ Testing Database Test Endpoints');
    
    // Test connection
    await this.makeRequest('/test/test-connection');
    
    // Test CRUD operations
    const createResult = await this.makeRequest('/test/items', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Item',
        description: 'Created by unified API test',
        value: 100
      })
    });

    if (createResult.success && createResult.data?.data?.id) {
      const itemId = createResult.data.data.id;
      
      // Test read
      await this.makeRequest(`/test/items/${itemId}`);
      
      // Test update
      await this.makeRequest(`/test/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Test Item',
          value: 200
        })
      });
      
      // Test delete
      await this.makeRequest(`/test/items/${itemId}`, {
        method: 'DELETE'
      });
    }

    // Test list all
    await this.makeRequest('/test/items');
  }

  generateReport() {
    console.log('\n📊 Test Results Summary');
    console.log('='.repeat(80));
    
    let passed = 0;
    let failed = 0;
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const statusCode = result.status || 'ERR';
      
      console.log(`${status} ${result.method.padEnd(6)} ${result.endpoint.padEnd(40)} [${statusCode}]`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.success) {
        passed++;
      } else {
        failed++;
      }
    });
    
    console.log('='.repeat(80));
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n🔍 Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`   ${result.method} ${result.endpoint}: ${result.error}`);
        });
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Unified API v1 Tests');
    console.log(`Testing against: ${API_BASE_URL}`);
    console.log(`Admin Secret: ${this.adminSecret ? '[SET]' : '[NOT SET]'}`);
    
    try {
      await this.testPublicEndpoints();
      await this.testAuthenticationFlow();
      await this.testUserEndpointsWithoutAuth();
      await this.testAdminEndpoints();
      await this.testInvalidAuthentication();
      await this.testDatabaseEndpoints();
      
      this.generateReport();
      
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  }
}

// Export for use as module
export { UnifiedApiTester };

// Run if called directly
if (require.main === module) {
  const tester = new UnifiedApiTester();
  tester.runAllTests();
}
