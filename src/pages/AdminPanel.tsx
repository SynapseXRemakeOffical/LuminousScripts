import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Shield, Eye, EyeOff, GamepadIcon, ExternalLink, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { Game, GameFormData } from '../types/game';
import { getGames, saveGame, updateGame, deleteGame } from '../utils/gameStorage';

// Admin access key - change this to your desired key
const ADMIN_ACCESS_KEY = "admin_hexa_hub_2024";

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
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
    if (isAuthenticated) {
      loadGames();
    }
  }, [isAuthenticated]);

  const loadGames = () => {
    const loadedGames = getGames();
    setGames(loadedGames);
  };

  const handleLogin = () => {
    if (accessKey === ADMIN_ACCESS_KEY) {
      setIsAuthenticated(true);
      setAccessKey('');
    } else {
      alert('Invalid access key!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessKey('');
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen grid-background pt-20 relative overflow-hidden">
        {/* Particle Effects */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3834a4]/5 rounded-full blur-3xl animate-pulse float-animation"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4c46b8]/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
        </div>

        <section className="py-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-md w-full mx-6 scale-hover shimmer">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md">
                <Shield className="w-4 h-4 text-[#8b7dd8]" />
                <span className="text-[#8b7dd8] text-sm font-semibold">Admin Access</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-4 text-glow">
                Admin Panel
              </h1>
              <p className="text-slate-400">Enter your access key to manage games</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Access Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md pr-12"
                    placeholder="Enter admin access key"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-background pt-20 relative overflow-hidden">
      {/* Particle Effects */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3834a4]/5 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4c46b8]/5 rounded-full blur-3xl animate-pulse delay-1000 float-animation-delayed"></div>
      </div>

      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-4 text-glow">
                Game Management Panel
              </h1>
              <p className="text-slate-400">Manage supported games and their configurations</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsAddingGame(true)}
                className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Game
              </button>
              <button
                onClick={handleLogout}
                className="border border-slate-600 text-slate-200 px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md"
              >
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