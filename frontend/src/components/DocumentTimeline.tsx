'use client';

import React, { useEffect, useState } from 'react';
import { TimelineEvent, Entity } from '@/types/document';
import { format } from 'date-fns';

interface DocumentTimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

export const DocumentTimeline: React.FC<DocumentTimelineProps> = ({
  events,
  onEventClick
}) => {
  const [sortedEvents, setSortedEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    // Sort events by date
    const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
    setSortedEvents(sorted);
  }, [events]);

  const renderEntity = (entity: Entity) => {
    const getEntityColor = (type: string) => {
      switch (type) {
        case 'date':
          return 'text-blue-600';
        case 'personName':
          return 'text-green-600';
        case 'caseNumber':
          return 'text-purple-600';
        case 'money':
          return 'text-yellow-600';
        default:
          return 'text-gray-600';
      }
    };

    return (
      <span
        key={`${entity.text}-${entity.position.start}`}
        className={`inline-block px-2 py-1 rounded-full text-sm ${getEntityColor(
          entity.type
        )} bg-opacity-10 bg-current mr-2 mb-1`}
        title={`Type: ${entity.type}, Confidence: ${(entity.confidence * 100).toFixed(
          1
        )}%`}
      >
        {entity.text}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />

        {/* Timeline events */}
        {sortedEvents.map((event, index) => (
          <div
            key={`${event.documentId}-${index}`}
            className={`flex items-start mb-8 ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            {/* Content */}
            <div
              className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}
            >
              <button
                onClick={() => onEventClick?.(event)}
                className="group w-full"
              >
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:border-blue-500 transition-colors">
                  {/* Date */}
                  <div className="text-sm font-semibold text-gray-500 mb-2">
                    {format(new Date(event.date), 'PPP')}
                  </div>

                  {/* Description */}
                  <div className="text-gray-700 mb-3">{event.description}</div>

                  {/* Entities */}
                  <div className="flex flex-wrap">
                    {event.entityReferences.map(renderEntity)}
                  </div>

                  {/* Confidence indicator */}
                  <div className="mt-2 flex items-center justify-end">
                    <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${event.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {(event.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow" />
          </div>
        ))}
      </div>
    </div>
  );
}; 