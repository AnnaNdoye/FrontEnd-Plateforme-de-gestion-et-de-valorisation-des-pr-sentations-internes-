// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
    'Content-Type': 'application/json',
    },
  timeout: 10000, 
});

export default api;

// Profile API functions
export const getProfile = async () => {
    const response = await api.get('/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
};

// Explication détaillé du code api.js
// on importe la librairie axios pour faire des requêtes HTTP
//on crée la variable qui va stocké l'url de la base de l'api
//on crée une instance d'axios avec l'url de base, le type de contenu et un timeout de 10 secondes
