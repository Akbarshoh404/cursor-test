const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || './database/prepx.db';
const dbDir = path.dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeTables()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  async initializeTables() {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        subscription_type VARCHAR(20) DEFAULT 'free',
        tests_this_week INTEGER DEFAULT 0,
        last_test_date DATE,
        is_active BOOLEAN DEFAULT 1
      )`,

      // Tests table
      `CREATE TABLE IF NOT EXISTS tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        difficulty VARCHAR(20) DEFAULT 'intermediate',
        duration_minutes INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )`,

      // User test attempts table
      `CREATE TABLE IF NOT EXISTS user_test_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        test_id INTEGER NOT NULL,
        started_at DATETIME NOT NULL,
        completed_at DATETIME,
        listening_score DECIMAL(3,1),
        reading_score DECIMAL(3,1),
        writing_score DECIMAL(3,1),
        overall_score DECIMAL(3,1),
        status VARCHAR(20) DEFAULT 'in_progress',
        answers TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (test_id) REFERENCES tests(id)
      )`,

      // Writing submissions table
      `CREATE TABLE IF NOT EXISTS writing_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_type VARCHAR(10) NOT NULL,
        prompt_id INTEGER,
        prompt_text TEXT,
        answer_text TEXT NOT NULL,
        word_count INTEGER NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        estimated_band DECIMAL(2,1),
        feedback TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,

      // Questions table
      `CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id INTEGER NOT NULL,
        section VARCHAR(20) NOT NULL,
        question_type VARCHAR(50) NOT NULL,
        question_text TEXT NOT NULL,
        correct_answer TEXT,
        options TEXT,
        points INTEGER DEFAULT 1,
        order_index INTEGER NOT NULL,
        audio_file VARCHAR(255),
        image_file VARCHAR(255),
        FOREIGN KEY (test_id) REFERENCES tests(id)
      )`,

      // Learning resources table
      `CREATE TABLE IF NOT EXISTS learning_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )`,

      // User sessions table (for token management)
      `CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    // Insert default data
    await this.insertDefaultData();
  }

  async insertDefaultData() {
    // Insert default test
    const testExists = await this.get('SELECT id FROM tests WHERE id = 1');
    if (!testExists) {
      await this.run(`
        INSERT INTO tests (id, title, type, duration_minutes) 
        VALUES (1, 'IELTS Academic Practice Test 1', 'full', 180)
      `);
    }

    // Insert sample questions for listening section
    const listeningQuestions = await this.get('SELECT id FROM questions WHERE test_id = 1 AND section = "listening" LIMIT 1');
    if (!listeningQuestions) {
      const sampleQuestions = [
        {
          test_id: 1,
          section: 'listening',
          question_type: 'multiple-choice',
          question_text: 'What is the main topic of the conversation?',
          correct_answer: '2',
          options: JSON.stringify(['Travel plans', 'Work schedule', 'Study abroad', 'Housing options']),
          order_index: 1
        },
        {
          test_id: 1,
          section: 'listening',
          question_type: 'multiple-choice',
          question_text: 'When is the deadline for the application?',
          correct_answer: '1',
          options: JSON.stringify(['Next Friday', 'Next Monday', 'Next Wednesday', 'Next Thursday']),
          order_index: 2
        }
      ];

      for (const question of sampleQuestions) {
        await this.run(`
          INSERT INTO questions (test_id, section, question_type, question_text, correct_answer, options, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [question.test_id, question.section, question.question_type, question.question_text, question.correct_answer, question.options, question.order_index]);
      }
    }

    // Insert sample reading questions
    const readingQuestions = await this.get('SELECT id FROM questions WHERE test_id = 1 AND section = "reading" LIMIT 1');
    if (!readingQuestions) {
      const sampleReadingQuestions = [
        {
          test_id: 1,
          section: 'reading',
          question_type: 'multiple-choice',
          question_text: 'According to the passage, what has happened to solar panel costs over the past decade?',
          correct_answer: '1',
          options: JSON.stringify(['They have increased', 'They have decreased', 'They have remained stable', 'The passage doesn\'t mention costs']),
          order_index: 1
        },
        {
          test_id: 1,
          section: 'reading',
          question_type: 'true-false-not-given',
          question_text: 'Government policies have had no impact on renewable energy development.',
          correct_answer: 'False',
          options: null,
          order_index: 2
        },
        {
          test_id: 1,
          section: 'reading',
          question_type: 'completion',
          question_text: 'Energy _______ continues to be a significant challenge for renewable energy.',
          correct_answer: 'storage',
          options: null,
          order_index: 3
        }
      ];

      for (const question of sampleReadingQuestions) {
        await this.run(`
          INSERT INTO questions (test_id, section, question_type, question_text, correct_answer, options, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [question.test_id, question.section, question.question_type, question.question_text, question.correct_answer, question.options, question.order_index]);
      }
    }

    // Insert learning resources
    const resourceExists = await this.get('SELECT id FROM learning_resources WHERE id = 1');
    if (!resourceExists) {
      const resources = [
        {
          title: 'Listening Tips',
          type: 'tips',
          category: 'listening',
          content: JSON.stringify([
            'Practice listening to different English accents',
            'Take notes while listening - write key words and numbers',
            'Don\'t spend too much time on one question',
            'Use the preparation time to read questions carefully',
            'Pay attention to signpost words like \'however\', \'moreover\', \'finally\''
          ])
        },
        {
          title: 'Reading Strategies',
          type: 'tips',
          category: 'reading',
          content: JSON.stringify([
            'Skim read the passage first to get the general idea',
            'Look for keywords in questions and scan for them in the text',
            'Don\'t try to understand every word',
            'Manage your time - spend about 20 minutes per passage',
            'Read the questions before reading the passage in detail'
          ])
        },
        {
          title: 'Writing Guidelines',
          type: 'tips',
          category: 'writing',
          content: JSON.stringify([
            'Plan your essay before you start writing',
            'Use a variety of sentence structures',
            'Check your grammar and spelling',
            'Make sure you answer all parts of the question',
            'Practice writing within time limits'
          ])
        }
      ];

      for (const resource of resources) {
        await this.run(`
          INSERT INTO learning_resources (title, type, category, content)
          VALUES (?, ?, ?, ?)
        `, [resource.title, resource.type, resource.category, resource.content]);
      }
    }
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();