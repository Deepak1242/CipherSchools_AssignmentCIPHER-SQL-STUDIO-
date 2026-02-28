const express = require('express');
const router = express.Router();
const { executeUserQuery, getHint, validateUserQuery } = require('../controllers/queryController');
const { validate, queryValidation } = require('../middleware/validator');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const queryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many query executions. Please try again later.' },
});

const hintLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many hint requests. Please try again later.' },
});

router.post('/execute', auth, queryLimiter, validate(queryValidation), executeUserQuery);
router.post('/hint', auth, hintLimiter, getHint);
router.post('/validate', auth, queryLimiter, validate(queryValidation), validateUserQuery);

module.exports = router;
