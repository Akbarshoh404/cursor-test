import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockTest } from '../../data/mockData';
import Navigation from '../layout/Navigation';
import ListeningSection from './sections/ListeningSection';
import ReadingSection from './sections/ReadingSection';
import WritingSection from './sections/WritingSection';
import TestResults from './TestResults';
import './MockTest.css';

const MockTest = () => {
  const { currentUser, updateUserTestProgress } = useAuth();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [answers, setAnswers] = useState({
    listening: [],
    reading: [],
    writing: { task1: '', task2: '' }
  });
  const [sectionStartTime, setSectionStartTime] = useState(null);

  const sections = ['listening', 'reading', 'writing'];
  const sectionNames = ['Listening', 'Reading', 'Writing'];
  const sectionDurations = [30, 60, 60]; // minutes

  useEffect(() => {
    if (!currentUser.testsThisWeek < 1) {
      navigate('/dashboard');
      return;
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    let timer;
    if (testStarted && timeRemaining > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSectionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeRemaining, testCompleted]);

  const startTest = () => {
    setTestStarted(true);
    setCurrentSection(0);
    setTimeRemaining(sectionDurations[0] * 60);
    setSectionStartTime(Date.now());
  };

  const handleSectionComplete = () => {
    if (currentSection < sections.length - 1) {
      // Move to next section
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setTimeRemaining(sectionDurations[nextSection] * 60);
      setSectionStartTime(Date.now());
    } else {
      // Test complete
      setTestCompleted(true);
      updateUserTestProgress();
    }
  };

  const updateAnswers = (section, newAnswers) => {
    setAnswers(prev => ({
      ...prev,
      [section]: newAnswers
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCurrentSection = () => {
    const sectionName = sections[currentSection];
    
    switch (sectionName) {
      case 'listening':
        return (
          <ListeningSection
            questions={mockTest.sections.listening.questions}
            answers={answers.listening}
            onAnswersChange={(newAnswers) => updateAnswers('listening', newAnswers)}
            onComplete={handleSectionComplete}
          />
        );
      case 'reading':
        return (
          <ReadingSection
            passages={mockTest.sections.reading.passages}
            answers={answers.reading}
            onAnswersChange={(newAnswers) => updateAnswers('reading', newAnswers)}
            onComplete={handleSectionComplete}
          />
        );
      case 'writing':
        return (
          <WritingSection
            tasks={mockTest.sections.writing.tasks}
            answers={answers.writing}
            onAnswersChange={(newAnswers) => updateAnswers('writing', newAnswers)}
            onComplete={handleSectionComplete}
          />
        );
      default:
        return null;
    }
  };

  if (testCompleted) {
    return <TestResults answers={answers} />;
  }

  if (!testStarted) {
    return (
      <div className="mock-test">
        <Navigation />
        <div className="test-intro">
          <div className="intro-content">
            <h1>🎯 IELTS Academic Practice Test</h1>
            <p>This is a full IELTS practice test with three sections:</p>
            
            <div className="test-overview">
              <div className="section-info">
                <h3>📻 Listening (30 minutes)</h3>
                <p>Multiple choice and completion questions</p>
              </div>
              <div className="section-info">
                <h3>📖 Reading (60 minutes)</h3>
                <p>Reading passages with various question types</p>
              </div>
              <div className="section-info">
                <h3>✍️ Writing (60 minutes)</h3>
                <p>Task 1 (20 min) and Task 2 (40 min)</p>
              </div>
            </div>

            <div className="test-instructions">
              <h3>Important Instructions:</h3>
              <ul>
                <li>You cannot pause the test once started</li>
                <li>Each section has a time limit</li>
                <li>You cannot go back to previous sections</li>
                <li>Your answers are automatically saved</li>
                <li>This counts as your weekly free test</li>
              </ul>
            </div>

            <div className="start-actions">
              <button onClick={startTest} className="btn primary large">
                Start Test
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn secondary">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mock-test">
      <Navigation />
      
      <div className="test-header">
        <div className="test-progress">
          <div className="section-indicator">
            {sectionNames.map((name, index) => (
              <div 
                key={name}
                className={`section-step ${index === currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
              >
                <span className="step-number">{index + 1}</span>
                <span className="step-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="test-timer">
          <div className="timer-display">
            <span className="timer-label">Time Remaining:</span>
            <span className={`timer-value ${timeRemaining < 300 ? 'warning' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      <div className="test-content">
        <div className="section-header">
          <h2>{sectionNames[currentSection]} Section</h2>
          <p>Section {currentSection + 1} of {sections.length}</p>
        </div>
        
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default MockTest;