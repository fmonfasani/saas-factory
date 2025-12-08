const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const AppError = require('../../utils/AppError');

const prisma = new PrismaClient();

/**
 * Generate a unique slug for an organization
 * @param {string} name - Organization name
 * @returns {Promise<string>} Unique slug
 */
async function generateUniqueSlug(name) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  
  // Ensure slug uniqueness with retry logic to handle race conditions
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    try {
      // Try to find an organization with this slug
      const existingOrg = await prisma.organization.findUnique({ 
        where: { slug } 
      });
      
      if (!existingOrg) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
        attempts++;
      }
    } catch (error) {
      // If there's an error checking for uniqueness, increment and try again
      slug = `${baseSlug}-${counter}`;
      counter++;
      attempts++;
    }
  }
  
  if (!isUnique) {
    throw new AppError(500, 'Unable to generate unique organization slug after maximum attempts');
  }
  
  return slug;
}

/**
 * Create a new organization with owner membership
 * @param {Object} params - Organization creation parameters
 * @param {string} params.name - Organization name
 * @param {string} params.userId - Owner user ID
 * @param {string} [params.logo] - Organization logo URL
 * @returns {Promise<Object>} Created organization with membership
 */
async function createOrganizationWithOwner(params) {
  const { name, userId, logo } = params;
  
  // Generate unique slug with retry logic
  const slug = await generateUniqueSlug(name);
  
  // Create organization with retry logic to handle race conditions
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      return await prisma.organization.create({
        data: {
          name,
          slug,
          logo,
          members: {
            create: {
              userId,
              role: 'owner'
            }
          }
        },
        include: {
          members: true
        }
      });
    } catch (error) {
      // If it's a unique constraint violation, regenerate slug and try again
      if (error.code === 'P2002') { // Unique constraint violation
        attempts++;
        if (attempts >= maxAttempts) {
          throw new AppError(500, 'Unable to create organization after multiple attempts due to slug conflicts');
        }
        // Regenerate slug and try again
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100)); // Random delay
      } else {
        // For other errors, re-throw
        throw error;
      }
    }
  }
}

/**
 * Check if user is a member of an organization
 * @param {string} userId - User ID
 * @param {string} organizationId - Organization ID
 * @returns {Promise<boolean>} True if user is a member
 */
async function isUserMemberOfOrganization(userId, organizationId) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId
      }
    }
  });
  
  return !!membership;
}

/**
 * Check if user has required role in organization
 * @param {string} userId - User ID
 * @param {string} organizationId - Organization ID
 * @param {string[]} roles - Allowed roles
 * @returns {Promise<boolean>} True if user has required role
 */
async function userHasRoleInOrganization(userId, organizationId, roles) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId
      }
    }
  });
  
  return membership && roles.includes(membership.role);
}

module.exports = {
  createOrganizationWithOwner,
  isUserMemberOfOrganization,
  userHasRoleInOrganization
};