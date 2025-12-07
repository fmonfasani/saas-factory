'use client';

import { useState, useEffect } from 'react';

interface SaaSData {
  name: string;
  idea: string;
  market: string;
  core_features: string;
  tech_stack: string;
  mvp_plan: string;
  gtm_plan: string;
}

export default function Dashboard() {
  const [saasData, setSaasData] = useState<SaaSData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSaasData();
  }, []);

  const fetchSaasData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/saas');
      if (!response.ok) {
        throw new Error('Failed to fetch SaaS data');
      }
      const data = await response.json();
      setSaasData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateLanding = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate landing page');
      }
      alert('Landing page generated successfully!');
    } catch (err) {
      alert('Error generating landing page: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your SaaS landing pages</p>
          </div>
          <button
            onClick={generateLanding}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Generate Landing Page
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saasData.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-2">No SaaS Projects Yet</h3>
              <p className="text-gray-600 mb-6">
                Add your first SaaS project to Google Sheets to get started
              </p>
              <a
                href={process.env.NEXT_PUBLIC_SPREADSHEET_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Open Google Sheets
              </a>
            </div>
          ) : (
            saasData.map((saas, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{saas.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{saas.idea}</p>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Market:</span>
                    <p className="text-gray-600 line-clamp-1">{saas.market}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Tech Stack:</span>
                    <p className="text-gray-600 line-clamp-1">{saas.tech_stack}</p>
                  </div>
                </div>
                
                <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{saasData.length}</div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600">Generated Pages</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-600">Active Campaigns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
