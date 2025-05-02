import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface JournalEntry {
  id: string;
  date: Date;
  mood: string;
  title: string;
  content: string;
  category?: string;
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

// Sample initial entries
const initialEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date(),
    mood: 'happy',
    title: 'First Kick!',
    content: 'Today I felt the baby kick for the first time. It was such an amazing moment!',
    category: 'milestones'
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000),
    mood: 'calm',
    title: 'Prenatal Yoga Session',
    content: 'Had a relaxing prenatal yoga session. Feeling much more flexible and centered.',
    category: 'wellness'
  }
];

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);

  const addEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries((prevEntries) => [newEntry, ...prevEntries]);
  };

  const updateEntry = (updatedEntry: JournalEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  const getEntryById = (id: string) => {
    return entries.find((entry) => entry.id === id);
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntryById,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = (): JournalContextType => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
