const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');

const prisma = new PrismaClient();

/**
 * Create a new project in an organization
 * @param {Object} params - Project creation parameters
 * @param {string} params.organizationId - Organization ID
 * @param {string} params.name - Project name
 * @param {string} [params.description] - Project description
 * @param {string} [params.idea] - SaaS idea
 * @param {string} [params.market] - Target market
 * @param {string[]} [params.coreFeatures] - Core features
 * @param {string[]} [params.techStack] - Technology stack
 * @param {string} [params.mvpPlan] - MVP plan
 * @param {string} [params.gtmPlan] - Go-to-market plan
 * @returns {Promise<Object>} Created project
 */
async function createProject(params) {
  const { 
    organizationId, 
    name, 
    description, 
    idea, 
    market, 
    coreFeatures, 
    techStack, 
    mvpPlan, 
    gtmPlan 
  } = params;

  return await prisma.project.create({
    data: {
      organizationId,
      name,
      description,
      idea,
      market,
      coreFeatures,
      techStack,
      mvpPlan,
      gtmPlan
    }
  });
}

/**
 * List projects in an organization
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Array>} Array of projects
 */
async function listProjects(organizationId) {
  return await prisma.project.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get specific project
 * @param {string} id - Project ID
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object|null>} Project or null if not found
 */
async function getProject(id, organizationId) {
  return await prisma.project.findUnique({
    where: { 
      id,
      organizationId 
    }
  });
}

/**
 * Update project
 * @param {string} id - Project ID
 * @param {string} organizationId - Organization ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated project
 */
async function updateProject(id, organizationId, updateData) {
  return await prisma.project.update({
    where: { 
      id,
      organizationId 
    },
    data: updateData
  });
}

/**
 * Delete project
 * @param {string} id - Project ID
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} Deleted project
 */
async function deleteProject(id, organizationId) {
  return await prisma.project.delete({
    where: { 
      id,
      organizationId 
    }
  });
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject
};