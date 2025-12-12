'use client';

import { useState } from 'react';

interface LandingPreviewProps {
  html: string;
  isLoading: boolean;
  onSaveProject?: () => void;
}

export function LandingPreview({ html, isLoading, onSaveProject }: LandingPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleViewFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleDownload = () => {
    if (!html) return;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saas-landing-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Landing Page Preview</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your landing page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Landing Page Preview</h2>
          <div className="flex space-x-2">
            {onSaveProject && (
              <button
                onClick={onSaveProject}
                disabled={!html}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Project
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={!html}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {html ? (
            <iframe
              srcDoc={html}
              className="w-full h-full border-0"
              title="Landing Page Preview"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center">
              <div>
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
                <p className="text-gray-500">
                  Enter your SaaS idea and generate a landing page to see the preview here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && html && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-white">
            <h2 className="text-xl font-bold text-gray-900">Full Preview</h2>
            <button
              onClick={handleCloseFullscreen}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              srcDoc={html}
              className="w-full h-full border-0"
              title="Full Landing Page Preview"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </>
  );
}