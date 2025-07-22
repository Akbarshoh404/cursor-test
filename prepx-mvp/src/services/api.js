const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Service class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(name, email, password) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  async updateProfile(name) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Test methods
  async getTests() {
    return await this.request('/tests');
  }

  async getTest(testId) {
    return await this.request(`/tests/${testId}`);
  }

  async startTest(testId) {
    return await this.request(`/tests/${testId}/start`, { method: 'POST' });
  }

  async submitTest(testId, attemptId, answers) {
    return await this.request(`/tests/${testId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ attemptId, answers }),
    });
  }

  async getTestResults(attemptId) {
    return await this.request(`/tests/results/${attemptId}`);
  }

  async getTestHistory(page = 1, limit = 10) {
    return await this.request(`/tests/history/all?page=${page}&limit=${limit}`);
  }

  // Writing methods
  async submitWriting(taskType, prompt, answer) {
    return await this.request('/writing/submit', {
      method: 'POST',
      body: JSON.stringify({ taskType, prompt, answer }),
    });
  }

  async getWritingHistory(page = 1, limit = 10, taskType = null) {
    let url = `/writing/history?page=${page}&limit=${limit}`;
    if (taskType) {
      url += `&taskType=${taskType}`;
    }
    return await this.request(url);
  }

  async getWritingSubmission(submissionId) {
    return await this.request(`/writing/submission/${submissionId}`);
  }

  async getWritingPrompts(taskType = null) {
    let url = '/writing/prompts';
    if (taskType) {
      url += `?taskType=${taskType}`;
    }
    return await this.request(url);
  }

  async getSampleAnswers(taskType = null, band = null) {
    let url = '/writing/samples';
    const params = [];
    if (taskType) params.push(`taskType=${taskType}`);
    if (band) params.push(`band=${band}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return await this.request(url);
  }

  async getWritingStats() {
    return await this.request('/writing/stats');
  }

  // Resources methods (these don't require authentication)
  async getResources(category = null, type = null) {
    let url = '/resources';
    const params = [];
    if (category) params.push(`category=${category}`);
    if (type) params.push(`type=${type}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return await this.request(url);
  }

  async getTips(category = null) {
    let url = '/resources/tips';
    if (category) {
      url += `?category=${category}`;
    }
    return await this.request(url);
  }

  async getCommonMistakes(category = null) {
    let url = '/resources/mistakes';
    if (category) {
      url += `?category=${category}`;
    }
    return await this.request(url);
  }

  async getVocabulary(category = null) {
    let url = '/resources/vocabulary';
    if (category) {
      url += `?category=${category}`;
    }
    return await this.request(url);
  }

  async getBandDescriptors(skill = null) {
    let url = '/resources/bands';
    if (skill) {
      url += `?skill=${skill}`;
    }
    return await this.request(url);
  }

  async getStudyPlans(duration = null) {
    let url = '/resources/study-plans';
    if (duration) {
      url += `?duration=${duration}`;
    }
    return await this.request(url);
  }

  // Admin API methods
  async adminGetDashboardStats() {
    return await this.request('/admin/dashboard/stats');
  }

  async adminGetUsers(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const url = params.toString() ? `/admin/users?${params.toString()}` : '/admin/users';
    return await this.request(url);
  }

  async adminGetUserDetails(userId) {
    return await this.request(`/admin/users/${userId}`);
  }

  async adminUpdateUserStatus(userId, data) {
    return await this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async adminGetTests(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const url = params.toString() ? `/admin/tests?${params.toString()}` : '/admin/tests';
    return await this.request(url);
  }

  async adminGetTestDetails(testId) {
    return await this.request(`/admin/tests/${testId}`);
  }

  async adminToggleTestPremium(testId, data) {
    return await this.request(`/admin/tests/${testId}/premium`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async adminGetSystemLogs() {
    return await this.request('/admin/logs');
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;