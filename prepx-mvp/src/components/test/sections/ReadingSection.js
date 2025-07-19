import React, { useState } from 'react';

const ReadingSection = ({ passages, answers, onAnswersChange, onComplete }) => {
  const [currentPassage, setCurrentPassage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (!passages || passages.length === 0) {
    return <div>No reading passages available</div>;
  }

  const passage = passages[currentPassage];
  const question = passage.questions[currentQuestion];

  const handleAnswerChange = (answer) => {
    const newAnswers = [...answers];
    const questionIndex = currentQuestion;
    newAnswers[questionIndex] = answer;
    onAnswersChange(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < passage.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentPassage < passages.length - 1) {
      setCurrentPassage(currentPassage + 1);
      setCurrentQuestion(0);
    } else {
      onComplete();
    }
  };

  return (
    <div className="reading-section">
      <div className="reading-layout">
        <div className="passage-panel">
          <h3>{passage.title}</h3>
          <div className="passage-text">
            {passage.text}
          </div>
        </div>

        <div className="questions-panel">
          <div className="question-progress">
            Passage {currentPassage + 1} of {passages.length} - 
            Question {currentQuestion + 1} of {passage.questions.length}
          </div>

          <div className="question-content">
            <h4>Question {currentQuestion + 1}</h4>
            <p>{question.question}</p>

            {question.type === 'multiple-choice' && (
              <div className="multiple-choice">
                {question.options.map((option, index) => (
                  <label key={index} className="option">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswerChange(index)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'true-false-not-given' && (
              <div className="true-false-options">
                {['True', 'False', 'Not Given'].map((option) => (
                  <label key={option} className="option">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={() => handleAnswerChange(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'completion' && (
              <div className="completion">
                <input
                  type="text"
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer..."
                  className="completion-input"
                />
              </div>
            )}
          </div>

          <div className="section-controls">
            <button 
              onClick={handleNext}
              className="btn primary"
            >
              {currentQuestion === passage.questions.length - 1 && currentPassage === passages.length - 1 
                ? 'Complete Section' 
                : 'Next Question'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingSection;