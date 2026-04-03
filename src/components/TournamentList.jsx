import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentService } from '../services/tournamentService';
import { Trophy, Calendar, MapPin, Plus } from 'lucide-react';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const data = await tournamentService.getAllTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Trophy className="mr-3 text-yellow-500" size={32} />
          Cricket Tournaments
        </h1>
        <Link to="/create-tournament" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-lg transition duration-300">
          <Plus className="mr-2" size={20} />
          New Tournament
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <div className="text-gray-400 mb-4 flex justify-center">
            <Trophy size={64} className="opacity-50" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Tournaments Yet</h3>
          <p className="text-gray-500 mb-6">Create your first cricket tournament to get started.</p>
          <Link to="/create-tournament" className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
              <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center p-6 relative">
                 <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    tournament.status === 'ONGOING' ? 'bg-yellow-100 text-yellow-800' :
                    tournament.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {tournament.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white text-center group-hover:scale-105 transition-transform duration-300">
                  {tournament.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin size={18} className="mr-2 text-gray-400" />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-6 mt-2 pb-4 border-b border-gray-100">
                  <Calendar size={18} className="mr-2 text-gray-400" />
                  <span>{tournament.startDate} - {tournament.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <button className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors">
                    Manage Teams
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    View Matches
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentList;
