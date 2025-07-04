import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getSettings } from '../utils/settingsStorage';
import { checkAuthStatus } from '../utils/auth';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [discordLink, setDiscordLink] = useState('https://discord.gg/your-discord-invite');
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load Discord link from settings
    const settings = getSettings();
    setDiscordLink(settings.discordInviteLink);

    // Check if user is admin
    checkAuthStatus().then(status => {
      setIsAdmin(status.authenticated);
    });
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-md border-b border-[#3834a4]/20 shadow-lg shadow-[#3834a4]/10' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-white group-hover:text-[#8b7dd8] transition-all duration-500 text-glow">Luminous Scripts</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/games" 
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-500 scale-hover shimmer ${
                isActive('/games') 
                  ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20 shadow-lg shadow-[#3834a4]/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:backdrop-blur-sm border border-transparent hover:border-slate-700/50'
              }`}
            >
              <span className="relative z-10">Games</span>
              {isActive('/games') && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#3834a4]/5 to-[#4c46b8]/5 rounded-lg animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/pricing" 
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-500 scale-hover shimmer ${
                isActive('/pricing') 
                  ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20 shadow-lg shadow-[#3834a4]/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:backdrop-blur-sm border border-transparent hover:border-slate-700/50'
              }`}
            >
              <span className="relative z-10">Pricing</span>
              {isActive('/pricing') && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#3834a4]/5 to-[#4c46b8]/5 rounded-lg animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/key-system" 
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-500 scale-hover shimmer ${
                isActive('/key-system') 
                  ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20 shadow-lg shadow-[#3834a4]/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:backdrop-blur-sm border border-transparent hover:border-slate-700/50'
              }`}
            >
              <span className="relative z-10">Key System</span>
              {isActive('/key-system') && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#3834a4]/5 to-[#4c46b8]/5 rounded-lg animate-pulse"></div>
              )}
            </Link>

            {/* Admin Panel Link - Only visible to admins */}
            {isAdmin && (
              <Link 
                to="/admin-hexa-hub-2024" 
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-500 scale-hover shimmer ${
                  isActive('/admin-hexa-hub-2024') 
                    ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20 shadow-lg shadow-[#3834a4]/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:backdrop-blur-sm border border-transparent hover:border-slate-700/50'
                }`}
                title="Admin Panel"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </span>
                {isActive('/admin-hexa-hub-2024') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3834a4]/5 to-[#4c46b8]/5 rounded-lg animate-pulse"></div>
                )}
              </Link>
            )}
          </div>

          {/* Discord Button */}
          <div className="hidden md:flex items-center">
            <a 
              href={discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center gap-2 hover:from-[#4c46b8] hover:to-[#5a54c2] overflow-hidden"
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
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-[#3834a4]/20 rounded-b-lg shadow-lg shadow-[#3834a4]/10 fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/games" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                  isActive('/games') 
                    ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20' 
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
                    ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20' 
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
                    ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Key System
              </Link>

              {/* Admin Panel Link - Mobile */}
              {isAdmin && (
                <Link 
                  to="/admin-hexa-hub-2024" 
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                    isActive('/admin-hexa-hub-2024') 
                      ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </div>
                </Link>
              )}

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