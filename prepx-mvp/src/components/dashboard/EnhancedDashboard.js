import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navigation from '../layout/Navigation';
import apiService from '../../services/api';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentTests: [],
    writingHistory: [],
    achievements: [],
    streakDays: 0,
    totalXP: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('ielts');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user stats, test history, writing stats, etc.
      const [profileRes, writingStatsRes, testHistoryRes] = await Promise.all([
        apiService.getProfile(),
        apiService.getWritingStats(),
        apiService.getTestHistory(1, 5)
      ]);

      if (profileRes.success) {
        setDashboardData(prev => ({
          ...prev,
          stats: profileRes.data.stats || {},
          streakDays: Math.floor(Math.random() * 30) + 1, // Mock streak
          totalXP: Math.floor(Math.random() * 5000) + 1000, // Mock XP
          level: Math.floor(Math.random() * 10) + 1 // Mock level
        }));
      }

      if (writingStatsRes.success) {
        setDashboardData(prev => ({
          ...prev,
          writingHistory: writingStatsRes.data.recentSubmissions || []
        }));
      }

      if (testHistoryRes.success) {
        setDashboardData(prev => ({
          ...prev,
          recentTests: testHistoryRes.data.history || []
        }));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const canTakeTest = () => {
    return currentUser?.testsThisWeek < 1;
  };

  const getWeeklyProgress = () => {
    const percentage = Math.min((currentUser?.testsThisWeek / 1) * 100, 100);
    return percentage;
  };

  const getBandColor = (band) => {
    if (band >= 8.5) return 'var(--success-600)';
    if (band >= 7.0) return 'var(--primary-600)';
    if (band >= 6.0) return 'var(--warning-600)';
    return 'var(--error-600)';
  };

  const examTypes = [
    { id: 'ielts', name: 'IELTS', icon: '🎓' },
    { id: 'toefl', name: 'TOEFL', icon: '📚' },
    { id: 'cefr', name: 'CEFR', icon: '🌍' },
    { id: 'sat', name: 'SAT', icon: '📝' }
  ];

  if (loading) {
    return (
      <div className="enhanced-dashboard loading">
        <Navigation />
        <div className="dashboard-content">
          <div className="loading-skeleton">
            <div className="skeleton skeleton-header"></div>
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton skeleton-card"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard">
      <Navigation />
      
      <div className="dashboard-content animate-fade-in">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="user-welcome">
            <div className="welcome-text">
              <h1>Welcome back, {currentUser?.name}! 👋</h1>
              <p>Continue your journey to IELTS success</p>
            </div>
            <div className="user-level">
              <div className="level-badge">
                <span className="level-number">Level {dashboardData.level}</span>
                <div className="xp-bar">
                  <div 
                    className="xp-progress" 
                    style={{ width: `${(dashboardData.totalXP % 1000) / 10}%` }}
                  ></div>
                </div>
                <span className="xp-text">{dashboardData.totalXP} XP</span>
              </div>
            </div>
          </div>

          {/* Exam Type Selector */}
          <div className="exam-selector">
            <label>Exam Type:</label>
            <div className="exam-tabs">
              {examTypes.map(exam => (
                <button
                  key={exam.id}
                  className={`exam-tab ${selectedExam === exam.id ? 'active' : ''}`}
                  onClick={() => setSelectedExam(exam.id)}
                >
                  <span className="exam-icon">{exam.icon}</span>
                  {exam.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="quick-stats animate-slide-in">
          <div className="stat-card streak">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <span className="stat-number">{dashboardData.streakDays}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
          
          <div className="stat-card tests">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-number">{dashboardData.stats.completedTests || 0}</span>
              <span className="stat-label">Tests Completed</span>
            </div>
          </div>
          
          <div className="stat-card writing">
            <div className="stat-icon">✍️</div>
            <div className="stat-content">
              <span className="stat-number">{dashboardData.stats.writingSubmissions || 0}</span>
              <span className="stat-label">Essays Written</span>
            </div>
          </div>
          
          <div className="stat-card band">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span 
                className="stat-number"
                style={{ color: getBandColor(dashboardData.stats.lastWritingBand || 0) }}
              >
                {dashboardData.stats.lastWritingBand || '—'}
              </span>
              <span className="stat-label">Latest Band</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Progress Overview */}
          <div className="dashboard-card progress-overview animate-scale-in">
            <div className="card-header">
              <h3>📈 Weekly Progress</h3>
              <span className="badge badge-primary">Free Plan</span>
            </div>
            <div className="card-body">
              <div className="progress-circle">
                <svg viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--gray-200)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--primary-600)"
                    strokeWidth="6"
                    strokeDasharray={`${getWeeklyProgress() * 2.83} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-number">{currentUser?.testsThisWeek || 0}/1</span>
                  <span className="progress-label">Free Tests</span>
                </div>
              </div>
              
              <div className="progress-info">
                {canTakeTest() ? (
                  <div className="status available">
                    <span className="status-icon">✅</span>
                    <span>Test Available</span>
                  </div>
                ) : (
                  <div className="status used">
                    <span className="status-icon">⏳</span>
                    <span>Weekly test used</span>
                  </div>
                )}
                <p className="reset-info">Resets every Monday</p>
              </div>
            </div>
          </div>

          {/* Mock Test Access */}
          <div className="dashboard-card mock-test animate-scale-in">
            <div className="card-header">
              <h3>🎯 Mock Tests</h3>
              <span className="test-count">12 Available</span>
            </div>
            <div className="card-body">
              <div className="test-types">
                <div className="test-type">
                  <span className="test-icon">🎧</span>
                  <span>Listening</span>
                </div>
                <div className="test-type">
                  <span className="test-icon">📖</span>
                  <span>Reading</span>
                </div>
                <div className="test-type">
                  <span className="test-icon">✍️</span>
                  <span>Writing</span>
                </div>
                <div className="test-type">
                  <span className="test-icon">🗣️</span>
                  <span>Speaking</span>
                </div>
              </div>
              
              <div className="test-info">
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <span>3 hours</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📊</span>
                  <span>Auto-grading</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📄</span>
                  <span>PDF Results</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {canTakeTest() ? (
                <Link to="/test" className="btn btn-primary btn-lg">
                  <span>🚀</span>
                  Start Mock Test
                </Link>
              ) : (
                <button className="btn btn-secondary btn-lg" disabled>
                  <span>⏳</span>
                  Weekly Test Used
                </button>
              )}
            </div>
          </div>

          {/* Writing Practice */}
          <div className="dashboard-card writing-practice animate-scale-in">
            <div className="card-header">
              <h3>✍️ Writing Practice</h3>
              <span className="badge badge-success">New Prompts</span>
            </div>
            <div className="card-body">
              <div className="writing-stats">
                <div className="writing-stat">
                  <span className="stat-value">{dashboardData.stats.writingSubmissions || 0}</span>
                  <span className="stat-name">Essays</span>
                </div>
                <div className="writing-stat">
                  <span className="stat-value">{dashboardData.stats.lastWritingBand || '—'}</span>
                  <span className="stat-name">Latest Band</span>
                </div>
              </div>
              
              <div className="writing-features">
                <div className="feature">
                  <span className="feature-icon">📝</span>
                  <span>Task 1 & 2 Practice</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🤖</span>
                  <span>AI Feedback</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span>Band Estimation</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">👨‍🏫</span>
                  <span>Human Review</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Link to="/writing" className="btn btn-secondary">
                Practice Writing
              </Link>
            </div>
          </div>

          {/* Speaking Practice */}
          <div className="dashboard-card speaking-practice animate-scale-in">
            <div className="card-header">
              <h3>🗣️ Speaking Practice</h3>
              <span className="badge badge-warning">Beta</span>
            </div>
            <div className="card-body">
              <div className="speaking-features">
                <div className="feature">
                  <span className="feature-icon">🎙️</span>
                  <span>Record & Replay</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🤖</span>
                  <span>AI Evaluation</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">👥</span>
                  <span>Speaking Room</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📈</span>
                  <span>Fluency Tracker</span>
                </div>
              </div>
              
              <div className="speaking-stats">
                <div className="stat">
                  <span className="stat-label">Sessions</span>
                  <span className="stat-value">0</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Avg Score</span>
                  <span className="stat-value">—</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Link to="/speaking" className="btn btn-warning">
                Start Speaking
              </Link>
            </div>
          </div>

          {/* Study Resources */}
          <div className="dashboard-card study-resources animate-scale-in">
            <div className="card-header">
              <h3>📚 Study Resources</h3>
              <span className="resource-count">500+ Resources</span>
            </div>
            <div className="card-body">
              <div className="resource-categories">
                <div className="resource-category">
                  <span className="category-icon">💡</span>
                  <div className="category-info">
                    <span className="category-name">Tips & Strategies</span>
                    <span className="category-count">50+ guides</span>
                  </div>
                </div>
                <div className="resource-category">
                  <span className="category-icon">📖</span>
                  <div className="category-info">
                    <span className="category-name">Vocabulary</span>
                    <span className="category-count">2000+ words</span>
                  </div>
                </div>
                <div className="resource-category">
                  <span className="category-icon">🎬</span>
                  <div className="category-info">
                    <span className="category-name">Video Lessons</span>
                    <span className="category-count">100+ videos</span>
                  </div>
                </div>
                <div className="resource-category">
                  <span className="category-icon">📋</span>
                  <div className="category-info">
                    <span className="category-name">Study Plans</span>
                    <span className="category-count">3 plans</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Link to="/resources" className="btn btn-secondary">
                Browse Resources
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card recent-activity animate-scale-in">
            <div className="card-header">
              <h3>📋 Recent Activity</h3>
              <button className="btn btn-sm btn-secondary">View All</button>
            </div>
            <div className="card-body">
              <div className="activity-timeline">
                {dashboardData.recentTests.slice(0, 3).map((test, index) => (
                  <div key={test.id} className="activity-item">
                    <div className="activity-icon">📊</div>
                    <div className="activity-content">
                      <div className="activity-title">Completed {test.testTitle}</div>
                      <div className="activity-meta">
                        <span>Band {test.scores?.overall || '—'}</span>
                        <span className="activity-time">{formatDate(test.completedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {dashboardData.writingHistory.slice(0, 2).map((writing, index) => (
                  <div key={`writing-${index}`} className="activity-item">
                    <div className="activity-icon">✍️</div>
                    <div className="activity-content">
                      <div className="activity-title">Submitted {writing.taskType.toUpperCase()} Essay</div>
                      <div className="activity-meta">
                        <span>Band {writing.estimatedBand}</span>
                        <span className="activity-time">{formatDate(writing.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!dashboardData.recentTests.length && !dashboardData.writingHistory.length) && (
                  <div className="no-activity">
                    <div className="no-activity-icon">📝</div>
                    <p>No recent activity</p>
                    <p className="no-activity-subtitle">Start practicing to see your progress here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="dashboard-card achievements animate-scale-in">
            <div className="card-header">
              <h3>🏆 Achievements</h3>
              <span className="achievement-count">3/20</span>
            </div>
            <div className="card-body">
              <div className="achievement-grid">
                <div className="achievement earned">
                  <div className="achievement-icon">🎯</div>
                  <div className="achievement-info">
                    <span className="achievement-name">First Test</span>
                    <span className="achievement-desc">Complete your first mock test</span>
                  </div>
                </div>
                <div className="achievement earned">
                  <div className="achievement-icon">✍️</div>
                  <div className="achievement-info">
                    <span className="achievement-name">Essay Writer</span>
                    <span className="achievement-desc">Submit 5 writing practices</span>
                  </div>
                </div>
                <div className="achievement earned">
                  <div className="achievement-icon">🔥</div>
                  <div className="achievement-info">
                    <span className="achievement-name">Streak Master</span>
                    <span className="achievement-desc">Maintain a 7-day streak</span>
                  </div>
                </div>
                <div className="achievement locked">
                  <div className="achievement-icon">🌟</div>
                  <div className="achievement-info">
                    <span className="achievement-name">Band 8 Hero</span>
                    <span className="achievement-desc">Achieve Band 8+ in any section</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions animate-fade-in">
          <h3>⚡ Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/writing/task1" className="action-btn">
              <span className="action-icon">📊</span>
              <div className="action-content">
                <span className="action-title">Task 1 Practice</span>
                <span className="action-subtitle">Chart & Graph descriptions</span>
              </div>
            </Link>
            <Link to="/writing/task2" className="action-btn">
              <span className="action-icon">💭</span>
              <div className="action-content">
                <span className="action-title">Task 2 Practice</span>
                <span className="action-subtitle">Essay writing practice</span>
              </div>
            </Link>
            <Link to="/speaking" className="action-btn">
              <span className="action-icon">🎙️</span>
              <div className="action-content">
                <span className="action-title">Speaking Practice</span>
                <span className="action-subtitle">Record and get feedback</span>
              </div>
            </Link>
            <Link to="/vocabulary" className="action-btn">
              <span className="action-icon">📖</span>
              <div className="action-content">
                <span className="action-title">Vocabulary</span>
                <span className="action-subtitle">Learn new words</span>
              </div>
            </Link>
            <Link to="/resources" className="action-btn">
              <span className="action-icon">💡</span>
              <div className="action-content">
                <span className="action-title">Study Tips</span>
                <span className="action-subtitle">Expert strategies</span>
              </div>
            </Link>
            <Link to="/premium" className="action-btn premium">
              <span className="action-icon">⭐</span>
              <div className="action-content">
                <span className="action-title">Go Premium</span>
                <span className="action-subtitle">Unlock all features</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;