import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../layout/Navigation';
import './SpeakingPractice.css';

const SpeakingPractice = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('practice');
  const [selectedPart, setSelectedPart] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [preparationTime, setPreparationTime] = useState(0);
  const [speakingTime, setSpeakingTime] = useState(0);
  const [isPreparation, setIsPreparation] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [recordings, setRecordings] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const preparationTimerRef = useRef(null);
  const speakingTimerRef = useRef(null);

  // Speaking prompts for different parts
  const speakingPrompts = {
    1: [
      {
        id: 1,
        category: "Personal Information",
        questions: [
          "What's your full name?",
          "Can I see your identification?",
          "Where are you from?",
          "Do you work or study?",
          "What do you like about your job/studies?"
        ]
      },
      {
        id: 2,
        category: "Hobbies",
        questions: [
          "What hobbies do you have?",
          "How long have you been interested in this hobby?",
          "What got you interested in this hobby?",
          "Do you think hobbies are important? Why?",
          "Did you have different hobbies when you were younger?"
        ]
      },
      {
        id: 3,
        category: "Technology",
        questions: [
          "Do you use technology a lot?",
          "What's your favorite piece of technology?",
          "How has technology changed in recent years?",
          "Do you think technology makes life easier?",
          "What technology would you like to see in the future?"
        ]
      }
    ],
    2: [
      {
        id: 1,
        topic: "Describe a memorable journey you have taken",
        questions: [
          "Where did you go?",
          "When did you go there?",
          "Who did you go with?",
          "What made it memorable?"
        ],
        preparationTime: 60,
        speakingTime: 120
      },
      {
        id: 2,
        topic: "Describe a skill you would like to learn",
        questions: [
          "What skill would you like to learn?",
          "Why do you want to learn this skill?",
          "How would you go about learning it?",
          "How would this skill benefit you?"
        ],
        preparationTime: 60,
        speakingTime: 120
      },
      {
        id: 3,
        topic: "Describe a place you would like to visit",
        questions: [
          "Where is this place?",
          "Why do you want to visit it?",
          "What would you do there?",
          "Who would you like to go with?"
        ],
        preparationTime: 60,
        speakingTime: 120
      }
    ],
    3: [
      {
        id: 1,
        topic: "Travel and Tourism",
        questions: [
          "How has tourism changed in your country over the years?",
          "What are the advantages and disadvantages of tourism for a country?",
          "Do you think people travel too much nowadays?",
          "How might travel change in the future?",
          "Should governments promote tourism? Why or why not?"
        ]
      },
      {
        id: 2,
        topic: "Education and Learning",
        questions: [
          "How important is formal education compared to life experience?",
          "What role should technology play in education?",
          "Do you think everyone should have access to higher education?",
          "How has education changed since your parents' generation?",
          "What skills do you think will be most important in the future?"
        ]
      }
    ]
  };

  useEffect(() => {
    return () => {
      // Cleanup timers
      if (preparationTimerRef.current) {
        clearInterval(preparationTimerRef.current);
      }
      if (speakingTimerRef.current) {
        clearInterval(speakingTimerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startPreparation = (duration) => {
    setPreparationTime(duration);
    setIsPreparation(true);
    
    preparationTimerRef.current = setInterval(() => {
      setPreparationTime((prev) => {
        if (prev <= 1) {
          clearInterval(preparationTimerRef.current);
          setIsPreparation(false);
          startSpeaking();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSpeaking = (duration = 120) => {
    setSpeakingTime(duration);
    setSessionActive(true);
    startRecording();
    
    speakingTimerRef.current = setInterval(() => {
      setSpeakingTime((prev) => {
        if (prev <= 1) {
          clearInterval(speakingTimerRef.current);
          stopRecording();
          setSessionActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const saveRecording = () => {
    if (audioBlob) {
      const recording = {
        id: Date.now(),
        part: selectedPart,
        question: currentQuestion,
        audioUrl: audioUrl,
        audioBlob: audioBlob,
        timestamp: new Date().toISOString(),
        feedback: generateMockFeedback()
      };
      
      setRecordings([...recordings, recording]);
      setAudioBlob(null);
      setAudioUrl(null);
      
      // Show feedback
      setFeedback(recording.feedback);
    }
  };

  const generateMockFeedback = () => {
    // Mock AI feedback - in real implementation, this would call an AI service
    const feedbackOptions = [
      {
        fluency: 7.0,
        pronunciation: 6.5,
        vocabulary: 7.5,
        grammar: 6.0,
        overall: 6.8,
        comments: [
          "Good use of linking words and natural flow",
          "Some pronunciation issues with specific sounds",
          "Rich vocabulary with some advanced expressions",
          "Minor grammatical errors but generally accurate"
        ]
      },
      {
        fluency: 6.0,
        pronunciation: 7.0,
        vocabulary: 6.5,
        grammar: 7.0,
        overall: 6.6,
        comments: [
          "Clear pronunciation and easy to understand",
          "Some hesitation and repetition",
          "Good range of vocabulary for the topic",
          "Generally accurate grammar structures"
        ]
      }
    ];
    
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPracticeContent = () => {
    const prompts = speakingPrompts[selectedPart];
    const currentPrompt = prompts[currentQuestion];

    return (
      <div className="practice-content animate-fade-in">
        <div className="practice-header">
          <div className="part-selector">
            {[1, 2, 3].map(part => (
              <button
                key={part}
                className={`part-btn ${selectedPart === part ? 'active' : ''}`}
                onClick={() => {
                  setSelectedPart(part);
                  setCurrentQuestion(0);
                }}
              >
                Part {part}
              </button>
            ))}
          </div>
          
          <div className="question-navigation">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn btn-secondary btn-sm"
            >
              ← Previous
            </button>
            <span className="question-counter">
              {currentQuestion + 1} of {prompts.length}
            </span>
            <button
              onClick={() => setCurrentQuestion(Math.min(prompts.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === prompts.length - 1}
              className="btn btn-secondary btn-sm"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="question-card card">
          <div className="card-header">
            <h3>Speaking Part {selectedPart}</h3>
            <span className="badge badge-primary">
              {selectedPart === 1 ? 'Interview' : selectedPart === 2 ? 'Long Turn' : 'Discussion'}
            </span>
          </div>
          
          <div className="card-body">
            {selectedPart === 1 && (
              <div className="part1-content">
                <h4>{currentPrompt.category}</h4>
                <div className="questions-list">
                  {currentPrompt.questions.map((question, index) => (
                    <div key={index} className="question-item">
                      <span className="question-number">{index + 1}.</span>
                      <span className="question-text">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPart === 2 && (
              <div className="part2-content">
                <h4>Cue Card</h4>
                <div className="cue-card">
                  <p className="topic">{currentPrompt.topic}</p>
                  <p className="instructions">You should say:</p>
                  <ul className="bullet-points">
                    {currentPrompt.questions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                  <p className="time-info">
                    You will have 1 minute to prepare and 2 minutes to speak.
                  </p>
                </div>
              </div>
            )}

            {selectedPart === 3 && (
              <div className="part3-content">
                <h4>{currentPrompt.topic}</h4>
                <div className="questions-list">
                  {currentPrompt.questions.map((question, index) => (
                    <div key={index} className="question-item">
                      <span className="question-number">{index + 1}.</span>
                      <span className="question-text">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-footer">
            <div className="recording-controls">
              {isPreparation && (
                <div className="preparation-timer">
                  <span className="timer-label">Preparation Time:</span>
                  <span className="timer-value">{formatTime(preparationTime)}</span>
                </div>
              )}

              {sessionActive && (
                <div className="speaking-timer">
                  <span className="timer-label">Speaking Time:</span>
                  <span className="timer-value">{formatTime(speakingTime)}</span>
                </div>
              )}

              {!isPreparation && !sessionActive && (
                <div className="control-buttons">
                  {selectedPart === 2 ? (
                    <button
                      onClick={() => startPreparation(60)}
                      className="btn btn-primary btn-lg"
                    >
                      <span>⏱️</span>
                      Start Practice (1 min prep)
                    </button>
                  ) : (
                    <button
                      onClick={() => startSpeaking(selectedPart === 1 ? 60 : 180)}
                      className="btn btn-primary btn-lg"
                    >
                      <span>🎙️</span>
                      Start Recording
                    </button>
                  )}
                </div>
              )}

              {isRecording && (
                <div className="recording-status">
                  <div className="recording-indicator animate-pulse">
                    <span className="recording-dot"></span>
                    Recording...
                  </div>
                  <button
                    onClick={stopRecording}
                    className="btn btn-error btn-lg"
                  >
                    <span>⏹️</span>
                    Stop Recording
                  </button>
                </div>
              )}

              {audioUrl && (
                <div className="playback-controls">
                  <audio controls src={audioUrl} className="audio-player">
                    Your browser does not support the audio element.
                  </audio>
                  <div className="playback-actions">
                    <button
                      onClick={saveRecording}
                      className="btn btn-success"
                    >
                      <span>💾</span>
                      Save & Get Feedback
                    </button>
                    <button
                      onClick={() => {
                        setAudioUrl(null);
                        setAudioBlob(null);
                      }}
                      className="btn btn-secondary"
                    >
                      <span>🗑️</span>
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {feedback && (
          <div className="feedback-card card animate-scale-in">
            <div className="card-header">
              <h3>🤖 AI Feedback</h3>
              <span className="badge badge-success">Band {feedback.overall}</span>
            </div>
            <div className="card-body">
              <div className="feedback-scores">
                <div className="score-item">
                  <span className="score-label">Fluency</span>
                  <span className="score-value">{feedback.fluency}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">Pronunciation</span>
                  <span className="score-value">{feedback.pronunciation}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">Vocabulary</span>
                  <span className="score-value">{feedback.vocabulary}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">Grammar</span>
                  <span className="score-value">{feedback.grammar}</span>
                </div>
              </div>
              
              <div className="feedback-comments">
                <h4>Detailed Feedback:</h4>
                <ul>
                  {feedback.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card-footer">
              <button
                onClick={() => setFeedback(null)}
                className="btn btn-secondary"
              >
                Close Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRecordingsContent = () => {
    return (
      <div className="recordings-content animate-fade-in">
        <div className="recordings-header">
          <h3>Your Recordings</h3>
          <span className="recordings-count">{recordings.length} recordings</span>
        </div>

        {recordings.length === 0 ? (
          <div className="no-recordings">
            <div className="no-recordings-icon">🎙️</div>
            <h4>No recordings yet</h4>
            <p>Start practicing to create your first recording</p>
            <button
              onClick={() => setActiveTab('practice')}
              className="btn btn-primary"
            >
              Start Practicing
            </button>
          </div>
        ) : (
          <div className="recordings-grid">
            {recordings.map((recording) => (
              <div key={recording.id} className="recording-card card">
                <div className="card-header">
                  <h4>Part {recording.part} - Recording</h4>
                  <span className="badge badge-primary">
                    Band {recording.feedback.overall}
                  </span>
                </div>
                <div className="card-body">
                  <div className="recording-info">
                    <p className="recording-date">
                      {new Date(recording.timestamp).toLocaleDateString()}
                    </p>
                    <audio controls src={recording.audioUrl} className="audio-player">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  
                  <div className="recording-scores">
                    {Object.entries(recording.feedback).map(([key, value]) => {
                      if (key === 'comments') return null;
                      return (
                        <div key={key} className="score-item">
                          <span className="score-label">{key}</span>
                          <span className="score-value">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSpeakingRoomContent = () => {
    return (
      <div className="speaking-room-content animate-fade-in">
        <div className="speaking-room-header">
          <h3>🗣️ Speaking Room</h3>
          <span className="badge badge-warning">Beta Feature</span>
        </div>

        <div className="room-options">
          <div className="room-card card">
            <div className="card-header">
              <h4>Practice with AI Partner</h4>
            </div>
            <div className="card-body">
              <p>Practice speaking with our AI conversation partner. Get real-time feedback and improve your fluency.</p>
              <div className="room-features">
                <div className="feature">✅ Real-time conversation</div>
                <div className="feature">✅ Instant feedback</div>
                <div className="feature">✅ Multiple topics</div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary btn-lg">
                Start AI Practice
              </button>
            </div>
          </div>

          <div className="room-card card">
            <div className="card-header">
              <h4>Find Speaking Partner</h4>
            </div>
            <div className="card-body">
              <p>Connect with other IELTS students for speaking practice. Improve together!</p>
              <div className="room-features">
                <div className="feature">✅ Real human interaction</div>
                <div className="feature">✅ Matched by level</div>
                <div className="feature">✅ Structured practice</div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-secondary btn-lg">
                Find Partner
              </button>
            </div>
          </div>

          <div className="room-card card">
            <div className="card-header">
              <h4>Mock Speaking Test</h4>
            </div>
            <div className="card-body">
              <p>Take a full mock speaking test with our AI examiner. Experience the real test format.</p>
              <div className="room-features">
                <div className="feature">✅ Full test simulation</div>
                <div className="feature">✅ Professional evaluation</div>
                <div className="feature">✅ Detailed band scores</div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-success btn-lg">
                Take Mock Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="speaking-practice">
      <Navigation />
      
      <div className="speaking-content">
        <div className="speaking-header">
          <h1>🗣️ Speaking Practice</h1>
          <p>Improve your IELTS speaking skills with AI feedback and real practice</p>
        </div>

        <div className="speaking-tabs">
          <button
            className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <span>🎙️</span>
            Practice
          </button>
          <button
            className={`tab-btn ${activeTab === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveTab('recordings')}
          >
            <span>📼</span>
            My Recordings
          </button>
          <button
            className={`tab-btn ${activeTab === 'room' ? 'active' : ''}`}
            onClick={() => setActiveTab('room')}
          >
            <span>🗣️</span>
            Speaking Room
          </button>
        </div>

        <div className="speaking-tab-content">
          {activeTab === 'practice' && renderPracticeContent()}
          {activeTab === 'recordings' && renderRecordingsContent()}
          {activeTab === 'room' && renderSpeakingRoomContent()}
        </div>
      </div>
    </div>
  );
};

export default SpeakingPractice;