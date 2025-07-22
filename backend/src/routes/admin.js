const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const {
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getTests,
  getTestDetails,
  toggleTestPremiumStatus,
  getSystemLogs
} = require('../controllers/adminController');

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Apply authentication and admin check to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId/status', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  validateRequest
], updateUserStatus);

// Test management routes
router.get('/tests', getTests);
router.get('/tests/:testId', getTestDetails);
router.put('/tests/:testId/premium', [
  body('isPremium').isBoolean().withMessage('isPremium must be a boolean'),
  validateRequest
], toggleTestPremiumStatus);

// System logs
router.get('/logs', getSystemLogs);

module.exports = router;