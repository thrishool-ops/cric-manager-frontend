import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/players` : 'https://cric-manager-backend.onrender.com/api/players';

export const playerService = {
  getAllPlayers: async (search = '', role = '', teamId = '') => {
    let url = API_BASE_URL + '?';
    if (search) url += `search=${search}&`;
    if (role) url += `role=${role}&`;
    if (teamId) url += `teamId=${teamId}`;
    
    const response = await axios.get(url);
    return response.data;
  },
  
  getPlayerById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  getTopBatsmen: async () => {
    const response = await axios.get(`${API_BASE_URL}/leaderboard/batsmen`);
    return response.data;
  },

  getTopBowlers: async () => {
    const response = await axios.get(`${API_BASE_URL}/leaderboard/bowlers`);
    return response.data;
  },
  
  createPlayer: async (player) => {
    const response = await axios.post(API_BASE_URL, player);
    return response.data;
  },
  
  updatePlayer: async (id, player) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, player);
    return response.data;
  },
  
  deletePlayer: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
