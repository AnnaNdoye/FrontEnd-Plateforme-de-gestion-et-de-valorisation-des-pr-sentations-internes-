import { apiClient } from './api';

class CommentaireService {
  async addCommentaire(idPresentation, contenu) {
    try {
      const response = await apiClient.post('/commentaires', null, {
        params: { idPresentation, contenu }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async getCommentairesByPresentation(idPresentation) {
    try {
      const response = await apiClient.get(`/commentaires/presentation/${idPresentation}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async updateCommentaire(idCommentaire, contenu) {
    try {
      const response = await apiClient.put(`/commentaires/${idCommentaire}`, null, {
        params: { contenu }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async deleteCommentaire(idCommentaire) {
    try {
      const response = await apiClient.delete(`/commentaires/${idCommentaire}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async getMyCommentaires() {
    try {
      const response = await apiClient.get('/commentaires/my');
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }
}

export default new CommentaireService();