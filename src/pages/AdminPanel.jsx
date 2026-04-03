import { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';
import { playerService } from '../services/playerService';
import { matchService } from '../services/matchService';
import { dashboardService } from '../services/dashboardService';
import { Settings, Shield, Users, Calendar, Database } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [teams, setTeams] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  // Form States
  const [teamForm, setTeamForm] = useState({ name: '', shortName: '', coach: '', homeVenue: '' });
  const [playerForm, setPlayerForm] = useState({ 
    name: '', age: '', role: 'Batsman', battingStyle: 'Right-hand bat', 
    bowlingStyle: 'Right-arm medium', country: '', teamId: '' 
  });
  const [matchForm, setMatchForm] = useState({
    teamAId: '', teamBId: '', venue: '', matchDate: '', matchType: 'T20'
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
      if (data.length > 0) {
        setPlayerForm(prev => ({ ...prev, teamId: data[0].id }));
        if (data.length > 1) {
          setMatchForm(prev => ({ ...prev, teamAId: data[0].id, teamBId: data[1].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load teams", err);
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      await teamService.createTeam(teamForm);
      setSuccess(`Team ${teamForm.name} created successfully!`);
      setTeamForm({ name: '', shortName: '', coach: '', homeVenue: '' });
      fetchTeams();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create team.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the actual team object
      const team = teams.find(t => t.id === parseInt(playerForm.teamId));
      if (!team) throw new Error("Team not found");

      const playerData = { ...playerForm, team: team };
      delete playerData.teamId;

      await playerService.createPlayer(playerData);
      setSuccess(`Player ${playerForm.name} registered successfully!`);
      setPlayerForm({ name: '', age: '', role: 'Batsman', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium', country: '', teamId: teams[0]?.id || '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to register player.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (matchForm.teamAId === matchForm.teamBId) {
      setError("Team A and Team B cannot be the same.");
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      const teamA = teams.find(t => t.id === parseInt(matchForm.teamAId));
      const teamB = teams.find(t => t.id === parseInt(matchForm.teamBId));
      
      const matchData = { ...matchForm, teamA, teamB };
      delete matchData.teamAId;
      delete matchData.teamBId;

      await matchService.createMatch(matchData);
      setSuccess(`Match scheduled successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to schedule match.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSeedDatabase = async () => {
    if(!window.confirm("This will auto-generate 100 new players and 30 matches into the existing database. Proceed?")) return;
    
    setIsSeeding(true);
    setError('');
    setSuccess('');
    
    try {
      const resp = await dashboardService.triggerSeeding();
      setSuccess(resp.message || 'Database successfully seeded with realistic mock data.');
      fetchTeams(); // refresh state
    } catch (err) {
      setError('Failed to seed the database. Make sure your Spring Boot backend is running.');
      console.error(err);
    } finally {
      setIsSeeding(false);
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-slate-800 p-3 rounded-xl mr-4 text-white">
            <Settings size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Platform Admin Hub</h1>
            <p className="text-slate-500 mt-1">Manage all central entities in the database.</p>
          </div>
        </div>
        
        <button 
          onClick={handleSeedDatabase}
          disabled={isSeeding}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors shadow-sm
            ${isSeeding ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'}`}
        >
          {isSeeding ? (
            <div className="w-5 h-5 mr-2 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Database size={18} className="mr-2" />
          )}
          {isSeeding ? 'Generating Data...' : 'Auto-Generate Data'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-4 flex items-center justify-center font-semibold transition-colors
              ${activeTab === 'team' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Shield size={18} className="mr-2" /> Register Team
          </button>
          <button 
            onClick={() => setActiveTab('player')}
            className={`flex-1 py-4 flex items-center justify-center font-semibold transition-colors
              ${activeTab === 'player' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users size={18} className="mr-2" /> Register Player
          </button>
          <button 
            onClick={() => setActiveTab('match')}
            className={`flex-1 py-4 flex items-center justify-center font-semibold transition-colors
              ${activeTab === 'match' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Calendar size={18} className="mr-2" /> Schedule Match
          </button>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium text-center">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium text-center">
              {error}
            </div>
          )}

          {/* TEAM FORM */}
          {activeTab === 'team' && (
            <form onSubmit={handleTeamSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Franchise Full Name</label>
                  <input type="text" required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Mumbai Indians" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Short Code</label>
                  <input type="text" required value={teamForm.shortName} onChange={e => setTeamForm({...teamForm, shortName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. MI" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Head Coach</label>
                  <input type="text" value={teamForm.coach} onChange={e => setTeamForm({...teamForm, coach: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Mahela Jayawardene" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Home Venue</label>
                  <input type="text" value={teamForm.homeVenue} onChange={e => setTeamForm({...teamForm, homeVenue: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Wankhede Stadium" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-6 shadow-md shadow-blue-600/20">
                Register Franchise Team
              </button>
            </form>
          )}

          {/* PLAYER FORM */}
          {activeTab === 'player' && (
            <form onSubmit={handlePlayerSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Player Name</label>
                  <input type="text" required value={playerForm.name} onChange={e => setPlayerForm({...playerForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Virat Kohli" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                  <input type="number" required value={playerForm.age} onChange={e => setPlayerForm({...playerForm, age: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 35" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Role</label>
                  <select value={playerForm.role} onChange={e => setPlayerForm({...playerForm, role: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option>Batsman</option>
                    <option>Bowler</option>
                    <option>All-rounder</option>
                    <option>Wicketkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                  <input type="text" required value={playerForm.country} onChange={e => setPlayerForm({...playerForm, country: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. India" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Batting Style</label>
                  <select value={playerForm.battingStyle} onChange={e => setPlayerForm({...playerForm, battingStyle: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option>Right-hand bat</option>
                    <option>Left-hand bat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Bowling Style</label>
                  <select value={playerForm.bowlingStyle} onChange={e => setPlayerForm({...playerForm, bowlingStyle: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option>Right-arm fast</option>
                    <option>Right-arm medium</option>
                    <option>Right-arm offbreak</option>
                    <option>Right-arm legbreak</option>
                    <option>Left-arm fast</option>
                    <option>Left-arm orthodox</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Franchise Team</label>
                  <select required value={playerForm.teamId} onChange={e => setPlayerForm({...playerForm, teamId: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-6 shadow-md shadow-blue-600/20">
                Register Player into Database
              </button>
            </form>
          )}

          {/* MATCH FORM */}
          {activeTab === 'match' && (
            <form onSubmit={handleMatchSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Team A (Home)</label>
                  <select required value={matchForm.teamAId} onChange={e => setMatchForm({...matchForm, teamAId: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Team B (Away)</label>
                  <select required value={matchForm.teamBId} onChange={e => setMatchForm({...matchForm, teamBId: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Match Date</label>
                  <input type="date" required value={matchForm.matchDate} onChange={e => setMatchForm({...matchForm, matchDate: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Format</label>
                  <select value={matchForm.matchType} onChange={e => setMatchForm({...matchForm, matchType: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option>T20</option>
                    <option>ODI</option>
                    <option>Test</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Authorized Venue</label>
                  <input type="text" required value={matchForm.venue} onChange={e => setMatchForm({...matchForm, venue: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Wankhede Stadium" />
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mt-4 text-sm text-slate-600">
                <p className="font-semibold mb-1">Note:</p>
                <p>Registering a match here will create an empty upcoming fixture. To log scorecard results, go to the Match Results portal.</p>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-6 shadow-md shadow-blue-600/20">
                Schedule Match Fixture
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
