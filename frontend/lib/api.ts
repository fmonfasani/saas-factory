interface SaaSData {
  name: string;
  idea: string;
  market: string;
  core_features: string;
  tech_stack: string;
  mvp_plan: string;
  gtm_plan: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  async getSaasList(): Promise<SaaSData[]> {
    try {
      const response = await fetch(`${API_URL}/api/saas`);
      if (!response.ok) {
        throw new Error('Failed to fetch SaaS list');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching SaaS list:', error);
      throw error;
    }
  },

  async getLatestSaas(): Promise<SaaSData> {
    try {
      const response = await fetch(`${API_URL}/api/saas/latest`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest SaaS');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest SaaS:', error);
      throw error;
    }
  },

  async generateLanding(): Promise<{ success: boolean; url?: string }> {
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to generate landing page');
      }
      return await response.json();
    } catch (error) {
      console.error('Error generating landing page:', error);
      throw error;
    }
  },
};

export type { SaaSData };
