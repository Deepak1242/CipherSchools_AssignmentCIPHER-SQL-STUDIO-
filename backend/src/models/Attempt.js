const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    default: false,
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
  },
  executionTime: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

attemptSchema.index({ userId: 1, assignmentId: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
