// Comprehensive test data for PrepX platform
const bcrypt = require('bcryptjs');

// Cambridge IELTS Tests 1-19 Structure
const cambridgeTests = {
  // Cambridge IELTS 1
  1: {
    title: 'Cambridge IELTS 1 - Test 1',
    description: 'Official Cambridge IELTS preparation material',
    isPremium: false,
    isOfficial: true,
    series: 'Cambridge IELTS 1',
    testNumber: 1,
    sections: {
      listening: {
        duration: 30,
        sections: 4,
        questions: 40
      },
      reading: {
        duration: 60,
        sections: 3,
        questions: 40
      },
      writing: {
        duration: 60,
        tasks: 2
      },
      speaking: {
        duration: 14,
        parts: 3
      }
    }
  },
  2: {
    title: 'Cambridge IELTS 1 - Test 2',
    description: 'Official Cambridge IELTS preparation material',
    isPremium: false,
    isOfficial: true,
    series: 'Cambridge IELTS 1',
    testNumber: 2
  },
  3: {
    title: 'Cambridge IELTS 1 - Test 3',
    description: 'Official Cambridge IELTS preparation material',
    isPremium: true,
    isOfficial: true,
    series: 'Cambridge IELTS 1',
    testNumber: 3
  },
  4: {
    title: 'Cambridge IELTS 1 - Test 4',
    description: 'Official Cambridge IELTS preparation material',
    isPremium: true,
    isOfficial: true,
    series: 'Cambridge IELTS 1',
    testNumber: 4
  }
};

// Generate all Cambridge tests 1-19
const generateCambridgeTests = () => {
  const tests = [];
  let testId = 1;

  for (let book = 1; book <= 19; book++) {
    for (let test = 1; test <= 4; test++) {
      const isPremium = book > 5 || test > 2; // First 5 books, first 2 tests of each are free
      
      tests.push({
        id: testId++,
        title: `Cambridge IELTS ${book} - Test ${test}`,
        description: `Official Cambridge IELTS ${book} preparation material - Test ${test}`,
        type: 'full',
        difficulty: 'intermediate',
        duration: 165, // 2 hours 45 minutes
        isPremium,
        isOfficial: true,
        series: `Cambridge IELTS ${book}`,
        testNumber: test,
        bookNumber: book,
        sections: {
          listening: {
            duration: 30,
            sections: 4,
            questions: 40
          },
          reading: {
            duration: 60,
            sections: 3,
            questions: 40
          },
          writing: {
            duration: 60,
            tasks: 2
          },
          speaking: {
            duration: 14,
            parts: 3
          }
        },
        tags: ['cambridge', 'official', 'ielts', `book${book}`, `test${test}`]
      });
    }
  }

  return tests;
};

// Sample questions for different test types
const sampleQuestions = {
  listening: [
    {
      id: 1,
      section: 1,
      type: 'multiple_choice',
      question: 'What is the main reason for the call?',
      options: [
        'To book a hotel room',
        'To cancel a reservation',
        'To ask about facilities',
        'To complain about service'
      ],
      correctAnswer: 0,
      audioTimestamp: '00:30-01:15'
    },
    {
      id: 2,
      section: 1,
      type: 'form_completion',
      question: 'Complete the booking form',
      fields: [
        { label: 'Name', answer: 'Sarah Johnson' },
        { label: 'Phone number', answer: '07845 321 789' },
        { label: 'Email', answer: 'sarah.j@email.com' }
      ],
      audioTimestamp: '01:15-02:30'
    }
  ],
  reading: [
    {
      id: 1,
      section: 1,
      type: 'multiple_choice',
      passage: 'The Impact of Technology on Education',
      question: 'According to the passage, what is the main benefit of technology in education?',
      options: [
        'Reduced costs for schools',
        'Improved student engagement',
        'Easier lesson planning for teachers',
        'Better test scores'
      ],
      correctAnswer: 1,
      explanation: 'The passage states that technology primarily helps increase student engagement and motivation.'
    },
    {
      id: 2,
      section: 1,
      type: 'true_false_not_given',
      passage: 'The Impact of Technology on Education',
      statements: [
        {
          statement: 'All schools have equal access to technology.',
          answer: 'FALSE',
          explanation: 'The passage mentions a digital divide between schools.'
        },
        {
          statement: 'Students prefer online learning to traditional methods.',
          answer: 'NOT GIVEN',
          explanation: 'The passage does not provide information about student preferences.'
        }
      ]
    }
  ],
  writing: [
    {
      id: 1,
      task: 1,
      type: 'academic',
      prompt: 'The charts below show the changes in ownership of electrical appliances and amount of time spent doing housework in households in one country between 1920 and 2019. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      wordLimit: 150,
      timeLimit: 20,
      criteria: ['task_achievement', 'coherence_cohesion', 'lexical_resource', 'grammatical_range'],
      sampleAnswer: {
        bandScore: 7.0,
        answer: 'The two charts illustrate the percentage of households with electrical appliances and the number of hours spent on housework per week in one country from 1920 to 2019...'
      }
    },
    {
      id: 2,
      task: 2,
      type: 'academic',
      prompt: 'In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in. What are the reasons for this? How can people research this?',
      wordLimit: 250,
      timeLimit: 40,
      criteria: ['task_achievement', 'coherence_cohesion', 'lexical_resource', 'grammatical_range'],
      sampleAnswer: {
        bandScore: 8.0,
        answer: 'In recent years, there has been a growing trend of people investigating the historical background of their homes...'
      }
    }
  ],
  speaking: [
    {
      id: 1,
      part: 1,
      topic: 'Personal Information',
      questions: [
        'What is your full name?',
        'Can I see your identification?',
        'Where are you from?',
        'Do you work or study?',
        'What do you like about your job/studies?'
      ]
    },
    {
      id: 2,
      part: 2,
      topic: 'Describe a memorable journey you have taken',
      cueCard: {
        topic: 'Describe a memorable journey you have taken',
        points: [
          'Where did you go?',
          'When did you go there?',
          'Who did you go with?',
          'What made it memorable?'
        ],
        preparationTime: 60,
        speakingTime: 120
      },
      followUpQuestions: [
        'Do you like to travel?',
        'What was the most interesting part of your journey?'
      ]
    },
    {
      id: 3,
      part: 3,
      topic: 'Travel and Tourism',
      questions: [
        'How has tourism changed in your country over the years?',
        'What are the advantages and disadvantages of tourism for a country?',
        'Do you think people travel too much nowadays?',
        'How might travel change in the future?'
      ]
    }
  ]
};

// Premium extra tests
const premiumExtraTests = [
  {
    id: 1000,
    title: 'Advanced Academic Practice Test 1',
    description: 'Challenging practice test for band 7+ students',
    type: 'full',
    difficulty: 'advanced',
    duration: 165,
    isPremium: true,
    isOfficial: false,
    series: 'PrepX Advanced',
    testNumber: 1,
    tags: ['advanced', 'academic', 'premium']
  },
  {
    id: 1001,
    title: 'General Training Practice Test 1',
    description: 'Comprehensive General Training practice test',
    type: 'full',
    difficulty: 'intermediate',
    duration: 165,
    isPremium: true,
    isOfficial: false,
    series: 'PrepX General',
    testNumber: 1,
    tags: ['general', 'training', 'premium']
  },
  {
    id: 1002,
    title: 'Speed Test - Reading Focus',
    description: 'Intensive reading practice with time pressure',
    type: 'reading_only',
    difficulty: 'intermediate',
    duration: 45,
    isPremium: true,
    isOfficial: false,
    series: 'PrepX Speed Tests',
    testNumber: 1,
    tags: ['reading', 'speed', 'premium']
  }
];

// Writing prompts database
const writingPrompts = {
  task1: {
    academic: [
      {
        id: 1,
        type: 'line_graph',
        prompt: 'The graph below shows the consumption of fish and some different kinds of meat in a European country between 1979 and 2004.',
        imageUrl: '/assets/writing/task1_graph1.png',
        wordLimit: 150,
        timeLimit: 20
      },
      {
        id: 2,
        type: 'bar_chart',
        prompt: 'The chart below shows the results of a survey about people\'s coffee and tea buying and drinking habits in five Australian cities.',
        imageUrl: '/assets/writing/task1_chart2.png',
        wordLimit: 150,
        timeLimit: 20
      },
      {
        id: 3,
        type: 'pie_chart',
        prompt: 'The charts below show the proportions of British students at one university in England who were able to speak other languages in addition to English, in 2000 and 2010.',
        imageUrl: '/assets/writing/task1_pie3.png',
        wordLimit: 150,
        timeLimit: 20
      },
      {
        id: 4,
        type: 'table',
        prompt: 'The table below shows the numbers of visitors to Ashdown Museum during the year before and the year after it was refurbished.',
        imageUrl: '/assets/writing/task1_table4.png',
        wordLimit: 150,
        timeLimit: 20
      },
      {
        id: 5,
        type: 'process',
        prompt: 'The diagrams below show the life cycle of a species of large fish called the salmon.',
        imageUrl: '/assets/writing/task1_process5.png',
        wordLimit: 150,
        timeLimit: 20
      }
    ],
    general: [
      {
        id: 101,
        type: 'formal_letter',
        prompt: 'You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken. Write a letter to the shop manager.',
        requirements: [
          'Describe the problem with the equipment',
          'Explain what happened when you phoned the shop',
          'Say what you would like the manager to do'
        ],
        wordLimit: 150,
        timeLimit: 20
      },
      {
        id: 102,
        type: 'informal_letter',
        prompt: 'A friend has agreed to look after your house and pet while you are on holiday. Write a letter to your friend.',
        requirements: [
          'Give contact details for when you are away',
          'Give instructions about how to care for your pet',
          'Describe other household duties'
        ],
        wordLimit: 150,
        timeLimit: 20
      }
    ]
  },
  task2: {
    academic: [
      {
        id: 201,
        type: 'opinion',
        prompt: 'Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.',
        wordLimit: 250,
        timeLimit: 40,
        keywords: ['opinion', 'discuss', 'both views']
      },
      {
        id: 202,
        type: 'problem_solution',
        prompt: 'In many countries around the world, rural people are moving to cities, so the population in the countryside is decreasing. Do you think this is a positive or a negative development?',
        wordLimit: 250,
        timeLimit: 40,
        keywords: ['positive', 'negative', 'development']
      },
      {
        id: 203,
        type: 'advantages_disadvantages',
        prompt: 'Some experts believe that it is better for children to begin learning a foreign language at primary school rather than secondary school. Do the advantages of this outweigh the disadvantages?',
        wordLimit: 250,
        timeLimit: 40,
        keywords: ['advantages', 'disadvantages', 'outweigh']
      }
    ],
    general: [
      {
        id: 301,
        type: 'opinion',
        prompt: 'Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both these views and give your own opinion.',
        wordLimit: 250,
        timeLimit: 40,
        keywords: ['opinion', 'discuss', 'both views']
      }
    ]
  }
};

// Admin user data
const adminUser = {
  name: 'PrepX Admin',
  email: 'admin@prepx.com',
  password: 'admin123',
  role: 'admin',
  isActive: true,
  permissions: [
    'manage_users',
    'manage_tests',
    'view_analytics',
    'manage_content',
    'manage_subscriptions'
  ]
};

// Learning resources data
const learningResources = {
  tips: [
    {
      id: 1,
      category: 'listening',
      title: 'How to Improve IELTS Listening Score',
      content: 'Focus on understanding the context and predicting answers...',
      difficulty: 'beginner',
      estimatedTime: 5,
      tags: ['listening', 'tips', 'beginner']
    },
    {
      id: 2,
      category: 'reading',
      title: 'Skimming and Scanning Techniques',
      content: 'Master the art of quick reading for IELTS success...',
      difficulty: 'intermediate',
      estimatedTime: 8,
      tags: ['reading', 'techniques', 'intermediate']
    },
    {
      id: 3,
      category: 'writing',
      title: 'Task 2 Essay Structure',
      content: 'Learn the perfect structure for high-scoring essays...',
      difficulty: 'intermediate',
      estimatedTime: 12,
      tags: ['writing', 'structure', 'task2']
    },
    {
      id: 4,
      category: 'speaking',
      title: 'Fluency vs Accuracy in Speaking',
      content: 'Balance fluency and accuracy for better speaking scores...',
      difficulty: 'advanced',
      estimatedTime: 10,
      tags: ['speaking', 'fluency', 'accuracy']
    }
  ],
  vocabulary: [
    {
      id: 1,
      category: 'academic',
      topic: 'Education',
      words: [
        {
          word: 'curriculum',
          definition: 'The subjects comprising a course of study in a school or college',
          example: 'The school updated its curriculum to include more technology courses.',
          pronunciation: '/kəˈrɪkjʊləm/',
          level: 'intermediate'
        },
        {
          word: 'assessment',
          definition: 'The evaluation or estimation of the nature, quality, or ability of someone or something',
          example: 'Continuous assessment is more effective than final exams alone.',
          pronunciation: '/əˈsesmənt/',
          level: 'intermediate'
        }
      ]
    },
    {
      id: 2,
      category: 'general',
      topic: 'Environment',
      words: [
        {
          word: 'sustainable',
          definition: 'Able to be maintained at a certain rate or level',
          example: 'We need to find sustainable solutions to environmental problems.',
          pronunciation: '/səˈsteɪnəbl/',
          level: 'advanced'
        }
      ]
    }
  ],
  grammar: [
    {
      id: 1,
      topic: 'Complex Sentences',
      level: 'intermediate',
      content: 'Learn to combine ideas using subordinating conjunctions...',
      examples: [
        'Although it was raining, we decided to go for a walk.',
        'Since you\'re here, let\'s start the meeting.'
      ],
      exercises: [
        {
          question: 'Combine these sentences: "It was cold. We went swimming."',
          answer: 'Although it was cold, we went swimming.'
        }
      ]
    }
  ]
};

// Study plans
const studyPlans = [
  {
    id: 1,
    title: '30-Day IELTS Intensive Plan',
    description: 'Comprehensive 30-day study plan for IELTS preparation',
    duration: 30,
    targetBand: '7.0+',
    difficulty: 'intermediate',
    weeks: [
      {
        week: 1,
        focus: 'Assessment and Foundation',
        days: [
          {
            day: 1,
            tasks: [
              'Take diagnostic test',
              'Review results and identify weak areas',
              'Set study schedule'
            ]
          },
          {
            day: 2,
            tasks: [
              'Listening practice - Section 1 & 2',
              'Learn note-taking techniques',
              'Vocabulary: Academic word list 1-50'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '60-Day Comprehensive Plan',
    description: 'Detailed 60-day plan for thorough IELTS preparation',
    duration: 60,
    targetBand: '8.0+',
    difficulty: 'advanced'
  },
  {
    id: 3,
    title: '7-Day Quick Review',
    description: 'Last-minute review plan for test day',
    duration: 7,
    targetBand: 'Maintain current level',
    difficulty: 'all_levels'
  }
];

module.exports = {
  generateCambridgeTests,
  premiumExtraTests,
  sampleQuestions,
  writingPrompts,
  adminUser,
  learningResources,
  studyPlans
};