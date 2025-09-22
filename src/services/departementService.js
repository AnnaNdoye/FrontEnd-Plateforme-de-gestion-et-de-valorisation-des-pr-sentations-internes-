import api from './api';

export const departementService = {
    getAll: () => api.get('/departements'),

    getById: (id) => api.get(`/departements/${id}`),

    create: (departement) => api.post('/departements', departement),

    update: (id, departement) => api.put(`/departements/${id}`, departement),

    delete: (id) => api.delete(`/departements/${id}`),

    search: (keyword) => api.get(`/departements/search?keyword=${encodeURIComponent(keyword)}`)
};