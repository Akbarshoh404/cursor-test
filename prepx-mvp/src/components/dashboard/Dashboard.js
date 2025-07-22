import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navigation from '../layout/Navigation';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const canTakeTest = () => {
    return currentUser.testsThisWeek < 1;
  };

  const getWeeklyProgress = () => {
    const percentage = Math.min((currentUser.testsThisWeek / 1) * 100, 100);
    return percentage;
  };

  return (
    <div className="dashboard">
      <Navigation />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {currentUser.name}!</h1>
          <p>Continue your IELTS preparation journey</p>
        </div>

        <div className="dashboard-grid">
          {/* Progress Overview */}
          <div className="dashboard-card progress-card">
            <h3>📊 Weekly Progress</h3>
            <div className="progress-info">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getWeeklyProgress()}%` }}
                ></div>
              </div>
              <p>{currentUser.testsThisWeek}/1 free tests this week</p>
              {canTakeTest() ? (
                <span className="status available">✅ Test Available</span>
              ) : (
                <span className="status used">⏳ Weekly test used</span>
              )}
            </div>
          </div>

          {/* Mock Test Access */}
          <div className="dashboard-card test-card">
            <h3>🎯 Mock Test</h3>
            <p>Full IELTS practice test (Listening, Reading, Writing)</p>
            <div className="test-info">
              <span className="duration">⏱️ 3 hours</span>
              <span className="sections">📝 3 sections</span>
            </div>
            {canTakeTest() ? (
              <Link to="/test" className="btn primary">
                Start Mock Test
              </Link>
            ) : (
              <button className="btn disabled" disabled>
                Weekly Test Used
              </button>
            )}
            <p className="reset-info">
              Resets every Monday
            </p>
          </div>

          {/* Writing Practice */}
          <div className="dashboard-card writing-card">
            <h3>✍️ Writing Practice</h3>
            <p>Practice Task 1 & Task 2 with sample answers</p>
            <div className="writing-stats">
              <span>📝 {currentUser.writingHistory?.length ?? 0} essays completed</span>
            </div>
            <Link to="/writing" className="btn secondary">
              Practice Writing
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card activity-card">
            <h3>📈 Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-label">Last Test:</span>
                <span className="activity-value">{formatDate(currentUser.lastTestDate)}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Member Since:</span>
                <span className="activity-value">{formatDate(currentUser.joinDate)}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Essays Written:</span>
                <span className="activity-value">{currentUser.writingHistory?.length ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Learning Resources */}
          <div className="dashboard-card resources-card">
            <h3>📚 Learning Resources</h3>
            <p>Tips, strategies, and sample answers</p>
            <Link to="/resources" className="btn secondary">
              Browse Resources
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card stats-card">
            <h3>📊 Your Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{currentUser.testsThisWeek}</span>
                <span className="stat-label">Tests This Week</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{currentUser.writingHistory?.length ?? 0}</span>
                <span className="stat-label">Essays Written</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {currentUser.writingHistory?.length > 0 
                    ? currentUser.writingHistory[currentUser.writingHistory.length - 1]?.estimatedBand ?? '—'
                    : '—'}
                </span>
                <span className="stat-label">Latest Writing Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/writing/task1" className="action-btn">
              <span className="action-icon">📊</span>
              <span>Task 1 Practice</span>
            </Link>
            <Link to="/writing/task2" className="action-btn">
              <span className="action-icon">💭</span>
              <span>Task 2 Practice</span>
            </Link>
            <Link to="/resources" className="action-btn">
              <span className="action-icon">📖</span>
              <span>Study Tips</span>
            </Link>
            <Link to="/resources" className="action-btn">
              <span className="action-icon">🎯</span>
              <span>Sample Answers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;