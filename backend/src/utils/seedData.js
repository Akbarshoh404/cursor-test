const database = require('../config/database');
const { hashPassword } = require('./helpers');

const seedDemoUser = async () => {
  try {
    // Check if demo user already exists
    const existingUser = await database.get(
      'SELECT id FROM users WHERE email = ?',
      ['john.doe@example.com']
    );

    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Create demo user with hashed password
    const passwordHash = await hashPassword('password123');
    
    const result = await database.run(
      `INSERT INTO users (name, email, password_hash, created_at, last_login, tests_this_week, last_test_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'John Doe',
        'john.doe@example.com',
        passwordHash,
        '2024-01-15 10:00:00',
        '2024-01-20 14:30:00',
        1,
        '2024-01-20'
      ]
    );

    console.log('Demo user created with ID:', result.id);

    // Add some demo writing submissions
    await database.run(
      `INSERT INTO writing_submissions (user_id, task_type, prompt_text, answer_text, word_count, estimated_band, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        result.id,
        'task1',
        'The chart shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.',
        'The chart illustrates the proportion of households that owned and rented accommodation in England and Wales from 1918 to 2011. Overall, there was a significant increase in home ownership over this period, while rented accommodation decreased correspondingly. In 1918, approximately 23% of households owned their homes, while 77% rented. This pattern completely reversed by 2011, when about 69% owned and 31% rented. The most dramatic change occurred between 1953 and 1971, when ownership rose from 31% to 50%.',
        165,
        6.5,
        '2024-01-18 16:45:00'
      ]
    );

    // Add demo test attempt
    await database.run(
      `INSERT INTO user_test_attempts (user_id, test_id, started_at, completed_at, listening_score, reading_score, writing_score, overall_score, status, answers)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        result.id,
        1,
        '2024-01-20 10:00:00',
        '2024-01-20 13:00:00',
        7.0,
        6.5,
        6.0,
        6.5,
        'completed',
        JSON.stringify({
          listening: [2, 1, 0, 3],
          reading: ['storage', 'False', 'decreased'],
          writing: {
            task1: 'The chart shows the percentage of households...',
            task2: 'In my opinion, it is better to try to improve difficult situations...'
          }
        })
      ]
    );

    console.log('Demo data seeded successfully');

  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};

const seedDatabase = async () => {
  try {
    await database.connect();
    await seedDemoUser();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDemoUser,
  seedDatabase
};