import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockTest } from '../../data/mockData';

const Task1Practice = () => {
  const { addWritingSubmission } = useAuth();
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedBand, setEstimatedBand] = useState(null);

  const task = mockTest.sections.writing.tasks[0]; // Task 1

  useEffect(() => {
    let timer;
    if (isTimerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getWordCountStatus = () => {
    const wordCount = countWords(answer);
    if (wordCount < 150) return 'under';
    if (wordCount > 200) return 'over';
    return 'good';
  };

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
  };

  const calculateEstimatedBand = () => {
    const wordCount = countWords(answer);
    let score = 5.0;

    // Word count factor
    if (wordCount >= 150 && wordCount <= 200) score += 0.5;
    else if (wordCount < 130) score -= 1.0;

    // Length and complexity (basic estimation)
    if (answer.length > 800) score += 0.5;
    if (answer.includes('The chart shows') || answer.includes('The graph illustrates')) score += 0.5;
    if (answer.includes('overall') || answer.includes('In conclusion')) score += 0.5;

    // Cap the score
    return Math.min(Math.max(score, 4.0), 8.0);
  };

  const handleSubmit = () => {
    const wordCount = countWords(answer);
    if (wordCount < 100) {
      alert('Please write at least 100 words before submitting.');
      return;
    }

    const band = calculateEstimatedBand();
    setEstimatedBand(band);

    const submission = {
      id: Date.now(),
      taskType: 'Task 1',
      prompt: task.prompt,
      answer,
      wordCount,
      completedAt: new Date().toISOString().split('T')[0],
      estimatedBand: band
    };

    addWritingSubmission(submission);
    setSubmitted(true);
    setIsTimerActive(false);
  };

  const resetPractice = () => {
    setAnswer('');
    setTimeRemaining(20 * 60);
    setIsTimerActive(false);
    setSubmitted(false);
    setEstimatedBand(null);
  };

  if (submitted) {
    return (
      <div className="task-practice submitted">
        <div className="submission-success">
          <h3>✅ Task 1 Submitted Successfully!</h3>
          <div className="submission-stats">
            <div className="stat-item">
              <span className="stat-label">Word Count:</span>
              <span className="stat-value">{countWords(answer)} words</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estimated Band:</span>
              <span className="stat-value band-score">{estimatedBand}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time Used:</span>
              <span className="stat-value">{formatTime(1200 - timeRemaining)}</span>
            </div>
          </div>

          <div className="submitted-answer">
            <h4>Your Answer:</h4>
            <div className="answer-text">{answer}</div>
          </div>

          <div className="feedback-section">
            <h4>Quick Feedback:</h4>
            <ul>
              {countWords(answer) >= 150 ? (
                <li className="positive">✅ Good word count ({countWords(answer)} words)</li>
              ) : (
                <li className="negative">❌ Under minimum word count (need 150+ words)</li>
              )}
              {answer.toLowerCase().includes('chart') || answer.toLowerCase().includes('graph') ? (
                <li className="positive">✅ Correctly identified the visual type</li>
              ) : (
                <li className="negative">❌ Should clearly identify what type of visual you're describing</li>
              )}
              {answer.toLowerCase().includes('overall') ? (
                <li className="positive">✅ Good use of overview language</li>
              ) : (
                <li className="neutral">💡 Consider adding an overview statement</li>
              )}
            </ul>
          </div>

          <div className="action-buttons">
            <button onClick={resetPractice} className="btn primary">
              Practice Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-practice task1">
      <div className="task-header">
        <div className="task-info">
          <h3>📊 IELTS Writing Task 1</h3>
          <div className="task-requirements">
            <span>⏱️ 20 minutes</span>
            <span>📝 150+ words</span>
            <span>🎯 33% of writing score</span>
          </div>
        </div>
        
        <div className="timer-section">
          <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="timer-controls">
            {!isTimerActive ? (
              <button onClick={startTimer} className="btn small">Start Timer</button>
            ) : (
              <button onClick={pauseTimer} className="btn small secondary">Pause</button>
            )}
          </div>
        </div>
      </div>

      <div className="task-prompt">
        <h4>Task:</h4>
        <p>{task.prompt}</p>
        
        <div className="chart-placeholder">
          <div className="placeholder-content">
            📊 [Chart/Graph would be displayed here]
            <p>Housing ownership trends in England and Wales (1918-2011)</p>
          </div>
        </div>
      </div>

      <div className="writing-area">
        <div className="writing-header">
          <h4>Your Answer:</h4>
          <div className="word-counter">
            <span className={`word-count ${getWordCountStatus()}`}>
              {countWords(answer)} words
            </span>
            <span className="word-target">(Target: 150-200 words)</span>
          </div>
        </div>
        
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Start writing your Task 1 response here...

Tips:
• Begin with an overview of what the chart shows
• Describe the main trends and patterns
• Include specific data points and comparisons
• Use appropriate vocabulary for describing visuals"
          className="writing-textarea"
          rows={20}
        />
        
        <div className="writing-controls">
          <div className="word-status">
            {getWordCountStatus() === 'under' && (
              <span className="status-message under">
                ⚠️ Write at least 150 words
              </span>
            )}
            {getWordCountStatus() === 'over' && (
              <span className="status-message over">
                💡 Consider being more concise (aim for ~170 words)
              </span>
            )}
            {getWordCountStatus() === 'good' && (
              <span className="status-message good">
                ✅ Good word count!
              </span>
            )}
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="btn primary"
            disabled={countWords(answer) < 100}
          >
            Submit Task 1
          </button>
        </div>
      </div>

      <div className="task-tips">
        <h4>💡 Task 1 Tips:</h4>
        <ul>
          <li>Start with an overview sentence</li>
          <li>Describe general trends before specific details</li>
          <li>Use comparative language (higher, lower, increased, decreased)</li>
          <li>Include specific data points and percentages</li>
          <li>Don't give your opinion - just describe what you see</li>
        </ul>
      </div>
    </div>
  );
};

export default Task1Practice;