import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/presentations';

// Configuration d'axios avec le token JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  };
};

const getAuthHeadersJSON = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

class PresentationService {

  // Créer une nouvelle présentation
  async createPresentation(presentationData, fichiers = []) {
    try {
      const formData = new FormData();

      // Ajouter les données de base
      formData.append('idUtilisateur', presentationData.idUtilisateur);
      formData.append('datePresentation', presentationData.datePresentation);
      formData.append('heureDebut', presentationData.heureDebut);
      formData.append('heureFin', presentationData.heureFin);
      formData.append('sujet', presentationData.sujet);
      formData.append('statut', presentationData.statut);

      if (presentationData.description) {
        formData.append('description', presentationData.description);
      }

      // Ajouter les fichiers
      if (fichiers && fichiers.length > 0) {
        fichiers.forEach((file, index) => {
          formData.append('fichiers', file);
        });
      }

      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la présentation:', error);
      throw error;
    }
  }

  // Obtenir toutes les présentations
  async getAllPresentations() {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: getAuthHeadersJSON()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présentations:', error);
      throw error;
    }
  }

  // Obtenir une présentation par ID
  async getPresentationById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeadersJSON()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la présentation:', error);
      throw error;
    }
  }

  // Obtenir les présentations de l'utilisateur connecté
  async getMyPresentations() {
    try {
      const response = await axios.get(`${API_BASE_URL}/my`, {
        headers: getAuthHeadersJSON()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de mes présentations:', error);
      throw error;
    }
  }

  // Mettre à jour une présentation
  async updatePresentation(id, presentationData, fichiers = []) {
    try {
      const formData = new FormData();

      formData.append('idUtilisateur', presentationData.idUtilisateur);
      formData.append('datePresentation', presentationData.datePresentation);
      formData.append('heureDebut', presentationData.heureDebut);
      formData.append('heureFin', presentationData.heureFin);
      formData.append('sujet', presentationData.sujet);
      formData.append('statut', presentationData.statut);

      if (presentationData.description) {
        formData.append('description', presentationData.description);
      }

      if (fichiers && fichiers.length > 0) {
        fichiers.forEach((file, index) => {
          formData.append('fichiers', file);
        });
      }

      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présentation:', error);
      throw error;
    }
  }

  // Supprimer une présentation
  async deletePresentation(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeadersJSON()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la présentation:', error);
      throw error;
    }
  }

  // Rechercher des présentations
  async searchPresentations(term) {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { term },
        headers: getAuthHeadersJSON()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de présentations:', error);
      throw error;
    }
  }

  // Formater les données pour le calendrier
  formatPresentationsForCalendar(presentations) {
    return presentations.map(presentation => ({
      id: presentation.idPresentation,
      title: presentation.sujet,
      start: presentation.heureDebut,
      end: presentation.heureFin,
      description: presentation.description,
      statut: presentation.statut,
      utilisateur: presentation.utilisateur
    }));
  }

  // Obtenir les statuts disponibles
  getStatuts() {
    return [
      { value: 'Planifié', label: 'Planifié' },
      { value: 'Annulé', label: 'Annulé' },
      { value: 'Confirmé', label: 'Confirmé' },
      { value: 'Terminé', label: 'Terminé' }
    ];
  }
}

const presentationService = new PresentationService();

export default presentationService;
