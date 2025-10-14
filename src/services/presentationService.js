import { apiClient } from './api';

const BASE_URL = '/presentations';

class PresentationService {
  
  // Créer une nouvelle présentation
  async createPresentation(presentationData, fichiers = []) {
    try {
      const formData = new FormData();
      const userId = localStorage.getItem('userId');
      
      formData.append('idUtilisateur', userId);
      formData.append('datePresentation', presentationData.datePresentation);
      formData.append('heureDebut', presentationData.heureDebut);
      formData.append('heureFin', presentationData.heureFin);
      formData.append('sujet', presentationData.sujet);
      formData.append('statut', presentationData.statut);
      
      if (presentationData.description) {
        formData.append('description', presentationData.description);
      }
      
      if (fichiers && fichiers.length > 0) {
        fichiers.forEach((file) => {
          formData.append('fichiers', file);
        });
      }

      const response = await apiClient.post(`${BASE_URL}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  }

  // Obtenir toutes les présentations
  async getAllPresentations() {
    try {
      const response = await apiClient.get(`${BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      throw error;
    }
  }

  // Obtenir une présentation par ID
  async getPresentationById(id) {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Obtenir mes présentations
  async getMyPresentations() {
    try {
      const response = await apiClient.get(`${BASE_URL}/my`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Obtenir présentations par statut
  async getPresentationsByStatut(statut) {
    try {
      const response = await apiClient.get(`${BASE_URL}/statut/${statut}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Obtenir présentations par période
  async getPresentationsByPeriod(startDate, endDate) {
    try {
      const response = await apiClient.get(`${BASE_URL}/period`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Mettre à jour une présentation
  async updatePresentation(id, presentationData, fichiers = []) {
    try {
      const formData = new FormData();
      const userId = localStorage.getItem('userId');
      
      formData.append('idUtilisateur', userId);
      formData.append('datePresentation', presentationData.datePresentation);
      formData.append('heureDebut', presentationData.heureDebut);
      formData.append('heureFin', presentationData.heureFin);
      formData.append('sujet', presentationData.sujet);
      formData.append('statut', presentationData.statut);
      
      if (presentationData.description) {
        formData.append('description', presentationData.description);
      }
      
      if (fichiers && fichiers.length > 0) {
        fichiers.forEach((file) => {
          formData.append('fichiers', file);
        });
      }

      const response = await apiClient.put(`${BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  }

  // Supprimer une présentation
  async deletePresentation(id) {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }

  // Rechercher des présentations
  async searchPresentations(term) {
    try {
      const response = await apiClient.get(`${BASE_URL}/search`, {
        params: { term }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  }

  // Obtenir statistiques d'une présentation
  async getPresentationStats(id) {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Formater les présentations pour le calendrier
  formatPresentationsForCalendar(presentations) {
    return presentations.map(presentation => {
      // Créer des objets Date à partir des chaînes ISO
      const startDate = new Date(presentation.heureDebut);
      const endDate = new Date(presentation.heureFin);

      return {
        id: presentation.idPresentation,
        title: presentation.sujet,
        start: startDate,
        end: endDate,
        description: presentation.description,
        status: presentation.statut,
        subject: presentation.sujet,
        datePresentation: presentation.datePresentation,
        heureDebut: presentation.heureDebut,
        heureFin: presentation.heureFin,
        statut: presentation.statut,
        utilisateur: presentation.utilisateur,
        fichier: presentation.fichier,
        // Couleur selon le statut
        style: {
          backgroundColor: this.getStatusColor(presentation.statut)
        }
      };
    });
  }

  // Obtenir la couleur selon le statut
  getStatusColor(statut) {
    const colors = {
      'Planifié': '#FF8C42',
      'Confirmé': '#28a745',
      'Terminé': '#007bff',
      'Annulé': '#dc3545'
    };
    return colors[statut] || '#FF8C42';
  }

  // Obtenir les statuts disponibles
  getStatuts() {
    return [
      { value: 'Planifié', label: 'Planifié', color: '#FF8C42' },
      { value: 'Confirmé', label: 'Confirmé', color: '#28a745' },
      { value: 'Terminé', label: 'Terminé', color: '#007bff' },
      { value: 'Annulé', label: 'Annulé', color: '#dc3545' }
    ];
  }
}

const presentationService = new PresentationService();
export default presentationService;