'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useOrganization } from '@/contexts';
import { OrganizationSwitcher } from '@/components';
import { ProjectList } from '@/components';
import { authApi } from '@/lib/api';
import { GenerateApi } from '@/lib/generate-api';
import { SaaSPromptInput } from '@/components/SaaSPromptInput';
import { AgentActivityFeed } from '@/components/AgentActivityFeed';
import { LandingPreview } from '@/components/LandingPreview';
import { ABTestResults } from '@/components/ABTestResults';
import { useEventSource } from '@/hooks/useEventSource';
import type { GeneratedSaaSData } from '@/types';

const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { currentOrganization } = useOrganization();
  const router = useRouter();
  const [jobId, setJobId] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentEvents, setAgentEvents] = useState<any[]>([]);
  const [currentVariant, setCurrentVariant] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const { events } = useEventSource(jobId ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${API_PREFIX}/generate/stream/${jobId}` : '');

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await authApi.signout();
      router.push('/signin');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if there's an error, we should still redirect to signin
      router.push('/signin');
    }
  };

  const handleRatingSubmit = async (rating: number) => {
    if (!jobId || !currentVariant) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${API_PREFIX}/generate/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          rating,
          variant: currentVariant
        }),
      });
      
      setUserRating(rating);
      setShowRating(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setGeneratedHtml('');
    setAgentEvents([]);
    setJobId(null); // Reset jobId
    setCurrentVariant(null);
    setShowRating(false);
    setUserRating(null);
    
    try {
      // Step 1: Analyze the prompt
      const analyzeResult = await GenerateApi.analyzePrompt(prompt);
      
      if (!analyzeResult.success) {
        throw new Error(analyzeResult.error || 'Failed to analyze prompt');
      }
      
      // Set jobId for streaming events
      if (analyzeResult.jobId) {
        setJobId(analyzeResult.jobId);
      }
      
      // Add event for analysis completion
      setAgentEvents(prev => [...prev, {
        type: 'agent_completed',
        agent: 'ai-feature-builder',
        message: 'SaaS structure analysis complete',
        timestamp: new Date(),
        data: analyzeResult.data
      }]);
      
      // Step 2: Generate landing page
      const landingResult = await GenerateApi.generateLandingPage(analyzeResult.data as GeneratedSaaSData);
      
      if (!landingResult.success) {
        throw new Error(landingResult.error || 'Failed to generate landing page');
      }
      
      setGeneratedHtml(landingResult.html || '');
      
      // Set current variant if provided in the response
      if (landingResult.variant) {
        setCurrentVariant(landingResult.variant);
      }
      
      // Show rating option after successful generation
      setShowRating(true);
      setUserRating(null);
      
      // Add event for landing page completion
      setAgentEvents(prev => [...prev, {
        type: 'agent_completed',
        agent: 'landing-generator',
        message: 'Landing page generated successfully',
        timestamp: new Date(),
        data: { html: landingResult.html, variant: landingResult.variant }
      }]);
      
      // Add event for preview ready
      setAgentEvents(prev => [...prev, {
        type: 'preview_ready',
        message: 'Preview ready',
        timestamp: new Date(),
        data: { html: landingResult.html, variant: landingResult.variant }
      }]);
    } catch (error: any) {
      console.error('Generation error:', error);
      // Add error event to display in feed
      setAgentEvents(prev => [...prev, {
        type: 'agent_error',
        agent: 'generator',
        message: error.message || 'Failed to generate SaaS',
        timestamp: new Date()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to signin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                SaaS Factory Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentOrganization 
              ? `Managing projects for ${currentOrganization.name}` 
              : 'Select an organization to get started'}
          </p>
        </div>

        {/* Organization Info */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Organization</h2>
              <p className="text-gray-600">
                {currentOrganization 
                  ? `${currentOrganization.name} (${currentOrganization.plan})` 
                  : 'No organization selected'}
              </p>
            </div>
            <div>
              <OrganizationSwitcher />
            </div>
          </div>
        </div>

        {/* SaaS Generator Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Prompt Input + Agent Activity */}
            <div className="space-y-6">
              <SaaSPromptInput onSubmit={handleGenerate} />
              <AgentActivityFeed events={[...agentEvents, ...events]} />
            </div>
            
            {/* Right: Live Preview */}
            <div className="border rounded-lg overflow-hidden">
              <LandingPreview html={generatedHtml} isLoading={isGenerating} />
              
              {/* Rating Section */}
              {showRating && !isGenerating && generatedHtml && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {currentVariant ? `Template ${currentVariant}` : 'Rate this landing page'}
                    </h3>
                    {userRating ? (
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">Thank you for your rating!</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500 mr-2">Rate:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRatingSubmit(star)}
                            className="text-gray-300 hover:text-yellow-400 focus:outline-none"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* A/B Test Results */}
        <div className="mb-12">
          <ABTestResults />
        </div>

        {/* Existing Projects Section */}
        <ProjectList />
      </main>
    </div>
  );
}