import { Link, useLocation } from 'react-router-dom';
import { Activity, Users, CalendarDays, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: 'Players & Stats', path: '/players', icon: Users },
    { name: 'Matches', path: '/matches', icon: CalendarDays },
    { name: 'Admin Hub', path: '/admin', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Cric<span className="text-blue-500">Analytics</span></span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="mr-2" size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
