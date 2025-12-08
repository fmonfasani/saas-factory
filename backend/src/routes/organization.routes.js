const express = require('express');
const router = express.Router();
const organizationController = require('../organizations/controllers/organization.controller');
const { authenticateJWT } = require('../auth/middleware/auth.middleware');
const { requireOrgAccess } = require('../auth/middleware/tenant.middleware');
const {
  createOrganizationRules,
  updateOrganizationRules,
  organizationIdRules,
  validate
} = require('../organizations/validators/organization.validator');

// Create organization (authenticated users only)
router.post('/', authenticateJWT, createOrganizationRules, validate, organizationController.createOrganization);

// List organizations for current user
router.get('/', authenticateJWT, organizationController.listOrganizations);

// Get organization details
router.get('/:id', authenticateJWT, requireOrgAccess, organizationIdRules, validate, organizationController.getOrganization);

// Update organization (admin/owner only)
router.put('/:id', authenticateJWT, requireOrgAccess, updateOrganizationRules, validate, organizationController.updateOrganization);

// Delete organization (owner only)
router.delete('/:id', authenticateJWT, requireOrgAccess, organizationIdRules, validate, organizationController.deleteOrganization);

module.exports = router;