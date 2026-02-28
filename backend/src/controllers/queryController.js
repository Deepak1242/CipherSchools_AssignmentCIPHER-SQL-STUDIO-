const Assignment = require('../models/Assignment');
const Attempt = require('../models/Attempt');
const { executeQuery } = require('../services/queryExecutor');
const { generateHint } = require('../services/hintGenerator');
const { validateQuery } = require('../services/queryValidator');

const executeUserQuery = async (req, res) => {
  try {
    const { assignmentId, query } = req.body;
    const userId = req.userId;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const result = await executeQuery(assignment.schemaName, query);

    const attempt = new Attempt({
      userId,
      assignmentId,
      query,
      success: result.success,
      result: result.success ? result.data : { error: result.error },
      executionTime: result.executionTime,
    });
    await attempt.save();

    res.json({
      success: result.success,
      data: result.data,
      rowCount: result.rowCount,
      executionTime: result.executionTime,
      error: result.error,
    });
  } catch (error) {
    res.status(500).json({ error: 'Query execution failed' });
  }
};

const getHint = async (req, res) => {
  try {
    const { assignmentId, userQuery } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const hintResult = await generateHint(
      assignment.question,
      userQuery,
      {
        tableNames: assignment.tableNames,
        difficulty: assignment.difficulty,
      }
    );

    if (!hintResult.success) {
      return res.status(500).json({ error: hintResult.error });
    }

    res.json({
      success: true,
      hint: hintResult.hint,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate hint' });
  }
};

const validateUserQuery = async (req, res) => {
  try {
    const { assignmentId, query } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (!assignment.expectedQuery) {
      return res.status(400).json({ error: 'No expected solution available for this assignment' });
    }

    const validationResult = await validateQuery(
      assignment.schemaName,
      query,
      assignment.expectedQuery
    );

    res.json(validationResult);
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
};

const executePlaygroundQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    // Execute query against the learning_playground schema
    const result = await executeQuery('learning_playground', query);

    res.json({
      success: result.success,
      data: result.data,
      rowCount: result.rowCount,
      executionTime: result.executionTime,
      error: result.error,
    });
  } catch (error) {
    res.status(500).json({ error: 'Query execution failed' });
  }
};

module.exports = {
  executeUserQuery,
  getHint,
  validateUserQuery,
  executePlaygroundQuery,
};
