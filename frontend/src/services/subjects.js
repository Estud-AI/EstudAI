import api from '../api/api';

// Criar uma nova matéria (gera resumo, flashcards e simulado automaticamente)
export const createSubject = async (tema, userId) => {
  try {
    const response = await api.post('/api/subjects', {
      tema,
      userId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao criar matéria');
  }
};

// Listar matérias do usuário
export const getUserSubjects = async (userId) => {
  try {
    const response = await api.get(`/api/subjects/user/${userId}`);
    return response.data.subjects;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar matérias');
  }
};

// Buscar uma matéria específica
export const getSubjectById = async (subjectId) => {
  try {
    const response = await api.get(`/api/subjects/${subjectId}`);
    return response.data.subject;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar matéria');
  }
};

// Gerar mais flashcards para uma matéria
export const generateFlashcards = async (subjectId) => {
  try {
    const response = await api.get(`/api/flashcard/${subjectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao gerar flashcards');
  }
};

// Gerar um novo resumo para uma matéria
export const generateSummary = async (userId, subjectId) => {
  try {
    const response = await api.post('/api/summary', {
      userId,
      subjectId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao gerar resumo');
  }
};

// Gerar um novo simulado para uma matéria
export const generateTest = async (userId, subjectId) => {
  try {
    const response = await api.post('/api/test', {
      userId,
      subjectId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao gerar simulado');
  }
};

// Deletar uma matéria
export const deleteSubject = async (subjectId) => {
  try {
    const response = await api.delete(`/api/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao deletar matéria');
  }
};
