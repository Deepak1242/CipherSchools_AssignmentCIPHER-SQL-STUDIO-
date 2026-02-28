const Assignment = require('../models/Assignment');
const Attempt = require('../models/Attempt');
const { executeQuery } = require('../services/queryExecutor');
const { generateHint } = require('../services/hintGenerator');

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

module.exports = {
  executeUserQuery,
  getHint,
};
