'use client';

import React from 'react';
import { Entity, CrossReference, ProcessedDocument } from '@/types/document';

interface DocumentAnalysisProps {
  document: ProcessedDocument;
  onEntityClick?: (entity: Entity) => void;
  onCrossReferenceClick?: (reference: CrossReference) => void;
}

export const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({
  document,
  onEntityClick,
  onCrossReferenceClick
}) => {
  const renderEntitySection = () => {
    const groupedEntities = document.entities.reduce((acc, entity) => {
      if (!acc[entity.type]) {
        acc[entity.type] = [];
      }
      acc[entity.type].push(entity);
      return acc;
    }, {} as Record<string, Entity[]>);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Extracted Entities</h3>
        {Object.entries(groupedEntities).map(([type, entities]) => (
          <div key={type} className="mb-4">
            <h4 className="text-md font-medium mb-2 capitalize">{type}</h4>
            <div className="flex flex-wrap gap-2">
              {entities.map((entity, index) => (
                <button
                  key={`${entity.text}-${index}`}
                  onClick={() => onEntityClick?.(entity)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm
                    bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  title={`Confidence: ${(entity.confidence * 100).toFixed(1)}%`}
                >
                  {entity.text}
                  <span className="ml-2 text-xs text-blue-600">
                    {(entity.confidence * 100).toFixed(0)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCrossReferences = () => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Cross References</h3>
      <div className="space-y-3">
        {document.crossReferences.map((reference, index) => (
          <button
            key={`${reference.sourceDocId}-${reference.targetDocId}-${index}`}
            onClick={() => onCrossReferenceClick?.(reference)}
            className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-500
              bg-white transition-colors text-left"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-600">
                {reference.type}
              </span>
              <span className="text-xs text-gray-500">
                {(reference.confidence * 100).toFixed(1)}% match
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Source:</span> {reference.sourceText}
              </p>
              <p className="text-sm">
                <span className="font-medium">Target:</span> {reference.targetText}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProcessingMetadata = () => (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Processing Information</h3>
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Status:</span>{' '}
          <span className="capitalize">{document.metadata.processingStatus}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium">Processed:</span>{' '}
          {new Date(document.metadata.processingDate).toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="font-medium">Confidence Score:</span>{' '}
          {(document.metadata.confidence * 100).toFixed(1)}%
        </p>
        {document.metadata.errorMessage && (
          <p className="text-sm text-red-600">
            <span className="font-medium">Error:</span>{' '}
            {document.metadata.errorMessage}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {renderProcessingMetadata()}
      {renderEntitySection()}
      {renderCrossReferences()}
    </div>
  );
}; 