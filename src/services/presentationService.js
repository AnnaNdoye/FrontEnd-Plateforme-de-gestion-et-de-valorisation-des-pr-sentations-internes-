import { apiClient } from './api';

const BASE_URL = '/presentations';

class PresentationService {
  
  // Mapper les statuts du frontend (avec accents) vers le backend (sans accents)
  mapStatusToBackend(status) {
    const mapping = {
      'Planifié': 'Planifie',
      'Confirmé': 'Confirme',
      'Terminé': 'Termine',
      'Annulé': 'Annule'
    };
    return mapping[status] || status;
  }

  // Mapper les statuts du backend (sans accents) vers le frontend (avec accents)
  mapStatusToFrontend(status) {
    const mapping = {
      'Planifie': 'Planifié',
      'Confirme': 'Confirmé',
      'Termine': 'Terminé',
      'Annule': 'Annulé'
    };
    return mapping[status] || status;
  }
  
  // Créer une nouvelle présentation
  async createPresentation(presentationData, fichiers = []) {
    try {
      const formData = new FormData();
      const userId = localStorage.getItem('userId');
      
      formData.append('idUtilisateur', userId);
      formData.append('datePresentation', presentationData.datePresentation);
      formData.append('sujet', presentationData.sujet);
      // CORRECTION : mapper le statut vers le backend
      formData.append('statut', this.mapStatusToBackend(presentationData.statut));
      
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
      // CORRECTION : mapper les statuts pour l'affichage
      return response.data.map(pres => ({
        ...pres,
        statut: this.mapStatusToFrontend(pres.statut)
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      throw error;
    }
  }

  // Obtenir une présentation par ID
  async getPresentationById(id) {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      return {
        ...response.data,
        statut: this.mapStatusToFrontend(response.data.statut)
      };
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Obtenir mes présentations
  async getMyPresentations() {
    try {
      const response = await apiClient.get(`${BASE_URL}/my`);
      return response.data.map(pres => ({
        ...pres,
        statut: this.mapStatusToFrontend(pres.statut)
      }));
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Obtenir présentations par statut
  async getPresentationsByStatut(statut) {
    try {
      // Mapper le statut avant l'envoi
      const backendStatus = this.mapStatusToBackend(statut);
      const response = await apiClient.get(`${BASE_URL}/statut/${backendStatus}`);
      return response.data.map(pres => ({
        ...pres,
        statut: this.mapStatusToFrontend(pres.statut)
      }));
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
      return response.data.map(pres => ({
        ...pres,
        statut: this.mapStatusToFrontend(pres.statut)
      }));
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
      formData.append('sujet', presentationData.sujet);
      // CORRECTION : mapper le statut vers le backend
      formData.append('statut', this.mapStatusToBackend(presentationData.statut));
      
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
      return response.data.map(pres => ({
        ...pres,
        statut: this.mapStatusToFrontend(pres.statut)
      }));
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
      const date = new Date(presentation.datePresentation);

      return {
        id: presentation.idPresentation,
        title: presentation.sujet,
        start: date,
        end: date,
        allDay: true,
        description: presentation.description,
        status: presentation.statut,
        subject: presentation.sujet,
        datePresentation: presentation.datePresentation,
        statut: presentation.statut,
        utilisateur: presentation.utilisateur,
        fichier: presentation.fichier
      };
    });
  }

  // Obtenir la couleur selon le statut (avec accents pour l'affichage)
  getStatusColor(statut) {
    const colors = {
      'Planifié': '#FF8C42',
      'Confirmé': '#28a745',
      'Terminé': '#007bff',
      'Annulé': '#dc3545'
    };
    return colors[statut] || '#FF8C42';
  }

  // Obtenir les statuts disponibles (avec accents pour l'affichage)
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