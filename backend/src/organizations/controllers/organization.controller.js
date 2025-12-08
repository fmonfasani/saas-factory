const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const AppError = require('../../utils/AppError');

const prisma = new PrismaClient();

/**
 * Create a new organization
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function createOrganization(req, res, next) {
  try {
    const { name, logo } = req.body;
    const userId = req.user.userId;

    // Use the service function which handles race conditions
    const organization = await createOrganizationWithOwner({
      name,
      userId,
      logo
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List organizations for the current user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function listOrganizations(req, res, next) {
  try {
    const userId = req.user.userId;

    const organizations = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        _count: {
          select: { projects: true }
        }
      }
    });

    res.json({
      success: true,
      organizations
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get organization details
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function getOrganization(req, res, next) {
  try {
    const { id } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: { projects: true }
        }
      }
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    res.json({
      success: true,
      organization
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update organization details
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function updateOrganization(req, res, next) {
  try {
    const { id } = req.params;
    const { name, logo, isActive } = req.body;
    const userId = req.user.userId;
    const userRole = req.membership.role;

    // Only admins and owners can update organization
    if (userRole !== 'admin' && userRole !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only admins and owners can update organization'
      });
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (logo !== undefined) updateData.logo = logo;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update organization
    const organization = await prisma.organization.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }
    next(error);
  }
}

/**
 * Delete organization
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function deleteOrganization(req, res, next) {
  try {
    const { id } = req.params;
    const userRole = req.membership.role;

    // Only owners can delete organization
    if (userRole !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only owners can delete organization'
      });
    }

    // Delete organization (will cascade to members, projects, and invitations)
    await prisma.organization.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }
    next(error);
  }
}

module.exports = {
  createOrganization,
  listOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization
};