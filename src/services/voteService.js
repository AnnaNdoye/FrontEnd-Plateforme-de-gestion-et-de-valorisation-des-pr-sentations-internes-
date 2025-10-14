import { apiClient } from './api';

class VoteService {
  async addOrUpdateVote(idPresentation, note) {
    try {
      const response = await apiClient.post('/votes', null, {
        params: { idPresentation, note }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur vote:', error);
      throw error;
    }
  }

  async getVotesByPresentation(idPresentation) {
    try {
      const response = await apiClient.get(`/votes/presentation/${idPresentation}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async getMyVote(idPresentation) {
    try {
      const response = await apiClient.get(`/votes/presentation/${idPresentation}/my`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async deleteVote(idVote) {
    try {
      const response = await apiClient.delete(`/votes/${idVote}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async getAverageNote(idPresentation) {
    try {
      const response = await apiClient.get(`/votes/presentation/${idPresentation}/average`);
      return response.data.average;
    } catch (error) {
      console.error('Erreur:', error);
      return 0;
    }
  }

  async getVoteCount(idPresentation) {
    try {
      const response = await apiClient.get(`/votes/presentation/${idPresentation}/count`);
      return response.data.count;
    } catch (error) {
      console.error('Erreur:', error);
      return 0;
    }
  }
}

export default new VoteService();