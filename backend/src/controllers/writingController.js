const database = require('../config/database');
const {
  countWords,
  estimateWritingBand,
  getCurrentDateTime,
  formatSuccessResponse,
  formatErrorResponse,
  sanitizeInput
} = require('../utils/helpers');

const writingController = {
  // Submit writing practice
  submitWriting: async (req, res) => {
    try {
      const { taskType, prompt, answer } = req.body;
      const userId = req.user.id;

      // Validation
      if (!taskType || !prompt || !answer) {
        return res.status(400).json(
          formatErrorResponse('Task type, prompt, and answer are required')
        );
      }

      if (!['task1', 'task2'].includes(taskType)) {
        return res.status(400).json(
          formatErrorResponse('Task type must be task1 or task2')
        );
      }

      const sanitizedAnswer = sanitizeInput(answer);
      const sanitizedPrompt = sanitizeInput(prompt);

      if (sanitizedAnswer.length < 50) {
        return res.status(400).json(
          formatErrorResponse('Answer is too short')
        );
      }

      // Count words
      const wordCount = countWords(sanitizedAnswer);

      // Estimate band score
      const estimatedBand = estimateWritingBand(wordCount, taskType);

      // Generate basic feedback
      const feedback = generateFeedback(taskType, wordCount, sanitizedAnswer);

      // Save submission
      const result = await database.run(
        `INSERT INTO writing_submissions (user_id, task_type, prompt_text, answer_text, word_count, estimated_band, feedback)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, taskType, sanitizedPrompt, sanitizedAnswer, wordCount, estimatedBand, JSON.stringify(feedback)]
      );

      const submission = {
        id: result.id,
        taskType,
        prompt: sanitizedPrompt,
        answer: sanitizedAnswer,
        wordCount,
        estimatedBand,
        feedback,
        submittedAt: getCurrentDateTime()
      };

      res.status(201).json(
        formatSuccessResponse(submission, 'Writing submitted successfully')
      );

    } catch (error) {
      console.error('Submit writing error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to submit writing')
      );
    }
  },

  // Get writing history
  getWritingHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, taskType } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE user_id = ?';
      let params = [userId];

      if (taskType && ['task1', 'task2'].includes(taskType)) {
        whereClause += ' AND task_type = ?';
        params.push(taskType);
      }

      const submissions = await database.all(
        `SELECT id, task_type, prompt_text, word_count, estimated_band, submitted_at
         FROM writing_submissions
         ${whereClause}
         ORDER BY submitted_at DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), parseInt(offset)]
      );

      const total = await database.get(
        `SELECT COUNT(*) as count FROM writing_submissions ${whereClause}`,
        params
      );

      const history = submissions.map(submission => ({
        id: submission.id,
        taskType: submission.task_type,
        prompt: submission.prompt_text.substring(0, 100) + '...',
        wordCount: submission.word_count,
        estimatedBand: submission.estimated_band,
        submittedAt: submission.submitted_at
      }));

      res.json(
        formatSuccessResponse({
          history,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total.count,
            pages: Math.ceil(total.count / limit)
          }
        }, 'Writing history retrieved successfully')
      );

    } catch (error) {
      console.error('Get writing history error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve writing history')
      );
    }
  },

  // Get specific writing submission
  getWritingSubmission: async (req, res) => {
    try {
      const { submissionId } = req.params;
      const userId = req.user.id;

      const submission = await database.get(
        `SELECT id, task_type, prompt_text, answer_text, word_count, estimated_band, feedback, submitted_at
         FROM writing_submissions
         WHERE id = ? AND user_id = ?`,
        [submissionId, userId]
      );

      if (!submission) {
        return res.status(404).json(
          formatErrorResponse('Writing submission not found')
        );
      }

      const submissionData = {
        id: submission.id,
        taskType: submission.task_type,
        prompt: submission.prompt_text,
        answer: submission.answer_text,
        wordCount: submission.word_count,
        estimatedBand: submission.estimated_band,
        feedback: submission.feedback ? JSON.parse(submission.feedback) : null,
        submittedAt: submission.submitted_at
      };

      res.json(
        formatSuccessResponse(submissionData, 'Writing submission retrieved successfully')
      );

    } catch (error) {
      console.error('Get writing submission error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve writing submission')
      );
    }
  },

  // Get writing prompts for practice
  getWritingPrompts: async (req, res) => {
    try {
      const { taskType } = req.query;

      const prompts = {
        task1: [
          {
            id: 1,
            type: 'chart',
            prompt: 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
            minWords: 150,
            timeLimit: 20
          },
          {
            id: 2,
            type: 'graph',
            prompt: 'The graph below shows the consumption of fish and some different kinds of meat in a European country between 1979 and 2004. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
            minWords: 150,
            timeLimit: 20
          },
          {
            id: 3,
            type: 'table',
            prompt: 'The table below shows the worldwide market share of the notebook computer market for manufacturers in the years 2006 and 2007. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
            minWords: 150,
            timeLimit: 20
          }
        ],
        task2: [
          {
            id: 1,
            type: 'opinion',
            prompt: 'Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.',
            minWords: 250,
            timeLimit: 40
          },
          {
            id: 2,
            type: 'advantages-disadvantages',
            prompt: 'In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.',
            minWords: 250,
            timeLimit: 40
          },
          {
            id: 3,
            type: 'problem-solution',
            prompt: 'Many manufactured food and drink products contain high levels of sugar, which causes many health problems. Sugary products should be made more expensive to encourage people to consume less sugar. Do you agree or disagree?',
            minWords: 250,
            timeLimit: 40
          }
        ]
      };

      if (taskType && prompts[taskType]) {
        res.json(
          formatSuccessResponse(prompts[taskType], `${taskType} prompts retrieved successfully`)
        );
      } else {
        res.json(
          formatSuccessResponse(prompts, 'Writing prompts retrieved successfully')
        );
      }

    } catch (error) {
      console.error('Get writing prompts error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve writing prompts')
      );
    }
  },

  // Get sample answers
  getSampleAnswers: async (req, res) => {
    try {
      const { taskType, band } = req.query;

      const sampleAnswers = {
        task1: {
          band6: "The chart shows the percentage of households in owned and rented accommodation in England and Wales from 1918 to 2011. Overall, there was a significant increase in home ownership over this period, while rented accommodation decreased correspondingly. In 1918, approximately 23% of households owned their homes, while 77% rented. This pattern completely reversed by 2011, when about 69% owned and 31% rented. The most dramatic change occurred between 1953 and 1971, when ownership rose from 31% to 50%. After 1991, the rate of increase slowed, with ownership peaking at around 69% in 2001 before slightly declining to 65% by 2011.",
          band7: "The chart illustrates the proportion of households living in owned versus rented accommodation in England and Wales over a 93-year period from 1918 to 2011. The most striking feature is the dramatic reversal in housing tenure patterns during this timeframe. At the beginning of the period in 1918, the vast majority of households (approximately 77%) lived in rented accommodation, with only 23% owning their homes. However, this situation underwent a complete transformation over the subsequent decades. Home ownership experienced steady growth, reaching parity with rented accommodation around 1971 at 50% each. The trend continued upward, with ownership peaking at approximately 69% in 2001, before experiencing a slight decline to 65% by 2011. Correspondingly, the proportion of rented households fell consistently throughout the period, reaching its lowest point of 31% in 2001.",
          band8: "The chart provides data on the percentage distribution of households between owned and rented accommodation in England and Wales across nearly a century, from 1918 to 2011. The data reveals a remarkable transformation in housing patterns, with ownership and rental trends showing an almost complete reversal. Initially, in 1918, rented accommodation dominated the housing market, accounting for approximately 77% of households, while only 23% owned their homes. This represented the traditional housing pattern of the early 20th century. However, the subsequent decades witnessed a fundamental shift in housing tenure. Home ownership began its ascent in the 1920s and continued steadily upward, crossing the 50% threshold around 1971 when it achieved parity with rented accommodation. The momentum continued through the following decades, with ownership reaching its zenith at approximately 69% in 2001. Interestingly, the final decade of the survey period showed a slight reversal of this trend, with ownership declining to 65% by 2011, possibly reflecting economic factors such as the global financial crisis.",
          band9: "The chart depicts the changing patterns of housing tenure in England and Wales between 1918 and 2011, specifically illustrating the percentage of households in owned versus rented accommodation. The data reveals a profound socioeconomic shift that fundamentally altered the housing landscape over this 93-year period. At the commencement of the survey period in 1918, the housing market was characterized by a pronounced rental dominance, with approximately 77% of households occupying rented properties and merely 23% owning their homes. This distribution reflected the prevailing socioeconomic conditions of the early 20th century, where property ownership was largely confined to the affluent classes. However, the ensuing decades witnessed a gradual but inexorable transformation in housing tenure patterns. Home ownership embarked on a sustained upward trajectory, demonstrating remarkable resilience across various economic cycles. The rate of increase was particularly pronounced during the post-war boom years, with ownership levels rising from approximately 31% in 1953 to 50% by 1971, effectively achieving equilibrium with rented accommodation. The ascendancy of home ownership continued unabated through the 1980s and 1990s, ultimately culminating at approximately 69% in 2001. This peak coincided with favorable economic conditions and government policies promoting home ownership. However, the final decade of the survey period exhibited a notable deviation from this long-term trend, with ownership levels experiencing a modest decline to 65% by 2011, likely attributable to the global financial crisis and subsequent tightening of mortgage lending criteria."
        },
        task2: {
          band6: "Some people think it is better to accept difficult situations like bad jobs or money problems. Other people believe we should try to improve these situations. I will discuss both views and give my opinion. People who accept bad situations might think this way because they believe some things cannot be changed. For example, if someone has a bad job, they might think it is better to keep it than to risk losing income by looking for something better. They might also think that accepting problems helps them feel less stressed. However, other people believe we should try to improve bad situations. They think that if we work hard, we can make our lives better. For example, someone with a bad job could study new skills or look for better opportunities. I think it is better to try to improve difficult situations when possible, but sometimes we need to accept things we cannot change.",
          band7: "There is ongoing debate about whether individuals should accept challenging circumstances such as unsatisfactory employment or financial difficulties, or whether they should actively work to improve their situations. This essay will examine both perspectives before presenting my own viewpoint. Those who advocate acceptance argue that some situations are beyond our control and that fighting against them only leads to frustration and stress. They contend that accepting reality allows people to find peace and focus their energy on aspects of life they can influence. For instance, during economic downturns, maintaining any employment might be preferable to the uncertainty of job searching. Conversely, proponents of active improvement believe that resignation leads to stagnation and missed opportunities. They argue that most situations can be improved through effort, education, and persistence. Someone in an unsatisfactory job, for example, could develop new skills, network professionally, or pursue additional qualifications to enhance their prospects. In my opinion, the optimal approach depends on the specific circumstances and the individual's capacity for change. While some situations genuinely require acceptance, I believe that in most cases, a proactive approach yields better long-term outcomes and personal satisfaction.",
          band8: "The question of how to respond to adverse circumstances, such as unfulfilling careers or financial constraints, has generated considerable debate. While some advocate for acceptance and adaptation, others champion proactive improvement efforts. This essay will analyze both approaches and argue for a balanced perspective. Proponents of acceptance maintain that certain life circumstances are immutable and that struggling against them is counterproductive. They argue that acceptance fosters resilience, reduces stress, and allows individuals to find contentment within their current situation. This philosophy, rooted in stoic traditions, suggests that happiness derives from managing our reactions to circumstances rather than changing the circumstances themselves. Furthermore, accepting limitations can prevent the disappointment and frustration that often accompany failed attempts at change. However, advocates for active improvement contend that resignation represents a surrender of human agency and potential. They emphasize that most situations contain elements that can be modified through strategic action, skill development, and perseverance. From this perspective, an unsatisfactory job becomes an opportunity to identify transferable skills, pursue professional development, or explore alternative career paths. This approach not only improves material conditions but also enhances self-efficacy and personal growth. In my view, the most effective strategy combines elements of both philosophies. While certain circumstances may indeed be unchangeable and require acceptance, I believe that most situations offer opportunities for improvement that should be pursued thoughtfully and persistently."
        }
      };

      if (taskType && sampleAnswers[taskType]) {
        if (band && sampleAnswers[taskType][band]) {
          res.json(
            formatSuccessResponse({
              [band]: sampleAnswers[taskType][band]
            }, `Sample answer retrieved successfully`)
          );
        } else {
          res.json(
            formatSuccessResponse(sampleAnswers[taskType], `${taskType} sample answers retrieved successfully`)
          );
        }
      } else {
        res.json(
          formatSuccessResponse(sampleAnswers, 'Sample answers retrieved successfully')
        );
      }

    } catch (error) {
      console.error('Get sample answers error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve sample answers')
      );
    }
  },

  // Get writing statistics
  getWritingStats: async (req, res) => {
    try {
      const userId = req.user.id;

      const stats = await database.all(
        `SELECT 
           COUNT(*) as total_submissions,
           AVG(estimated_band) as average_band,
           AVG(word_count) as average_word_count,
           task_type
         FROM writing_submissions 
         WHERE user_id = ? 
         GROUP BY task_type`,
        [userId]
      );

      const recentSubmissions = await database.all(
        `SELECT task_type, estimated_band, submitted_at 
         FROM writing_submissions 
         WHERE user_id = ? 
         ORDER BY submitted_at DESC 
         LIMIT 5`,
        [userId]
      );

      const totalCount = await database.get(
        'SELECT COUNT(*) as count FROM writing_submissions WHERE user_id = ?',
        [userId]
      );

      const statsData = {
        totalSubmissions: totalCount.count,
        byTaskType: stats.reduce((acc, stat) => {
          acc[stat.task_type] = {
            submissions: stat.total_submissions,
            averageBand: parseFloat(stat.average_band).toFixed(1),
            averageWordCount: Math.round(stat.average_word_count)
          };
          return acc;
        }, {}),
        recentSubmissions: recentSubmissions.map(sub => ({
          taskType: sub.task_type,
          estimatedBand: sub.estimated_band,
          submittedAt: sub.submitted_at
        }))
      };

      res.json(
        formatSuccessResponse(statsData, 'Writing statistics retrieved successfully')
      );

    } catch (error) {
      console.error('Get writing stats error:', error);
      res.status(500).json(
        formatErrorResponse('Failed to retrieve writing statistics')
      );
    }
  }
};

// Helper function to generate feedback
function generateFeedback(taskType, wordCount, answer) {
  const feedback = {
    wordCount: {
      status: '',
      message: ''
    },
    structure: {
      status: '',
      message: ''
    },
    suggestions: []
  };

  const minWords = taskType === 'task1' ? 150 : 250;
  const maxWords = taskType === 'task1' ? 200 : 350;

  // Word count feedback
  if (wordCount < minWords * 0.8) {
    feedback.wordCount.status = 'poor';
    feedback.wordCount.message = `Your essay is significantly under the minimum word count (${wordCount}/${minWords} words). This will negatively impact your score.`;
  } else if (wordCount < minWords) {
    feedback.wordCount.status = 'below';
    feedback.wordCount.message = `Your essay is slightly under the minimum word count (${wordCount}/${minWords} words).`;
  } else if (wordCount >= minWords && wordCount <= maxWords) {
    feedback.wordCount.status = 'good';
    feedback.wordCount.message = `Good word count (${wordCount} words). You've met the requirements.`;
  } else if (wordCount > maxWords * 1.2) {
    feedback.wordCount.status = 'too_long';
    feedback.wordCount.message = `Your essay is quite long (${wordCount} words). Consider being more concise.`;
  } else {
    feedback.wordCount.status = 'acceptable';
    feedback.wordCount.message = `Acceptable word count (${wordCount} words).`;
  }

  // Basic structure analysis
  const paragraphs = answer.split('\n\n').filter(p => p.trim().length > 0);
  
  if (taskType === 'task1') {
    if (paragraphs.length >= 3) {
      feedback.structure.status = 'good';
      feedback.structure.message = 'Good paragraph structure with clear introduction, body, and overview.';
    } else {
      feedback.structure.status = 'needs_improvement';
      feedback.structure.message = 'Consider organizing your response into clear paragraphs: introduction, body paragraphs describing key features, and overview.';
    }
  } else {
    if (paragraphs.length >= 4) {
      feedback.structure.status = 'good';
      feedback.structure.message = 'Good essay structure with introduction, body paragraphs, and conclusion.';
    } else {
      feedback.structure.status = 'needs_improvement';
      feedback.structure.message = 'Consider organizing your essay into 4-5 paragraphs: introduction, 2-3 body paragraphs, and conclusion.';
    }
  }

  // General suggestions
  feedback.suggestions = [
    'Use a variety of sentence structures to demonstrate language range',
    'Include specific examples to support your points',
    'Check for grammar and spelling errors before submitting',
    'Practice time management to complete within the time limit'
  ];

  if (taskType === 'task1') {
    feedback.suggestions.push('Focus on describing trends and making comparisons rather than giving opinions');
    feedback.suggestions.push('Use appropriate vocabulary for describing data and charts');
  } else {
    feedback.suggestions.push('Make sure to address all parts of the question');
    feedback.suggestions.push('Present a clear position and support it with relevant examples');
  }

  return feedback;
}

module.exports = writingController;