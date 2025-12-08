const projectService = require('../services/project.service');
const AppError = require('../../utils/AppError');

/**
 * Create a new project in an organization
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function createProject(req, res, next) {
  try {
    const { orgId: organizationId } = req.params;
    const { name, description, idea, market, coreFeatures, techStack, mvpPlan, gtmPlan } = req.body;

    // Create project
    const project = await projectService.createProject({
      organizationId,
      name,
      description,
      idea,
      market,
      coreFeatures,
      techStack,
      mvpPlan,
      gtmPlan
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List projects in an organization
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function listProjects(req, res, next) {
  try {
    const { orgId: organizationId } = req.params;

    const projects = await projectService.listProjects(organizationId);

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get specific project
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const { orgId: organizationId } = req.params;

    const project = await projectService.getProject(id, organizationId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update project
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const { orgId: organizationId } = req.params;
    const { name, description, idea, market, coreFeatures, techStack, mvpPlan, gtmPlan, status } = req.body;

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (idea !== undefined) updateData.idea = idea;
    if (market !== undefined) updateData.market = market;
    if (coreFeatures !== undefined) updateData.coreFeatures = coreFeatures;
    if (techStack !== undefined) updateData.techStack = techStack;
    if (mvpPlan !== undefined) updateData.mvpPlan = mvpPlan;
    if (gtmPlan !== undefined) updateData.gtmPlan = gtmPlan;
    if (status !== undefined) updateData.status = status;

    // Update project
    const project = await projectService.updateProject(id, organizationId, updateData);

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    next(error);
  }
}

/**
 * Delete project
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const { orgId: organizationId } = req.params;

    // Delete project
    await projectService.deleteProject(id, organizationId);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    next(error);
  }
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject
};