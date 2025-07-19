import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../layout/Navigation';

const TestResults = ({ answers }) => {
  // Mock scoring calculation
  const calculateScores = () => {
    return {
      listening: 7.0,
      reading: 6.5,
      writing: 6.0,
      overall: 6.5
    };
  };

  const scores = calculateScores();

  const getBandColor = (band) => {
    if (band >= 7.5) return '#38a169';
    if (band >= 6.5) return '#d69e2e';
    if (band >= 5.5) return '#e53e3e';
    return '#718096';
  };

  return (
    <div className="test-results">
      <Navigation />
      
      <div className="results-content">
        <div className="results-header">
          <h1>🎉 Test Completed!</h1>
          <p>Here are your estimated IELTS band scores</p>
        </div>

        <div className="overall-score">
          <div className="score-circle">
            <span 
              className="score-value"
              style={{ color: getBandColor(scores.overall) }}
            >
              {scores.overall}
            </span>
            <span className="score-label">Overall Band</span>
          </div>
        </div>

        <div className="section-scores">
          <div className="score-card">
            <h3>🎧 Listening</h3>
            <span 
              className="section-score"
              style={{ color: getBandColor(scores.listening) }}
            >
              {scores.listening}
            </span>
            <p>{answers.listening.length} questions answered</p>
          </div>
          
          <div className="score-card">
            <h3>📖 Reading</h3>
            <span 
              className="section-score"
              style={{ color: getBandColor(scores.reading) }}
            >
              {scores.reading}
            </span>
            <p>{answers.reading.length} questions answered</p>
          </div>
          
          <div className="score-card">
            <h3>✍️ Writing</h3>
            <span 
              className="section-score"
              style={{ color: getBandColor(scores.writing) }}
            >
              {scores.writing}
            </span>
            <p>2 tasks completed</p>
          </div>
        </div>

        <div className="test-summary">
          <h3>Test Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Test Date:</span>
              <span className="summary-value">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Test Type:</span>
              <span className="summary-value">IELTS Academic Practice</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Completion:</span>
              <span className="summary-value">100%</span>
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <h3>💡 Feedback & Next Steps</h3>
          <div className="feedback-cards">
            <div className="feedback-card">
              <h4>Strengths</h4>
              <ul>
                <li>Good listening comprehension</li>
                <li>Completed all sections on time</li>
                <li>Met word count requirements</li>
              </ul>
            </div>
            <div className="feedback-card">
              <h4>Areas to Improve</h4>
              <ul>
                <li>Practice more writing tasks</li>
                <li>Focus on reading speed</li>
                <li>Review grammar basics</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/writing" className="btn primary">
            Practice Writing
          </Link>
          <Link to="/resources" className="btn secondary">
            Study Resources
          </Link>
          <Link to="/dashboard" className="btn secondary">
            Back to Dashboard
          </Link>
        </div>

        <div className="disclaimer">
          <p><strong>Disclaimer:</strong> These are estimated band scores based on basic automated analysis. Actual IELTS scores may vary and require human assessment, especially for writing and speaking sections.</p>
        </div>
      </div>
    </div>
  );
};

export default TestResults;