import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tournaments';

export const tournamentService = {
  getAllTournaments: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },
  
  getTournamentById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  
  createTournament: async (tournament) => {
    const response = await axios.post(API_BASE_URL, tournament);
    return response.data;
  },
  
  updateTournament: async (id, tournament) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, tournament);
    return response.data;
  },
  
  deleteTournament: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
