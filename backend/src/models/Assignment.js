const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  schemaName: {
    type: String,
    required: true,
    unique: true,
  },
  tableNames: [{
    type: String,
  }],
  expectedOutput: {
    type: String,
  },
  expectedQuery: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
