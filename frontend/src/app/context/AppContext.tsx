'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExtractedItem {
  id: string;
  content: string;
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  extractedItems: ExtractedItem[];
  addExtractedItem: (item: ExtractedItem) => void;
  removeExtractedItem: (id: string) => void;
  selectedDocumentSet: string | null;
  setSelectedDocumentSet: (id: string | null) => void;
}

// Create context with a default value matching the interface
const AppContext = createContext<AppContextType>({
  activeTab: 'emails',
  setActiveTab: () => {},
  extractedItems: [],
  addExtractedItem: () => {},
  removeExtractedItem: () => {},
  selectedDocumentSet: null,
  setSelectedDocumentSet: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('emails');
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [selectedDocumentSet, setSelectedDocumentSet] = useState<string | null>(null);

  const addExtractedItem = (item: ExtractedItem) => {
    setExtractedItems(prev => [...prev, item]);
  };

  const removeExtractedItem = (id: string) => {
    setExtractedItems(prev => prev.filter(item => item.id !== id));
  };

  const value = {
    activeTab,
    setActiveTab,
    extractedItems,
    addExtractedItem,
    removeExtractedItem,
    selectedDocumentSet,
    setSelectedDocumentSet,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  // Since we provide a default value, context will never be undefined
  return context;
} 