import React, { useState } from 'react';

const WritingSection = ({ tasks, answers, onAnswersChange, onComplete }) => {
  const [currentTask, setCurrentTask] = useState(0);

  if (!tasks || tasks.length === 0) {
    return <div>No writing tasks available</div>;
  }

  const task = tasks[currentTask];

  // Map task type to answer key
  const getAnswerKey = (taskType) => {
    if (taskType.toLowerCase().includes('task 1') || taskType.toLowerCase().includes('task1')) {
      return 'task1';
    } else if (taskType.toLowerCase().includes('task 2') || taskType.toLowerCase().includes('task2')) {
      return 'task2';
    }
    return taskType.toLowerCase().replace(/\s+/g, '');
  };

  const handleAnswerChange = (taskType, answer) => {
    const key = getAnswerKey(taskType);
    const newAnswers = {
      ...answers,
      [key]: answer
    };
    onAnswersChange(newAnswers);
  };

  const handleNext = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
    } else {
      onComplete();
    }
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const answerKey = getAnswerKey(task.type);
  const currentAnswer = answers[answerKey] || '';

  return (
    <div className="writing-section">
      <div className="task-info">
        <h3>{task.type}</h3>
        <p>Time: {task.timeLimit} minutes | Minimum words: {task.minWords}</p>
      </div>

      <div className="task-prompt">
        <h4>Task:</h4>
        <p>{task.prompt}</p>
        {task.chartImage && (
          <div className="chart-placeholder">
            📊 Chart would be displayed here
          </div>
        )}
      </div>

      <div className="writing-area">
        <div className="writing-header">
          <h4>Your Answer:</h4>
          <div className="word-count">
            {countWords(currentAnswer)} words
            <span className="target">({task.minWords}+ required)</span>
          </div>
        </div>
        
        <textarea
          value={currentAnswer}
          onChange={(e) => handleAnswerChange(task.type, e.target.value)}
          placeholder={`Start writing your ${task.type} response...`}
          className="writing-textarea"
          rows={15}
        />
      </div>

      <div className="section-controls">
        <div className="word-status">
          {countWords(currentAnswer) < task.minWords ? (
            <span className="warning">
              ⚠️ Need {task.minWords - countWords(currentAnswer)} more words
            </span>
          ) : (
            <span className="good">✅ Word count met</span>
          )}
        </div>
        <button 
          onClick={handleNext}
          className="btn primary"
          disabled={countWords(currentAnswer) < task.minWords}
        >
          {currentTask === tasks.length - 1 ? 'Complete Writing' : 'Next Task'}
        </button>
      </div>
    </div>
  );
};

export default WritingSection;