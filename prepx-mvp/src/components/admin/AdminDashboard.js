import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../layout/Navigation';
import apiService from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilters, setUserFilters] = useState({
    search: '',
    role: '',
    page: 1
  });
  const [testFilters, setTestFilters] = useState({
    search: '',
    type: '',
    isPremium: '',
    isOfficial: '',
    page: 1
  });

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminGetDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiService.adminGetUsers(userFilters);
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadTests = async () => {
    try {
      const response = await apiService.adminGetTests(testFilters);
      if (response.success) {
        setTests(response.data.tests);
      }
    } catch (error) {
      console.error('Failed to load tests:', error);
    }
  };

  const handleUserStatusToggle = async (userId, isActive) => {
    try {
      await apiService.adminUpdateUserStatus(userId, { isActive });
      loadUsers(); // Refresh users list
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleTestPremiumToggle = async (testId, isPremium) => {
    try {
      await apiService.adminToggleTestPremium(testId, { isPremium });
      loadTests(); // Refresh tests list
    } catch (error) {
      console.error('Failed to update test premium status:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'tests') {
      loadTests();
    }
  }, [activeTab, userFilters, testFilters]);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <Navigation />
        <div className="access-denied-content">
          <h1>🚫 Access Denied</h1>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    if (loading || !dashboardStats) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    return (
      <div className="dashboard-content animate-fade-in">
        <div className="dashboard-header">
          <h2>📊 Admin Dashboard</h2>
          <p>Welcome back, {currentUser.name}! Here's your platform overview.</p>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card users">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>{dashboardStats.users.total}</h3>
              <p>Total Users</p>
              <span className="metric-change">+{dashboardStats.users.newThisMonth} this month</span>
            </div>
          </div>
          
          <div className="metric-card tests">
            <div className="metric-icon">📚</div>
            <div className="metric-content">
              <h3>{dashboardStats.tests.total}</h3>
              <p>Total Tests</p>
              <span className="metric-detail">{dashboardStats.tests.cambridge} Cambridge</span>
            </div>
          </div>
          
          <div className="metric-card attempts">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h3>{dashboardStats.tests.attempts}</h3>
              <p>Test Attempts</p>
              <span className="metric-change">+{dashboardStats.tests.attemptsThisMonth} this month</span>
            </div>
          </div>
          
          <div className="metric-card writing">
            <div className="metric-icon">✍️</div>
            <div className="metric-content">
              <h3>{dashboardStats.writing.totalSubmissions}</h3>
              <p>Writing Submissions</p>
              <span className="metric-change">+{dashboardStats.writing.submissionsThisMonth} this month</span>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="performance-section">
          <h3>🎯 Average Performance</h3>
          <div className="performance-grid">
            <div className="performance-item">
              <span className="skill-name">Listening</span>
              <div className="score-bar">
                <div 
                  className="score-fill listening" 
                  style={{ width: `${(dashboardStats.performance.averageScores.listening / 9) * 100}%` }}
                ></div>
              </div>
              <span className="score-value">{dashboardStats.performance.averageScores.listening}</span>
            </div>
            
            <div className="performance-item">
              <span className="skill-name">Reading</span>
              <div className="score-bar">
                <div 
                  className="score-fill reading" 
                  style={{ width: `${(dashboardStats.performance.averageScores.reading / 9) * 100}%` }}
                ></div>
              </div>
              <span className="score-value">{dashboardStats.performance.averageScores.reading}</span>
            </div>
            
            <div className="performance-item">
              <span className="skill-name">Writing</span>
              <div className="score-bar">
                <div 
                  className="score-fill writing" 
                  style={{ width: `${(dashboardStats.performance.averageScores.writing / 9) * 100}%` }}
                ></div>
              </div>
              <span className="score-value">{dashboardStats.performance.averageScores.writing}</span>
            </div>
            
            <div className="performance-item">
              <span className="skill-name">Overall</span>
              <div className="score-bar">
                <div 
                  className="score-fill overall" 
                  style={{ width: `${(dashboardStats.performance.averageScores.overall / 9) * 100}%` }}
                ></div>
              </div>
              <span className="score-value">{dashboardStats.performance.averageScores.overall}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>📈 Recent Trends</h3>
          <div className="trends-grid">
            <div className="trend-card">
              <h4>User Registrations (Last 7 Days)</h4>
              <div className="trend-chart">
                {dashboardStats.users.registrationTrend.map((item, index) => (
                  <div key={index} className="trend-bar">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${Math.max(item.count * 20, 10)}px` }}
                    ></div>
                    <span className="bar-label">{new Date(item.date).getDate()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersContent = () => {
    return (
      <div className="users-content animate-fade-in">
        <div className="users-header">
          <h2>👥 User Management</h2>
          <div className="users-filters">
            <input
              type="text"
              placeholder="Search users..."
              value={userFilters.search}
              onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value, page: 1 })}
              className="search-input"
            />
            <select
              value={userFilters.role}
              onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value, page: 1 })}
              className="filter-select"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Subscription</th>
                <th>Tests This Week</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`subscription-badge ${user.subscription_type}`}>
                      {user.subscription_type}
                    </span>
                  </td>
                  <td>{user.tests_this_week}</td>
                  <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleUserStatusToggle(user.id, !user.is_active)}
                      className={`action-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTestsContent = () => {
    return (
      <div className="tests-content animate-fade-in">
        <div className="tests-header">
          <h2>📚 Test Management</h2>
          <div className="tests-filters">
            <input
              type="text"
              placeholder="Search tests..."
              value={testFilters.search}
              onChange={(e) => setTestFilters({ ...testFilters, search: e.target.value, page: 1 })}
              className="search-input"
            />
            <select
              value={testFilters.type}
              onChange={(e) => setTestFilters({ ...testFilters, type: e.target.value, page: 1 })}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="full">Full Test</option>
              <option value="reading_only">Reading Only</option>
              <option value="listening_only">Listening Only</option>
            </select>
            <select
              value={testFilters.isPremium}
              onChange={(e) => setTestFilters({ ...testFilters, isPremium: e.target.value, page: 1 })}
              className="filter-select"
            >
              <option value="">All Tests</option>
              <option value="true">Premium</option>
              <option value="false">Free</option>
            </select>
            <select
              value={testFilters.isOfficial}
              onChange={(e) => setTestFilters({ ...testFilters, isOfficial: e.target.value, page: 1 })}
              className="filter-select"
            >
              <option value="">All Sources</option>
              <option value="true">Cambridge Official</option>
              <option value="false">PrepX Created</option>
            </select>
          </div>
        </div>

        <div className="tests-table-container">
          <table className="tests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Premium</th>
                <th>Official</th>
                <th>Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id}>
                  <td>{test.id}</td>
                  <td className="test-title">{test.title}</td>
                  <td>
                    <span className={`type-badge ${test.type}`}>
                      {test.type}
                    </span>
                  </td>
                  <td>
                    <span className={`difficulty-badge ${test.difficulty}`}>
                      {test.difficulty}
                    </span>
                  </td>
                  <td>{test.duration} min</td>
                  <td>
                    <span className={`premium-badge ${test.is_premium ? 'premium' : 'free'}`}>
                      {test.is_premium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td>
                    <span className={`official-badge ${test.is_official ? 'official' : 'custom'}`}>
                      {test.is_official ? 'Cambridge' : 'PrepX'}
                    </span>
                  </td>
                  <td>{test.attempt_count}</td>
                  <td>
                    <button
                      onClick={() => handleTestPremiumToggle(test.id, !test.is_premium)}
                      className={`action-btn ${test.is_premium ? 'make-free' : 'make-premium'}`}
                    >
                      {test.is_premium ? 'Make Free' : 'Make Premium'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <Navigation />
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <div className="admin-user-info">
            <div className="admin-avatar">👨‍💼</div>
            <div className="admin-details">
              <h3>{currentUser.name}</h3>
              <p>Administrator</p>
            </div>
          </div>
          
          <nav className="admin-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              Users
            </button>
            <button
              className={`nav-item ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              <span className="nav-icon">📚</span>
              Tests
            </button>
            <button
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="nav-icon">📈</span>
              Analytics
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'users' && renderUsersContent()}
          {activeTab === 'tests' && renderTestsContent()}
          {activeTab === 'analytics' && (
            <div className="coming-soon">
              <h2>📈 Advanced Analytics</h2>
              <p>Detailed analytics and reporting features coming soon!</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="coming-soon">
              <h2>⚙️ System Settings</h2>
              <p>System configuration and settings coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;