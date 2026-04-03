import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchService } from '../services/matchService';
import { Calendar, MapPin, Trophy } from 'lucide-react';

const MatchesList = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await matchService.getAllMatches();
                // Sort by date descending
                setMatches(data.sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate)));
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Match Results & Fixtures</h1>
                <p className="text-slate-500 mt-2">Comprehensive list of all tournament matches and scorecards.</p>
            </div>

            <div className="space-y-6">
                {matches.map(match => (
                    <div key={match.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center text-sm font-medium text-slate-500">
                            <div className="flex items-center">
                                <Calendar size={16} className="mr-2" />
                                {match.matchDate} &bull; {match.matchType}
                            </div>
                            <div className="flex items-center">
                                <MapPin size={16} className="mr-2" />
                                {match.venue}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                {/* Team A */}
                                <div className="flex-1 flex justify-end items-center text-right w-full md:w-auto">
                                    <div className="mr-4">
                                        <h2 className={`text-2xl ${match.winner === match.teamA.shortName ? 'font-black text-slate-900' : 'font-semibold text-slate-600'}`}>
                                            {match.teamA.name}
                                        </h2>
                                        <div className="text-xl text-slate-700 mt-1">
                                            {match.teamARuns}/{match.teamAWickets} <span className="text-sm text-slate-400 font-normal">({match.teamAOvers})</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex flex-shrink-0 items-center justify-center font-bold text-slate-400 text-xl border-2 border-white shadow-inner">
                                        {match.teamA.shortName}
                                    </div>
                                </div>

                                {/* VS Divider */}
                                <div className="px-6 py-2 bg-slate-800 text-white font-bold rounded-full text-sm">
                                    VS
                                </div>

                                {/* Team B */}
                                <div className="flex-1 flex justify-start items-center text-left w-full md:w-auto">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex flex-shrink-0 items-center justify-center font-bold text-slate-400 text-xl border-2 border-white shadow-inner">
                                        {match.teamB.shortName}
                                    </div>
                                    <div className="ml-4">
                                        <h2 className={`text-2xl ${match.winner === match.teamB.shortName ? 'font-black text-slate-900' : 'font-semibold text-slate-600'}`}>
                                            {match.teamB.name}
                                        </h2>
                                        <div className="text-xl text-slate-700 mt-1">
                                            {match.teamBRuns}/{match.teamBWickets} <span className="text-sm text-slate-400 font-normal">({match.teamBOvers})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-blue-100 gap-4">
                            <div className="flex items-center">
                                <Trophy size={18} className="text-blue-600 mr-2" />
                                <span className="font-bold text-blue-800">{match.matchSummary || 'No summary available'}</span>
                            </div>
                            <div className="flex space-x-3">
                                {match.status === 'LIVE' && (
                                    <span className="animate-pulse bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200 shadow-sm flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> LIVE
                                    </span>
                                )}
                                <Link to={`/match/${match.id}/live`} className="text-sm font-medium text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-lg transition-colors hover:bg-blue-50">
                                    Live Scoreboard
                                </Link>
                                <Link to={`/admin/match/${match.id}/score`} className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors shadow-sm">
                                    Admin Score
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {matches.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500 text-lg">No matches played yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchesList;
