const express = require('express');
const { body, param, query } = require('express-validator');
const testController = require('../controllers/testController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const testIdValidation = [
  param('testId')
    .isInt({ min: 1 })
    .withMessage('Test ID must be a positive integer')
];

const attemptIdValidation = [
  param('attemptId')
    .isInt({ min: 1 })
    .withMessage('Attempt ID must be a positive integer')
];

const submitTestValidation = [
  body('attemptId')
    .isInt({ min: 1 })
    .withMessage('Attempt ID must be a positive integer'),
  body('answers')
    .isObject()
    .withMessage('Answers must be an object')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

// All routes require authentication
router.use(authenticateToken);

// Get all available tests
router.get('/', testController.getTests);

// Get specific test with questions
router.get('/:testId', testIdValidation, testController.getTest);

// Start a test attempt
router.post('/:testId/start', testIdValidation, testController.startTest);

// Submit test answers
router.post('/:testId/submit', testIdValidation, submitTestValidation, testController.submitTest);

// Get test results
router.get('/results/:attemptId', attemptIdValidation, testController.getTestResults);

// Get user's test history
router.get('/history/all', paginationValidation, testController.getTestHistory);

module.exports = router;