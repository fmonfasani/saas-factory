import React from 'react';
import { notFound } from 'next/navigation';

// Mock function to fetch project data (Client Component for now, or Server Component)
// In a real app, this would query the backend API
async function getProjectData(projectId: string) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        // We can't easily query by ID if we don't have a lookup, assuming ID passed for now
        // If passed a slug, we'd need a lookup endpoint

        // For MVP, we'll try to fetch assuming it's an ID
        // But since UUIDs are long, for "subdomain" simulation we might need to assume 
        // the user set up some mapping or we just show a demo.

        // Let's rely on the client-side fetch for the actual HTML for now to keep it simple
        // or return basic meta.
        return { projectId };
    } catch (error) {
        return null;
    }
}

export default async function SitePage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch generated HTML from backend
    // Since this is a server component, we can fetch directly

    // Note: To make this robust, we should create a public endpoint to get project by slug/id
    // GET /api/public/projects/:idOrSlug

    return (
        <div className="min-h-screen bg-white">
            {/* 
        For the MVP, we render a Client Component that fetches the HTML 
        to avoid CORS/Server issues getting complex right now.
      */}
            <SiteRenderer projectId={id} />
        </div>
    );
}

// Client Component to fetch and render
'use client';

import { useEffect, useState } from 'react';

function SiteRenderer({ projectId }: { projectId: string }) {
    const [html, setHtml] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSite = async () => {
            try {
                // We'll use the 'generate' endpoint logic or access the project data
                // We need a public endpoint to get the generated HTML. 
                // We'll use the organizations/:orgId/projects/:id endpoint for now, 
                // assuming we are authenticated or it's open.
                // Actually, for a public site, it MUST be open.
                // I'll assume we need to add a public route.

                // For now, let's mock the success state or tell the user 
                // "This is where your site lives: project [id]"
                setHtml(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #333;">Welcome to Project ${projectId}</h1>
            <p>The generated landing page will appear here.</p>
            <p style="color: #666; font-size: 0.9em;">(Backend public endpoint required for full render)</p>
          </div>
        `);
            } catch (err) {
                setError('Failed to load site');
            } finally {
                setLoading(false);
            }
        };

        fetchSite();
    }, [projectId]);

    if (loading) return <div className="p-10 text-center">Loading site...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
