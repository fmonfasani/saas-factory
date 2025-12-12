import React from 'react';

interface SchemaViewerProps {
    schema: string;
}

export function SchemaViewer({ schema }: SchemaViewerProps) {
    if (!schema) return null;

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs font-mono text-gray-400">schema.prisma</span>
                </div>
                <button
                    onClick={() => navigator.clipboard.writeText(schema)}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                    Copy
                </button>
            </div>
            <div className="p-4 overflow-auto max-h-[500px]">
                <pre className="font-mono text-sm text-green-400">
                    <code>{schema}</code>
                </pre>
            </div>

            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-white mb-2">What happens next?</h4>
                <p className="text-xs text-gray-400">
                    This schema defines your application's data structure.
                    When you save this project, we will automatically create these tables in your dedicated database environment.
                </p>
            </div>
        </div>
    );
}
