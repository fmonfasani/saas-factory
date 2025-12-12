const express = require('express');
const router = express.Router({ mergeParams: true }); // Allow accessing :projectId from parent route
const dynamicDataService = require('../services/dynamic-data.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to verify project access/ownership
const checkProjectAccess = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        // In a real generic public API, we might allow public read access
        // For this MVP generator, we assume these are admin routes for the project owner
        // OR public API routes for the generated app (which might need API keys later)

        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // TODO: Verify user is member of project's organization via req.user
        // For now, allowing access to enable quick testing

        next();
    } catch (error) {
        console.error('Project access check failed:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

router.use(checkProjectAccess);

/**
 * GET /api/projects/:projectId/data/:modelName
 * List records
 */
router.get('/:modelName', async (req, res) => {
    try {
        const { projectId, modelName } = req.params;
        const records = await dynamicDataService.listRecords(projectId, modelName, req.query);
        res.json(records);
    } catch (error) {
        console.error('List records error:', error);
        res.status(500).json({ error: 'Failed to list records' });
    }
});

/**
 * POST /api/projects/:projectId/data/:modelName
 * Create record
 */
router.post('/:modelName', async (req, res) => {
    try {
        const { projectId, modelName } = req.params;
        const record = await dynamicDataService.createRecord(projectId, modelName, req.body);
        res.status(201).json(record);
    } catch (error) {
        console.error('Create record error:', error);
        res.status(500).json({ error: 'Failed to create record' });
    }
});

/**
 * GET /api/projects/:projectId/data/:modelName/:id
 * Get single record
 */
router.get('/:modelName/:id', async (req, res) => {
    try {
        const { projectId, id } = req.params;
        const record = await dynamicDataService.getRecord(id, projectId);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json(record);
    } catch (error) {
        console.error('Get record error:', error);
        res.status(500).json({ error: 'Failed to get record' });
    }
});

/**
 * PUT /api/projects/:projectId/data/:modelName/:id
 * Update record
 */
router.put('/:modelName/:id', async (req, res) => {
    try {
        const { projectId, id } = req.params;
        const record = await dynamicDataService.updateRecord(id, projectId, req.body);
        res.json(record);
    } catch (error) {
        if (error.message === 'Record not found') {
            return res.status(404).json({ error: 'Record not found' });
        }
        console.error('Update record error:', error);
        res.status(500).json({ error: 'Failed to update record' });
    }
});

/**
 * DELETE /api/projects/:projectId/data/:modelName/:id
 * Delete record
 */
router.delete('/:modelName/:id', async (req, res) => {
    try {
        const { projectId, id } = req.params;
        const success = await dynamicDataService.deleteRecord(id, projectId);

        if (!success) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Delete record error:', error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

module.exports = router;
