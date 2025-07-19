// Mock Data for PrepX MVP

// User Data
export const mockUsers = [
  {
    id: 1,
    email: "john.doe@example.com",
    name: "John Doe",
    password: "password123", // In real app, this would be hashed
    joinDate: "2024-01-15",
    lastTestDate: "2024-01-20",
    testsThisWeek: 1,
    writingHistory: [
      {
        id: 1,
        taskType: "Task 1",
        prompt: "The chart shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.",
        answer: "The chart illustrates the proportion of households that owned and rented accommodation in England and Wales from 1918 to 2011...",
        wordCount: 165,
        completedAt: "2024-01-18",
        estimatedBand: 6.5
      }
    ]
  }
];

// Mock Test Data
export const mockTest = {
  id: 1,
  title: "IELTS Academic Practice Test 1",
  duration: 180, // 3 hours in minutes
  sections: {
    listening: {
      duration: 30,
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          question: "What is the main topic of the conversation?",
          options: ["Travel plans", "Work schedule", "Study abroad", "Housing options"],
          correctAnswer: 2,
          audio: "/audio/listening-1.mp3" // Mock audio file
        },
        // More listening questions...
      ]
    },
    reading: {
      duration: 60,
      passages: [
        {
          id: 1,
          title: "The Future of Renewable Energy",
          text: `Renewable energy sources have become increasingly important in the 21st century as concerns about climate change and energy security have grown. Solar power, wind energy, and hydroelectric systems are leading the way in providing sustainable alternatives to fossil fuels.

The development of renewable energy technologies has accelerated dramatically over the past decade. Solar panel efficiency has improved while costs have decreased, making solar power more accessible to both residential and commercial users. Wind energy has also seen significant advances, with larger and more efficient turbines being deployed both onshore and offshore.

Government policies have played a crucial role in promoting renewable energy adoption. Many countries have implemented feed-in tariffs, tax incentives, and renewable energy targets to encourage investment in clean energy technologies. These policies have created a favorable environment for renewable energy development and have helped drive down costs through economies of scale.

Despite these advances, challenges remain. Energy storage continues to be a significant hurdle, as renewable energy sources are often intermittent. Battery technology is improving, but large-scale energy storage solutions are still expensive and limited in capacity. Grid integration is another challenge, as existing electrical grids were designed for centralized fossil fuel power plants rather than distributed renewable energy sources.

The future of renewable energy looks promising, with continued technological improvements and falling costs expected to drive further adoption. Experts predict that renewable energy will account for the majority of global electricity generation within the next two decades, fundamentally transforming the energy sector and helping to address climate change concerns.`,
          questions: [
            {
              id: 1,
              type: "multiple-choice",
              question: "According to the passage, what has happened to solar panel costs over the past decade?",
              options: ["They have increased", "They have decreased", "They have remained stable", "The passage doesn't mention costs"],
              correctAnswer: 1
            },
            {
              id: 2,
              type: "true-false-not-given",
              question: "Government policies have had no impact on renewable energy development.",
              correctAnswer: "False"
            },
            {
              id: 3,
              type: "completion",
              question: "Energy _______ continues to be a significant challenge for renewable energy.",
              correctAnswer: "storage"
            }
          ]
        }
      ]
    },
    writing: {
      duration: 60,
      tasks: [
        {
          id: 1,
          type: "Task 1",
          prompt: "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
          chartImage: "/images/housing-chart.png", // Mock chart image
          minWords: 150,
          timeLimit: 20
        },
        {
          id: 2,
          type: "Task 2", 
          prompt: "Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.",
          minWords: 250,
          timeLimit: 40
        }
      ]
    }
  }
};

// Model Answers for Writing Tasks
export const modelAnswers = {
  task1: {
    band6: "The chart shows the percentage of households in owned and rented accommodation in England and Wales from 1918 to 2011. Overall, there was a significant increase in home ownership over this period, while rented accommodation decreased correspondingly...",
    band7: "The chart illustrates the proportion of households living in owned versus rented accommodation in England and Wales over a 93-year period from 1918 to 2011. The most striking feature is the dramatic reversal in housing tenure patterns during this timeframe...",
    band8: "The chart provides data on the percentage distribution of households between owned and rented accommodation in England and Wales across nearly a century, from 1918 to 2011. The data reveals a remarkable transformation in housing patterns, with ownership and rental trends showing an almost complete reversal...",
    band9: "The chart depicts the changing patterns of housing tenure in England and Wales between 1918 and 2011, specifically illustrating the percentage of households in owned versus rented accommodation. The data reveals a profound socioeconomic shift that fundamentally altered the housing landscape over this 93-year period..."
  },
  task2: {
    band6: "Some people think it is better to accept difficult situations like bad jobs or money problems. Other people believe we should try to improve these situations. I will discuss both views and give my opinion...",
    band7: "There is ongoing debate about whether individuals should accept challenging circumstances such as unsatisfactory employment or financial difficulties, or whether they should actively work to improve their situations. This essay will examine both perspectives before presenting my own viewpoint...",
    band8: "The question of how to respond to adverse circumstances, such as unfulfilling careers or financial constraints, has generated considerable debate. While some advocate for acceptance and adaptation, others champion proactive improvement efforts. This essay will analyze both approaches and argue for a balanced perspective...",
    band9: "The philosophical divide between acceptance and active improvement in the face of adversity represents a fundamental question about human agency and resilience. While stoic acceptance of unfavorable circumstances such as career dissatisfaction or economic hardship has its merits, I contend that a strategic approach to improvement, tempered by realistic assessment, offers the most constructive path forward..."
  }
};

// Learning Resources
export const learningResources = {
  tips: {
    listening: [
      "Practice listening to different English accents",
      "Take notes while listening - write key words and numbers",
      "Don't spend too much time on one question",
      "Use the preparation time to read questions carefully",
      "Pay attention to signpost words like 'however', 'moreover', 'finally'"
    ],
    reading: [
      "Skim read the passage first to get the general idea",
      "Look for keywords in questions and scan for them in the text",
      "Don't try to understand every word",
      "Manage your time - spend about 20 minutes per passage",
      "Read the questions before reading the passage in detail"
    ],
    writing: [
      "Plan your essay before you start writing",
      "Use a variety of sentence structures",
      "Check your grammar and spelling",
      "Make sure you answer all parts of the question",
      "Practice writing within time limits"
    ]
  },
  commonMistakes: [
    "Not reading instructions carefully",
    "Poor time management",
    "Not checking answers",
    "Using inappropriate register in writing",
    "Not practicing under exam conditions"
  ]
};

// Backend Schema Examples (for future implementation)
export const backendSchema = {
  users: {
    id: "INTEGER PRIMARY KEY",
    email: "VARCHAR(255) UNIQUE NOT NULL",
    password_hash: "VARCHAR(255) NOT NULL",
    name: "VARCHAR(100) NOT NULL",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    last_login: "TIMESTAMP",
    subscription_type: "ENUM('free', 'premium')",
    tests_this_week: "INTEGER DEFAULT 0",
    last_test_date: "DATE"
  },
  tests: {
    id: "INTEGER PRIMARY KEY",
    title: "VARCHAR(255) NOT NULL",
    type: "ENUM('full', 'listening', 'reading', 'writing')",
    difficulty: "ENUM('beginner', 'intermediate', 'advanced')",
    duration_minutes: "INTEGER NOT NULL",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    is_active: "BOOLEAN DEFAULT TRUE"
  },
  user_test_attempts: {
    id: "INTEGER PRIMARY KEY",
    user_id: "INTEGER FOREIGN KEY REFERENCES users(id)",
    test_id: "INTEGER FOREIGN KEY REFERENCES tests(id)",
    started_at: "TIMESTAMP NOT NULL",
    completed_at: "TIMESTAMP",
    total_score: "DECIMAL(3,1)",
    listening_score: "DECIMAL(3,1)",
    reading_score: "DECIMAL(3,1)",
    writing_score: "DECIMAL(3,1)",
    status: "ENUM('in_progress', 'completed', 'abandoned')"
  },
  writing_submissions: {
    id: "INTEGER PRIMARY KEY",
    user_id: "INTEGER FOREIGN KEY REFERENCES users(id)",
    task_type: "ENUM('task1', 'task2')",
    prompt_id: "INTEGER",
    answer_text: "TEXT NOT NULL",
    word_count: "INTEGER NOT NULL",
    submitted_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    estimated_band: "DECIMAL(2,1)",
    feedback: "TEXT"
  },
  questions: {
    id: "INTEGER PRIMARY KEY",
    test_id: "INTEGER FOREIGN KEY REFERENCES tests(id)",
    section: "ENUM('listening', 'reading', 'writing')",
    question_type: "VARCHAR(50) NOT NULL",
    question_text: "TEXT NOT NULL",
    correct_answer: "TEXT",
    options: "JSON", // For multiple choice questions
    points: "INTEGER DEFAULT 1",
    order_index: "INTEGER NOT NULL"
  }
};

// Test Results Mock Data
export const mockTestResults = {
  testId: 1,
  userId: 1,
  completedAt: "2024-01-20T14:30:00Z",
  scores: {
    overall: 6.5,
    listening: 7.0,
    reading: 6.5,
    writing: 6.0
  },
  timeSpent: {
    listening: 30,
    reading: 58,
    writing: 62
  },
  answers: {
    listening: [2, 1, 3, 0, 2], // indices of chosen answers
    reading: ["storage", "False", "decreased"],
    writing: {
      task1: "The chart shows the percentage of households...",
      task2: "In my opinion, it is better to try to improve difficult situations..."
    }
  }
};

// Admin Dashboard Data
export const adminData = {
  userStats: {
    totalUsers: 1247,
    activeUsersToday: 89,
    newUsersThisWeek: 23,
    testsCompletedToday: 45
  },
  testStats: {
    totalTests: 12,
    averageScore: 6.2,
    completionRate: 78,
    mostPopularTest: "Academic Practice Test 1"
  }
};