import React, { createContext, useContext, useState, useCallback } from 'react';

const SubjectsContext = createContext();

export function SubjectsProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(0);

  // Força uma atualização em todos os componentes que consomem o contexto
  const refreshSubjects = useCallback(() => {
    setShouldRefresh(prev => prev + 1);
  }, []);

  // Adiciona uma nova matéria ao estado
  const addSubject = useCallback((newSubject) => {
    setSubjects(prev => [...prev, newSubject]);
    refreshSubjects();
  }, [refreshSubjects]);

  // Atualiza a lista de matérias
  const updateSubjects = useCallback((newSubjects) => {
    setSubjects(newSubjects);
  }, []);

  const value = {
    subjects,
    shouldRefresh,
    refreshSubjects,
    addSubject,
    updateSubjects
  };

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error('useSubjects deve ser usado dentro de um SubjectsProvider');
  }
  return context;
}
