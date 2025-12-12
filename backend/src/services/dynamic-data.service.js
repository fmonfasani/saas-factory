const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DynamicDataService {
    /**
     * Create a new record for a project model
     * @param {string} projectId - Project ID
     * @param {string} modelName - Name of the entity/model
     * @param {Object} data - Record data
     * @returns {Promise<Object>} Created record
     */
    async createRecord(projectId, modelName, data) {
        if (!projectId || !modelName || !data) {
            throw new Error('Missing required fields');
        }

        const record = await prisma.dynamicRecord.create({
            data: {
                projectId,
                modelName,
                data
            }
        });

        return this._formatRecord(record);
    }

    /**
     * List records for a project model
     * @param {string} projectId - Project ID
     * @param {string} modelName - Name of the entity/model
     * @param {Object} query - Query parameters (limit, offset)
     * @returns {Promise<Array>} List of records
     */
    async listRecords(projectId, modelName, query = {}) {
        const { limit = 50, offset = 0 } = query;
        const take = Math.min(parseInt(limit), 100);
        const skip = parseInt(offset);

        const records = await prisma.dynamicRecord.findMany({
            where: {
                projectId,
                modelName
            },
            take,
            skip,
            orderBy: { createdAt: 'desc' }
        });

        return records.map(this._formatRecord);
    }

    /**
     * Get a single record by ID
     * @param {string} id - Record ID
     * @param {string} projectId - Project ID (security check)
     * @returns {Promise<Object>} Record
     */
    async getRecord(id, projectId) {
        const record = await prisma.dynamicRecord.findFirst({
            where: {
                id,
                projectId
            }
        });

        if (!record) return null;
        return this._formatRecord(record);
    }

    /**
     * Update a record
     * @param {string} id - Record ID
     * @param {string} projectId - Project ID
     * @param {Object} updates - Data updates
     * @returns {Promise<Object>} Updated record
     */
    async updateRecord(id, projectId, updates) {
        const record = await prisma.dynamicRecord.findFirst({
            where: { id, projectId } // Validate ownership first
        });

        if (!record) throw new Error('Record not found');

        const updated = await prisma.dynamicRecord.update({
            where: { id },
            data: {
                data: {
                    // Shallow merge of existing data with updates
                    ...(record.data),
                    ...updates
                }
            }
        });

        return this._formatRecord(updated);
    }

    /**
     * Delete a record
     * @param {string} id - Record ID
     * @param {string} projectId - Project ID
     * @returns {Promise<boolean>} Success
     */
    async deleteRecord(id, projectId) {
        const result = await prisma.dynamicRecord.deleteMany({
            where: {
                id,
                projectId
            }
        });

        return result.count > 0;
    }

    /**
     * Helper to format output (flattens structure slightly)
     */
    _formatRecord(record) {
        return {
            id: record.id,
            model: record.modelName,
            ...record.data,
            _meta: {
                createdAt: record.createdAt,
                updatedAt: record.updatedAt
            }
        };
    }
}

module.exports = new DynamicDataService();
