import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/matches` : 'https://cric-manager-backend.onrender.com/api/matches';

export const matchService = {
  getAllMatches: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  getRecentMatches: async () => {
    const response = await axios.get(`${API_BASE_URL}/recent`);
    return response.data;
  },
  
  getMatchById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  createMatch: async (match) => {
    const response = await axios.post(API_BASE_URL, match);
    return response.data;
  },
  
  updateMatch: async (id, match) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, match);
    return response.data;
  },

  updateLiveScore: async (id, scoreData) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/score`, scoreData);
    return response.data;
  },
  
  deleteMatch: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
