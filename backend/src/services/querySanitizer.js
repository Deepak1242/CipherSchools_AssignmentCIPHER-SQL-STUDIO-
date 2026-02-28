const DANGEROUS_KEYWORDS = [
  'DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER', 'TRUNCATE',
  'EXEC', 'EXECUTE', 'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK',
  'SAVEPOINT', 'SET', 'SHOW', 'DESCRIBE', 'USE', 'PRAGMA'
];

const ALLOWED_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
  'ON', 'AND', 'OR', 'IN', 'NOT', 'LIKE', 'BETWEEN', 'IS', 'NULL',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS',
  'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
];

const sanitizeQuery = (query) => {
  const upperQuery = query.toUpperCase();
  
  for (const keyword of DANGEROUS_KEYWORDS) {
    const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
    if (pattern.test(query)) {
      throw new Error(`Dangerous SQL keyword detected: ${keyword}`);
    }
  }

  if (!upperQuery.includes('SELECT')) {
    throw new Error('Only SELECT queries are allowed');
  }

  if (query.includes(';') && query.trim().indexOf(';') !== query.trim().length - 1) {
    throw new Error('Multiple SQL statements are not allowed');
  }

  if (query.includes('--') || query.includes('/*') || query.includes('*/')) {
    throw new Error('SQL comments are not allowed');
  }

  return query.trim().replace(/;+$/, '');
};

const validateQuerySafety = (query) => {
  try {
    return {
      isValid: true,
      sanitizedQuery: sanitizeQuery(query),
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
    };
  }
};

module.exports = { sanitizeQuery, validateQuerySafety };
