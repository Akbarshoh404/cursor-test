const database = require('../config/database');
const {
  hashPassword,
  comparePassword,
  generateToken,
  generateSessionToken,
  validateEmail,
  validatePassword,
  validateName,
  getCurrentDateTime,
  formatSuccessResponse,
  formatErrorResponse
} = require('../utils/helpers');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json(
          formatErrorResponse('Name, email, and password are required')
        );
      }

      if (!validateName(name)) {
        return res.status(400).json(
          formatErrorResponse('Name must be between 2 and 50 characters')
        );
      }

      if (!validateEmail(email)) {
        return res.status(400).json(
          formatErrorResponse('Please provide a valid email address')
        );
      }

      if (!validatePassword(password)) {
        return res.status(400).json(
          formatErrorResponse('Password must be at least 8 characters with uppercase, lowercase, and number')
        );
      }

      // Check if user already exists
      const existingUser = await database.get(
        'SELECT id FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (existingUser) {
        return res.status(409).json(
          formatErrorResponse('User already exists with this email')
        );
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const result = await database.run(
        `INSERT INTO users (name, email, password_hash) 
         VALUES (?, ?, ?)`,
        [name.trim(), email.toLowerCase(), passwordHash]
      );

      // Generate token and session
      const token = generateToken(result.id);
      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await database.run(
        `INSERT INTO user_sessions (user_id, token_hash, expires_at) 
         VALUES (?, ?, ?)`,
        [result.id, sessionToken, expiresAt.toISOString()]
      );

      // Get user data (without password)
      const user = await database.get(
        `SELECT id, name, email, created_at, subscription_type, tests_this_week, last_test_date 
         FROM users WHERE id = ?`,
        [result.id]
      );

      res.status(201).json(
        formatSuccessResponse({
          user,
          token
        }, 'User registered successfully')
      );

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json(
        formatErrorResponse('Registration failed')
      );
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json(
          formatErrorResponse('Email and password are required')
        );
      }

      // Find user
      const user = await database.get(
        'SELECT id, name, email, password_hash, is_active FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (!user || !user.is_active) {
        return res.status(401).json(
          formatErrorResponse('Invalid email or password')
        );
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json(
          formatErrorResponse('Invalid email or password')
        );
      }

      // Update last login
      await database.run(
        'UPDATE users SET last_login = ? WHERE id = ?',
        [getCurrentDateTime(), user.id]
      );

      // Generate token and session
      const token = generateToken(user.id);
      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      // Deactivate old sessions
      await database.run(
        'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?',
        [user.id]
      );

      // Create new session
      await database.run(
        `INSERT INTO user_sessions (user_id, token_hash, expires_at) 
         VALUES (?, ?, ?)`,
        [user.id, sessionToken, expiresAt.toISOString()]
      );

      // Get updated user data (without password)
      const userData = await database.get(
        `SELECT id, name, email, created_at, last_login, subscription_type, 
                tests_this_week, last_test_date 
         FROM users WHERE id = ?`,
        [user.id]
      );

      res.json(
        formatSuccessResponse({
          user: userData,
          token
        }, 'Login successful')
      );

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(
        formatErrorResponse('Login failed')
      );
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      const userId = req.user.id;

      // Deactivate all user sessions
      await database.run(
        'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?',
        [userId]
      );

      res.json(
        formatSuccessResponse(null, 'Logout successful')
      );

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json(
        formatErrorResponse('Logout failed')
      );
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await database.get(
        `SELECT id, name, email, created_at, last_login, subscription_type, 
                tests_this_week, last_test_date 
         FROM users WHERE id = ?`,
        [userId]
      );

      if (!user) {
        return res.status(404).json(
          formatErrorResponse('User not found')
        );
      }

      // Get user statistics
      const writingCount = await database.get(
        'SELECT COUNT(*) as count FROM writing_submissions WHERE user_id = ?',
        [userId]
      );

      const testCount = await database.get(
        'SELECT COUNT(*) as count FROM user_test_attempts WHERE user_id = ? AND status = "completed"',
        [userId]
      );

      const lastWriting = await database.get(
        'SELECT estimated_band FROM writing_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1',
        [userId]
      );

      const userData = {
        ...user,
        stats: {
          writingSubmissions: writingCount.count,
          completedTests: testCount.count,
          lastWritingBand: lastWriting ? lastWriting.estimated_band : null
        }
      };

      res.json(
        formatSuccessResponse(userData, 'Profile retrieved successfully')
      );

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve profile')
      );
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      // Validation
      if (!name) {
        return res.status(400).json(
          formatErrorResponse('Name is required')
        );
      }

      if (!validateName(name)) {
        return res.status(400).json(
          formatErrorResponse('Name must be between 2 and 50 characters')
        );
      }

      // Update user
      await database.run(
        'UPDATE users SET name = ? WHERE id = ?',
        [name.trim(), userId]
      );

      // Get updated user data
      const user = await database.get(
        `SELECT id, name, email, created_at, last_login, subscription_type, 
                tests_this_week, last_test_date 
         FROM users WHERE id = ?`,
        [userId]
      );

      res.json(
        formatSuccessResponse(user, 'Profile updated successfully')
      );

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to update profile')
      );
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json(
          formatErrorResponse('Current password and new password are required')
        );
      }

      if (!validatePassword(newPassword)) {
        return res.status(400).json(
          formatErrorResponse('New password must be at least 8 characters with uppercase, lowercase, and number')
        );
      }

      // Get current password hash
      const user = await database.get(
        'SELECT password_hash FROM users WHERE id = ?',
        [userId]
      );

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json(
          formatErrorResponse('Current password is incorrect')
        );
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      await database.run(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [newPasswordHash, userId]
      );

      // Deactivate all sessions (force re-login)
      await database.run(
        'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?',
        [userId]
      );

      res.json(
        formatSuccessResponse(null, 'Password changed successfully. Please login again.')
      );

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to change password')
      );
    }
  },

  // Verify token (for frontend auth checks)
  verifyToken: async (req, res) => {
    try {
      // If we reach here, the token is valid (middleware passed)
      res.json(
        formatSuccessResponse({
          user: req.user,
          valid: true
        }, 'Token is valid')
      );
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json(
        formatErrorResponse('Token verification failed')
      );
    }
  }
};

module.exports = authController;