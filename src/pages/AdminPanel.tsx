import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Shield, GamepadIcon, ExternalLink, AlertCircle, CheckCircle, Clock, Wrench, LogOut, User } from 'lucide-react';
import { Game, GameFormData } from '../types/game';
import { getGames, saveGame, updateGame, deleteGame } from '../utils/gameStorage';
import { checkAuthStatus, logout, initiateDiscordLogin, getAvatarUrl, AuthStatus, User as AuthUser } from '../utils/auth';

const AdminPanel: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false });
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState<GameFormData>({
    name: '',
    description: '',
    features: '',
    popularity: 50,
    image: '',
    gameLink: '',
    status: 'active'
  });

  useEffect(() => {
    checkAuth();
    
    // Check for authentication callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('authenticated') === 'true') {
      // Remove the query parameter and refresh auth status
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => checkAuth(), 500);
    } else if (urlParams.get('error') === 'access_denied') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (authStatus.authenticated) {
      loadGames();
    }
  }, [authStatus.authenticated]);

  const checkAuth = async () => {
    setIsLoading(true);
    const status = await checkAuthStatus();
    setAuthStatus(status);
    setIsLoading(false);
  };

  const loadGames = () => {
    const loadedGames = getGames();
    setGames(loadedGames);
  };

  const handleLogin = () => {
    initiateDiscordLogin();
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setAuthStatus({ authenticated: false });
      setGames([]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      features: '',
      popularity: 50,
      image: '',
      gameLink: '',
      status: 'active'
    });
    setIsAddingGame(false);
    setEditingGame(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGame) {
      const updated = updateGame(editingGame.id, formData);
      if (updated) {
        setGames(games.map(g => g.id === editingGame.id ? updated : g));
      }
    } else {
      const newGame = saveGame(formData);
      setGames([...games, newGame]);
    }
    
    resetForm();
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      description: game.description,
      features: game.features.join(', '),
      popularity: game.popularity,
      image: game.image,
      gameLink: game.gameLink,
      status: game.status
    });
    setIsAddingGame(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      if (deleteGame(id)) {
        setGames(games.filter(g => g.id !== id));
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'updating': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'updating': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'maintenance': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen unique-background pt-20 relative overflow-hidden">
        {/* Floating orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>

        {/* Particle Effects */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              '--random-x': `${(Math.random() - 0.5) * 100}px`
            } as React.CSSProperties}
          />
        ))}

        <section className="py-20 relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b7dd8] mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  if (!authStatus.authenticated) {
    return (
      <div className="min-h-screen unique-background pt-20 relative overflow-hidden">
        {/* Floating orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>

        {/* Particle Effects */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              '--random-x': `${(Math.random() - 0.5) * 100}px`
            } as React.CSSProperties}
          />
        ))}

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3834a4]/5 rounded-full blur-3xl animate-pulse float-animation"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4c46b8]/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
        </div>

        <section className="py-20 relative z-20 flex items-center justify-center min-h-screen">
          <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-md w-full mx-6 scale-hover shimmer">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md">
                <Shield className="w-4 h-4 text-[#8b7dd8]" />
                <span className="text-[#8b7dd8] text-sm font-semibold">Admin Access</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-4 text-glow">
                Admin Panel
              </h1>
              <p className="text-slate-400 mb-6">Authenticate with Discord to access the admin panel</p>
              
              <div className="bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-300">
                  Only authorized Discord users can access this panel. Contact the administrator if you need access.
                </p>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#5865F2]/25 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Login with Discord
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen unique-background pt-20 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>

      {/* Particle Effects */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            '--random-x': `${(Math.random() - 0.5) * 100}px`
          } as React.CSSProperties}
        />
      ))}

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3834a4]/5 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4c46b8]/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
      </div>

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-4 text-glow">
                Game Management Panel
              </h1>
              <p className="text-slate-400">Manage supported games and their configurations</p>
            </div>
            <div className="flex items-center gap-4">
              {/* User Info */}
              {authStatus.user && (
                <div className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 px-4 py-2">
                  <img
                    src={getAvatarUrl(authStatus.user)}
                    alt={authStatus.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <div className="text-white font-medium">{authStatus.user.username}</div>
                    <div className="text-slate-400">#{authStatus.user.discriminator}</div>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setIsAddingGame(true)}
                className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Game
              </button>
              <button
                onClick={handleLogout}
                className="border border-slate-600 text-slate-200 px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-700 hover:scale-105 hover:bg-slate-800/60 hover:border-[#3834a4]/50 hover:shadow-2xl hover:shadow-[#3834a4]/20 scale-hover shimmer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-1 ${getStatusColor(game.status)}`}>
                    {getStatusIcon(game.status)}
                    {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                  </div>

                  {/* Popularity Score */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 backdrop-blur-md bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50">
                    <GamepadIcon className="w-4 h-4 text-[#8b7dd8]" />
                    <span className="text-white font-semibold">{game.popularity}%</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white text-glow">{game.name}</h3>
                    <a
                      href={game.gameLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8b7dd8] hover:text-[#a094e0] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <p className="text-slate-400 mb-4 text-sm leading-relaxed line-clamp-3">
                    {game.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {game.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded border border-slate-600/50 text-center">
                          {feature}
                        </div>
                      ))}
                    </div>
                    {game.features.length > 4 && (
                      <div className="text-xs text-slate-400 text-center">
                        +{game.features.length - 4} more features
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(game)}
                      className="flex-1 bg-slate-700/50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-500 hover:bg-slate-600/50 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-500 hover:bg-red-500/30 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Game Modal */}
          {isAddingGame && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white text-glow">
                    {editingGame ? 'Edit Game' : 'Add New Game'}
                  </h3>
                  <button 
                    onClick={resetForm}
                    className="text-slate-400 hover:text-white transition-colors scale-hover"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Game Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                        placeholder="Enter game name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Game Link
                      </label>
                      <input
                        type="url"
                        value={formData.gameLink}
                        onChange={(e) => setFormData({...formData, gameLink: e.target.value})}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                        placeholder="https://www.roblox.com/games/..."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md h-24 resize-none"
                      placeholder="Enter game description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Features (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      placeholder="Auto Farm, ESP, Speed Hack, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      placeholder="https://images.pexels.com/..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Popularity (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.popularity}
                        onChange={(e) => setFormData({...formData, popularity: parseInt(e.target.value)})}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'updating' | 'maintenance'})}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="updating">Updating</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {editingGame ? 'Update Game' : 'Add Game'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="border border-slate-600 text-slate-200 px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;