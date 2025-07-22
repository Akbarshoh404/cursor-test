const jwt = require('jsonwebtoken');
const database = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await database.get(
      'SELECT id, email, name, subscription_type, tests_this_week, last_test_date FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // Check if session is still valid (optional - for enhanced security)
    const session = await database.get(
      'SELECT id FROM user_sessions WHERE user_id = ? AND is_active = 1 AND expires_at > datetime("now")',
      [user.id]
    );

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expired - please login again'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired - please login again'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else {
      console.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await database.get(
      'SELECT id, email, name, subscription_type FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const requireSubscription = (requiredType = 'premium') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.subscription_type !== requiredType) {
      return res.status(403).json({
        success: false,
        message: `${requiredType} subscription required`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireSubscription
};