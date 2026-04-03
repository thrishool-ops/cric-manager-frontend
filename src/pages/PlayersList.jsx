import { useState, useEffect } from 'react';
import { playerService } from '../services/playerService';
import { teamService } from '../services/teamService';
import { Search, Filter, Crosshair, ChevronRight } from 'lucide-react';

const PlayersList = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [teamFilter, setTeamFilter] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [playersData, teamsData] = await Promise.all([
                    playerService.getAllPlayers(),
                    teamService.getAllTeams()
                ]);
                setPlayers(playersData);
                setTeams(teamsData);
            } catch (err) {
                console.error("Failed to load players", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await playerService.getAllPlayers(searchTerm, roleFilter, teamFilter);
            setPlayers(data);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header & Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Player Directory</h1>
                        <p className="text-slate-500 text-sm mt-1">Search and filter through the global player database.</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative md:col-span-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search player by name..."
                            className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <select
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="Batsman">Batsmen</option>
                            <option value="Bowler">Bowlers</option>
                            <option value="All-rounder">All-rounders</option>
                            <option value="Wicketkeeper">Wicketkeepers</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Filter size={16} className="text-slate-400" />
                        </div>
                    </div>

                    <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg p-2.5 transition-colors flex justify-center items-center">
                        <Crosshair size={18} className="mr-2" />
                        Apply Filters
                    </button>
                </form>
            </div>

            {/* Players Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : players.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-lg">No players match your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {players.map(player => (
                        <div key={player.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="h-20 bg-gradient-to-r from-slate-800 to-slate-700"></div>
                            <div className="px-5 pb-5 relative">
                                <div className="absolute -top-10 left-5">
                                    <div className="w-20 h-20 bg-white p-1 rounded-full shadow-md">
                                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-300">
                                            {player.name.charAt(0)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-12">
                                    <h3 className="font-bold text-lg text-slate-800 truncate" title={player.name}>{player.name}</h3>
                                    <p className="text-sm font-medium text-blue-600 mb-4">{player.role} &bull; {player.team?.shortName}</p>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Matches</p>
                                            <p className="font-semibold text-slate-700">{player.matchesPlayed}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Runs</p>
                                            <p className="font-semibold text-slate-700">{player.runs}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Wickets</p>
                                            <p className="font-semibold text-slate-700">{player.wickets}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Avg</p>
                                            <p className="font-semibold text-slate-700">{player.battingAverage?.toFixed(1) || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                                        <span onClick={() => window.location.href = `/players/${player.id}`} className="text-slate-500 group-hover:text-blue-600 transition-colors cursor-pointer">View Profile</span>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlayersList;
