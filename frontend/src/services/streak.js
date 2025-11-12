import api from '../api/api';

export const updateStreak = async (userId) => {
  try {
    const response = await api.post('/api/streak/update-streak', { userId });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar streak:', error);
    throw error;
  }
};
