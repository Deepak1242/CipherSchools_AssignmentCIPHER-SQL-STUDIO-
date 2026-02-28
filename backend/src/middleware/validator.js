const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ 
        error: firstError,
        errors: errors.array() 
      });
    }
    next();
  };
};

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const queryValidation = [
  body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
  body('query').notEmpty().withMessage('SQL query is required'),
];

module.exports = {
  validate,
  signupValidation,
  loginValidation,
  queryValidation,
};
