'use client';

import { useState } from 'react';
import { useOrganization } from '@/contexts';
import { CreateOrganizationModal } from '@/components/CreateOrganizationModal';

export function OrganizationSwitcher() {
  const { currentOrganization, organizations, switchOrganization } = useOrganization();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentOrganization) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        {currentOrganization.logo ? (
          <img 
            src={currentOrganization.logo} 
            alt={currentOrganization.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {currentOrganization.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <select
          value={currentOrganization.id}
          onChange={(e) => switchOrganization(e.target.value)}
          className="ml-2 bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded"
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Create organization"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <CreateOrganizationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}