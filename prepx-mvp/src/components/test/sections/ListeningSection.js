import React, { useState } from 'react';

const ListeningSection = ({ questions, answers, onAnswersChange, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    onAnswersChange(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete();
    }
  };

  if (!questions || questions.length === 0) {
    return <div>No listening questions available</div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className="listening-section">
      <div className="section-progress">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
      </div>

      <div className="audio-player">
        <div className="audio-placeholder">
          🎧 Audio would play here: {question.audio}
        </div>
        <div className="audio-controls">
          <button className="btn small">▶️ Play</button>
          <button className="btn small">⏸️ Pause</button>
        </div>
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
                  onChange={() => handleAnswerChange(currentQuestion, index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="section-controls">
        <button 
          onClick={handleNext}
          className="btn primary"
        >
          {currentQuestion === questions.length - 1 ? 'Complete Section' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default ListeningSection;