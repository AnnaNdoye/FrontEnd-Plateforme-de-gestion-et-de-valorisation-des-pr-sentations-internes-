import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
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

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    // Normaliser la réponse pour utiliser photoUrl
    return {
      ...response.data,
      photoUrl: response.data.photoDeProfil || response.data.photoUrl,
    };
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('nom', profileData.nom || '');
    formData.append('prenom', profileData.prenom || '');
    formData.append('email', profileData.email || '');
    formData.append('poste', profileData.poste || '');
    formData.append('matricule', profileData.matricule || '');
    
    // Ajouter la photo seulement si c'est un fichier
    if (profileData.photo instanceof File) {
      formData.append('photo', profileData.photo);
    }

    const response = await api.put('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Normaliser la réponse
    return {
      ...response.data,
      photoUrl: response.data.photoDeProfil || response.data.photoUrl,
    };
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/request-password-reset', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
