import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Créer une instance axios avec configuration par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
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
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

// Services pour les clients
export const clientService = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  
  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  }
};

// Services pour les voitures
export const voitureService = {
  getAll: async () => {
    const response = await api.get('/voitures');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/voitures/${id}`);
    return response.data;
  },
  
  getByStatus: async (status) => {
    const response = await api.get(`/voitures/statut/${status}`);
    return response.data;
  },
  
  getByClient: async (clientId) => {
    const response = await api.get(`/voitures/client/${clientId}`);
    return response.data;
  },
  
  create: async (voitureData) => {
    const response = await api.post('/voitures', voitureData);
    return response.data;
  },
  
  update: async (id, voitureData) => {
    const response = await api.put(`/voitures/${id}`, voitureData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/voitures/${id}`);
    return response.data;
  }
};

// Services pour les interventions
export const interventionService = {
  getAll: async () => {
    const response = await api.get('/interventions');
    return response.data;
  },
  
  getDisponibles: async () => {
    const response = await api.get('/interventions/disponibles');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/interventions/${id}`);
    return response.data;
  },
  
  create: async (interventionData) => {
    const response = await api.post('/interventions', interventionData);
    return response.data;
  },
  
  update: async (id, interventionData) => {
    const response = await api.put(`/interventions/${id}`, interventionData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/interventions/${id}`);
    return response.data;
  }
};

// Services pour les réparations
export const reparationService = {
  getAll: async () => {
    const response = await api.get('/reparations');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/reparations/${id}`);
    return response.data;
  },
  
  getByEtat: async (etat) => {
    const response = await api.get(`/reparations/etat/${etat}`);
    return response.data;
  },
  
  create: async (reparationData) => {
    const response = await api.post('/reparations', reparationData);
    return response.data;
  },
  
  demarrer: async (id) => {
    const response = await api.put(`/reparations/${id}/demarrer`);
    return response.data;
  },
  
  terminer: async (id) => {
    const response = await api.put(`/reparations/${id}/terminer`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/reparations/${id}`);
    return response.data;
  }
};

// Services pour les slots
export const slotService = {
  getAll: async () => {
    const response = await api.get('/slots');
    return response.data;
  },
  
  getStatistiques: async () => {
    const response = await api.get('/slots/statistiques');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/slots/${id}`);
    return response.data;
  },
  
  occuper: async (id, voitureId) => {
    const response = await api.put(`/slots/${id}/occuper`, { id_voiture: voitureId });
    return response.data;
  },
  
  liberer: async (id) => {
    const response = await api.put(`/slots/${id}/liberer`);
    return response.data;
  }
};

// Services pour les statistiques
export const statistiqueService = {
  getAll: async () => {
    const response = await api.get('/statistiques');
    return response.data;
  },
  
  getDashboard: async () => {
    const response = await api.get('/statistiques/dashboard');
    return response.data;
  }
};

export default api;
