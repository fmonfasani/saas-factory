import { GeneratedSaaSData } from '@/types';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${process.env.NEXT_PUBLIC_API_PREFIX || '/api'}`;

export class GenerateApi {
  static async analyzePrompt(prompt: string): Promise<{ success: boolean; data?: GeneratedSaaSData; error?: string; jobId?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      return {
        success: false,
        error: 'Failed to analyze prompt',
      };
    }
  }

  static async generateLandingPage(saasData: GeneratedSaaSData, variant?: string): Promise<{ success: boolean; html?: string; error?: string; jobId?: string; variant?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate/landing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saasData, variant }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error generating landing page:', error);
      return {
        success: false,
        error: 'Failed to generate landing page',
      };
    }
  }
}