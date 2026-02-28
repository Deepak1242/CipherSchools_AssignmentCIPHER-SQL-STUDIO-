const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser } = require('../controllers/authController');
const { validate, signupValidation, loginValidation } = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/signup', validate(signupValidation), signup);
router.post('/login', validate(loginValidation), login);
router.get('/me', auth, getCurrentUser);

module.exports = router;
