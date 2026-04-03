import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playerService } from '../services/playerService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, User, Activity, Trophy, Crosshair } from 'lucide-react';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const data = await playerService.getPlayerById(id);
        setPlayer(data);
      } catch (err) {
        console.error("Failed to fetch player details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!player) {
    return <div className="text-center p-12 text-slate-500 font-medium">Player not found.</div>;
  }

  // Visualization Data prep
  const statData = [
    { name: 'Matches', value: player.matchesPlayed, fill: '#64748b' },
    { name: 'Runs', value: player.runs, fill: '#0ea5e9' },
    { name: 'Wickets', value: player.wickets, fill: '#10b981' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/players" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Directory
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-900 to-slate-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <div className="px-8 pb-8">
          {/* Header Profile Section */}
          <div className="flex flex-col md:flex-row relative -mt-20 z-10">
            <div className="w-40 h-40 bg-white p-2 rounded-2xl shadow-lg border-2 border-slate-100 flex items-center justify-center bg-slate-50">
              <User size={80} className="text-slate-300" />
            </div>
            
            <div className="mt-20 md:mt-24 md:ml-8 flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{player.name}</h1>
                  <p className="text-xl text-blue-600 font-medium mt-1">{player.country} &bull; {player.team?.name}</p>
                </div>
                <div className="mt-4 md:mt-0 bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-bold text-sm inline-block border border-blue-200">
                  {player.role}
                </div>
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-100" />

          {/* Details & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Personal Information & Formats */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center border-b pb-2 border-slate-100">
                  <Activity size={20} className="mr-2 text-slate-400" /> Physical & Style
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age</span>
                    <span className="font-semibold text-slate-800">{player.age} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batting Style</span>
                    <span className="font-semibold text-slate-800">{player.battingStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bowling Style</span>
                    <span className="font-semibold text-slate-800">{player.bowlingStyle}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center border-b pb-2 border-slate-100">
                  <Trophy size={20} className="mr-2 text-slate-400" /> Best Performance
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-2xl font-black text-slate-800 text-center">{player.bestPerformance || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Career Statistics grids */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center border-b pb-2 border-slate-100">
                  <Crosshair size={20} className="mr-2 text-slate-400" /> Career Analytics
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Matches</span>
                    <span className="text-3xl font-black text-slate-800">{player.matchesPlayed}</span>
                  </div>
                  
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Runs</span>
                    <span className="text-3xl font-black text-slate-800">{player.runs}</span>
                  </div>
                  
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Wickets</span>
                    <span className="text-3xl font-black text-slate-800">{player.wickets}</span>
                  </div>
                  
                  <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Average</span>
                    <span className="text-3xl font-black text-slate-800">{player.battingAverage?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Batting Strike Rate</span>
                    <span className="text-xl font-bold text-slate-900">{player.strikeRate?.toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Bowling Economy</span>
                    <span className="text-xl font-bold text-slate-900">{player.economyRate?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Visualization */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Volume Distribution</h3>
                <div className="h-48 w-full bg-white border border-slate-100 rounded-xl p-4 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
