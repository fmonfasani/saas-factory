'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlueprintCard } from '@/components/BlueprintCard';

interface Blueprint {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon?: string;
    difficulty: string;
    isPremium: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BlueprintsPage() {
    const router = useRouter();
    const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBlueprints();
        fetchCategories();
    }, [selectedCategory]);

    const fetchBlueprints = async () => {
        setIsLoading(true);
        try {
            const url = selectedCategory
                ? `${API_URL}/api/blueprints?category=${selectedCategory}`
                : `${API_URL}/api/blueprints`;
            const res = await fetch(url);
            const data = await res.json();
            setBlueprints(data);
        } catch (error) {
            console.error('Error fetching blueprints:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/blueprints/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const filteredBlueprints = blueprints.filter(bp =>
        bp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bp.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categoryLabels: Record<string, string> = {
        productivity: '⚡ Productivity',
        business: '💼 Business',
        content: '📸 Content',
        ai: '🤖 AI',
        marketing: '📣 Marketing'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        🏗️ Blueprint Gallery
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Choose a template to kickstart your SaaS project
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search blueprints..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {categoryLabels[cat] || cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                                <div className="h-12 w-12 bg-gray-200 rounded mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filteredBlueprints.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700">No blueprints found</h3>
                        <p className="text-gray-500">Try a different search or category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBlueprints.map(blueprint => (
                            <BlueprintCard
                                key={blueprint.id}
                                {...blueprint}
                                onClick={() => router.push(`/blueprints/${blueprint.slug}`)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
