import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const BASE_URL = 'http://localhost:8080/api';

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

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export const register = async (userData) => {
  try {
    const response = await api.post('/register', {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      poste: userData.poste,
      matricule: userData.matricule,
      motDePasse: userData.motDePasse,
      departement: userData.departement
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.idUtilisateur);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', `${response.data.prenom} ${response.data.nom}`);
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
      localStorage.setItem('userId', response.data.idUtilisateur);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', `${response.data.prenom} ${response.data.nom}`);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
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
    
    formData.append('nom', profileData.nom || '');
    formData.append('prenom', profileData.prenom || '');
    formData.append('email', profileData.email || '');
    formData.append('poste', profileData.poste || '');
    formData.append('matricule', profileData.matricule || '');
    
    if (profileData.photo instanceof File) {
      formData.append('photo', profileData.photo);
    }

    const response = await api.put('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      ...response.data,
      photoUrl: response.data.photoDeProfil || response.data.photoUrl,
    };
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/request-password-reset', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export d'une instance axios configurée pour d'autres services
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default api;