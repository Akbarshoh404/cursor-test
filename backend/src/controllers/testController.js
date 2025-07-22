const database = require('../config/database');
const {
  getCurrentDateTime,
  getCurrentDate,
  isCurrentWeek,
  calculateIELTSBand,
  calculateOverallBand,
  formatSuccessResponse,
  formatErrorResponse
} = require('../utils/helpers');

const testController = {
  // Get available tests
  getTests: async (req, res) => {
    try {
      const tests = await database.all(
        'SELECT id, title, type, difficulty, duration_minutes, created_at FROM tests WHERE is_active = 1 ORDER BY created_at DESC'
      );

      res.json(
        formatSuccessResponse(tests, 'Tests retrieved successfully')
      );

    } catch (error) {
      console.error('Get tests error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve tests')
      );
    }
  },

  // Get test by ID with questions
  getTest: async (req, res) => {
    try {
      const { testId } = req.params;
      const userId = req.user.id;

      // Check if user can take test (weekly limit for free users)
      if (req.user.subscription_type === 'free') {
        const lastTestDate = req.user.last_test_date;
        if (lastTestDate && isCurrentWeek(lastTestDate) && req.user.tests_this_week >= 1) {
          return res.status(403).json(
            formatErrorResponse('Weekly test limit reached. Upgrade to premium for unlimited tests.')
          );
        }
      }

      // Get test details
      const test = await database.get(
        'SELECT id, title, type, difficulty, duration_minutes FROM tests WHERE id = ? AND is_active = 1',
        [testId]
      );

      if (!test) {
        return res.status(404).json(
          formatErrorResponse('Test not found')
        );
      }

      // Get questions by section
      const questions = await database.all(
        `SELECT id, section, question_type, question_text, options, order_index, audio_file, image_file 
         FROM questions WHERE test_id = ? ORDER BY section, order_index`,
        [testId]
      );

      // Group questions by section
      const sections = {
        listening: [],
        reading: [],
        writing: []
      };

      questions.forEach(question => {
        const questionData = {
          id: question.id,
          type: question.question_type,
          question: question.question_text,
          orderIndex: question.order_index
        };

        // Add options for multiple choice questions
        if (question.options) {
          questionData.options = JSON.parse(question.options);
        }

        // Add media files if available
        if (question.audio_file) {
          questionData.audioFile = question.audio_file;
        }
        if (question.image_file) {
          questionData.imageFile = question.image_file;
        }

        sections[question.section].push(questionData);
      });

      // Add reading passage (mock data for now)
      if (sections.reading.length > 0) {
        sections.reading.passage = {
          title: "The Future of Renewable Energy",
          text: `Renewable energy sources have become increasingly important in the 21st century as concerns about climate change and energy security have grown. Solar power, wind energy, and hydroelectric systems are leading the way in providing sustainable alternatives to fossil fuels.

The development of renewable energy technologies has accelerated dramatically over the past decade. Solar panel efficiency has improved while costs have decreased, making solar power more accessible to both residential and commercial users. Wind energy has also seen significant advances, with larger and more efficient turbines being deployed both onshore and offshore.

Government policies have played a crucial role in promoting renewable energy adoption. Many countries have implemented feed-in tariffs, tax incentives, and renewable energy targets to encourage investment in clean energy technologies. These policies have created a favorable environment for renewable energy development and have helped drive down costs through economies of scale.

Despite these advances, challenges remain. Energy storage continues to be a significant hurdle, as renewable energy sources are often intermittent. Battery technology is improving, but large-scale energy storage solutions are still expensive and limited in capacity. Grid integration is another challenge, as existing electrical grids were designed for centralized fossil fuel power plants rather than distributed renewable energy sources.

The future of renewable energy looks promising, with continued technological improvements and falling costs expected to drive further adoption. Experts predict that renewable energy will account for the majority of global electricity generation within the next two decades, fundamentally transforming the energy sector and helping to address climate change concerns.`
        };
      }

      // Add writing tasks
      if (sections.writing.length === 0) {
        sections.writing = [
          {
            id: 'task1',
            type: 'Task 1',
            prompt: 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
            minWords: 150,
            timeLimit: 20
          },
          {
            id: 'task2',
            type: 'Task 2',
            prompt: 'Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.',
            minWords: 250,
            timeLimit: 40
          }
        ];
      }

      const testData = {
        ...test,
        sections
      };

      res.json(
        formatSuccessResponse(testData, 'Test retrieved successfully')
      );

    } catch (error) {
      console.error('Get test error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve test')
      );
    }
  },

  // Start a test attempt
  startTest: async (req, res) => {
    try {
      const { testId } = req.params;
      const userId = req.user.id;

      // Check if user can take test
      if (req.user.subscription_type === 'free') {
        const lastTestDate = req.user.last_test_date;
        if (lastTestDate && isCurrentWeek(lastTestDate) && req.user.tests_this_week >= 1) {
          return res.status(403).json(
            formatErrorResponse('Weekly test limit reached')
          );
        }
      }

      // Check if test exists
      const test = await database.get(
        'SELECT id, duration_minutes FROM tests WHERE id = ? AND is_active = 1',
        [testId]
      );

      if (!test) {
        return res.status(404).json(
          formatErrorResponse('Test not found')
        );
      }

      // Check if user has an ongoing test attempt
      const ongoingAttempt = await database.get(
        'SELECT id FROM user_test_attempts WHERE user_id = ? AND test_id = ? AND status = "in_progress"',
        [userId, testId]
      );

      if (ongoingAttempt) {
        return res.status(409).json(
          formatErrorResponse('Test already in progress')
        );
      }

      // Create test attempt
      const result = await database.run(
        'INSERT INTO user_test_attempts (user_id, test_id, started_at) VALUES (?, ?, ?)',
        [userId, testId, getCurrentDateTime()]
      );

      res.json(
        formatSuccessResponse({
          attemptId: result.id,
          testId: testId,
          startedAt: getCurrentDateTime(),
          durationMinutes: test.duration_minutes
        }, 'Test started successfully')
      );

    } catch (error) {
      console.error('Start test error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to start test')
      );
    }
  },

  // Submit test answers
  submitTest: async (req, res) => {
    try {
      const { testId } = req.params;
      const { attemptId, answers } = req.body;
      const userId = req.user.id;

      // Validate attempt
      const attempt = await database.get(
        'SELECT id, started_at FROM user_test_attempts WHERE id = ? AND user_id = ? AND test_id = ? AND status = "in_progress"',
        [attemptId, userId, testId]
      );

      if (!attempt) {
        return res.status(404).json(
          formatErrorResponse('Test attempt not found or already completed')
        );
      }

      // Get correct answers
      const questions = await database.all(
        'SELECT id, section, correct_answer FROM questions WHERE test_id = ?',
        [testId]
      );

      // Calculate scores by section
      const sectionScores = {
        listening: 0,
        reading: 0,
        writing: 0
      };

      const sectionTotals = {
        listening: 0,
        reading: 0,
        writing: 0
      };

      // Score listening and reading sections
      questions.forEach(question => {
        if (question.section === 'listening' || question.section === 'reading') {
          sectionTotals[question.section]++;
          
          const userAnswer = answers[question.section] && answers[question.section][question.id];
          if (userAnswer && userAnswer.toString() === question.correct_answer) {
            sectionScores[question.section]++;
          }
        }
      });

      // Calculate IELTS bands
      const listeningBand = calculateIELTSBand(sectionScores.listening, sectionTotals.listening);
      const readingBand = calculateIELTSBand(sectionScores.reading, sectionTotals.reading);
      
      // For writing, use a simplified scoring (in real app, this would be manual/AI assessment)
      const writingBand = 6.5; // Default band for now
      
      const overallBand = calculateOverallBand(listeningBand, readingBand, writingBand);

      // Update test attempt
      await database.run(
        `UPDATE user_test_attempts 
         SET completed_at = ?, listening_score = ?, reading_score = ?, writing_score = ?, 
             overall_score = ?, status = 'completed', answers = ?
         WHERE id = ?`,
        [
          getCurrentDateTime(),
          listeningBand,
          readingBand,
          writingBand,
          overallBand,
          JSON.stringify(answers),
          attemptId
        ]
      );

      // Update user test statistics
      const currentDate = getCurrentDate();
      const testsThisWeek = isCurrentWeek(req.user.last_test_date) ? req.user.tests_this_week + 1 : 1;

      await database.run(
        'UPDATE users SET tests_this_week = ?, last_test_date = ? WHERE id = ?',
        [testsThisWeek, currentDate, userId]
      );

      // Save writing submissions if provided
      if (answers.writing) {
        if (answers.writing.task1) {
          await database.run(
            `INSERT INTO writing_submissions (user_id, task_type, prompt_text, answer_text, word_count, estimated_band)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              'task1',
              'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.',
              answers.writing.task1,
              answers.writing.task1.trim().split(/\s+/).length,
              6.5
            ]
          );
        }

        if (answers.writing.task2) {
          await database.run(
            `INSERT INTO writing_submissions (user_id, task_type, prompt_text, answer_text, word_count, estimated_band)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              'task2',
              'Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.',
              answers.writing.task2,
              answers.writing.task2.trim().split(/\s+/).length,
              6.5
            ]
          );
        }
      }

      const results = {
        attemptId,
        scores: {
          overall: overallBand,
          listening: listeningBand,
          reading: readingBand,
          writing: writingBand
        },
        completedAt: getCurrentDateTime()
      };

      res.json(
        formatSuccessResponse(results, 'Test submitted successfully')
      );

    } catch (error) {
      console.error('Submit test error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to submit test')
      );
    }
  },

  // Get test results
  getTestResults: async (req, res) => {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;

      const attempt = await database.get(
        `SELECT uta.*, t.title, t.type, t.duration_minutes
         FROM user_test_attempts uta
         JOIN tests t ON uta.test_id = t.id
         WHERE uta.id = ? AND uta.user_id = ? AND uta.status = 'completed'`,
        [attemptId, userId]
      );

      if (!attempt) {
        return res.status(404).json(
          formatErrorResponse('Test results not found')
        );
      }

      const results = {
        id: attempt.id,
        testTitle: attempt.title,
        testType: attempt.type,
        startedAt: attempt.started_at,
        completedAt: attempt.completed_at,
        scores: {
          overall: attempt.overall_score,
          listening: attempt.listening_score,
          reading: attempt.reading_score,
          writing: attempt.writing_score
        },
        answers: attempt.answers ? JSON.parse(attempt.answers) : null
      };

      res.json(
        formatSuccessResponse(results, 'Test results retrieved successfully')
      );

    } catch (error) {
      console.error('Get test results error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve test results')
      );
    }
  },

  // Get user's test history
  getTestHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const attempts = await database.all(
        `SELECT uta.id, uta.started_at, uta.completed_at, uta.overall_score, 
                uta.listening_score, uta.reading_score, uta.writing_score, uta.status,
                t.title, t.type
         FROM user_test_attempts uta
         JOIN tests t ON uta.test_id = t.id
         WHERE uta.user_id = ?
         ORDER BY uta.started_at DESC
         LIMIT ? OFFSET ?`,
        [userId, parseInt(limit), parseInt(offset)]
      );

      const total = await database.get(
        'SELECT COUNT(*) as count FROM user_test_attempts WHERE user_id = ?',
        [userId]
      );

      const history = attempts.map(attempt => ({
        id: attempt.id,
        testTitle: attempt.title,
        testType: attempt.type,
        startedAt: attempt.started_at,
        completedAt: attempt.completed_at,
        status: attempt.status,
        scores: {
          overall: attempt.overall_score,
          listening: attempt.listening_score,
          reading: attempt.reading_score,
          writing: attempt.writing_score
        }
      }));

      res.json(
        formatSuccessResponse({
          history,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total.count,
            pages: Math.ceil(total.count / limit)
          }
        }, 'Test history retrieved successfully')
      );

    } catch (error) {
      console.error('Get test history error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve test history')
      );
    }
  }
};

module.exports = testController;