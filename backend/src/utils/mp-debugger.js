// backend/src/utils/mp-debugger.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MercadoPagoDebugger {
  /**
   * Log transaction details for debugging
   */
  static async logTransaction(type, data, userId, organizationId) {
    try {
      await prisma.mPTransactionLog.create({
        data: {
          type,
          data,
          userId,
          organizationId
        }
      });
    } catch (error) {
      console.error('Error logging MP transaction:', error);
    }
  }

  /**
   * Get transaction logs for an organization
   */
  static async getTransactionLogs(organizationId, limit = 50) {
    try {
      const logs = await prisma.mPTransactionLog.findMany({
        where: {
          organizationId: organizationId
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });
      return logs;
    } catch (error) {
      console.error('Error fetching MP transaction logs:', error);
      return [];
    }
  }

  /**
   * Find failed transactions
   */
  static async getFailedTransactions(days = 7) {
    try {
      const logs = await prisma.mPTransactionLog.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          },
          OR: [
            {
              data: {
                path: ['status'],
                equals: 'failed'
              }
            },
            {
              data: {
                path: ['status'],
                equals: 'error'
              }
            }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return logs;
    } catch (error) {
      console.error('Error fetching failed MP transactions:', error);
      return [];
    }
  }

  /**
   * Analyze webhook delivery issues
   */
  static async analyzeWebhookIssues() {
    try {
      const issues = await prisma.$queryRaw`
        SELECT 
          "type",
          COUNT(*) as count,
          MAX("createdAt") as "lastOccurrence"
        FROM "MPTransactionLog"
        WHERE "data"->>'webhookStatus' = 'failed'
        GROUP BY "type"
        ORDER BY count DESC
      `;
      return issues;
    } catch (error) {
      console.error('Error analyzing MP webhook issues:', error);
      return [];
    }
  }

  /**
   * Validate Mercado Pago configuration
   */
  static validateConfiguration() {
    const requiredEnvVars = [
      'MP_ACCESS_TOKEN',
      'BACKEND_URL',
      'FRONTEND_URL'
    ];

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    return {
      valid: missingVars.length === 0,
      missingEnvVars: missingVars,
      webhookUrl: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/billing/mp/webhook` : null
    };
  }

  /**
   * Format error for better readability
   */
  static formatError(error) {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name
      };
    }
    return { message: String(error) };
  }

  /**
   * Generate diagnostic report
   */
  static async generateDiagnosticReport() {
    const config = this.validateConfiguration();
    
    const recentLogs = await prisma.mPTransactionLog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    const failedLogs = await this.getFailedTransactions(7);
    
    return {
      timestamp: new Date().toISOString(),
      configuration: config,
      recentActivity: recentLogs,
      recentFailures: failedLogs,
      summary: {
        totalLogs: recentLogs.length,
        failedLogs: failedLogs.length,
        successRate: recentLogs.length > 0 
          ? ((recentLogs.length - failedLogs.length) / recentLogs.length * 100).toFixed(2) + '%'
          : 'N/A'
      }
    };
  }
}

module.exports = MercadoPagoDebugger;