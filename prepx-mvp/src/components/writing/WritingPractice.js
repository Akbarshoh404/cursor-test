import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../layout/Navigation';
import Task1Practice from './Task1Practice';
import Task2Practice from './Task2Practice';
import WritingHistory from './WritingHistory';
import { modelAnswers } from '../../data/mockData';
import './WritingPractice.css';

const WritingPractice = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'task1':
        return <Task1Practice />;
      case 'task2':
        return <Task2Practice />;
      case 'history':
        return <WritingHistory />;
      case 'samples':
        return <SampleAnswers />;
      default:
        return <WritingOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="writing-practice">
      <Navigation />
      
      <div className="writing-content">
        <div className="writing-header">
          <h1>✍️ Writing Practice</h1>
          <p>Improve your IELTS writing skills with guided practice and sample answers</p>
        </div>

        <div className="writing-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'task1' ? 'active' : ''}`}
            onClick={() => setActiveTab('task1')}
          >
            Task 1 Practice
          </button>
          <button 
            className={`tab-btn ${activeTab === 'task2' ? 'active' : ''}`}
            onClick={() => setActiveTab('task2')}
          >
            Task 2 Practice
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Your Essays
          </button>
          <button 
            className={`tab-btn ${activeTab === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveTab('samples')}
          >
            Sample Answers
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

const WritingOverview = ({ setActiveTab }) => {
  const { currentUser } = useAuth();

  return (
    <div className="writing-overview">
      <div className="overview-grid">
        <div className="overview-card">
          <h3>📊 Task 1 - Academic Writing</h3>
          <p>Describe visual information (charts, graphs, diagrams)</p>
          <div className="task-details">
            <span>⏱️ 20 minutes</span>
            <span>📝 150+ words</span>
            <span>🎯 33% of writing score</span>
          </div>
          <button 
            onClick={() => setActiveTab('task1')} 
            className="btn primary"
          >
            Practice Task 1
          </button>
        </div>

        <div className="overview-card">
          <h3>💭 Task 2 - Essay Writing</h3>
          <p>Write an essay in response to a point of view, argument or problem</p>
          <div className="task-details">
            <span>⏱️ 40 minutes</span>
            <span>📝 250+ words</span>
            <span>🎯 67% of writing score</span>
          </div>
          <button 
            onClick={() => setActiveTab('task2')} 
            className="btn primary"
          >
            Practice Task 2
          </button>
        </div>

        <div className="overview-card stats-card">
          <h3>📈 Your Progress</h3>
          <div className="stats-grid">
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
              <span className="stat-label">Latest Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {currentUser.writingHistory.filter(h => h.taskType === 'Task 1').length}
              </span>
              <span className="stat-label">Task 1 Essays</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {currentUser.writingHistory.filter(h => h.taskType === 'Task 2').length}
              </span>
              <span className="stat-label">Task 2 Essays</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('history')} 
            className="btn secondary"
          >
            View All Essays
          </button>
        </div>

        <div className="overview-card tips-card">
          <h3>💡 Writing Tips</h3>
          <ul>
            <li>Always plan before you write</li>
            <li>Use a variety of sentence structures</li>
            <li>Check grammar and spelling</li>
            <li>Answer all parts of the question</li>
            <li>Practice time management</li>
          </ul>
          <button 
            onClick={() => setActiveTab('samples')} 
            className="btn secondary"
          >
            View Sample Answers
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Start</h3>
        <div className="actions-row">
          <button 
            onClick={() => setActiveTab('task1')} 
            className="action-btn-large"
          >
            <span className="action-icon">📊</span>
            <div>
              <h4>Start Task 1</h4>
              <p>Describe charts and graphs</p>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('task2')} 
            className="action-btn-large"
          >
            <span className="action-icon">💭</span>
            <div>
              <h4>Start Task 2</h4>
              <p>Write argumentative essays</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const SampleAnswers = () => {
  const [selectedTask, setSelectedTask] = useState('task1');
  const [selectedBand, setSelectedBand] = useState('band7');

  return (
    <div className="sample-answers">
      <div className="sample-controls">
        <div className="control-group">
          <label>Task Type:</label>
          <select 
            value={selectedTask} 
            onChange={(e) => setSelectedTask(e.target.value)}
            className="select-input"
          >
            <option value="task1">Task 1</option>
            <option value="task2">Task 2</option>
          </select>
        </div>
        <div className="control-group">
          <label>Band Score:</label>
          <select 
            value={selectedBand} 
            onChange={(e) => setSelectedBand(e.target.value)}
            className="select-input"
          >
            <option value="band6">Band 6</option>
            <option value="band7">Band 7</option>
            <option value="band8">Band 8</option>
            <option value="band9">Band 9</option>
          </select>
        </div>
      </div>

      <div className="sample-content">
        <div className="sample-header">
          <h3>
            {selectedTask === 'task1' ? 'Task 1' : 'Task 2'} - 
            Band {selectedBand.replace('band', '')} Sample
          </h3>
        </div>
        <div className="sample-text">
          {modelAnswers[selectedTask][selectedBand]}
        </div>
      </div>

      <div className="sample-tips">
        <h4>Key Features of This Response:</h4>
        <ul>
          {selectedBand === 'band6' && (
            <>
              <li>Addresses the task adequately</li>
              <li>Basic range of vocabulary</li>
              <li>Some grammatical errors</li>
              <li>Simple sentence structures</li>
            </>
          )}
          {selectedBand === 'band7' && (
            <>
              <li>Covers all requirements of the task</li>
              <li>Good range of vocabulary</li>
              <li>Generally accurate grammar</li>
              <li>Mix of simple and complex sentences</li>
            </>
          )}
          {selectedBand === 'band8' && (
            <>
              <li>Fully addresses all parts of the task</li>
              <li>Wide range of vocabulary</li>
              <li>Flexible use of grammar</li>
              <li>Variety of complex structures</li>
            </>
          )}
          {selectedBand === 'band9' && (
            <>
              <li>Fully satisfies all requirements</li>
              <li>Wide range of vocabulary with precision</li>
              <li>Full range of structures with flexibility</li>
              <li>Error-free sentences with only rare slips</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default WritingPractice;