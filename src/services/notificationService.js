import { apiClient } from './api';

class NotificationService {
  async getMyNotifications() {
    try {
      const response = await apiClient.get('/notifications/my');
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async getUnreadNotifications() {
    try {
      const response = await apiClient.get('/notifications/my/unread');
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const response = await apiClient.get('/notifications/my/unread/count');
      return response.data.count;
    } catch (error) {
      console.error('Erreur:', error);
      return 0;
    }
  }

  async markAsRead(idNotification) {
    try {
      const response = await apiClient.put(`/notifications/${idNotification}/read`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await apiClient.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  async deleteNotification(idNotification) {
    try {
      const response = await apiClient.delete(`/notifications/${idNotification}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }
}

export default new NotificationService();