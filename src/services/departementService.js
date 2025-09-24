import api from './api';

export const departementService = {
    // Test de connexion
    test: () => api.get('/departements/test'),
    
    // Récupérer tous les départements
    getAll: () => api.get('/departements'),
    
    // Récupérer un département par ID
    getById: (id) => api.get(`/departements/${id}`),
    
    // Créer un nouveau département
    create: (departement) => api.post('/departements', departement),
    
    // Mettre à jour un département
    update: (id, departement) => api.put(`/departements/${id}`, departement),
    
    // Supprimer un département
    delete: (id) => api.delete(`/departements/${id}`),
    
    // Rechercher des départements
    search: (keyword) => api.get(`/departements/search`, {
        params: { keyword }
    })
};