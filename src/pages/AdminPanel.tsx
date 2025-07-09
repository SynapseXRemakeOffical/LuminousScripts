import React, { useState, useEffect } from 'react';
import { Shield, Key, Plus, Edit, Trash2, Eye, EyeOff, Copy, Check, Settings, Gamepad as Games, LogOut, User, RefreshCw } from 'lucide-react';
import { loginWithKey, logout, checkAuthStatus, getAdminKeys, addAdminKey, removeAdminKey, generateAdminKey, AuthStatus } from '../utils/auth';
import { getGames, saveGame, updateGame, deleteGame, GameFormData } from '../utils/gameStorage';
import { getSettings, updateSettings, addKeySystemProvider, updateKeySystemProvider, deleteKeySystemProvider, SettingsFormData } from '../utils/settingsStorage';
import { Game } from '../types/game';
import { AppSettings, KeySystemProvider } from '../types/settings';

const AdminPanel: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false });
  const [loginForm, setLoginForm] = useState({ username: '', key: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'games' | 'settings' | 'keys'>('games');
  
  // Games state
  const [games, setGames] = useState<Game[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [gameForm, setGameForm] = useState<GameFormData>({
    name: '',
    description: '',
    features: '',
    popularity: 85,
    image: '',
    gameLink: '',
    status: 'active'
  });

  // Settings state
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState<SettingsFormData>({
    discordInviteLink: '',
    keySystemProviders: []
  });
  const [editingProvider, setEditingProvider] = useState<KeySystemProvider | null>(null);
  const [providerForm, setProviderForm] = useState({
    name: '',
    checkpoints: 2,
    description: '',
    link: '',
    isActive: true
  });

  // Keys state
  const [adminKeys, setAdminKeys] = useState<string[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authStatus.authenticated) {
      loadData();
    }
  }, [authStatus.authenticated]);

  const checkAuth = async () => {
    try {
      const status = await checkAuthStatus();
      setAuthStatus(status);
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthStatus({ authenticated: false });
    }
  };

  const loadData = () => {
    // Load games
    setGames(getGames());
    
    // Load settings
    const appSettings = getSettings();
    setSettings(appSettings);
    setSettingsForm({
      discordInviteLink: appSettings.discordInviteLink,
      keySystemProviders: appSettings.keySystemProviders
    });
    
    // Load admin keys
    setAdminKeys(getAdminKeys());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username.trim() || !loginForm.key.trim()) return;
    
    setIsLoggingIn(true);
    try {
      const result = await loginWithKey(loginForm.key, loginForm.username);
      setAuthStatus(result);
      if (result.authenticated) {
        setLoginForm({ username: '', key: '' });
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthStatus({ authenticated: false });
      setActiveTab('games');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Game management functions
  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGame) {
        const updated = updateGame(editingGame.id, gameForm);
        if (updated) {
          setGames(games.map(g => g.id === editingGame.id ? updated : g));
        }
      } else {
        const newGame = saveGame(gameForm);
        setGames([...games, newGame]);
      }
      resetGameForm();
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setGameForm({
      name: game.name,
      description: game.description,
      features: game.features.join(', '),
      popularity: game.popularity,
      image: game.image,
      gameLink: game.gameLink,
      status: game.status
    });
  };

  const handleDeleteGame = (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      if (deleteGame(id)) {
        setGames(games.filter(g => g.id !== id));
      }
    }
  };

  const resetGameForm = () => {
    setEditingGame(null);
    setGameForm({
      name: '',
      description: '',
      features: '',
      popularity: 85,
      image: '',
      gameLink: '',
      status: 'active'
    });
  };

  // Settings management functions
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = updateSettings(settingsForm);
      setSettings(updated);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProvider) {
        const updated = updateKeySystemProvider(editingProvider.id, providerForm);
        setSettings(updated);
        setSettingsForm({
          ...settingsForm,
          keySystemProviders: updated.keySystemProviders
        });
      } else {
        const updated = addKeySystemProvider(providerForm);
        setSettings(updated);
        setSettingsForm({
          ...settingsForm,
          keySystemProviders: updated.keySystemProviders
        });
      }
      resetProviderForm();
    } catch (error) {
      console.error('Error saving provider:', error);
    }
  };

  const handleEditProvider = (provider: KeySystemProvider) => {
    setEditingProvider(provider);
    setProviderForm({
      name: provider.name,
      checkpoints: provider.checkpoints,
      description: provider.description,
      link: provider.link,
      isActive: provider.isActive
    });
  };

  const handleDeleteProvider = (id: string) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      const updated = deleteKeySystemProvider(id);
      setSettings(updated);
      setSettingsForm({
        ...settingsForm,
        keySystemProviders: updated.keySystemProviders
      });
    }
  };

  const resetProviderForm = () => {
    setEditingProvider(null);
    setProviderForm({
      name: '',
      checkpoints: 2,
      description: '',
      link: '',
      isActive: true
    });
  };

  // Key management functions
  const handleGenerateKey = () => {
    const newKey = generateAdminKey();
    if (addAdminKey(newKey)) {
      setAdminKeys([...adminKeys, newKey]);
    }
  };

  const handleDeleteKey = (key: string) => {
    if (confirm('Are you sure you want to delete this admin key?')) {
      if (removeAdminKey(key)) {
        setAdminKeys(adminKeys.filter(k => k !== key));
        setVisibleKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    }
  };

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

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

        <section className="py-20 relative z-20">
          <div className="container mx-auto px-6">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-full mb-6 backdrop-blur-md shimmer scale-hover">
                  <Shield className="w-4 h-4 text-[#8b7dd8]" />
                  <span className="text-[#8b7dd8] text-sm font-semibold">Admin Access</span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent mb-4 text-glow">
                  Admin Panel
                </h1>
                <p className="text-slate-400">Enter your admin credentials to access the control panel</p>
              </div>

              <form onSubmit={handleLogin} className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Admin Key</label>
                    <input
                      type="password"
                      value={loginForm.key}
                      onChange={(e) => setLoginForm({ ...loginForm, key: e.target.value })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      placeholder="Enter your admin key"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn || !loginForm.username.trim() || !loginForm.key.trim()}
                    className="w-full bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Login
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
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

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#b8b4e8] to-[#8b7dd8] bg-clip-text text-transparent text-glow">
                Admin Panel
              </h1>
              <p className="text-slate-400 mt-2">
                Welcome back, {authStatus.user?.username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-700/50 border border-slate-600/50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-500 hover:bg-slate-600/50 hover:scale-105 scale-hover shimmer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                  : 'bg-slate-800/30 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Games className="w-4 h-4" />
              Games
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                  : 'bg-slate-800/30 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('keys')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-500 scale-hover ${
                activeTab === 'keys'
                  ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                  : 'bg-slate-800/30 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Key className="w-4 h-4" />
              Admin Keys
            </button>
          </div>

          {/* Games Tab */}
          {activeTab === 'games' && (
            <div className="space-y-8">
              {/* Game Form */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <h3 className="text-2xl font-bold text-white mb-6 text-glow">
                  {editingGame ? 'Edit Game' : 'Add New Game'}
                </h3>
                <form onSubmit={handleSaveGame} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Game Name</label>
                      <input
                        type="text"
                        value={gameForm.name}
                        onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Popularity (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gameForm.popularity}
                        onChange={(e) => setGameForm({ ...gameForm, popularity: parseInt(e.target.value) })}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      value={gameForm.description}
                      onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 h-24 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={gameForm.features}
                      onChange={(e) => setGameForm({ ...gameForm, features: e.target.value })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                      placeholder="Auto Farm, Boss Kill, Item Collector"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={gameForm.image}
                        onChange={(e) => setGameForm({ ...gameForm, image: e.target.value })}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Game Link</label>
                      <input
                        type="url"
                        value={gameForm.gameLink}
                        onChange={(e) => setGameForm({ ...gameForm, gameLink: e.target.value })}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={gameForm.status}
                      onChange={(e) => setGameForm({ ...gameForm, status: e.target.value as 'active' | 'updating' | 'maintenance' })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                    >
                      <option value="active">Active</option>
                      <option value="updating">Updating</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                    >
                      {editingGame ? 'Update Game' : 'Add Game'}
                    </button>
                    {editingGame && (
                      <button
                        type="button"
                        onClick={resetGameForm}
                        className="bg-slate-700/50 border border-slate-600/50 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-600/50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Games List */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <h3 className="text-2xl font-bold text-white mb-6 text-glow">Manage Games</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map((game) => (
                    <div key={game.id} className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-4">
                      <img src={game.image} alt={game.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                      <h4 className="text-lg font-bold text-white mb-2">{game.name}</h4>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          game.status === 'active' ? 'bg-green-400/10 text-green-400' :
                          game.status === 'updating' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-red-400/10 text-red-400'
                        }`}>
                          {game.status}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditGame(game)}
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
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* General Settings */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <h3 className="text-2xl font-bold text-white mb-6 text-glow">General Settings</h3>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Discord Invite Link</label>
                    <input
                      type="url"
                      value={settingsForm.discordInviteLink}
                      onChange={(e) => setSettingsForm({ ...settingsForm, discordInviteLink: e.target.value })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                  >
                    Save Settings
                  </button>
                </form>
              </div>

              {/* Key System Providers */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <h3 className="text-2xl font-bold text-white mb-6 text-glow">Key System Providers</h3>
                
                {/* Provider Form */}
                <form onSubmit={handleSaveProvider} className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Provider Name</label>
                      <input
                        type="text"
                        value={providerForm.name}
                        onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Checkpoints</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={providerForm.checkpoints}
                        onChange={(e) => setProviderForm({ ...providerForm, checkpoints: parseInt(e.target.value) })}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      value={providerForm.description}
                      onChange={(e) => setProviderForm({ ...providerForm, description: e.target.value })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 h-20 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Provider Link</label>
                    <input
                      type="url"
                      value={providerForm.link}
                      onChange={(e) => setProviderForm({ ...providerForm, link: e.target.value })}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={providerForm.isActive}
                      onChange={(e) => setProviderForm({ ...providerForm, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#3834a4] bg-slate-700 border-slate-600 rounded focus:ring-[#3834a4] focus:ring-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-slate-300">Active</label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                    >
                      {editingProvider ? 'Update Provider' : 'Add Provider'}
                    </button>
                    {editingProvider && (
                      <button
                        type="button"
                        onClick={resetProviderForm}
                        className="bg-slate-700/50 border border-slate-600/50 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-600/50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Providers List */}
                <div className="space-y-4">
                  {settingsForm.keySystemProviders.map((provider) => (
                    <div key={provider.id} className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-white">{provider.name}</h4>
                          <p className="text-slate-400 text-sm">{provider.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">{provider.checkpoints} checkpoints</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              provider.isActive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                            }`}>
                              {provider.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProvider(provider)}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin Keys Tab */}
          {activeTab === 'keys' && (
            <div className="space-y-8">
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white text-glow">Admin Keys Management</h3>
                  <button
                    onClick={handleGenerateKey}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                  >
                    <Plus className="w-4 h-4" />
                    Generate New Key
                  </button>
                </div>

                <div className="space-y-4">
                  {adminKeys.map((key, index) => (
                    <div key={key} className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#8b7dd8]" />
                            <span className="text-sm text-slate-400">Key #{index + 1}</span>
                          </div>
                          <div className="font-mono text-white bg-slate-800/50 px-3 py-1 rounded border border-slate-600/50 flex-1 max-w-md">
                            {visibleKeys.has(key) ? key : maskKey(key)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleKeyVisibility(key)}
                            className="p-2 bg-slate-600/50 text-slate-300 rounded hover:bg-slate-500/50 transition-colors"
                            title={visibleKeys.has(key) ? 'Hide key' : 'Show key'}
                          >
                            {visibleKeys.has(key) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(key)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedKey === key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteKey(key)}
                            className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                            title="Delete key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {adminKeys.length === 0 && (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No admin keys found. Generate your first key to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;