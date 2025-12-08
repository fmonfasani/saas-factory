const { body, param, validationResult } = require('express-validator');
const AppError = require('../../utils/AppError');

// Validation rules for creating a project
const createProjectRules = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters')
    .notEmpty()
    .withMessage('Project name is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('idea')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Idea must be less than 1000 characters'),
  body('market')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Market description must be less than 500 characters'),
  body('coreFeatures')
    .optional()
    .isArray()
    .withMessage('Core features must be an array'),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array'),
  body('mvpPlan')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('MVP plan must be less than 1000 characters'),
  body('gtmPlan')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Go-to-market plan must be less than 1000 characters')
];

// Validation rules for updating a project
const updateProjectRules = [
  param('id')
    .isUUID()
    .withMessage('Project ID must be a valid UUID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('idea')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Idea must be less than 1000 characters'),
  body('market')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Market description must be less than 500 characters'),
  body('coreFeatures')
    .optional()
    .isArray()
    .withMessage('Core features must be an array'),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array'),
  body('mvpPlan')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('MVP plan must be less than 1000 characters'),
  body('gtmPlan')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Go-to-market plan must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'archived'])
    .withMessage('Status must be one of: draft, active, archived')
];

// Validation rules for getting/deleting a project
const projectIdRules = [
  param('id')
    .isUUID()
    .withMessage('Project ID must be a valid UUID')
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(400, `Validation failed: ${errorMessages.join(', ')}`));
  }
  next();
};

module.exports = {
  createProjectRules,
  updateProjectRules,
  projectIdRules,
  validate
};