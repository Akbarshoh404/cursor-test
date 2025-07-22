const express = require('express');
const { body, param, query } = require('express-validator');
const writingController = require('../controllers/writingController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const submitWritingValidation = [
  body('taskType')
    .isIn(['task1', 'task2'])
    .withMessage('Task type must be task1 or task2'),
  body('prompt')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Prompt must be between 10 and 1000 characters'),
  body('answer')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Answer must be between 50 and 5000 characters')
];

const submissionIdValidation = [
  param('submissionId')
    .isInt({ min: 1 })
    .withMessage('Submission ID must be a positive integer')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('taskType')
    .optional()
    .isIn(['task1', 'task2'])
    .withMessage('Task type must be task1 or task2')
];

const taskTypeValidation = [
  query('taskType')
    .optional()
    .isIn(['task1', 'task2'])
    .withMessage('Task type must be task1 or task2')
];

const sampleAnswerValidation = [
  query('taskType')
    .optional()
    .isIn(['task1', 'task2'])
    .withMessage('Task type must be task1 or task2'),
  query('band')
    .optional()
    .isIn(['band6', 'band7', 'band8', 'band9'])
    .withMessage('Band must be band6, band7, band8, or band9')
];

// All routes require authentication
router.use(authenticateToken);

// Submit writing practice
router.post('/submit', submitWritingValidation, writingController.submitWriting);

// Get writing history
router.get('/history', paginationValidation, writingController.getWritingHistory);

// Get specific writing submission
router.get('/submission/:submissionId', submissionIdValidation, writingController.getWritingSubmission);

// Get writing prompts
router.get('/prompts', taskTypeValidation, writingController.getWritingPrompts);

// Get sample answers
router.get('/samples', sampleAnswerValidation, writingController.getSampleAnswers);

// Get writing statistics
router.get('/stats', writingController.getWritingStats);

module.exports = router;