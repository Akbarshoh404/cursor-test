import React from 'react';
import { useAuth } from '../../context/AuthContext';

const WritingHistory = () => {
  const { currentUser } = useAuth();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getBandColor = (band) => {
    if (band >= 7.5) return '#38a169';
    if (band >= 6.5) return '#d69e2e';
    if (band >= 5.5) return '#e53e3e';
    return '#718096';
  };

  if (!currentUser.writingHistory || currentUser.writingHistory.length === 0) {
    return (
      <div className="writing-history empty">
        <div className="empty-state">
          <h3>📝 No Essays Yet</h3>
          <p>Start practicing to see your writing history here.</p>
          <div className="empty-actions">
            <button className="btn primary">Practice Task 1</button>
            <button className="btn secondary">Practice Task 2</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="writing-history">
      <div className="history-header">
        <h3>📝 Your Writing History</h3>
        <p>Track your progress and review past submissions</p>
      </div>

      <div className="history-stats">
        <div className="stat-card">
                        <span className="stat-number">{currentUser.writingHistory?.length ?? 0}</span>
          <span className="stat-label">Total Essays</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {currentUser.writingHistory.filter(h => h.taskType === 'Task 1').length}
          </span>
          <span className="stat-label">Task 1 Essays</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {currentUser.writingHistory.filter(h => h.taskType === 'Task 2').length}
          </span>
          <span className="stat-label">Task 2 Essays</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {currentUser.writingHistory?.length > 0
              ? (currentUser.writingHistory.reduce((sum, h) => sum + h.estimatedBand, 0) / currentUser.writingHistory.length).toFixed(1)
              : '—'
            }
          </span>
          <span className="stat-label">Average Band</span>
        </div>
      </div>

      <div className="essays-list">
        {currentUser.writingHistory.map((essay) => (
          <div key={essay.id} className="essay-card">
            <div className="essay-header">
              <div className="essay-meta">
                <span className={`task-type ${essay.taskType.toLowerCase().replace(' ', '')}`}>
                  {essay.taskType}
                </span>
                <span className="essay-date">{formatDate(essay.completedAt)}</span>
              </div>
              <div className="essay-score">
                <span 
                  className="band-score"
                  style={{ color: getBandColor(essay.estimatedBand) }}
                >
                  Band {essay.estimatedBand}
                </span>
                <span className="word-count">{essay.wordCount} words</span>
              </div>
            </div>
            
            <div className="essay-prompt">
              <strong>Prompt:</strong> {essay.prompt.substring(0, 150)}...
            </div>
            
            <div className="essay-preview">
              <strong>Your Answer:</strong>
              <p>{essay.answer.substring(0, 200)}...</p>
            </div>
            
            <div className="essay-actions">
              <button className="btn small secondary">View Full Essay</button>
              <button className="btn small">Practice Similar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WritingHistory;