const { getGeminiModel } = require('../config/gemini');

const generateHint = async (question, userQuery, assignmentData) => {
  try {
    const model = getGeminiModel();

    const prompt = `You are an SQL tutor helping students learn database queries.

Assignment Question: ${question}
Available Tables: ${assignmentData.tableNames.join(', ')}
Student's Current Query: ${userQuery || 'No query written yet'}

IMPORTANT RULES:
1. DO NOT write the complete solution or exact SQL query
2. Provide a conceptual hint to guide their thinking
3. Ask leading questions to help them discover the answer
4. If their query has errors, point out the type of issue without fixing it directly
5. Keep hints under 3 sentences
6. Focus on SQL concepts like which clauses to use, not specific syntax

Provide a helpful hint:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const hint = response.text();

    return {
      success: true,
      hint: hint.trim(),
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      error: 'Failed to generate hint. Please try again.',
    };
  }
};

module.exports = { generateHint };
