import { apiClient } from './api';

class DashboardService {
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }
}

export default new DashboardService();