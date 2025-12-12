'use client';

import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onPreview?: (project: Project) => void;
  onEdit: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails, onPreview, onEdit }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Truncate text to a specified length
  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-4">
            {truncateText(project.description, 100)}
          </p>
        )}

        {/* Project details */}
        <div className="space-y-2 mb-4">
          {project.idea && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase">Idea</h4>
              <p className="text-sm text-gray-900">{truncateText(project.idea, 60)}</p>
            </div>
          )}
          
          {project.market && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase">Market</h4>
              <p className="text-sm text-gray-900">{truncateText(project.market, 60)}</p>
            </div>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button 
              onClick={() => onViewDetails(project)}
              className="text-sm font-medium text-primary hover:text-blue-700"
            >
              View Details
            </button>
            {project.generatedHtml && onPreview && (
              <button 
                onClick={() => onPreview(project)}
                className="text-sm font-medium text-green-600 hover:text-green-800"
              >
                Preview
              </button>
            )}
          </div>
          <button 
            onClick={() => onEdit(project)}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}