'use client';

import { useState, useEffect } from 'react';

interface EventSourceEvent {
  type: string;
  message: string;
  data?: any;
  timestamp: Date;
}

export function useEventSource(url: string) {
  const [events, setEvents] = useState<EventSourceEvent[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    if (!url) return;

    const es = new EventSource(url);
    setEventSource(es);

    es.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        setEvents(prevEvents => [
          ...prevEvents,
          {
            ...eventData,
            timestamp: new Date()
          }
        ]);
      } catch (error) {
        console.error('Error parsing event data:', error);
      }
    };

    es.onerror = (error) => {
      console.error('EventSource failed:', error);
    };

    return () => {
      es.close();
      setEventSource(null);
    };
  }, [url]);

  const close = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  };

  return { events, close };
}