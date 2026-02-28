const express = require('express');
const router = express.Router();
const { getAllAssignments, getAssignmentById } = require('../controllers/assignmentController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllAssignments);
router.get('/:id', auth, getAssignmentById);

module.exports = router;
