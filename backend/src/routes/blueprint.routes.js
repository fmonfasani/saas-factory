const express = require('express');
const router = express.Router();
const blueprintService = require('../services/blueprint.service');

/**
 * GET /api/blueprints
 * Get all blueprints with optional category filter
 */
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const blueprints = await blueprintService.getAll(category);
        res.json(blueprints);
    } catch (error) {
        console.error('Error fetching blueprints:', error);
        res.status(500).json({ error: 'Failed to fetch blueprints' });
    }
});

/**
 * GET /api/blueprints/popular
 * Get popular blueprints
 */
router.get('/popular', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const blueprints = await blueprintService.getPopular(limit);
        res.json(blueprints);
    } catch (error) {
        console.error('Error fetching popular blueprints:', error);
        res.status(500).json({ error: 'Failed to fetch popular blueprints' });
    }
});

/**
 * GET /api/blueprints/categories
 * Get all unique categories
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await blueprintService.getCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

/**
 * GET /api/blueprints/:slug
 * Get blueprint by slug
 */
router.get('/:slug', async (req, res) => {
    try {
        const blueprint = await blueprintService.getBySlug(req.params.slug);
        if (!blueprint) {
            return res.status(404).json({ error: 'Blueprint not found' });
        }
        res.json(blueprint);
    } catch (error) {
        console.error('Error fetching blueprint:', error);
        res.status(500).json({ error: 'Failed to fetch blueprint' });
    }
});

/**
 * POST /api/blueprints/:id/use
 * Increment usage counter when a blueprint is used
 */
router.post('/:id/use', async (req, res) => {
    try {
        const blueprint = await blueprintService.incrementUsage(req.params.id);
        res.json(blueprint);
    } catch (error) {
        console.error('Error incrementing blueprint usage:', error);
        res.status(500).json({ error: 'Failed to update blueprint' });
    }
});

module.exports = router;
