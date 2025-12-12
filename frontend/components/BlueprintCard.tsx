'use client';

interface BlueprintCardProps {
    slug: string;
    name: string;
    description: string;
    category: string;
    icon?: string;
    difficulty: string;
    isPremium?: boolean;
    onClick?: () => void;
}

const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
};

const categoryColors: Record<string, string> = {
    productivity: 'bg-blue-500',
    business: 'bg-purple-500',
    content: 'bg-pink-500',
    ai: 'bg-indigo-500',
    marketing: 'bg-orange-500'
};

export function BlueprintCard({
    slug,
    name,
    description,
    category,
    icon,
    difficulty,
    isPremium,
    onClick
}: BlueprintCardProps) {
    return (
        <div
            onClick={onClick}
            className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
        >
            {/* Category indicator */}
            <div className={`h-1 ${categoryColors[category] || 'bg-gray-500'}`} />

            <div className="p-6">
                {/* Icon and Premium badge */}
                <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl">{icon || '📦'}</span>
                    {isPremium && (
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            PRO
                        </span>
                    )}
                </div>

                {/* Name and description */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[difficulty]}`}>
                        {difficulty}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                        {category}
                    </span>
                </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
        </div>
    );
}
