const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Password utilities
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// JWT utilities
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const generateSessionToken = () => {
  return uuidv4();
};

// Validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

// Date utilities
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

const getCurrentDateTime = () => {
  return new Date().toISOString();
};

const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const isCurrentWeek = (dateString) => {
  const date = new Date(dateString);
  const weekStart = new Date(getWeekStart());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return date >= weekStart && date <= weekEnd;
};

// Test scoring utilities
const calculateIELTSBand = (correctAnswers, totalQuestions) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  if (percentage >= 90) return 9.0;
  if (percentage >= 82) return 8.5;
  if (percentage >= 75) return 8.0;
  if (percentage >= 67) return 7.5;
  if (percentage >= 60) return 7.0;
  if (percentage >= 52) return 6.5;
  if (percentage >= 45) return 6.0;
  if (percentage >= 37) return 5.5;
  if (percentage >= 30) return 5.0;
  if (percentage >= 22) return 4.5;
  if (percentage >= 15) return 4.0;
  if (percentage >= 8) return 3.5;
  if (percentage >= 5) return 3.0;
  return 2.5;
};

const calculateOverallBand = (listeningBand, readingBand, writingBand, speakingBand = null) => {
  const bands = [listeningBand, readingBand, writingBand];
  if (speakingBand) bands.push(speakingBand);
  
  const average = bands.reduce((sum, band) => sum + band, 0) / bands.length;
  
  // Round to nearest 0.5
  return Math.round(average * 2) / 2;
};

// Writing assessment utilities
const estimateWritingBand = (wordCount, taskType) => {
  const minWords = taskType === 'task1' ? 150 : 250;
  const maxWords = taskType === 'task1' ? 200 : 350;
  
  // Basic scoring based on word count (this is simplified)
  if (wordCount < minWords * 0.8) return 4.0; // Significantly under word count
  if (wordCount < minWords) return 5.0; // Under word count
  if (wordCount >= minWords && wordCount <= maxWords) return 6.5; // Good word count
  if (wordCount > maxWords * 1.2) return 6.0; // Too many words
  
  return 6.0; // Default
};

const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Response formatting utilities
const formatSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

const formatErrorResponse = (message, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return response;
};

// File utilities
const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

const isValidImageFile = (filename) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return validExtensions.includes(getFileExtension(filename));
};

const isValidAudioFile = (filename) => {
  const validExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
  return validExtensions.includes(getFileExtension(filename));
};

// Sanitization utilities
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

module.exports = {
  // Password utilities
  hashPassword,
  comparePassword,
  
  // JWT utilities
  generateToken,
  generateSessionToken,
  
  // Validation utilities
  validateEmail,
  validatePassword,
  validateName,
  
  // Date utilities
  getCurrentDate,
  getCurrentDateTime,
  getWeekStart,
  isCurrentWeek,
  
  // Test scoring utilities
  calculateIELTSBand,
  calculateOverallBand,
  
  // Writing assessment utilities
  estimateWritingBand,
  countWords,
  
  // Response formatting utilities
  formatSuccessResponse,
  formatErrorResponse,
  
  // File utilities
  getFileExtension,
  isValidImageFile,
  isValidAudioFile,
  
  // Sanitization utilities
  sanitizeInput,
  sanitizeHtml
};