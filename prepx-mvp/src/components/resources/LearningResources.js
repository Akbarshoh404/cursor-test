import React, { useState } from 'react';
import Navigation from '../layout/Navigation';
import { learningResources, modelAnswers } from '../../data/mockData';
import './LearningResources.css';

const LearningResources = () => {
  const [activeSection, setActiveSection] = useState('tips');

  const renderContent = () => {
    switch (activeSection) {
      case 'tips':
        return <StudyTips />;
      case 'strategies':
        return <TestStrategies />;
      case 'samples':
        return <SampleAnswers />;
      case 'mistakes':
        return <CommonMistakes />;
      default:
        return <StudyTips />;
    }
  };

  return (
    <div className="learning-resources">
      <Navigation />
      
      <div className="resources-content">
        <div className="resources-header">
          <h1>📚 Learning Resources</h1>
          <p>Essential tips, strategies, and materials for IELTS success</p>
        </div>

        <div className="resources-tabs">
          <button 
            className={`tab-btn ${activeSection === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveSection('tips')}
          >
            Study Tips
          </button>
          <button 
            className={`tab-btn ${activeSection === 'strategies' ? 'active' : ''}`}
            onClick={() => setActiveSection('strategies')}
          >
            Test Strategies
          </button>
          <button 
            className={`tab-btn ${activeSection === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveSection('samples')}
          >
            Sample Answers
          </button>
          <button 
            className={`tab-btn ${activeSection === 'mistakes' ? 'active' : ''}`}
            onClick={() => setActiveSection('mistakes')}
          >
            Common Mistakes
          </button>
        </div>

        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const StudyTips = () => {
  return (
    <div className="study-tips">
      <div className="tips-grid">
        <div className="tips-section">
          <h3>🎧 Listening Tips</h3>
          <div className="tips-list">
            {learningResources.tips.listening.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">💡</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tips-section">
          <h3>📖 Reading Tips</h3>
          <div className="tips-list">
            {learningResources.tips.reading.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">💡</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tips-section">
          <h3>✍️ Writing Tips</h3>
          <div className="tips-list">
            {learningResources.tips.writing.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">💡</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="general-tips">
        <h3>🎯 General Study Tips</h3>
        <div className="general-tips-grid">
          <div className="tip-card">
            <h4>📅 Create a Study Schedule</h4>
            <p>Dedicate specific times each day to different IELTS sections. Consistency is key to improvement.</p>
          </div>
          <div className="tip-card">
            <h4>📝 Practice Under Test Conditions</h4>
            <p>Time yourself during practice sessions to simulate real exam pressure and improve time management.</p>
          </div>
          <div className="tip-card">
            <h4>📚 Use Authentic Materials</h4>
            <p>Practice with real IELTS past papers and official preparation materials for the most accurate preparation.</p>
          </div>
          <div className="tip-card">
            <h4>🎯 Focus on Weak Areas</h4>
            <p>Identify your weakest sections and dedicate extra time to improving those specific skills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestStrategies = () => {
  return (
    <div className="test-strategies">
      <div className="strategy-section">
        <h3>⏰ Time Management Strategies</h3>
        <div className="strategy-grid">
          <div className="strategy-card">
            <h4>Listening (30 minutes)</h4>
            <ul>
              <li>Use the 10 minutes transfer time wisely</li>
              <li>Write answers on question paper first</li>
              <li>Check spelling when transferring answers</li>
              <li>Don't spend too long on one question</li>
            </ul>
          </div>
          <div className="strategy-card">
            <h4>Reading (60 minutes)</h4>
            <ul>
              <li>Spend 20 minutes per passage</li>
              <li>Skim read first, then detailed reading</li>
              <li>Look for keywords in questions</li>
              <li>Don't read every word</li>
            </ul>
          </div>
          <div className="strategy-card">
            <h4>Writing (60 minutes)</h4>
            <ul>
              <li>Task 1: 20 minutes (150+ words)</li>
              <li>Task 2: 40 minutes (250+ words)</li>
              <li>Plan before writing (5 minutes)</li>
              <li>Save time for checking (5 minutes)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="strategy-section">
        <h3>📊 Band Score Strategies</h3>
        <div className="band-strategies">
          <div className="band-card">
            <h4>Band 6.0 → 6.5</h4>
            <ul>
              <li>Improve vocabulary range</li>
              <li>Use more complex sentence structures</li>
              <li>Reduce basic grammatical errors</li>
              <li>Be more precise in answering questions</li>
            </ul>
          </div>
          <div className="band-card">
            <h4>Band 6.5 → 7.0</h4>
            <ul>
              <li>Use advanced vocabulary accurately</li>
              <li>Vary sentence structures more</li>
              <li>Improve coherence and cohesion</li>
              <li>Address all parts of writing tasks</li>
            </ul>
          </div>
          <div className="band-card">
            <h4>Band 7.0 → 7.5+</h4>
            <ul>
              <li>Use sophisticated vocabulary</li>
              <li>Perfect grammar and punctuation</li>
              <li>Demonstrate critical thinking</li>
              <li>Show excellent task achievement</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="strategy-section">
        <h3>🧠 Mental Preparation</h3>
        <div className="mental-prep">
          <div className="prep-item">
            <h4>Stay Calm During the Test</h4>
            <p>Take deep breaths, read instructions carefully, and don't panic if you don't understand something.</p>
          </div>
          <div className="prep-item">
            <h4>Manage Test Anxiety</h4>
            <p>Practice relaxation techniques and visualize success. Remember that you can retake the test if needed.</p>
          </div>
          <div className="prep-item">
            <h4>Get Adequate Rest</h4>
            <p>Ensure you get enough sleep before the test day and eat a healthy breakfast to maintain energy levels.</p>
          </div>
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
            <option value="task1">Task 1 - Academic Writing</option>
            <option value="task2">Task 2 - Essay Writing</option>
          </select>
        </div>
        <div className="control-group">
          <label>Band Score:</label>
          <select 
            value={selectedBand} 
            onChange={(e) => setSelectedBand(e.target.value)}
            className="select-input"
          >
            <option value="band6">Band 6.0</option>
            <option value="band7">Band 7.0</option>
            <option value="band8">Band 8.0</option>
            <option value="band9">Band 9.0</option>
          </select>
        </div>
      </div>

      <div className="sample-content">
        <div className="sample-header">
          <h3>
            {selectedTask === 'task1' ? 'Task 1' : 'Task 2'} Sample - 
            Band {selectedBand.replace('band', '')}
          </h3>
        </div>
        <div className="sample-text">
          {modelAnswers[selectedTask][selectedBand]}
        </div>
      </div>

      <div className="sample-analysis">
        <h4>Why This Response Achieves Band {selectedBand.replace('band', '')}:</h4>
        <div className="analysis-points">
          {selectedBand === 'band6' && (
            <ul>
              <li><strong>Task Achievement:</strong> Addresses the task adequately but may miss some elements</li>
              <li><strong>Coherence:</strong> Information is arranged coherently with some linking</li>
              <li><strong>Vocabulary:</strong> Adequate range with some flexibility and precision</li>
              <li><strong>Grammar:</strong> Mix of simple and complex sentences with some errors</li>
            </ul>
          )}
          {selectedBand === 'band7' && (
            <ul>
              <li><strong>Task Achievement:</strong> Covers all requirements with clear position</li>
              <li><strong>Coherence:</strong> Logically organized with appropriate linking</li>
              <li><strong>Vocabulary:</strong> Good range with some flexibility and precision</li>
              <li><strong>Grammar:</strong> Variety of complex structures with good control</li>
            </ul>
          )}
          {selectedBand === 'band8' && (
            <ul>
              <li><strong>Task Achievement:</strong> Fully addresses all parts with well-developed ideas</li>
              <li><strong>Coherence:</strong> Skillfully managed with effective linking</li>
              <li><strong>Vocabulary:</strong> Wide range with natural and sophisticated usage</li>
              <li><strong>Grammar:</strong> Wide range of structures with flexibility and accuracy</li>
            </ul>
          )}
          {selectedBand === 'band9' && (
            <ul>
              <li><strong>Task Achievement:</strong> Fully addresses task with highly developed response</li>
              <li><strong>Coherence:</strong> Sophisticated control of organizational features</li>
              <li><strong>Vocabulary:</strong> Full flexibility and precise usage with natural language</li>
              <li><strong>Grammar:</strong> Full range of structures with complete naturalness</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const CommonMistakes = () => {
  return (
    <div className="common-mistakes">
      <div className="mistakes-intro">
        <h3>⚠️ Common IELTS Mistakes to Avoid</h3>
        <p>Learn from these frequent errors that can cost you valuable band points.</p>
      </div>

      <div className="mistakes-list">
        {learningResources.commonMistakes.map((mistake, index) => (
          <div key={index} className="mistake-item">
            <span className="mistake-icon">❌</span>
            <span>{mistake}</span>
          </div>
        ))}
      </div>

      <div className="detailed-mistakes">
        <div className="mistake-category">
          <h4>📝 Writing Mistakes</h4>
          <div className="mistake-examples">
            <div className="mistake-example">
              <h5>Task 1: Adding Personal Opinion</h5>
              <p className="wrong">❌ "I think this chart shows that people prefer to own homes."</p>
              <p className="correct">✅ "The chart shows that home ownership increased significantly."</p>
            </div>
            <div className="mistake-example">
              <h5>Task 2: Not Answering All Parts</h5>
              <p className="wrong">❌ Only discussing one side of a "discuss both views" question</p>
              <p className="correct">✅ Discussing both sides and giving your opinion when asked</p>
            </div>
          </div>
        </div>

        <div className="mistake-category">
          <h4>📖 Reading Mistakes</h4>
          <div className="mistake-examples">
            <div className="mistake-example">
              <h5>True/False/Not Given Confusion</h5>
              <p className="wrong">❌ Choosing "False" when information isn't mentioned</p>
              <p className="correct">✅ "Not Given" when information isn't in the passage</p>
            </div>
            <div className="mistake-example">
              <h5>Overthinking Simple Questions</h5>
              <p className="wrong">❌ Looking for complex meanings in straightforward questions</p>
              <p className="correct">✅ Finding direct answers in the text</p>
            </div>
          </div>
        </div>

        <div className="mistake-category">
          <h4>🎧 Listening Mistakes</h4>
          <div className="mistake-examples">
            <div className="mistake-example">
              <h5>Spelling Errors</h5>
              <p className="wrong">❌ "Febuary, recieve, occured"</p>
              <p className="correct">✅ "February, receive, occurred"</p>
            </div>
            <div className="mistake-example">
              <h5>Missing Plural Forms</h5>
              <p className="wrong">❌ Writing "student" when the answer is "students"</p>
              <p className="correct">✅ Listen carefully for plural endings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResources;