'use client';

import { useState, useEffect } from 'react';

interface SaaSPromptInputProps {
  onSubmit: (prompt: string) => void;
  initialPrompt?: string;
  isLoading?: boolean;
}

export function SaaSPromptInput({ onSubmit, initialPrompt = '', isLoading: externalLoading }: SaaSPromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);

  // Update prompt when initialPrompt changes (from blueprint selection)
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !externalLoading) {
      setIsLoading(true);
      onSubmit(prompt.trim());
    }
  };

  const examplePrompts = [
    "SaaS de gestión de tareas para freelancers",
    "Plataforma de reservas para restaurantes",
    "App de seguimiento de fitness personal",
    "Sistema de facturación para pequeñas empresas"
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Create New SaaS</h2>
      <p className="text-gray-600 mb-6">
        Describe your SaaS idea and we'll generate a landing page in real-time
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="saas-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Your SaaS Idea
          </label>
          <textarea
            id="saas-prompt"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe tu idea de SaaS... (e.g., Quiero un SaaS de gestión de tareas para freelancers)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Inspiration Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded transition-colors"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              Generate SaaS ✨
            </>
          )}
        </button>
      </form>
    </div>
  );
}