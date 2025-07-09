import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Key System', path: '/key-system' },
    { name: 'Admin Panel', path: '/admin-panel' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-[#8b7dd8] transition-colors duration-300">
            <div className="p-2 bg-gradient-to-br from-[#3834a4] to-[#4c46b8] rounded-lg shadow-lg shadow-[#3834a4]/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Luminous Scripts
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20'
                    : 'text-slate-300 hover:text-[#8b7dd8] hover:bg-slate-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-[#8b7dd8] transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-[#8b7dd8] bg-[#3834a4]/10 border border-[#3834a4]/20'
                      : 'text-slate-300 hover:text-[#8b7dd8] hover:bg-slate-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;