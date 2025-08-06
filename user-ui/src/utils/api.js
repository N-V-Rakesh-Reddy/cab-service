// API utility for backend communication
const API_BASE_URL = 'http://localhost:3000/api/v1';

class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.status = status;
    this.response = response;
    this.name = 'ApiError';
  }
}

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || data.error || 'Request failed',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        'Network error. Please check your connection.',
        0,
        null
      );
    }
  }

  static async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  static async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  static async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  static async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // Auth specific methods
  static async sendOtp(phoneNumber) {
    const response = await this.post('/auth/send-otp', {
      mobile: phoneNumber
    });
    return response.data;
  }

  static async verifyOtp(phoneNumber, otp, sessionId) {
    const response = await this.post('/auth/verify-otp', {
      mobile: phoneNumber,
      otp: otp,
      sessionId: sessionId
    });
    return response.data;
  }

  static async refreshToken(userId) {
    const response = await this.post('/auth/refresh-token', {
      userId: userId
    });
    return response.data;
  }

  // User methods
  static async getUserProfile() {
    const response = await this.get('/users/profile');
    return response.data;
  }

  static async updateUserProfile(userData) {
    const response = await this.put('/users/profile', userData);
    return response.data;
  }

  static async getUserBookings() {
    const response = await this.get('/users/bookings');
    return response.data;
  }
}

export default ApiService;
export { ApiError };
