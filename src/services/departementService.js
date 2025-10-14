import axios from 'axios';

const departementApi = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const departementService = {
    // Test de connexion
    test: () => departementApi.get('/departements/test'),

    // Récupérer tous les départements
    getAll: () => departementApi.get('/departements'),

    // Récupérer un département par ID
    getById: (id) => departementApi.get(`/departements/${id}`),

    // Créer un nouveau département
    create: (departement) => departementApi.post('/departements', departement),

    // Mettre à jour un département
    update: (id, departement) => departementApi.put(`/departements/${id}`, departement),

    // Supprimer un département
    delete: (id) => departementApi.delete(`/departements/${id}`),

    // Rechercher des départements
    search: (keyword) => departementApi.get(`/departements/search`, {
        params: { keyword }
    })
};




// Explication détaillé du code departementService.js
// on importe le fichier api.js qui contient la configuration d'axios
// on crée un objet departementService qui contient plusieurs méthodes pour interagir avec l'API des départements
// chaque méthode utilise l'instance d'axios pour faire une requête HTTP vers l'API
// test: fait une requête GET vers /departements/test pour vérifier la connexion