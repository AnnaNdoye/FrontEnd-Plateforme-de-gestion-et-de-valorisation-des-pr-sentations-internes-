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

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (email, motDePasse) => {
    const response = await api.post('/auth/login', { email, motDePasse });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Profile API functions
export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
};

export const requestPasswordReset = async (email) => {
    const response = await api.post('/password-reset', { email });
    return response.data;
};

export default api;

// Explication détaillé du code api.js
// on importe la librairie axios pour faire des requêtes HTTP
//on crée la variable qui va stocké l'url de la base de l'api
//on crée une instance d'axios avec l'url de base, le type de contenu et un timeout de 10 secondes
