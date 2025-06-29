import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Placeholder Discord link - replace with your actual Discord invite
  const discordLink = "https://discord.gg/your-discord-invite";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-md border-b border-purple-500/20 shadow-lg shadow-purple-500/10' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-white group-hover:text-purple-400 transition-all duration-500 text-glow">Luminous</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/games" 
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-500 scale-hover shimmer ${
                isActive('/games') 
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:backdrop-blur-sm border border-transparent hover:border-slate-700/50'
              }`}
            >
              <span className="relative z-10">Games</span>
              {isActive('/games') && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-lg animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/pricing" 
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-500 scale-hover shimmer ${
                isActive('/pricing') 
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:backdrop-blur-sm border border-transparent hover:border-slate-700/50'
              }`}
            >
              <span className="relative z-10">Pricing</span>
              {isActive('/pricing') && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-lg animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/key-system" 
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-500 scale-hover shimmer ${
                isActive('/key-system') 
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:backdrop-blur-sm border border-transparent hover:border-slate-700/50'
              }`}
            >
              <span className="relative z-10">Key System</span>
              {isActive('/key-system') && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-lg animate-pulse"></div>
              )}
            </Link>
          </div>

          {/* Discord Button */}
          <div className="hidden md:flex items-center">
            <a 
              href={discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 hover:from-purple-700 hover:to-purple-800 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <MessageCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Discord</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-500 scale-hover"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-purple-500/20 rounded-b-lg shadow-lg shadow-purple-500/10 fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/games" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                  isActive('/games') 
                    ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Games
              </Link>
              <Link 
                to="/pricing" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                  isActive('/pricing') 
                    ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/key-system" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                  isActive('/key-system') 
                    ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Key System
              </Link>
              <a 
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-500 scale-hover"
                onClick={() => setIsOpen(false)}
              >
                Discord
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;