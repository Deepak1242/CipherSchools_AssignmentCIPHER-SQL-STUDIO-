const { executeInSchema } = require('../config/database');
const { validateQuerySafety } = require('./querySanitizer');

const executeQuery = async (schemaName, query) => {
  const validation = validateQuerySafety(query);
  
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    const startTime = Date.now();
    
    const result = await Promise.race([
      executeInSchema(schemaName, validation.sanitizedQuery),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
      ),
    ]);

    const executionTime = Date.now() - startTime;

    const rows = result.rows.slice(0, 1000);

    return {
      success: true,
      data: rows,
      rowCount: result.rowCount,
      executionTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Query execution failed',
    };
  }
};

const getSampleData = async (schemaName, tableNames) => {
  try {
    const sampleData = {};

    for (const tableName of tableNames) {
      const result = await executeInSchema(
        schemaName,
        `SELECT * FROM ${tableName} LIMIT 5`
      );
      sampleData[tableName] = result.rows;
    }

    return {
      success: true,
      data: sampleData,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const getTableSchema = async (schemaName, tableNames) => {
  try {
    const schemas = {};

    for (const tableName of tableNames) {
      const result = await executeInSchema(
        schemaName,
        `SELECT column_name, data_type, is_nullable 
         FROM information_schema.columns 
         WHERE table_schema = $1 AND table_name = $2 
         ORDER BY ordinal_position`,
        [schemaName, tableName]
      );
      schemas[tableName] = result.rows;
    }

    return {
      success: true,
      data: schemas,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  executeQuery,
  getSampleData,
  getTableSchema,
};
