import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/dashboard';

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
