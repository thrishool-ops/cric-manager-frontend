import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PlayersList from './pages/PlayersList';
import PlayerProfile from './pages/PlayerProfile';
import MatchesList from './pages/MatchesList';
import AdminPanel from './pages/AdminPanel';
import AdminLiveScoring from './pages/AdminLiveScoring';
import LiveScoreCard from './pages/LiveScoreCard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<PlayersList />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/matches" element={<MatchesList />} />
            <Route path="/match/:id/live" element={<LiveScoreCard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/match/:id/score" element={<AdminLiveScoring />} />
          </Routes>
        </main>
        <footer className="bg-gray-900 border-t mt-auto">
          <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ESPN CricAnalytics. Professional Match Management.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
