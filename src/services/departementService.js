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




// Explication détaillé du code departementService.js
// on importe le fichier api.js qui contient la configuration d'axios
// on crée un objet departementService qui contient plusieurs méthodes pour interagir avec l'API des départements
// chaque méthode utilise l'instance d'axios pour faire une requête HTTP vers l'API
// test: fait une requête GET vers /departements/test pour vérifier la connexion