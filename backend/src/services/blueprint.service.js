const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BlueprintService {
    /**
     * Get all active blueprints
     * @param {string} category - Optional category filter
     * @returns {Promise<Array>} List of blueprints
     */
    async getAll(category = null) {
        const where = { isActive: true };
        if (category) {
            where.category = category;
        }

        return prisma.blueprint.findMany({
            where,
            orderBy: [
                { popularityScore: 'desc' },
                { name: 'asc' }
            ]
        });
    }

    /**
     * Get blueprint by slug
     * @param {string} slug - Blueprint slug
     * @returns {Promise<Object>} Blueprint object
     */
    async getBySlug(slug) {
        return prisma.blueprint.findUnique({
            where: { slug }
        });
    }

    /**
     * Get popular blueprints
     * @param {number} limit - Number of blueprints to return
     * @returns {Promise<Array>} List of popular blueprints
     */
    async getPopular(limit = 6) {
        return prisma.blueprint.findMany({
            where: { isActive: true },
            orderBy: { popularityScore: 'desc' },
            take: limit
        });
    }

    /**
     * Get unique categories
     * @returns {Promise<Array>} List of categories
     */
    async getCategories() {
        const blueprints = await prisma.blueprint.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category']
        });
        return blueprints.map(b => b.category);
    }

    /**
     * Increment popularity score
     * @param {string} id - Blueprint ID
     * @returns {Promise<Object>} Updated blueprint
     */
    async incrementUsage(id) {
        return prisma.blueprint.update({
            where: { id },
            data: {
                popularityScore: { increment: 1 }
            }
        });
    }

    /**
     * Create a new blueprint (admin only)
     * @param {Object} data - Blueprint data
     * @returns {Promise<Object>} Created blueprint
     */
    async create(data) {
        return prisma.blueprint.create({ data });
    }
}

module.exports = new BlueprintService();
