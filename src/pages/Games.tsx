import React from 'react';
import { Star, Shield, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { getGames } from '../utils/gameStorage';

const Games: React.FC = () => {
  const games = getGames();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'updating': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'maintenance': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'updating': return 'Updating';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen grid-background pt-20 relative overflow-hidden">
      {/* Particle Effects - Fixed positioning to spread across screen */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${5 + (i * 4.5)}%`, // Spread particles evenly across width
            animationDelay: `${i * 1}s`, // Stagger animation start times
            animationDuration: `${22 + (i % 8)}s`, // Vary animation speeds
          }}
        />
      ))}

      {/* Additional animated background elements for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
      </div>

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover fade-in-up">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">Premium Scripts</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6 text-glow fade-in-up-delay-1">
              Supported Games
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto fade-in-up-delay-2">
              Premium scripts for the most popular games with regular updates and new features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                className={`group bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-700 hover:scale-105 hover:bg-slate-800/60 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 scale-hover shimmer fade-in-up-delay-${Math.min(index + 1, 5)}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Enhanced gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/60 via-purple-700/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  
                  {/* Animated border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${getStatusColor(game.status)}`}>
                    {getStatusText(game.status)}
                  </div>

                  {/* Popularity Score */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 backdrop-blur-md bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50 scale-hover">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{game.popularity}%</span>
                  </div>

                  {/* Game Link */}
                  <div className="absolute bottom-4 right-4">
                    <a
                      href={game.gameLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 backdrop-blur-md bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50 text-white hover:text-purple-400 transition-colors scale-hover"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 text-glow">
                    {game.name}
                  </h3>
                  <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                    {game.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {game.features.map((feature, index) => (
                        <div key={index} className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded border border-slate-600/50 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm scale-hover shimmer">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 fade-in-up-delay-5">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 backdrop-blur-md scale-hover shimmer">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Scripts updated every 24 hours</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Games;