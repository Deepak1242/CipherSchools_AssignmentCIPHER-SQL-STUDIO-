const Assignment = require('../models/Assignment');
const { getSampleData, getTableSchema } = require('../services/queryExecutor');

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .select('title description difficulty question')
      .sort({ difficulty: 1, createdAt: 1 });

    res.json({
      success: true,
      assignments,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const sampleDataResult = await getSampleData(
      assignment.schemaName,
      assignment.tableNames
    );

    const schemaResult = await getTableSchema(
      assignment.schemaName,
      assignment.tableNames
    );

    res.json({
      success: true,
      assignment: {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        difficulty: assignment.difficulty,
        question: assignment.question,
        tableNames: assignment.tableNames,
      },
      sampleData: sampleDataResult.success ? sampleDataResult.data : {},
      tableSchema: schemaResult.success ? schemaResult.data : {},
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment details' });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
};
