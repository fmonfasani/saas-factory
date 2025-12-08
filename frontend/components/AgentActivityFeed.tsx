'use client';

import { useState, useEffect } from 'react';

interface AgentEvent {
  type: string;
  agent?: string;
  message: string;
  timestamp: Date;
  data?: any;
}

interface AgentActivityFeedProps {
  events: AgentEvent[];
}

export function AgentActivityFeed({ events }: AgentActivityFeedProps) {
  const [displayEvents, setDisplayEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    setDisplayEvents(events);
  }, [events]);

  const getAgentEmoji = (agentName?: string) => {
    if (!agentName) return 'ℹ️';
    
    const agentEmojis: Record<string, string> = {
      'ai-feature-builder': '🧠',
      'landing-generator': '🎨',
      'frontend-analyzer': '🔍',
      'fullstack-integrator': '🔗',
      'default': '🤖'
    };
    
    return agentEmojis[agentName] || agentEmojis['default'];
  };

  const getEventStyle = (eventType: string) => {
    switch (eventType) {
      case 'agent_started':
        return 'text-blue-600 bg-blue-50';
      case 'agent_progress':
        return 'text-yellow-600 bg-yellow-50';
      case 'agent_completed':
        return 'text-green-600 bg-green-50';
      case 'agent_error':
        return 'text-red-600 bg-red-50';
      case 'preview_ready':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Agent Activity</h2>
      
      {displayEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No activity yet. Submit a SaaS idea to see agents in action!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {[...displayEvents].reverse().map((event, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${getEventStyle(event.type)} transition-all duration-300`}
            >
              <div className="flex items-start">
                <span className="text-lg mr-2">{getAgentEmoji(event.agent)}</span>
                <div className="flex-1">
                  <p className="font-medium">{event.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}