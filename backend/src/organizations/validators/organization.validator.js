const { body, param, validationResult } = require('express-validator');
const AppError = require('../../utils/AppError');

// Validation rules for creating an organization
const createOrganizationRules = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Organization name must be between 1 and 100 characters')
    .notEmpty()
    .withMessage('Organization name is required'),
  body('logo')
    .optional()
    .isURL()
    .withMessage('Logo must be a valid URL')
];

// Validation rules for updating an organization
const updateOrganizationRules = [
  param('id')
    .isUUID()
    .withMessage('Organization ID must be a valid UUID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Organization name must be between 1 and 100 characters'),
  body('logo')
    .optional()
    .isURL()
    .withMessage('Logo must be a valid URL'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Validation rules for getting/deleting an organization
const organizationIdRules = [
  param('id')
    .isUUID()
    .withMessage('Organization ID must be a valid UUID')
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
  createOrganizationRules,
  updateOrganizationRules,
  organizationIdRules,
  validate
};