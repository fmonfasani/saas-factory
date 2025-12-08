'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { organizationApi } from '@/lib/api';
import type { Organization } from '@/types';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  switchOrganization: (orgId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
  createOrganization: (name: string) => Promise<Organization>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load organizations and current organization from localStorage on mount
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        await refreshOrganizations();
        
        // Load current organization from localStorage
        const savedOrgId = localStorage.getItem('currentOrganizationId');
        if (savedOrgId && organizations.length > 0) {
          const org = organizations.find(o => o.id === savedOrgId);
          if (org) {
            setCurrentOrganization(org);
          }
        } else if (organizations.length > 0) {
          // Set first organization as default
          setCurrentOrganization(organizations[0]);
          localStorage.setItem('currentOrganizationId', organizations[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load organizations');
      } finally {
        setIsLoading(false);
      }
    };

    // Only load if there's an access token (user is logged in)
    const token = localStorage.getItem('accessToken');
    if (token) {
      loadOrganizations();
    } else {
      setIsLoading(false);
    }
  }, []);

  const switchOrganization = async (orgId: string) => {
    try {
      const org = organizations.find(o => o.id === orgId);
      if (org) {
        setCurrentOrganization(org);
        localStorage.setItem('currentOrganizationId', orgId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch organization');
      throw err;
    }
  };

  const refreshOrganizations = async () => {
    try {
      const orgs = await organizationApi.list();
      setOrganizations(orgs);
      
      // If current organization is not in the list anymore, reset it
      if (currentOrganization && !orgs.find(o => o.id === currentOrganization.id)) {
        if (orgs.length > 0) {
          setCurrentOrganization(orgs[0]);
          localStorage.setItem('currentOrganizationId', orgs[0].id);
        } else {
          setCurrentOrganization(null);
          localStorage.removeItem('currentOrganizationId');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh organizations');
      throw err;
    }
  };

  const createOrganization = async (name: string) => {
    try {
      const newOrg = await organizationApi.create({ name });
      setOrganizations([...organizations, newOrg]);
      
      // If this is the first organization, set it as current
      if (organizations.length === 0) {
        setCurrentOrganization(newOrg);
        localStorage.setItem('currentOrganizationId', newOrg.id);
      }
      
      return newOrg;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
      throw err;
    }
  };

  return (
    <OrganizationContext.Provider value={{
      currentOrganization,
      organizations,
      isLoading,
      error,
      switchOrganization,
      refreshOrganizations,
      createOrganization
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}