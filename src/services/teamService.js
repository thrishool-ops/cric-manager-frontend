import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/teams` : 'https://cric-manager-backend.onrender.com/api/teams';

export const teamService = {
  getAllTeams: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },
  
  getTeamById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  createTeam: async (team) => {
    const response = await axios.post(API_BASE_URL, team);
    return response.data;
  },
  
  updateTeam: async (id, team) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, team);
    return response.data;
  },
  
  deleteTeam: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
