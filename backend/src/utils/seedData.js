const database = require('../config/database');
const { hashPassword } = require('./helpers');
const {
  generateCambridgeTests,
  premiumExtraTests,
  sampleQuestions,
  writingPrompts,
  adminUser,
  learningResources,
  studyPlans
} = require('./comprehensiveData');

const seedAdminUser = async () => {
  try {
    console.log('🔑 Seeding admin user...');
    
    // Check if admin already exists
    const existingAdmin = await database.get(
      'SELECT id FROM users WHERE email = ?',
      [adminUser.email]
    );

    if (existingAdmin) {
      console.log('Admin user already exists');
      return existingAdmin.id;
    }
    
    const hashedPassword = await hashPassword(adminUser.password);
    
    const result = await database.run(`
      INSERT INTO users (name, email, password_hash, role, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      adminUser.name,
      adminUser.email,
      hashedPassword,
      adminUser.role,
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    
    console.log(`✅ Admin user created with ID: ${result.id}`);
    return result.id;
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }
};

const seedCambridgeTests = async () => {
  try {
    console.log('📚 Seeding Cambridge IELTS tests...');
    
    const cambridgeTests = generateCambridgeTests();
    let addedCount = 0;
    
    for (const test of cambridgeTests) {
      // Check if test already exists
      const existingTest = await database.get(
        'SELECT id FROM tests WHERE id = ?',
        [test.id]
      );

      if (!existingTest) {
        await database.run(`
          INSERT INTO tests (
            id, title, description, type, difficulty, duration,
            is_premium, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          test.id,
          test.title,
          test.description,
          test.type,
          test.difficulty,
          test.duration,
          test.isPremium ? 1 : 0,
          new Date().toISOString()
        ]);
        addedCount++;
      }
    }
    
    console.log(`✅ ${addedCount} Cambridge tests added`);
  } catch (error) {
    console.error('❌ Error seeding Cambridge tests:', error);
    throw error;
  }
};

const seedPremiumTests = async () => {
  try {
    console.log('⭐ Seeding premium extra tests...');
    
    let addedCount = 0;
    
    for (const test of premiumExtraTests) {
      const existingTest = await database.get(
        'SELECT id FROM tests WHERE id = ?',
        [test.id]
      );

      if (!existingTest) {
        await database.run(`
          INSERT INTO tests (
            id, title, description, type, difficulty, duration,
            is_premium, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          test.id,
          test.title,
          test.description,
          test.type,
          test.difficulty,
          test.duration,
          test.isPremium ? 1 : 0,
          new Date().toISOString()
        ]);
        addedCount++;
      }
    }
    
    console.log(`✅ ${addedCount} premium tests added`);
  } catch (error) {
    console.error('❌ Error seeding premium tests:', error);
    throw error;
  }
};

const seedQuestions = async () => {
  try {
    console.log('❓ Seeding sample questions...');
    
    let questionId = 1;
    let addedCount = 0;
    
    // Seed listening questions for test 1
    for (const question of sampleQuestions.listening) {
      const existingQuestion = await database.get(
        'SELECT id FROM questions WHERE id = ?',
        [questionId]
      );

      if (!existingQuestion) {
        await database.run(`
          INSERT INTO questions (
            id, test_id, section, question_type, question_text, options,
            correct_answer, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          questionId,
          1, // Cambridge IELTS 1 - Test 1
          question.section,
          question.type,
          question.question,
          JSON.stringify(question.options || question.fields || []),
          JSON.stringify(question.correctAnswer || 0),
          new Date().toISOString()
        ]);
        addedCount++;
      }
      questionId++;
    }
    
    // Seed reading questions for test 1
    for (const question of sampleQuestions.reading) {
      const existingQuestion = await database.get(
        'SELECT id FROM questions WHERE id = ?',
        [questionId]
      );

      if (!existingQuestion) {
        await database.run(`
          INSERT INTO questions (
            id, test_id, section, question_type, question_text, options,
            correct_answer, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          questionId,
          1, // Cambridge IELTS 1 - Test 1
          question.section,
          question.type,
          question.question || 'Reading comprehension question',
          JSON.stringify(question.options || question.statements || []),
          JSON.stringify(question.correctAnswer || 0),
          new Date().toISOString()
        ]);
        addedCount++;
      }
      questionId++;
    }
    
    console.log(`✅ ${addedCount} sample questions added`);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    throw error;
  }
};

const seedLearningResources = async () => {
  try {
    console.log('📖 Seeding learning resources...');
    
    let addedCount = 0;
    
    // Seed tips
    for (const tip of learningResources.tips) {
      const existingResource = await database.get(
        'SELECT id FROM learning_resources WHERE id = ?',
        [`tip_${tip.id}`]
      );

      if (!existingResource) {
        await database.run(`
          INSERT INTO learning_resources (
            id, type, category, title, content, difficulty, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          `tip_${tip.id}`,
          'tip',
          tip.category,
          tip.title,
          tip.content,
          tip.difficulty,
          new Date().toISOString()
        ]);
        addedCount++;
      }
    }
    
    // Seed vocabulary
    for (const vocab of learningResources.vocabulary) {
      const existingResource = await database.get(
        'SELECT id FROM learning_resources WHERE id = ?',
        [`vocab_${vocab.id}`]
      );

      if (!existingResource) {
        await database.run(`
          INSERT INTO learning_resources (
            id, type, category, title, content, difficulty, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          `vocab_${vocab.id}`,
          'vocabulary',
          vocab.category,
          `${vocab.topic} Vocabulary`,
          JSON.stringify(vocab.words),
          'intermediate',
          new Date().toISOString()
        ]);
        addedCount++;
      }
    }
    
    // Seed grammar
    for (const grammar of learningResources.grammar) {
      const existingResource = await database.get(
        'SELECT id FROM learning_resources WHERE id = ?',
        [`grammar_${grammar.id}`]
      );

      if (!existingResource) {
        await database.run(`
          INSERT INTO learning_resources (
            id, type, category, title, content, difficulty, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          `grammar_${grammar.id}`,
          'grammar',
          'general',
          grammar.topic,
          JSON.stringify({
            content: grammar.content,
            examples: grammar.examples,
            exercises: grammar.exercises
          }),
          grammar.level,
          new Date().toISOString()
        ]);
        addedCount++;
      }
    }
    
    // Seed writing prompts
    const allPrompts = [
      ...writingPrompts.task1.academic,
      ...writingPrompts.task1.general,
      ...writingPrompts.task2.academic,
      ...writingPrompts.task2.general
    ];
    
    for (const prompt of allPrompts) {
      const existingResource = await database.get(
        'SELECT id FROM learning_resources WHERE id = ?',
        [`writing_prompt_${prompt.id}`]
      );

      if (!existingResource) {
        await database.run(`
          INSERT INTO learning_resources (
            id, type, category, title, content, difficulty, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          `writing_prompt_${prompt.id}`,
          'writing_prompt',
          prompt.type,
          `Writing ${prompt.id < 200 ? 'Task 1' : 'Task 2'} - ${prompt.type}`,
          JSON.stringify({
            prompt: prompt.prompt,
            wordLimit: prompt.wordLimit,
            timeLimit: prompt.timeLimit,
            requirements: prompt.requirements,
            keywords: prompt.keywords,
            imageUrl: prompt.imageUrl
          }),
          'intermediate',
          new Date().toISOString()
        ]);
        addedCount++;
      }
    }
    
    console.log(`✅ ${addedCount} learning resources added`);
  } catch (error) {
    console.error('❌ Error seeding learning resources:', error);
    throw error;
  }
};

const seedDemoUser = async () => {
  try {
    console.log('👤 Seeding demo user...');
    
    // Check if demo user already exists
    const existingUser = await database.get(
      'SELECT id FROM users WHERE email = ?',
      ['john.doe@example.com']
    );

    if (existingUser) {
      console.log('Demo user already exists');
      return existingUser.id;
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

    console.log(`✅ Demo user created with ID: ${result.id}`);

    // Add some demo writing submissions
    const writingSubmissions = [
      {
        task_type: 'task1',
        prompt: 'The chart shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.',
        answer: 'The chart illustrates the proportion of households that owned and rented accommodation in England and Wales from 1918 to 2011. Overall, there was a significant increase in home ownership over this period, while rented accommodation decreased correspondingly. In 1918, approximately 23% of households owned their homes, while 77% rented. This pattern completely reversed by 2011, when about 69% owned and 31% rented. The most dramatic change occurred between 1953 and 1971, when ownership rose from 31% to 50%.',
        word_count: 165,
        estimated_band: 6.5
      },
      {
        task_type: 'task2',
        prompt: 'Some people think that university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future. Discuss both views and give your opinion.',
        answer: 'Education is one of the most debated topics in modern society. While some argue that students should have complete freedom to choose their subjects, others contend that practical considerations should guide academic choices. Both perspectives have merit and deserve careful consideration. Those who support academic freedom argue that passion and personal interest are crucial for learning success...',
        word_count: 289,
        estimated_band: 7.0
      }
    ];
    
    for (const submission of writingSubmissions) {
      await database.run(
        `INSERT INTO writing_submissions (user_id, task_type, prompt_text, answer_text, word_count, estimated_band, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          result.id,
          submission.task_type,
          submission.prompt,
          submission.answer,
          submission.word_count,
          submission.estimated_band,
          new Date().toISOString()
        ]
      );
    }

    // Add demo test attempts
    const testAttempts = [
      {
        test_id: 1,
        listening_score: 7.0,
        reading_score: 6.5,
        writing_score: 6.5,
        overall_score: 6.75,
        completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        test_id: 2,
        listening_score: 7.5,
        reading_score: 7.0,
        writing_score: 7.0,
        overall_score: 7.25,
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const attempt of testAttempts) {
      await database.run(
        `INSERT INTO user_test_attempts (user_id, test_id, started_at, completed_at, listening_score, reading_score, writing_score, overall_score, status, answers)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          result.id,
          attempt.test_id,
          attempt.completed_at,
          attempt.completed_at,
          attempt.listening_score,
          attempt.reading_score,
          attempt.writing_score,
          attempt.overall_score,
          'completed',
          JSON.stringify({
            listening: [2, 1, 0, 3],
            reading: ['storage', 'False', 'decreased'],
            writing: {
              task1: 'Sample task 1 answer...',
              task2: 'Sample task 2 answer...'
            }
          })
        ]
      );
    }

    console.log('✅ Demo user data seeded successfully');
    return result.id;

  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    await database.connect();
    
    // Seed in order of dependencies
    await seedAdminUser();
    await seedCambridgeTests();
    await seedPremiumTests();
    await seedQuestions();
    await seedLearningResources();
    await seedDemoUser();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📝 Login credentials:');
    console.log('👤 Demo User: john.doe@example.com / password123');
    console.log('🔑 Admin User: admin@prepx.com / admin123');
    console.log('');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedAdminUser,
  seedCambridgeTests,
  seedPremiumTests,
  seedQuestions,
  seedLearningResources,
  seedDemoUser,
  seedDatabase
};