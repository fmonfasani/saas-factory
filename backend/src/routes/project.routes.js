const express = require('express');
const router = express.Router();
const projectController = require('../projects/controllers/project.controller');
const { authenticateJWT } = require('../auth/middleware/auth.middleware');
const { requireOrgAccess } = require('../auth/middleware/tenant.middleware');
const {
  createProjectRules,
  updateProjectRules,
  projectIdRules,
  validate
} = require('../projects/validators/project.validator');

// Create project in organization
router.post('/', authenticateJWT, requireOrgAccess, createProjectRules, validate, projectController.createProject);

// List projects in organization
router.get('/', authenticateJWT, requireOrgAccess, projectController.listProjects);

// Get specific project
router.get('/:id', authenticateJWT, requireOrgAccess, projectIdRules, validate, projectController.getProject);

// Update project
router.put('/:id', authenticateJWT, requireOrgAccess, updateProjectRules, validate, projectController.updateProject);

// Delete project
router.delete('/:id', authenticateJWT, requireOrgAccess, projectIdRules, validate, projectController.deleteProject);

// Get project HTML preview
router.get('/:id/preview', authenticateJWT, requireOrgAccess, projectIdRules, validate, projectController.getProjectPreview);

module.exports = router;