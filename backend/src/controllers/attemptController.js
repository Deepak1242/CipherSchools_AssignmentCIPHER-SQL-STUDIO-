const Attempt = require('../models/Attempt');

const getUserAttempts = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.userId;

    const attempts = await Attempt.find({ userId, assignmentId })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('query success timestamp executionTime');

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
};

const getAllUserAttempts = async (req, res) => {
  try {
    const userId = req.userId;

    const attempts = await Attempt.find({ userId })
      .populate('assignmentId', 'title difficulty')
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
};

module.exports = {
  getUserAttempts,
  getAllUserAttempts,
};
