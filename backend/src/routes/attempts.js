const express = require('express');
const router = express.Router();
const { getUserAttempts, getAllUserAttempts } = require('../controllers/attemptController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllUserAttempts);
router.get('/:assignmentId', auth, getUserAttempts);

module.exports = router;
