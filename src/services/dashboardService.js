import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/dashboard` : 'https://cric-manager-backend.onrender.com/api/dashboard';

export const dashboardService = {
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  },
  
  triggerSeeding: async () => {
    const response = await axios.post(`${API_BASE_URL}/seed`);
    return response.data;
  }
};
