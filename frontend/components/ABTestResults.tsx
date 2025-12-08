'use client';

import { useState, useEffect } from 'react';

interface ABTestResults {
  A: {
    views: number;
    totalGenerations: number;
    avgGenerationTime: number;
    totalRatings: number;
    avgRating: number;
    previewViews: number;
  };
  B: {
    views: number;
    totalGenerations: number;
    avgGenerationTime: number;
    totalRatings: number;
    avgRating: number;
    previewViews: number;
  };
}

export function ABTestResults() {
  const [results, setResults] = useState<ABTestResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${process.env.NEXT_PUBLIC_API_PREFIX || '/api'}/generate/ab-results`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Failed to fetch A/B test results');
      }
    } catch (err) {
      setError('Failed to fetch A/B test results');
      console.error('Error fetching A/B test results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div>No A/B test results available</div>
      </div>
    );
  }

  const totalTests = results.A.totalGenerations + results.B.totalGenerations;
  const aPercentage = totalTests > 0 ? (results.A.totalGenerations / totalTests) * 100 : 0;
  const bPercentage = totalTests > 0 ? (results.B.totalGenerations / totalTests) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">A/B Test Results</h2>
        <p className="text-gray-600">Comparison between Template A and Template B</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template A */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Template A</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {aPercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Generations:</span>
                <span className="font-medium">{results.A.totalGenerations}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Generation Time:</span>
                <span className="font-medium">{results.A.avgGenerationTime}ms</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Ratings:</span>
                <span className="font-medium">{results.A.totalRatings}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Rating:</span>
                <span className="font-medium">
                  {results.A.avgRating.toFixed(2)} 
                  {results.A.totalRatings > 0 && (
                    <span className="text-yellow-500 ml-1">
                      {'★'.repeat(Math.round(results.A.avgRating))}
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Preview Views:</span>
                <span className="font-medium">{results.A.previewViews}</span>
              </div>
            </div>
          </div>
          
          {/* Template B */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Template B</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {bPercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Generations:</span>
                <span className="font-medium">{results.B.totalGenerations}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Generation Time:</span>
                <span className="font-medium">{results.B.avgGenerationTime}ms</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Ratings:</span>
                <span className="font-medium">{results.B.totalRatings}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Rating:</span>
                <span className="font-medium">
                  {results.B.avgRating.toFixed(2)}
                  {results.B.totalRatings > 0 && (
                    <span className="text-yellow-500 ml-1">
                      {'★'.repeat(Math.round(results.B.avgRating))}
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Preview Views:</span>
                <span className="font-medium">{results.B.previewViews}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={fetchResults}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Refresh Results
          </button>
        </div>
      </div>
    </div>
  );
}