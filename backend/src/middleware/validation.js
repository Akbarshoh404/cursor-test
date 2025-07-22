const { validationResult } = require('express-validator');
const { formatErrorResponse } = require('../utils/helpers');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json(
      formatErrorResponse('Validation failed', formattedErrors)
    );
  }
  next();
};

// Custom validation functions
const isValidTaskType = (value) => {
  return ['task1', 'task2'].includes(value);
};

const isValidBandScore = (value) => {
  const score = parseFloat(value);
  return score >= 0 && score <= 9 && (score * 2) % 1 === 0; // Allows 0.5 increments
};

const isValidSection = (value) => {
  return ['listening', 'reading', 'writing'].includes(value);
};

const isValidTestStatus = (value) => {
  return ['in_progress', 'completed', 'abandoned'].includes(value);
};

const isValidSubscriptionType = (value) => {
  return ['free', 'premium'].includes(value);
};

// Sanitization functions
const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .substring(0, 10000); // Limit length
};

const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  
  return email.toLowerCase().trim();
};

const sanitizeName = (name) => {
  if (typeof name !== 'string') return name;
  
  return name
    .trim()
    .replace(/[^\w\s-']/g, '') // Allow only letters, numbers, spaces, hyphens, and apostrophes
    .substring(0, 100);
};

module.exports = {
  handleValidationErrors,
  isValidTaskType,
  isValidBandScore,
  isValidSection,
  isValidTestStatus,
  isValidSubscriptionType,
  sanitizeText,
  sanitizeEmail,
  sanitizeName
};