import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockTest } from '../../data/mockData';

const Task2Practice = () => {
  const { addWritingSubmission } = useAuth();
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(40 * 60); // 40 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedBand, setEstimatedBand] = useState(null);

  const task = mockTest.sections.writing.tasks[1]; // Task 2

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
    if (wordCount < 250) return 'under';
    if (wordCount > 320) return 'over';
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
    if (wordCount >= 250 && wordCount <= 320) score += 0.5;
    else if (wordCount < 230) score -= 1.0;

    // Structure and content (basic estimation)
    if (answer.includes('In my opinion') || answer.includes('I believe')) score += 0.3;
    if (answer.includes('However') || answer.includes('On the other hand')) score += 0.4;
    if (answer.includes('In conclusion') || answer.includes('To conclude')) score += 0.3;
    if (answer.length > 1200) score += 0.5;

    return Math.min(Math.max(score, 4.0), 8.0);
  };

  const handleSubmit = () => {
    const wordCount = countWords(answer);
    if (wordCount < 150) {
      alert('Please write at least 150 words before submitting.');
      return;
    }

    const band = calculateEstimatedBand();
    setEstimatedBand(band);

    const submission = {
      id: Date.now(),
      taskType: 'Task 2',
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
    setTimeRemaining(40 * 60);
    setIsTimerActive(false);
    setSubmitted(false);
    setEstimatedBand(null);
  };

  if (submitted) {
    return (
      <div className="task-practice submitted">
        <div className="submission-success">
          <h3>✅ Task 2 Submitted Successfully!</h3>
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
              <span className="stat-value">{formatTime(2400 - timeRemaining)}</span>
            </div>
          </div>

          <div className="submitted-answer">
            <h4>Your Answer:</h4>
            <div className="answer-text">{answer}</div>
          </div>

          <div className="feedback-section">
            <h4>Quick Feedback:</h4>
            <ul>
              {countWords(answer) >= 250 ? (
                <li className="positive">✅ Good word count ({countWords(answer)} words)</li>
              ) : (
                <li className="negative">❌ Under minimum word count (need 250+ words)</li>
              )}
              {answer.toLowerCase().includes('opinion') || answer.toLowerCase().includes('believe') ? (
                <li className="positive">✅ Clear position stated</li>
              ) : (
                <li className="negative">❌ Should clearly state your opinion</li>
              )}
              {answer.toLowerCase().includes('however') || answer.toLowerCase().includes('on the other hand') ? (
                <li className="positive">✅ Good use of contrasting language</li>
              ) : (
                <li className="neutral">💡 Consider using contrasting connectors</li>
              )}
              {answer.toLowerCase().includes('conclusion') ? (
                <li className="positive">✅ Has a conclusion</li>
              ) : (
                <li className="neutral">💡 Consider adding a clear conclusion</li>
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
    <div className="task-practice task2">
      <div className="task-header">
        <div className="task-info">
          <h3>💭 IELTS Writing Task 2</h3>
          <div className="task-requirements">
            <span>⏱️ 40 minutes</span>
            <span>📝 250+ words</span>
            <span>🎯 67% of writing score</span>
          </div>
        </div>
        
        <div className="timer-section">
          <div className={`timer ${timeRemaining < 600 ? 'warning' : ''}`}>
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
        <p><strong>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</strong></p>
      </div>

      <div className="writing-area">
        <div className="writing-header">
          <h4>Your Answer:</h4>
          <div className="word-counter">
            <span className={`word-count ${getWordCountStatus()}`}>
              {countWords(answer)} words
            </span>
            <span className="word-target">(Target: 250-320 words)</span>
          </div>
        </div>
        
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Start writing your Task 2 essay here...

Structure suggestion:
• Introduction: Paraphrase the question and state your opinion
• Body Paragraph 1: First supporting argument with examples
• Body Paragraph 2: Second supporting argument or opposing view
• Conclusion: Summarize your position"
          className="writing-textarea"
          rows={25}
        />
        
        <div className="writing-controls">
          <div className="word-status">
            {getWordCountStatus() === 'under' && (
              <span className="status-message under">
                ⚠️ Write at least 250 words
              </span>
            )}
            {getWordCountStatus() === 'over' && (
              <span className="status-message over">
                💡 Consider being more concise (aim for ~280 words)
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
            disabled={countWords(answer) < 150}
          >
            Submit Task 2
          </button>
        </div>
      </div>

      <div className="task-tips">
        <h4>💡 Task 2 Tips:</h4>
        <ul>
          <li>Plan your essay structure before writing</li>
          <li>State your opinion clearly in the introduction</li>
          <li>Use topic sentences for each body paragraph</li>
          <li>Support your ideas with examples and explanations</li>
          <li>Use linking words to connect ideas</li>
          <li>Conclude by restating your position</li>
        </ul>
      </div>
    </div>
  );
};

export default Task2Practice;