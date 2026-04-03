import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { matchService } from '../services/matchService';
import { playerService } from '../services/playerService';
import { Activity, Users, Shield, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPlayers: 0, totalTeams: 0, totalMatches: 0, topPerformer: 'Loading...' });
  const [recentMatches, setRecentMatches] = useState([]);
  const [topBatsmen, setTopBatsmen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, matchesData, batsmenData] = await Promise.all([
          dashboardService.getStats(),
          matchService.getRecentMatches(),
          playerService.getTopBatsmen()
        ]);
        
        setStats(statsData);
        setRecentMatches(matchesData);
        setTopBatsmen(batsmenData.slice(0, 5)); // Just show top 5 on dashboard
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <Activity className="mr-3 text-blue-600" size={32} />
          Platform Overview
        </h1>
        <p className="text-slate-500 mt-2">Welcome to the central analytics hub. Here's what's happening across the platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="bg-blue-100 p-4 rounded-lg mr-4">
            <Users className="text-blue-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Registered Players</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.totalPlayers}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="bg-purple-100 p-4 rounded-lg mr-4">
            <Calendar className="text-purple-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Matches</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.totalMatches}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="bg-emerald-100 p-4 rounded-lg mr-4">
            <Shield className="text-emerald-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Active Teams</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.totalTeams}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="bg-orange-100 p-4 rounded-lg mr-4">
            <Trophy className="text-orange-600" size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Top Performer</p>
            <h3 className="text-lg font-bold text-slate-800 break-words">{stats.topPerformer || 'N/A'}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Matches Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">Recent Matches</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View All</button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {recentMatches.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No matches found. Run the Data Seeder!</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentMatches.map((match) => (
                  <div key={match.id} className="p-5 hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-center mb-3 text-xs text-slate-500 font-medium">
                      <span>{match.matchDate} &bull; {match.venue}</span>
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-700">{match.matchType}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {/* Team A */}
                      <div className={`flex flex-col w-1/3 ${match.winner === match.teamA.shortName ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                        <span className="text-lg">{match.teamA.shortName}</span>
                        <span className="text-sm mt-1">{match.teamARuns}/{match.teamAWickets} <span className="text-slate-400 text-xs">({match.teamAOvers})</span></span>
                      </div>
                      
                      {/* VS */}
                      <div className="w-1/3 text-center text-slate-300 font-black italic text-xl">VS</div>
                      
                      {/* Team B */}
                      <div className={`flex flex-col w-1/3 text-right ${match.winner === match.teamB.shortName ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                        <span className="text-lg">{match.teamB.shortName}</span>
                        <span className="text-sm mt-1">{match.teamBRuns}/{match.teamBWickets} <span className="text-slate-400 text-xs">({match.teamBOvers})</span></span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-center">
                      <span className="text-blue-700 font-semibold">{match.matchSummary}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Column */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-600 pl-3">Top Run Scorers</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            {topBatsmen.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No player data available.</div>
            ) : (
              <div className="space-y-4">
                {topBatsmen.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          index === 1 ? 'bg-slate-200 text-slate-700' : 
                          index === 2 ? 'bg-orange-100 text-orange-800' : 
                          'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{player.name}</p>
                        <p className="text-xs text-slate-500">{player.team.shortName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{player.runs}</p>
                      <p className="text-xs text-slate-400">runs</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mt-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Runs Distribution</h3>
            <div className="h-64 w-full">
              {topBatsmen.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBatsmen} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(val) => val.split(' ')[0]} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="runs" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">Waiting for data...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
