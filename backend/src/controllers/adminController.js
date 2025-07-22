const database = require('../config/database');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await database.get('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const activeUsers = await database.get('SELECT COUNT(*) as count FROM users WHERE role = "user" AND last_login > date("now", "-30 days")');
    const newUsersThisMonth = await database.get('SELECT COUNT(*) as count FROM users WHERE role = "user" AND created_at > date("now", "-30 days")');
    
    // Get test statistics
    const totalTests = await database.get('SELECT COUNT(*) as count FROM tests WHERE is_active = 1');
    const cambridgeTests = await database.get('SELECT COUNT(*) as count FROM tests WHERE is_official = 1');
    const premiumTests = await database.get('SELECT COUNT(*) as count FROM tests WHERE is_premium = 1');
    
    // Get test attempts statistics
    const totalAttempts = await database.get('SELECT COUNT(*) as count FROM user_test_attempts');
    const attemptsThisMonth = await database.get('SELECT COUNT(*) as count FROM user_test_attempts WHERE created_at > date("now", "-30 days")');
    
    // Get writing submissions statistics
    const totalWritingSubmissions = await database.get('SELECT COUNT(*) as count FROM writing_submissions');
    const writingSubmissionsThisMonth = await database.get('SELECT COUNT(*) as count FROM writing_submissions WHERE submitted_at > date("now", "-30 days")');
    
    // Get average scores
    const avgScores = await database.get(`
      SELECT 
        AVG(listening_score) as avg_listening,
        AVG(reading_score) as avg_reading,
        AVG(writing_score) as avg_writing,
        AVG(overall_score) as avg_overall
      FROM user_test_attempts 
      WHERE status = 'completed'
    `);
    
    // Get recent user registrations (last 7 days)
    const recentRegistrations = await database.all(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users 
      WHERE role = 'user' AND created_at > date('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    // Get test completion trends (last 30 days)
    const testTrends = await database.all(`
      SELECT DATE(completed_at) as date, COUNT(*) as count
      FROM user_test_attempts 
      WHERE completed_at > date('now', '-30 days') AND status = 'completed'
      GROUP BY DATE(completed_at)
      ORDER BY date DESC
    `);

    const stats = {
      users: {
        total: totalUsers.count,
        active: activeUsers.count,
        newThisMonth: newUsersThisMonth.count,
        registrationTrend: recentRegistrations
      },
      tests: {
        total: totalTests.count,
        cambridge: cambridgeTests.count,
        premium: premiumTests.count,
        attempts: totalAttempts.count,
        attemptsThisMonth: attemptsThisMonth.count,
        completionTrend: testTrends
      },
      writing: {
        totalSubmissions: totalWritingSubmissions.count,
        submissionsThisMonth: writingSubmissionsThisMonth.count
      },
      performance: {
        averageScores: {
          listening: avgScores.avg_listening ? parseFloat(avgScores.avg_listening.toFixed(1)) : 0,
          reading: avgScores.avg_reading ? parseFloat(avgScores.avg_reading.toFixed(1)) : 0,
          writing: avgScores.avg_writing ? parseFloat(avgScores.avg_writing.toFixed(1)) : 0,
          overall: avgScores.avg_overall ? parseFloat(avgScores.avg_overall.toFixed(1)) : 0
        }
      }
    };

    res.json(formatSuccessResponse(stats, 'Dashboard statistics retrieved successfully'));
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve dashboard statistics'));
  }
};

// Get all users with pagination and filtering
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '', sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    const validSortColumns = ['id', 'name', 'email', 'created_at', 'last_login', 'tests_this_week'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const users = await database.all(`
      SELECT 
        id, name, email, role, subscription_type, tests_this_week, 
        last_test_date, created_at, last_login, is_active
      FROM users 
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const totalCount = await database.get(`
      SELECT COUNT(*) as count FROM users ${whereClause}
    `, params);

    res.json(formatSuccessResponse({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount.count / limit),
        totalItems: totalCount.count,
        itemsPerPage: parseInt(limit)
      }
    }, 'Users retrieved successfully'));
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve users'));
  }
};

// Get user details with test history
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await database.get(`
      SELECT id, name, email, role, subscription_type, tests_this_week, 
             last_test_date, created_at, last_login, is_active, settings, preferences
      FROM users WHERE id = ?
    `, [userId]);

    if (!user) {
      return res.status(404).json(formatErrorResponse('User not found'));
    }

    // Get user's test attempts
    const testAttempts = await database.all(`
      SELECT 
        uta.id, uta.test_id, uta.started_at, uta.completed_at,
        uta.listening_score, uta.reading_score, uta.writing_score, uta.overall_score,
        uta.status, t.title as test_title
      FROM user_test_attempts uta
      JOIN tests t ON uta.test_id = t.id
      WHERE uta.user_id = ?
      ORDER BY uta.created_at DESC
      LIMIT 20
    `, [userId]);

    // Get user's writing submissions
    const writingSubmissions = await database.all(`
      SELECT id, task_type, word_count, estimated_band, submitted_at
      FROM writing_submissions
      WHERE user_id = ?
      ORDER BY submitted_at DESC
      LIMIT 10
    `, [userId]);

    // Calculate user statistics
    const userStats = {
      totalTests: testAttempts.length,
      completedTests: testAttempts.filter(t => t.status === 'completed').length,
      averageScore: testAttempts.length > 0 
        ? testAttempts
            .filter(t => t.overall_score)
            .reduce((sum, t) => sum + t.overall_score, 0) / testAttempts.filter(t => t.overall_score).length
        : 0,
      totalWritingSubmissions: writingSubmissions.length,
      averageWritingBand: writingSubmissions.length > 0
        ? writingSubmissions.reduce((sum, w) => sum + w.estimated_band, 0) / writingSubmissions.length
        : 0
    };

    res.json(formatSuccessResponse({
      user: {
        ...user,
        settings: user.settings ? JSON.parse(user.settings) : {},
        preferences: user.preferences ? JSON.parse(user.preferences) : {}
      },
      testAttempts,
      writingSubmissions,
      stats: userStats
    }, 'User details retrieved successfully'));
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve user details'));
  }
};

// Update user status (activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    await database.run(`
      UPDATE users SET is_active = ? WHERE id = ?
    `, [isActive ? 1 : 0, userId]);

    res.json(formatSuccessResponse({}, `User ${isActive ? 'activated' : 'deactivated'} successfully`));
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json(formatErrorResponse('Failed to update user status'));
  }
};

// Get all tests with filtering
const getTests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      type = '', 
      difficulty = '',
      isPremium = '',
      isOfficial = '',
      sortBy = 'created_at', 
      sortOrder = 'DESC' 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE is_active = 1';
    const params = [];

    if (search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ? OR series LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    if (difficulty) {
      whereClause += ' AND difficulty = ?';
      params.push(difficulty);
    }

    if (isPremium !== '') {
      whereClause += ' AND is_premium = ?';
      params.push(isPremium === 'true' ? 1 : 0);
    }

    if (isOfficial !== '') {
      whereClause += ' AND is_official = ?';
      params.push(isOfficial === 'true' ? 1 : 0);
    }

    const validSortColumns = ['id', 'title', 'type', 'difficulty', 'duration', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const tests = await database.all(`
      SELECT 
        id, title, description, type, difficulty, duration,
        is_premium, is_official, series, test_number, book_number,
        created_at,
        (SELECT COUNT(*) FROM user_test_attempts WHERE test_id = tests.id) as attempt_count
      FROM tests 
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const totalCount = await database.get(`
      SELECT COUNT(*) as count FROM tests ${whereClause}
    `, params);

    res.json(formatSuccessResponse({
      tests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount.count / limit),
        totalItems: totalCount.count,
        itemsPerPage: parseInt(limit)
      }
    }, 'Tests retrieved successfully'));
  } catch (error) {
    console.error('Error getting tests:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve tests'));
  }
};

// Get test details with questions and attempts
const getTestDetails = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await database.get(`
      SELECT * FROM tests WHERE id = ? AND is_active = 1
    `, [testId]);

    if (!test) {
      return res.status(404).json(formatErrorResponse('Test not found'));
    }

    // Get questions for this test
    const questions = await database.all(`
      SELECT id, section, question_type, question_text, options, correct_answer, explanation, order_index
      FROM questions 
      WHERE test_id = ?
      ORDER BY section, order_index
    `, [testId]);

    // Get recent attempts for this test
    const recentAttempts = await database.all(`
      SELECT 
        uta.id, uta.user_id, uta.started_at, uta.completed_at,
        uta.listening_score, uta.reading_score, uta.writing_score, uta.overall_score,
        uta.status, u.name as user_name, u.email as user_email
      FROM user_test_attempts uta
      JOIN users u ON uta.user_id = u.id
      WHERE uta.test_id = ?
      ORDER BY uta.created_at DESC
      LIMIT 10
    `, [testId]);

    // Get test statistics
    const stats = await database.get(`
      SELECT 
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_attempts,
        AVG(CASE WHEN status = 'completed' THEN overall_score END) as avg_score,
        MAX(overall_score) as highest_score,
        MIN(overall_score) as lowest_score
      FROM user_test_attempts 
      WHERE test_id = ?
    `, [testId]);

    res.json(formatSuccessResponse({
      test: {
        ...test,
        sections: test.sections ? JSON.parse(test.sections) : null,
        tags: test.tags ? JSON.parse(test.tags) : []
      },
      questions: questions.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null,
        correct_answer: q.correct_answer ? JSON.parse(q.correct_answer) : null
      })),
      recentAttempts,
      stats
    }, 'Test details retrieved successfully'));
  } catch (error) {
    console.error('Error getting test details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve test details'));
  }
};

// Toggle test premium status
const toggleTestPremiumStatus = async (req, res) => {
  try {
    const { testId } = req.params;
    const { isPremium } = req.body;

    await database.run(`
      UPDATE tests SET is_premium = ? WHERE id = ?
    `, [isPremium ? 1 : 0, testId]);

    res.json(formatSuccessResponse({}, `Test ${isPremium ? 'marked as premium' : 'marked as free'} successfully`));
  } catch (error) {
    console.error('Error updating test premium status:', error);
    res.status(500).json(formatErrorResponse('Failed to update test premium status'));
  }
};

// Get system logs (placeholder for future implementation)
const getSystemLogs = async (req, res) => {
  try {
    // This would typically read from log files or a logging database
    const mockLogs = [
      {
        id: 1,
        level: 'info',
        message: 'User login successful',
        timestamp: new Date().toISOString(),
        userId: 2,
        ip: '127.0.0.1'
      },
      {
        id: 2,
        level: 'error',
        message: 'Failed to process payment',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: null,
        ip: '192.168.1.100'
      }
    ];

    res.json(formatSuccessResponse({ logs: mockLogs }, 'System logs retrieved successfully'));
  } catch (error) {
    console.error('Error getting system logs:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve system logs'));
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getTests,
  getTestDetails,
  toggleTestPremiumStatus,
  getSystemLogs
};