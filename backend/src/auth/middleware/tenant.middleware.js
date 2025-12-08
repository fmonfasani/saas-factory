const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Extract tenant (organization) from JWT token or header
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function extractTenant(req, res, next) {
  try {
    // Extract organizationId from JWT token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      
      // Check if organizationId is in the token
      if (decoded.organizationId) {
        req.organizationId = decoded.organizationId;
      }
    }
    
    // If not in token, check for X-Organization-Id header
    if (!req.organizationId) {
      const orgIdHeader = req.headers['x-organization-id'];
      if (orgIdHeader) {
        req.organizationId = orgIdHeader;
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require organization access middleware
 * Verifies that the authenticated user is a member of the requested organization
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function requireOrgAccess(req, res, next) {
  try {
    // If no organizationId was provided, return error
    if (!req.organizationId) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID is required'
      });
    }
    
    // Verify user is authenticated
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check if user is a member of the organization
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: req.userId,
          organizationId: req.organizationId
        }
      }
    });
    
    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a member of this organization'
      });
    }
    
    // Add membership info to request for use in controllers
    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  extractTenant,
  requireOrgAccess
};