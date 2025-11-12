import api from '../api/api';

export const createFlashcards = async (subjectId) => {
  try {
    const response = await api.post(`/api/flashcard/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar flashcards:', error);
    throw error;
  }
};

export const createSummary = async (userId, subjectId) => {
  try {
    const response = await api.post('/api/summary', { userId, subjectId });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar resumo:', error);
    throw error;
  }
};

export const createTest = async (userId, subjectId) => {
  try {
    const response = await api.post('/api/test', { userId, subjectId });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar simulado:', error);
    throw error;
  }
};
