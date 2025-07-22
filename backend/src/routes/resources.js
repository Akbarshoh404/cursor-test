const express = require('express');
const { query } = require('express-validator');
const resourcesController = require('../controllers/resourcesController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const categoryValidation = [
  query('category')
    .optional()
    .isIn(['listening', 'reading', 'writing', 'general'])
    .withMessage('Category must be listening, reading, writing, or general')
];

const typeValidation = [
  query('type')
    .optional()
    .isIn(['tips', 'vocabulary', 'mistakes', 'guides'])
    .withMessage('Type must be tips, vocabulary, mistakes, or guides')
];

const skillValidation = [
  query('skill')
    .optional()
    .isIn(['listening', 'reading', 'writing'])
    .withMessage('Skill must be listening, reading, or writing')
];

const vocabularyCategoryValidation = [
  query('category')
    .optional()
    .isIn(['academic', 'describing_trends', 'linking_words'])
    .withMessage('Category must be academic, describing_trends, or linking_words')
];

const studyPlanValidation = [
  query('duration')
    .optional()
    .isIn(['4_weeks', '8_weeks', '12_weeks'])
    .withMessage('Duration must be 4_weeks, 8_weeks, or 12_weeks')
];

// Most resources are public, but some may require authentication
router.use(optionalAuth);

// Get all learning resources
router.get('/', categoryValidation, typeValidation, resourcesController.getResources);

// Get tips by category
router.get('/tips', categoryValidation, resourcesController.getTips);

// Get common mistakes
router.get('/mistakes', categoryValidation, resourcesController.getCommonMistakes);

// Get vocabulary lists
router.get('/vocabulary', vocabularyCategoryValidation, resourcesController.getVocabulary);

// Get band descriptors
router.get('/bands', skillValidation, resourcesController.getBandDescriptors);

// Get study plans
router.get('/study-plans', studyPlanValidation, resourcesController.getStudyPlans);

module.exports = router;