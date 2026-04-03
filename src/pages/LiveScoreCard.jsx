import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { matchService } from '../services/matchService';
import { ArrowLeft, Clock, MapPin, Trophy } from 'lucide-react';

const LiveScoreCard = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const data = await matchService.getMatchById(id);
                setMatch(data);
            } catch (err) {
                console.error("Failed to load match", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
        
        // Polling every 5 seconds for live matches
        const intervalId = setInterval(() => {
            if (match && match.status !== 'COMPLETED') {
                fetchMatch();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [id, match?.status]);

    if (loading || !match) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentBattingTeam = match.currentInnings === 2 ? match.teamB : match.teamA;
    const currentBowlingTeam = match.currentInnings === 2 ? match.teamA : match.teamB;
    
    // Fallback if innings is 1/2
    const teamARuns = match.teamARuns || 0;
    const teamAWickets = match.teamAWickets || 0;
    const teamAOvers = match.teamAOvers || 0.0;
    const teamBRuns = match.teamBRuns || 0;
    const teamBWickets = match.teamBWickets || 0;
    const teamBOvers = match.teamBOvers || 0.0;
    
    const crr = teamAOvers > 0 && match.currentInnings === 1 ? (teamARuns / teamAOvers).toFixed(2) 
              : match.currentInnings === 2 && teamBOvers > 0 ? (teamBRuns / teamBOvers).toFixed(2)
              : "0.00";
              
    const requiredRuns = match.targetScore > 0 ? match.targetScore - teamBRuns : 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
            <Link to="/matches" className="flex items-center text-slate-500 hover:text-slate-800 mb-6 font-medium">
                <ArrowLeft size={16} className="mr-2" /> Back to Matches
            </Link>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
                {/* Header Strip */}
                <div className={`px-6 py-3 flex justify-between items-center text-sm font-bold text-white shadow-inner ${match.status === 'LIVE' ? 'bg-red-600' : match.status === 'COMPLETED' ? 'bg-slate-800' : 'bg-blue-600'}`}>
                    <div className="flex items-center">
                        {match.status === 'LIVE' && <span className="animate-ping w-2 h-2 rounded-full border-white bg-white mr-2"></span>}
                        {match.status}
                    </div>
                    <div>{match.matchType} Match</div>
                </div>

                <div className="p-8 pb-4">
                    <div className="flex flex-col text-center text-slate-500 text-sm font-semibold mb-6 uppercase tracking-wider space-y-1">
                        <span className="flex justify-center items-center"><Clock size={14} className="mr-1"/> {match.matchDate}</span>
                        <span className="flex justify-center items-center"><MapPin size={14} className="mr-1"/> {match.venue}</span>
                    </div>

                    {/* Score section */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        {/* Team A */}
                        <div className={`flex flex-col items-center flex-1 ${match.currentInnings === 1 ? '' : 'opacity-60'}`}>
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center font-black text-2xl text-slate-400 border-4 border-slate-100 shadow-md mb-3">
                                {match.teamA.shortName}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{match.teamA.name}</h2>
                            <div className="text-4xl font-black text-slate-900 mt-2">
                                {teamARuns}<span className="text-2xl text-slate-400">/{teamAWickets}</span>
                            </div>
                            <div className="text-sm font-semibold text-slate-500 mt-1">
                                {match.teamAOvers?.toFixed(1)} Overs
                            </div>
                        </div>

                        <div className="px-6 py-3 mx-4 my-6 md:my-0 bg-slate-200 text-slate-600 font-bold rounded-xl text-lg relative">
                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1px] h-20 bg-slate-300 md:hidden"></div>
                             VS
                        </div>

                        {/* Team B */}
                        <div className={`flex flex-col items-center flex-1 ${match.currentInnings === 2 ? '' : 'opacity-50'}`}>
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center font-black text-2xl text-slate-400 border-4 border-slate-100 shadow-md mb-3">
                                {match.teamB.shortName}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{match.teamB.name}</h2>
                            <div className="text-4xl font-black text-slate-900 mt-2">
                                {teamBRuns}<span className="text-2xl text-slate-400">/{teamBWickets}</span>
                            </div>
                            <div className="text-sm font-semibold text-slate-500 mt-1">
                                {match.teamBOvers?.toFixed(1)} Overs
                            </div>
                        </div>
                    </div>

                    {match.currentInnings === 2 && match.targetScore > 0 && match.status !== 'COMPLETED' && (
                        <div className="mt-6 text-center text-lg font-bold text-slate-600 bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                            Target: <span className="text-slate-800">{match.targetScore}</span> 
                            &nbsp;&bull;&nbsp; 
                            <span className="text-blue-600">{match.teamB.name} needs {requiredRuns} runs</span>
                        </div>
                    )}
                </div>

                {/* Live Details Section */}
                {match.status === 'LIVE' && (
                    <div className="px-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                        {/* Current Batters */}
                        <div className="bg-white border-l-4 border-l-blue-500 rounded-r-xl border border-y-slate-200 border-r-slate-200 p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Batters</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-slate-800 font-bold text-lg">
                                    <span className="flex items-center group">
                                        {match.currentStriker || 'Batter 1'} 
                                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full" title="Striker"></span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 font-medium pb-2 border-b border-slate-100">
                                    <span>{match.currentNonStriker || 'Batter 2'}</span>
                                </div>
                            </div>
                            <div className="mt-3 flex justify-between text-sm font-bold text-slate-500">
                                <span>CRR: {crr}</span>
                            </div>
                        </div>

                        {/* Current Bowler & Over Details */}
                        <div className="bg-white border-l-4 border-l-orange-500 rounded-r-xl border border-y-slate-200 border-r-slate-200 p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Bowler</h3>
                            <div className="text-slate-800 font-bold text-lg mb-4">
                                {match.currentBowler || 'Current Bowler'}
                            </div>
                            
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">This Over</h3>
                            <div className="flex flex-wrap gap-2 items-center">
                                {match.currentOverDetails ? (
                                    match.currentOverDetails.split(' ').map((ball, i) => (
                                        ball && (
                                            <span key={i} className={`
                                                w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm
                                                ${ball === 'W' ? 'bg-red-500 text-white' : 
                                                  ball === '4' ? 'bg-sky-400 text-white' :
                                                  ball === '6' ? 'bg-indigo-600 text-white' :
                                                  'bg-slate-100 text-slate-700 border border-slate-200'}
                                            `}>
                                                {ball}
                                            </span>
                                        )
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400 font-medium">New over starts</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Match Summary / Toss */}
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
                    <div className="flex items-center text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                         {match.tossResult || 'Toss not updated'}
                    </div>
                    {match.matchSummary && (
                        <div className="flex items-center text-blue-700">
                            <Trophy size={16} className="mr-2" />
                            <span className="font-bold">{match.matchSummary}</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-center mt-6 text-slate-400 text-xs font-medium">
                 Data automatically refreshes every 5 seconds.
            </div>
        </div>
    );
};

export default LiveScoreCard;
