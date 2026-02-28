const { getGeminiModel } = require('../config/gemini');

const generateFallbackHint = (question, userQuery, assignmentData) => {
  const hints = {
    select: "Try using the SELECT statement to choose specific columns. What columns does the question ask for?",
    where: "You might need a WHERE clause to filter your results. What condition should the data meet?",
    join: "This question requires combining data from multiple tables. Consider using JOIN to connect related tables.",
    group: "For calculations like totals or counts, think about using GROUP BY with aggregate functions like COUNT(), SUM(), or AVG().",
    order: "Don't forget to sort your results! The ORDER BY clause can arrange data in ascending (ASC) or descending (DESC) order.",
    date: "Working with dates? Try using date functions like EXTRACT() or date comparison operators.",
    count: "To count rows, use the COUNT() function. Remember to use COUNT(*) for all rows or COUNT(column) for non-null values.",
  };

  const questionLower = question.toLowerCase();
  const queryLower = (userQuery || '').toLowerCase();

  if (questionLower.includes('join') || questionLower.includes('multiple tables')) {
    return hints.join;
  } else if (questionLower.includes('total') || questionLower.includes('sum') || questionLower.includes('group')) {
    return hints.group;
  } else if (questionLower.includes('count') || questionLower.includes('number of')) {
    return hints.count;
  } else if (questionLower.includes('sort') || questionLower.includes('order')) {
    return hints.order;
  } else if (questionLower.includes('date') || questionLower.includes('year')) {
    return hints.date;
  } else if (questionLower.includes('where') || questionLower.includes('filter') || questionLower.includes('greater than')) {
    return hints.where;
  } else {
    return hints.select;
  }
};

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
    console.error('Gemini API error:', error.message);
    
    // Fallback to rule-based hints if Gemini fails
    const fallbackHint = generateFallbackHint(question, userQuery, assignmentData);
    return {
      success: true,
      hint: fallbackHint + "\n\n(AI hint service temporarily unavailable - showing basic guidance)",
    };
  }
};

module.exports = { generateHint };
