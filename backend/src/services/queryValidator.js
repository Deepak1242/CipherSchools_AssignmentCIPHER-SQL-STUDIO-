const { executeQuery } = require('./queryExecutor');

const normalizeData = (rows) => {
  if (!rows || rows.length === 0) return [];
  
  return rows.map(row => {
    const normalized = {};
    Object.keys(row).forEach(key => {
      const value = row[key];
      if (value instanceof Date) {
        normalized[key.toLowerCase()] = value.toISOString();
      } else if (typeof value === 'number') {
        normalized[key.toLowerCase()] = parseFloat(value.toFixed(2));
      } else {
        normalized[key.toLowerCase()] = value;
      }
    });
    return normalized;
  });
};

const compareResults = (userRows, expectedRows) => {
  const normalizedUser = normalizeData(userRows);
  const normalizedExpected = normalizeData(expectedRows);

  if (normalizedUser.length !== normalizedExpected.length) {
    return {
      match: false,
      reason: `Row count mismatch: expected ${normalizedExpected.length} rows, got ${normalizedUser.length} rows`
    };
  }

  if (normalizedUser.length === 0) {
    return { match: true };
  }

  const userColumns = Object.keys(normalizedUser[0]).sort();
  const expectedColumns = Object.keys(normalizedExpected[0]).sort();

  if (JSON.stringify(userColumns) !== JSON.stringify(expectedColumns)) {
    return {
      match: false,
      reason: `Column mismatch: expected columns [${expectedColumns.join(', ')}], got [${userColumns.join(', ')}]`
    };
  }

  for (let i = 0; i < normalizedUser.length; i++) {
    const userRow = normalizedUser[i];
    const expectedRow = normalizedExpected[i];

    for (const col of userColumns) {
      if (JSON.stringify(userRow[col]) !== JSON.stringify(expectedRow[col])) {
        return {
          match: false,
          reason: `Data mismatch in row ${i + 1}, column '${col}': expected '${expectedRow[col]}', got '${userRow[col]}'`
        };
      }
    }
  }

  return { match: true };
};

const validateQuery = async (schemaName, userQuery, expectedQuery) => {
  try {
    const userResult = await executeQuery(schemaName, userQuery);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error,
        isCorrect: false
      };
    }

    const expectedResult = await executeQuery(schemaName, expectedQuery);
    if (!expectedResult.success) {
      return {
        success: false,
        error: 'Failed to execute expected query',
        isCorrect: false
      };
    }

    const comparison = compareResults(userResult.data, expectedResult.data);

    return {
      success: true,
      isCorrect: comparison.match,
      userRowCount: userResult.data.length,
      expectedRowCount: expectedResult.data.length,
      feedback: comparison.match 
        ? 'Excellent! Your query produces the correct results.' 
        : comparison.reason,
      userResult: userResult.data,
      expectedResult: expectedResult.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Validation failed',
      isCorrect: false
    };
  }
};

module.exports = {
  validateQuery,
  compareResults,
};
