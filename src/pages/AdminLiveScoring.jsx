import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchService } from '../services/matchService';
import { ArrowLeft, Save, Activity, RefreshCw } from 'lucide-react';

const AdminLiveScoring = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Live State
    const [status, setStatus] = useState('UPCOMING');
    const [tossResult, setTossResult] = useState('');
    const [currentInnings, setCurrentInnings] = useState(1);
    const [currentStriker, setCurrentStriker] = useState('');
    const [currentNonStriker, setCurrentNonStriker] = useState('');
    const [currentBowler, setCurrentBowler] = useState('');
    const [currentOverDetails, setCurrentOverDetails] = useState('');
    const [targetScore, setTargetScore] = useState(0);
    const [matchSummary, setMatchSummary] = useState('');
    
    const [teamRuns, setTeamRuns] = useState(0);
    const [teamWickets, setTeamWickets] = useState(0);
    const [teamOvers, setTeamOvers] = useState(0.0);

    const fetchMatch = async () => {
        try {
            const data = await matchService.getMatchById(id);
            setMatch(data);
            setStatus(data.status || 'UPCOMING');
            setTossResult(data.tossResult || '');
            setCurrentInnings(data.currentInnings || 1);
            setCurrentStriker(data.currentStriker || '');
            setCurrentNonStriker(data.currentNonStriker || '');
            setCurrentBowler(data.currentBowler || '');
            setCurrentOverDetails(data.currentOverDetails || '');
            setTargetScore(data.targetScore || 0);
            setMatchSummary(data.matchSummary || '');
            
            if (data.currentInnings === 2) {
                setTeamRuns(data.teamBRuns || 0);
                setTeamWickets(data.teamBWickets || 0);
                setTeamOvers(data.teamBOvers || 0.0);
            } else {
                setTeamRuns(data.teamARuns || 0);
                setTeamWickets(data.teamAWickets || 0);
                setTeamOvers(data.teamAOvers || 0.0);
            }
        } catch (err) {
            console.error("Failed to load match", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatch();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await matchService.updateLiveScore(id, {
                status,
                tossResult,
                currentInnings,
                currentStriker,
                currentNonStriker,
                currentBowler,
                currentOverDetails,
                targetScore,
                matchSummary,
                teamRuns,
                teamWickets,
                teamOvers
            });
            await fetchMatch(); // Refresh state from server
        } catch (err) {
            console.error("Failed to update score", err);
            alert("Error updating score");
        } finally {
            setSaving(false);
        }
    };

    const addRunToOver = (symbol) => {
        setCurrentOverDetails(prev => prev ? prev + ' ' + symbol : symbol);
    };

    const handleBall = (runs, extraMsg = null, isWicket = false) => {
        setTeamRuns(prev => prev + runs);
        
        if (isWicket) {
            setTeamWickets(prev => prev + 1);
            addRunToOver('W');
        } else if (extraMsg) {
            addRunToOver(extraMsg);
        } else {
            addRunToOver(runs.toString());
        }

        // Logic for Overs (naive approach: increment balls correctly)
        // 0.1 -> 0.2 -> 0.3 -> 0.4 -> 0.5 -> 1.0
        if (!extraMsg || extraMsg === 'B' || extraMsg === 'LB') {
            setTeamOvers(prev => {
                let over = Math.floor(prev);
                let balls = Math.round((prev - over) * 10);
                if (balls >= 5) {
                    // Over change
                    setCurrentOverDetails(''); // Reset over tracking box
                    return over + 1.0;
                }
                return parseFloat((over + (balls + 1) / 10).toFixed(1));
            });
        }
    };

    if (loading || !match) {
        return <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>;
    }

    const currentBattingTeam = currentInnings === 2 ? match.teamB : match.teamA;
    const currentBowlingTeam = currentInnings === 2 ? match.teamA : match.teamB;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <button onClick={() => navigate('/matches')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 font-medium">
                <ArrowLeft size={16} className="mr-2" /> Back to Matches
            </button>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <Activity className="text-blue-400" />
                        <h1 className="text-xl font-bold">Admin Scoring Panel</h1>
                    </div>
                    <div>
                        <span className="text-sm text-slate-400 mr-4">{match.teamA.shortName} vs {match.teamB.shortName}</span>
                        <select 
                            value={status} 
                            onChange={e => setStatus(e.target.value)}
                            className="bg-slate-800 border-none text-sm rounded px-3 py-1 text-white font-medium focus:ring-2 ring-blue-500">
                            <option value="UPCOMING">Upcoming</option>
                            <option value="LIVE">Live</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 border-b border-slate-200">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-center font-bold text-2xl text-slate-800 mb-1">{currentBattingTeam.name}</h2>
                        <div className="text-center text-5xl font-black text-slate-900 my-4">
                            {teamRuns}/{teamWickets} 
                            <span className="text-2xl text-slate-400 font-normal ml-2">({teamOvers.toFixed(1)})</span>
                        </div>
                        {currentInnings === 2 && targetScore > 0 && (
                            <div className="text-center text-sm font-bold text-blue-600 bg-blue-50 py-2 rounded-lg">
                                Target: {targetScore}. Needs {targetScore - teamRuns} runs to win.
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-semibold mb-2">Current Over Status:</p>
                            <div className="flex flex-wrap gap-2 min-h-12 items-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-lg font-bold">
                                {currentOverDetails.split(' ').map((ball, i) => (
                                    ball && <span key={i} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-300 rounded-full shadow-sm text-slate-700">{ball}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => setCurrentOverDetails('')} className="mt-4 px-4 py-2 border border-slate-300 rounded shadow-sm text-sm font-medium hover:bg-slate-50 flex-1">
                                Clear Over
                            </button>
                            <button onClick={fetchMatch} className="mt-4 px-4 py-2 border border-blue-300 text-blue-700 rounded shadow-sm text-sm font-medium hover:bg-blue-50 flex items-center justify-center">
                                <RefreshCw size={14} className="mr-2" /> Sync
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 bg-white grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Scoring Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Scoring Actions</h3>
                        
                        <div className="grid grid-cols-6 gap-3">
                            {[0, 1, 2, 3, 4, 6].map(runs => (
                                <button 
                                    key={runs} 
                                    onClick={() => handleBall(runs)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-6 rounded-xl shadow-sm transition-colors text-xl border border-slate-200 focus:ring-2 ring-blue-400">
                                    {runs}
                                </button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3">
                            <button onClick={() => handleBall(0, 'W', true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-sm transition-colors text-lg col-span-2 shadow-red-200 border-b-4 border-red-700 active:border-b-0 active:translate-y-[4px]">
                                Wicket!
                            </button>
                            <button onClick={() => handleBall(1, 'Wd')} className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold py-4 rounded-xl border border-orange-200">Wide</button>
                            <button onClick={() => handleBall(1, 'Nb')} className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold py-4 rounded-xl border border-orange-200">No Ball</button>
                            <button onClick={() => handleBall(1, 'B')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl border border-slate-200">Bye (+1)</button>
                            <button onClick={() => handleBall(1, 'LB')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl border border-slate-200">Leg Bye (+1)</button>
                            <button onClick={() => handleBall(4, 'B')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl border border-slate-200">Bye (+4)</button>
                            <button onClick={() => handleBall(4, 'LB')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl border border-slate-200">Leg Bye (+4)</button>
                        </div>
                    </div>

                    {/* Meta Controls */}
                    <div className="space-y-4">
                         <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Match Metadata</h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Innings</label>
                            <select 
                                value={currentInnings}
                                onChange={e => setCurrentInnings(parseInt(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 ring-blue-500 outline-none">
                                <option value={1}>1st Innings ({match.teamA.shortName})</option>
                                <option value={2}>2nd Innings ({match.teamB.shortName})</option>
                            </select>
                        </div>
                        
                        {currentInnings === 2 && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Target Score</label>
                                <input 
                                    type="number" 
                                    value={targetScore} 
                                    onChange={e => setTargetScore(parseInt(e.target.value))} 
                                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 ring-blue-500 outline-none" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Striker</label>
                            <input 
                                type="text" 
                                value={currentStriker} 
                                onChange={e => setCurrentStriker(e.target.value)} 
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 ring-blue-500 outline-none" placeholder="e.g. Virat Kohli" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Non-Striker</label>
                            <input 
                                type="text" 
                                value={currentNonStriker} 
                                onChange={e => setCurrentNonStriker(e.target.value)} 
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 ring-blue-500 outline-none" placeholder="e.g. Rohit Sharma" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Bowler</label>
                            <input 
                                type="text" 
                                value={currentBowler} 
                                onChange={e => setCurrentBowler(e.target.value)} 
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 ring-blue-500 outline-none" placeholder="e.g. Jasprit Bumrah" />
                        </div>

                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Match Summary / Note</label>
                            <textarea 
                                value={matchSummary} 
                                onChange={e => setMatchSummary(e.target.value)} 
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 ring-blue-500 outline-none resize-none" rows="2" placeholder="Match situation..."></textarea>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-6 flex justify-end border-t border-slate-200">
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save className="mr-2" size={20} />
                        {saving ? 'Saving...' : 'Push Update Server'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLiveScoring;
