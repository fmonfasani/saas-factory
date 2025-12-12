'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Blueprint {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon?: string;
    difficulty: string;
    estimatedTime?: string;
    isPremium: boolean;
    defaultFeatures: string[];
    suggestedStack?: string[];
    promptTemplate?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BlueprintDetailPage({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [customName, setCustomName] = useState('');
    const [customMarket, setCustomMarket] = useState('');

    useEffect(() => {
        fetchBlueprint();
    }, [params.slug]);

    const fetchBlueprint = async () => {
        try {
            const res = await fetch(`${API_URL}/api/blueprints/${params.slug}`);
            if (!res.ok) {
                router.push('/blueprints');
                return;
            }
            const data = await res.json();
            setBlueprint(data);
            setCustomName(data.name);
        } catch (error) {
            console.error('Error fetching blueprint:', error);
            router.push('/blueprints');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseBlueprint = async () => {
        if (!blueprint) return;

        // Increment usage
        await fetch(`${API_URL}/api/blueprints/${blueprint.id}/use`, { method: 'POST' });

        // Build the prompt from template
        const prompt = blueprint.promptTemplate
            ?.replace('{{market}}', customMarket || 'businesses')
            ?.replace('{{features}}', blueprint.defaultFeatures.slice(0, 3).join(', '))
            || `Create a ${blueprint.name} SaaS for ${customMarket || 'businesses'}`;

        // Redirect to dashboard with pre-filled data
        router.push(`/dashboard?blueprint=${blueprint.slug}&prompt=${encodeURIComponent(prompt)}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!blueprint) {
        return null;
    }

    const difficultyColors: Record<string, string> = {
        beginner: 'bg-green-100 text-green-800',
        intermediate: 'bg-yellow-100 text-yellow-800',
        advanced: 'bg-red-100 text-red-800'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/blueprints" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        ← Back to Blueprints
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hero */}
                        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                            <div className="flex items-start gap-4">
                                <span className="text-6xl">{blueprint.icon || '📦'}</span>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{blueprint.name}</h1>
                                    <p className="text-gray-600 mt-2">{blueprint.description}</p>
                                    <div className="flex gap-2 mt-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[blueprint.difficulty]}`}>
                                            {blueprint.difficulty}
                                        </span>
                                        {blueprint.estimatedTime && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                                ⏱️ {blueprint.estimatedTime}
                                            </span>
                                        )}
                                        {blueprint.isPremium && (
                                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                                                PRO
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Included Features</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {blueprint.defaultFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-700">
                                        <span className="text-green-500">✓</span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tech Stack */}
                        {blueprint.suggestedStack && blueprint.suggestedStack.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">🛠️ Suggested Tech Stack</h2>
                                <div className="flex flex-wrap gap-2">
                                    {blueprint.suggestedStack.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Use This Blueprint</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="My Awesome SaaS"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Market
                                    </label>
                                    <input
                                        type="text"
                                        value={customMarket}
                                        onChange={(e) => setCustomMarket(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., freelancers, restaurants..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUseBlueprint}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Generate SaaS →
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                This will take you to the generator with pre-filled settings
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
