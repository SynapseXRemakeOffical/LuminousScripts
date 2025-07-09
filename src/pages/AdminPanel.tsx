import React, { useState, useEffect } from 'react';
import { Settings, Users, GamepadIcon, Key, Plus, Edit, Trash2, Save, X, Sparkles } from 'lucide-react';
import { getGames, addGame, updateGame, deleteGame } from '../utils/gameStorage';
import { getSettings, updateSettings, addKeySystemProvider, updateKeySystemProvider, deleteKeySystemProvider } from '../utils/settingsStorage';
import { Game, GameFormData } from '../types/game';
import { AppSettings, KeySystemProvider } from '../types/settings';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'games' | 'settings' | 'keys'>('games');
  const [games, setGames] = useState<Game[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingProvider, setEditingProvider] = useState<KeySystemProvider | null>(null);
  const [showGameForm, setShowGameForm] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);

  useEffect(() => {
    setGames(getGames());
    setSettings(getSettings());
  }, []);

  const handleAddGame = (gameData: GameFormData) => {
    const newGame = addGame({
      ...gameData,
      features: gameData.features.split(',').map(f => f.trim()).filter(f => f)
    });
    setGames(getGames());
    setShowGameForm(false);
  };

  const handleUpdateGame = (id: string, gameData: GameFormData) => {
    updateGame(id, {
      ...gameData,
      features: gameData.features.split(',').map(f => f.trim()).filter(f => f)
    });
    setGames(getGames());
    setEditingGame(null);
  };

  const handleDeleteGame = (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      deleteGame(id);
      setGames(getGames());
    }
  };

  const handleUpdateSettings = (updates: Partial<AppSettings>) => {
    if (settings) {
      const updatedSettings = updateSettings(updates);
      setSettings(updatedSettings);
    }
  };

  const handleAddProvider = (provider: Omit<KeySystemProvider, 'id'>) => {
    addKeySystemProvider(provider);
    setSettings(getSettings());
    setShowProviderForm(false);
  };

  const handleUpdateProvider = (id: string, updates: Partial<KeySystemProvider>) => {
    updateKeySystemProvider(id, updates);
    setSettings(getSettings());
    setEditingProvider(null);
  };

  const handleDeleteProvider = (id: string) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      deleteKeySystemProvider(id);
      setSettings(getSettings());
    }
  };

  return (
    <div className="min-h-screen unique-background pt-20 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover fade-in-up">
              <Settings className="w-4 h-4 text-[#8b7dd8]" />
              <span className="text-[#8b7dd8] text-sm font-semibold">Admin Panel</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-6 text-glow fade-in-up-delay-1">
              Admin Dashboard
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto fade-in-up-delay-2">
              Manage games, settings, and key system providers
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-500 ${
                  activeTab === 'games'
                    ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                    : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                } backdrop-blur-md scale-hover shimmer`}
              >
                <GamepadIcon className="w-5 h-5" />
                Games
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-500 ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                    : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                } backdrop-blur-md scale-hover shimmer`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={() => setActiveTab('keys')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-500 ${
                  activeTab === 'keys'
                    ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                    : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                } backdrop-blur-md scale-hover shimmer`}
              >
                <Key className="w-5 h-5" />
                Key Providers
              </button>
            </div>

            {/* Games Tab */}
            {activeTab === 'games' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white text-glow">Manage Games</h2>
                  <button
                    onClick={() => setShowGameForm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                  >
                    <Plus className="w-5 h-5" />
                    Add Game
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map((game) => (
                    <div key={game.id} className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 scale-hover shimmer">
                      <img src={game.image} alt={game.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2 text-glow">{game.name}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{game.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          game.status === 'active' ? 'bg-green-400/10 text-green-400' :
                          game.status === 'updating' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-red-400/10 text-red-400'
                        }`}>
                          {game.status}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingGame(game)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && settings && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-glow">App Settings</h2>
                <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Discord Invite Link</label>
                      <input
                        type="url"
                        value={settings.discordInviteLink}
                        onChange={(e) => handleUpdateSettings({ discordInviteLink: e.target.value })}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                        placeholder="https://discord.gg/your-server"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Providers Tab */}
            {activeTab === 'keys' && settings && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white text-glow">Key System Providers</h2>
                  <button
                    onClick={() => setShowProviderForm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                  >
                    <Plus className="w-5 h-5" />
                    Add Provider
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {settings.keySystemProviders.map((provider) => (
                    <div key={provider.id} className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 scale-hover shimmer">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white text-glow">{provider.name}</h3>
                          <p className="text-slate-400 text-sm">{provider.checkpoints} checkpoints</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProvider(provider)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProvider(provider.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{provider.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          provider.isActive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                        }`}>
                          {provider.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleUpdateProvider(provider.id, { isActive: !provider.isActive })}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            provider.isActive 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {provider.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Game Form Modal */}
      {(showGameForm || editingGame) && (
        <GameFormModal
          game={editingGame}
          onSave={editingGame ? (data) => handleUpdateGame(editingGame.id, data) : handleAddGame}
          onClose={() => {
            setShowGameForm(false);
            setEditingGame(null);
          }}
        />
      )}

      {/* Provider Form Modal */}
      {(showProviderForm || editingProvider) && (
        <ProviderFormModal
          provider={editingProvider}
          onSave={editingProvider ? (data) => handleUpdateProvider(editingProvider.id, data) : handleAddProvider}
          onClose={() => {
            setShowProviderForm(false);
            setEditingProvider(null);
          }}
        />
      )}
    </div>
  );
};

// Game Form Modal Component
const GameFormModal: React.FC<{
  game?: Game | null;
  onSave: (data: GameFormData) => void;
  onClose: () => void;
}> = ({ game, onSave, onClose }) => {
  const [formData, setFormData] = useState<GameFormData>({
    name: game?.name || '',
    description: game?.description || '',
    features: game?.features.join(', ') || '',
    popularity: game?.popularity || 50,
    image: game?.image || '',
    gameLink: game?.gameLink || '',
    status: game?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white text-glow">
            {game ? 'Edit Game' : 'Add New Game'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Game Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Features (comma-separated)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              placeholder="Auto Farm, ESP, Teleport"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Popularity (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.popularity}
                onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) })}
                className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'updating' | 'maintenance' })}
                className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              >
                <option value="active">Active</option>
                <option value="updating">Updating</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Game Link</label>
            <input
              type="url"
              value={formData.gameLink}
              onChange={(e) => setFormData({ ...formData, gameLink: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {game ? 'Update Game' : 'Add Game'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-slate-700/50 text-slate-300 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-600/50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Provider Form Modal Component
const ProviderFormModal: React.FC<{
  provider?: KeySystemProvider | null;
  onSave: (data: Omit<KeySystemProvider, 'id'>) => void;
  onClose: () => void;
}> = ({ provider, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: provider?.name || '',
    checkpoints: provider?.checkpoints || 2,
    description: provider?.description || '',
    link: provider?.link || '',
    isActive: provider?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white text-glow">
            {provider ? 'Edit Provider' : 'Add New Provider'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Provider Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Checkpoints</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.checkpoints}
              onChange={(e) => setFormData({ ...formData, checkpoints: parseInt(e.target.value) })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 h-20 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Provider Link</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#3834a4] bg-slate-700 border-slate-600 rounded focus:ring-[#3834a4] focus:ring-2"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-slate-300">
              Active Provider
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {provider ? 'Update Provider' : 'Add Provider'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-slate-700/50 text-slate-300 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-600/50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;