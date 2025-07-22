const database = require('../config/database');
const {
  formatSuccessResponse,
  formatErrorResponse
} = require('../utils/helpers');

const resourcesController = {
  // Get all learning resources
  getResources: async (req, res) => {
    try {
      const { category, type } = req.query;

      let whereClause = 'WHERE is_active = 1';
      let params = [];

      if (category) {
        whereClause += ' AND category = ?';
        params.push(category);
      }

      if (type) {
        whereClause += ' AND type = ?';
        params.push(type);
      }

      const resources = await database.all(
        `SELECT id, title, type, category, content, created_at 
         FROM learning_resources 
         ${whereClause} 
         ORDER BY category, type, created_at DESC`,
        params
      );

      const formattedResources = resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        category: resource.category,
        content: JSON.parse(resource.content),
        createdAt: resource.created_at
      }));

      res.json(
        formatSuccessResponse(formattedResources, 'Resources retrieved successfully')
      );

    } catch (error) {
      console.error('Get resources error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve resources')
      );
    }
  },

  // Get tips by category
  getTips: async (req, res) => {
    try {
      const tips = {
        listening: [
          "Practice listening to different English accents (British, American, Australian, Canadian)",
          "Take notes while listening - write key words and numbers",
          "Don't spend too much time on one question - move on if you're unsure",
          "Use the preparation time to read questions carefully",
          "Pay attention to signpost words like 'however', 'moreover', 'finally'",
          "Listen for synonyms and paraphrases of words in the questions",
          "Practice with authentic materials like BBC, CNN, podcasts",
          "Focus on understanding the main idea first, then details",
          "Be aware of distractors - information that sounds correct but isn't the answer",
          "Write your answers as you listen - don't wait until the end"
        ],
        reading: [
          "Skim read the passage first to get the general idea",
          "Look for keywords in questions and scan for them in the text",
          "Don't try to understand every word - focus on the overall meaning",
          "Manage your time - spend about 20 minutes per passage",
          "Read the questions before reading the passage in detail",
          "Pay attention to paragraph headings and topic sentences",
          "Practice different question types regularly",
          "Look for connecting words that show relationships between ideas",
          "Use elimination strategy for multiple choice questions",
          "Check your answers fit grammatically and logically"
        ],
        writing: [
          "Plan your essay before you start writing (5 minutes for planning)",
          "Use a variety of sentence structures and vocabulary",
          "Check your grammar and spelling carefully",
          "Make sure you answer all parts of the question",
          "Practice writing within time limits regularly",
          "Use linking words to connect your ideas clearly",
          "Write a clear introduction and conclusion",
          "Support your points with specific examples",
          "Count your words to meet the minimum requirement",
          "Leave time to review and edit your work"
        ],
        general: [
          "Practice regularly with authentic IELTS materials",
          "Time yourself during practice to build exam stamina",
          "Read the instructions carefully in the real test",
          "Don't leave any answers blank - guess if necessary",
          "Stay calm and focused during the test",
          "Get familiar with the test format before exam day",
          "Build your vocabulary systematically",
          "Practice all four skills regularly",
          "Take mock tests under exam conditions",
          "Learn from your mistakes and track your progress"
        ]
      };

      const { category } = req.query;

      if (category && tips[category]) {
        res.json(
          formatSuccessResponse({
            category,
            tips: tips[category]
          }, `${category} tips retrieved successfully`)
        );
      } else {
        res.json(
          formatSuccessResponse(tips, 'All tips retrieved successfully')
        );
      }

    } catch (error) {
      console.error('Get tips error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve tips')
      );
    }
  },

  // Get common mistakes
  getCommonMistakes: async (req, res) => {
    try {
      const mistakes = {
        listening: [
          {
            mistake: "Not reading questions before listening",
            solution: "Use preparation time to read and understand questions",
            impact: "Missing key information during audio"
          },
          {
            mistake: "Writing too much for short answer questions",
            solution: "Follow word limits strictly (usually 1-3 words)",
            impact: "Answers marked incorrect even if content is right"
          },
          {
            mistake: "Not checking spelling",
            solution: "Practice spelling of common IELTS vocabulary",
            impact: "Losing points for correct answers with wrong spelling"
          },
          {
            mistake: "Panicking when missing an answer",
            solution: "Move on quickly and focus on next question",
            impact: "Missing subsequent questions due to stress"
          }
        ],
        reading: [
          {
            mistake: "Reading the entire passage before questions",
            solution: "Skim first, then read questions, then detailed reading",
            impact: "Running out of time"
          },
          {
            mistake: "Choosing answers based on matching words only",
            solution: "Look for meaning and context, not just word matching",
            impact: "Falling for distractors and wrong answers"
          },
          {
            mistake: "Not managing time effectively",
            solution: "Allocate 20 minutes per passage and stick to it",
            impact: "Not completing all sections"
          },
          {
            mistake: "Overthinking True/False/Not Given questions",
            solution: "Base answers only on information explicitly stated",
            impact: "Confusion between False and Not Given"
          }
        ],
        writing: [
          {
            mistake: "Not planning before writing",
            solution: "Spend 5 minutes planning your structure and ideas",
            impact: "Disorganized essays with unclear arguments"
          },
          {
            mistake: "Writing under the word limit",
            solution: "Practice counting words and aim slightly above minimum",
            impact: "Automatic penalty for insufficient words"
          },
          {
            mistake: "Memorizing and using template phrases",
            solution: "Learn flexible language patterns, not fixed phrases",
            impact: "Lower scores for lack of natural language"
          },
          {
            mistake: "Not addressing all parts of Task 2 questions",
            solution: "Analyze question carefully and address each part",
            impact: "Lower Task Achievement score"
          }
        ],
        general: [
          {
            mistake: "Not practicing under timed conditions",
            solution: "Regular practice with strict time limits",
            impact: "Poor time management in actual test"
          },
          {
            mistake: "Focusing only on one skill",
            solution: "Practice all four skills regularly and equally",
            impact: "Unbalanced preparation and lower overall score"
          },
          {
            mistake: "Not familiarizing with test format",
            solution: "Take several practice tests before the real exam",
            impact: "Confusion and wasted time during actual test"
          },
          {
            mistake: "Cramming just before the test",
            solution: "Start preparation early and practice consistently",
            impact: "Stress and poor performance on test day"
          }
        ]
      };

      const { category } = req.query;

      if (category && mistakes[category]) {
        res.json(
          formatSuccessResponse({
            category,
            mistakes: mistakes[category]
          }, `${category} common mistakes retrieved successfully`)
        );
      } else {
        res.json(
          formatSuccessResponse(mistakes, 'All common mistakes retrieved successfully')
        );
      }

    } catch (error) {
      console.error('Get common mistakes error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve common mistakes')
      );
    }
  },

  // Get vocabulary lists
  getVocabulary: async (req, res) => {
    try {
      const vocabulary = {
        academic: [
          { word: "analyze", definition: "to examine in detail", example: "We need to analyze the data carefully." },
          { word: "significant", definition: "important or notable", example: "There was a significant increase in sales." },
          { word: "demonstrate", definition: "to show clearly", example: "The results demonstrate the effectiveness of the method." },
          { word: "evaluate", definition: "to assess or judge", example: "Students must evaluate the evidence presented." },
          { word: "establish", definition: "to set up or prove", example: "The research established a clear connection." },
          { word: "fundamental", definition: "basic or essential", example: "This is a fundamental principle of physics." },
          { word: "comprehensive", definition: "complete and thorough", example: "We need a comprehensive review of the policy." },
          { word: "substantial", definition: "considerable in amount", example: "There was substantial improvement in performance." },
          { word: "preliminary", definition: "initial or preparatory", example: "These are just preliminary results." },
          { word: "subsequent", definition: "following in time", example: "Subsequent studies confirmed the findings." }
        ],
        describing_trends: [
          { word: "surge", definition: "sudden increase", example: "There was a surge in online shopping." },
          { word: "plummet", definition: "fall rapidly", example: "Prices plummeted after the announcement." },
          { word: "fluctuate", definition: "vary irregularly", example: "The temperature fluctuated throughout the day." },
          { word: "stabilize", definition: "become steady", example: "The market began to stabilize." },
          { word: "peak", definition: "reach highest point", example: "Sales peaked in December." },
          { word: "decline", definition: "decrease gradually", example: "There was a steady decline in enrollment." },
          { word: "accelerate", definition: "increase in speed", example: "Growth accelerated in the final quarter." },
          { word: "plateau", definition: "reach a stable level", example: "Growth rates plateaued after 2010." },
          { word: "recover", definition: "return to normal", example: "The economy began to recover." },
          { word: "stagnate", definition: "stop developing", example: "Progress stagnated due to lack of funding." }
        ],
        linking_words: [
          { word: "furthermore", definition: "in addition", example: "The method is effective. Furthermore, it's cost-efficient." },
          { word: "nevertheless", definition: "despite this", example: "The task was difficult. Nevertheless, we completed it." },
          { word: "consequently", definition: "as a result", example: "It rained heavily. Consequently, the match was cancelled." },
          { word: "whereas", definition: "while on the contrary", example: "John likes coffee, whereas Mary prefers tea." },
          { word: "albeit", definition: "although", example: "The solution works, albeit slowly." },
          { word: "hence", definition: "therefore", example: "The evidence is clear, hence the conclusion." },
          { word: "moreover", definition: "besides", example: "The plan is good. Moreover, it's affordable." },
          { word: "nonetheless", definition: "however", example: "The results were unexpected. Nonetheless, they're valid." },
          { word: "thereby", definition: "by that means", example: "We reduced costs, thereby increasing profits." },
          { word: "conversely", definition: "on the other hand", example: "Some prices rose. Conversely, others fell." }
        ]
      };

      const { category } = req.query;

      if (category && vocabulary[category]) {
        res.json(
          formatSuccessResponse({
            category,
            vocabulary: vocabulary[category]
          }, `${category} vocabulary retrieved successfully`)
        );
      } else {
        res.json(
          formatSuccessResponse(vocabulary, 'All vocabulary lists retrieved successfully')
        );
      }

    } catch (error) {
      console.error('Get vocabulary error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve vocabulary')
      );
    }
  },

  // Get band descriptors
  getBandDescriptors: async (req, res) => {
    try {
      const bandDescriptors = {
        listening: {
          "9": "Can understand extended speech even when it is not clearly structured and when relationships are only implied and not signalled explicitly.",
          "8": "Can understand a wide range of recorded and live spoken language including some non-standard usage with only occasional unsupported gaps.",
          "7": "Can understand most speech at normal speed but may have difficulty with very fast speech or unclear pronunciation.",
          "6": "Can understand most factual information about familiar topics and can follow the general meaning in familiar contexts.",
          "5": "Can understand main points when the delivery is clear and the topic is familiar.",
          "4": "Can understand basic information and main points in familiar contexts when delivery is slow and clear.",
          "3": "Can understand simple factual information when delivery is very slow and clear with repetition.",
          "2": "Can understand isolated words and very simple phrases when delivery is very slow with long pauses.",
          "1": "Can understand a few isolated words in very simple contexts."
        },
        reading: {
          "9": "Can understand texts on any topic and appreciate distinctions of style and implicit meaning.",
          "8": "Can understand complex texts on familiar and unfamiliar topics with only occasional unsupported gaps.",
          "7": "Can understand main ideas and specific details in most texts, including some complex language.",
          "6": "Can understand main ideas and some details in most texts on familiar topics.",
          "5": "Can understand main ideas in texts on familiar topics when the language is straightforward.",
          "4": "Can understand basic information and main points in simple texts on familiar topics.",
          "3": "Can understand simple factual information in straightforward texts on familiar topics.",
          "2": "Can understand simple phrases and sentences in very basic texts.",
          "1": "Can understand isolated words and very simple phrases in basic contexts."
        },
        writing: {
          "9": "Uses language naturally and accurately with complete flexibility and precise usage in all contexts.",
          "8": "Uses language fluently and accurately with only occasional minor errors that do not impede communication.",
          "7": "Uses language flexibly and accurately with good control of complex structures and precise vocabulary.",
          "6": "Uses language effectively with good control of structure and vocabulary, though some errors occur.",
          "5": "Uses language with reasonable accuracy and shows some flexibility in structure and vocabulary.",
          "4": "Uses basic language with limited control of structure and vocabulary, with frequent errors.",
          "3": "Uses very basic language with many errors that may impede communication.",
          "2": "Uses extremely limited language with frequent errors that severely impede communication.",
          "1": "Uses isolated words and phrases with little or no control of structure."
        }
      };

      const { skill } = req.query;

      if (skill && bandDescriptors[skill]) {
        res.json(
          formatSuccessResponse({
            skill,
            descriptors: bandDescriptors[skill]
          }, `${skill} band descriptors retrieved successfully`)
        );
      } else {
        res.json(
          formatSuccessResponse(bandDescriptors, 'All band descriptors retrieved successfully')
        );
      }

    } catch (error) {
      console.error('Get band descriptors error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve band descriptors')
      );
    }
  },

  // Get study plans
  getStudyPlans: async (req, res) => {
    try {
      const studyPlans = {
        "4_weeks": {
          title: "4-Week Intensive Plan",
          description: "For students who need to prepare quickly",
          weeks: [
            {
              week: 1,
              focus: "Assessment and Foundation",
              tasks: [
                "Take a full practice test to assess current level",
                "Identify weak areas and prioritize",
                "Start daily vocabulary building (20 words/day)",
                "Practice listening for 30 minutes daily",
                "Complete 1 reading passage daily"
              ]
            },
            {
              week: 2,
              focus: "Skill Development",
              tasks: [
                "Focus on weakest skill identified in week 1",
                "Practice writing Task 1 (3 essays this week)",
                "Practice writing Task 2 (3 essays this week)",
                "Continue daily listening and reading",
                "Learn test strategies and time management"
              ]
            },
            {
              week: 3,
              focus: "Practice and Refinement",
              tasks: [
                "Take 2 full practice tests",
                "Review and analyze mistakes",
                "Focus on remaining weak areas",
                "Practice under timed conditions",
                "Refine test-taking strategies"
              ]
            },
            {
              week: 4,
              focus: "Final Preparation",
              tasks: [
                "Take final practice test",
                "Review common mistakes and tips",
                "Practice relaxation techniques",
                "Prepare for test day logistics",
                "Light review and confidence building"
              ]
            }
          ]
        },
        "8_weeks": {
          title: "8-Week Comprehensive Plan",
          description: "Balanced preparation with steady progress",
          weeks: [
            {
              week: 1,
              focus: "Assessment and Goal Setting",
              tasks: [
                "Take diagnostic test",
                "Set target band scores",
                "Create study schedule",
                "Start vocabulary journal",
                "Begin daily English exposure"
              ]
            },
            {
              week: 2,
              focus: "Listening Skills",
              tasks: [
                "Learn listening question types",
                "Practice note-taking techniques",
                "Work on accent recognition",
                "Practice with authentic materials",
                "Focus on weak listening areas"
              ]
            },
            {
              week: 3,
              focus: "Reading Skills",
              tasks: [
                "Learn reading strategies",
                "Practice skimming and scanning",
                "Work on different question types",
                "Improve reading speed",
                "Build academic vocabulary"
              ]
            },
            {
              week: 4,
              focus: "Writing Task 1",
              tasks: [
                "Learn Task 1 structure",
                "Practice describing trends",
                "Work on data interpretation",
                "Build describing vocabulary",
                "Write 5 Task 1 essays"
              ]
            },
            {
              week: 5,
              focus: "Writing Task 2",
              tasks: [
                "Learn essay types and structures",
                "Practice argument development",
                "Work on idea generation",
                "Build opinion vocabulary",
                "Write 5 Task 2 essays"
              ]
            },
            {
              week: 6,
              focus: "Integration and Practice",
              tasks: [
                "Take 2 full practice tests",
                "Review and analyze performance",
                "Focus on time management",
                "Practice weak areas",
                "Refine strategies"
              ]
            },
            {
              week: 7,
              focus: "Intensive Practice",
              tasks: [
                "Daily practice tests (sections)",
                "Focus on consistency",
                "Work on stamina building",
                "Review common mistakes",
                "Practice under pressure"
              ]
            },
            {
              week: 8,
              focus: "Final Preparation",
              tasks: [
                "Take final practice test",
                "Review test day procedures",
                "Prepare mentally and physically",
                "Light review of strategies",
                "Confidence building activities"
              ]
            }
          ]
        },
        "12_weeks": {
          title: "12-Week Thorough Plan",
          description: "Comprehensive preparation with skill building",
          weeks: [
            {
              week: 1,
              focus: "Foundation Assessment",
              tasks: [
                "Complete diagnostic test",
                "Analyze current level",
                "Set realistic goals",
                "Plan study schedule",
                "Gather study materials"
              ]
            },
            {
              week: 2,
              focus: "English Foundation",
              tasks: [
                "Build basic vocabulary",
                "Review grammar basics",
                "Start daily English input",
                "Practice pronunciation",
                "Establish study routine"
              ]
            },
            {
              week: 3,
              focus: "Listening Introduction",
              tasks: [
                "Learn test format",
                "Practice basic listening",
                "Work on concentration",
                "Learn note-taking",
                "Practice with simple materials"
              ]
            }
            // ... continuing for all 12 weeks
          ]
        }
      };

      const { duration } = req.query;

      if (duration && studyPlans[duration]) {
        res.json(
          formatSuccessResponse(studyPlans[duration], `${duration} study plan retrieved successfully`)
        );
      } else {
        res.json(
          formatSuccessResponse(Object.keys(studyPlans).map(key => ({
            duration: key,
            title: studyPlans[key].title,
            description: studyPlans[key].description
          })), 'Study plan options retrieved successfully')
        );
      }

    } catch (error) {
      console.error('Get study plans error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve study plans')
      );
    }
  }
};

module.exports = resourcesController;