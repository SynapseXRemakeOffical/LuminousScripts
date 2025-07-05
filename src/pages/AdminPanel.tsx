import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Shield, GamepadIcon, ExternalLink, AlertCircle, CheckCircle, Clock, Wrench, LogOut, User, Settings, Link as LinkIcon, Key, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import { Game, GameFormData } from '../types/game';
import { getGames, saveGame, updateGame, deleteGame } from '../utils/gameStorage';
import { checkAuthStatus, logout, initiateDiscordLogin, getAvatarUrl, AuthStatus, User as AuthUser, simulateAdminLogin } from '../utils/auth';
import { getSettings, updateSettings, addKeySystemProvider, updateKeySystemProvider, deleteKeySystemProvider } from '../utils/settingsStorage';
import { AppSettings, SettingsFormData, KeySystemProvider } from '../types/settings';

type ActiveTab = 'games' | 'settings';

const AdminPanel: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('games');
  
  // Demo login state
  const [showDemoLogin, setShowDemoLogin] = useState(false);
  const [demoUsername, setDemoUsername] = useState('Admin');
  
  // Games state
  const [games, setGames] = useState<Game[]>([]);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [gameFormData, setGameFormData] = useState<GameFormData>({
    name: '',
    description: '',
    features: '',
    popularity: 50,
    image: '',
    gameLink: '',
    status: 'active'
  });

  // Settings state
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [settingsFormData, setSettingsFormData] = useState<SettingsFormData>({
    discordInviteLink: '',
    keySystemProviders: []
  });
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [editingProvider, setEditingProvider] = useState<KeySystemProvider | null>(null);
  const [providerFormData, setProviderFormData] = useState({
    name: '',
    checkpoints: 2,
    description: '',
    link: '',
    isActive: true
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
      loadSettings();
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

  const loadSettings = () => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
    setSettingsFormData({
      discordInviteLink: loadedSettings.discordInviteLink,
      keySystemProviders: loadedSettings.keySystemProviders
    });
  };

  const handleLogin = () => {
    setShowDemoLogin(true);
  };

  const handleDemoLogin = () => {
    simulateAdminLogin(demoUsername);
    setShowDemoLogin(false);
    checkAuth();
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setAuthStatus({ authenticated: false });
      setGames([]);
      setSettings(null);
    }
  };

  // Game management functions
  const resetGameForm = () => {
    setGameFormData({
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

  const handleGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGame) {
      const updated = updateGame(editingGame.id, gameFormData);
      if (updated) {
        setGames(games.map(g => g.id === editingGame.id ? updated : g));
      }
    } else {
      const newGame = saveGame(gameFormData);
      setGames([...games, newGame]);
    }
    
    resetGameForm();
    
    // Trigger a custom event to notify other components about game count change
    window.dispatchEvent(new CustomEvent('gamesUpdated'));
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setGameFormData({
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

  const handleDeleteGame = (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      if (deleteGame(id)) {
        setGames(games.filter(g => g.id !== id));
        // Trigger a custom event to notify other components about game count change
        window.dispatchEvent(new CustomEvent('gamesUpdated'));
      }
    }
  };

  // Settings management functions
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = updateSettings(settingsFormData);
    setSettings(updatedSettings);
    alert('Settings updated successfully!');
  };

  const resetProviderForm = () => {
    setProviderFormData({
      name: '',
      checkpoints: 2,
      description: '',
      link: '',
      isActive: true
    });
    setIsAddingProvider(false);
    setEditingProvider(null);
  };

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProvider) {
      const updatedSettings = updateKeySystemProvider(editingProvider.id, providerFormData);
      setSettings(updatedSettings);
      setSettingsFormData({
        discordInviteLink: updatedSettings.discordInviteLink,
        keySystemProviders: updatedSettings.keySystemProviders
      });
    } else {
      const updatedSettings = addKeySystemProvider(providerFormData);
      setSettings(updatedSettings);
      setSettingsFormData({
        discordInviteLink: updatedSettings.discordInviteLink,
        keySystemProviders: updatedSettings.keySystemProviders
      });
    }
    
    resetProviderForm();
  };

  const handleEditProvider = (provider: KeySystemProvider) => {
    setEditingProvider(provider);
    setProviderFormData({
      name: provider.name,
      checkpoints: provider.checkpoints,
      description: provider.description,
      link: provider.link,
      isActive: provider.isActive
    });
    setIsAddingProvider(true);
  };

  const handleDeleteProvider = (id: string) => {
    if (confirm('Are you sure you want to delete this key provider?')) {
      const updatedSettings = deleteKeySystemProvider(id);
      setSettings(updatedSettings);
      setSettingsFormData({
        discordInviteLink: updatedSettings.discordInviteLink,
        keySystemProviders: updatedSettings.keySystemProviders
      });
    }
  };

  const toggleProviderStatus = (id: string) => {
    const provider = settingsFormData.keySystemProviders.find(p => p.id === id);
    if (provider) {
      const updatedSettings = updateKeySystemProvider(id, { isActive: !provider.isActive });
      setSettings(updatedSettings);
      setSettingsFormData({
        discordInviteLink: updatedSettings.discordInviteLink,
        keySystemProviders: updatedSettings.keySystemProviders
      });
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
              <p className="text-slate-400 mb-6">Demo admin panel for managing the website</p>
              
              <div className="bg-[#3834a4]/10 border border-[#3834a4]/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-300">
                  This is a demo version. In production, this would use Discord OAuth authentication.
                </p>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Demo Admin Login
            </button>
          </div>
        </section>

        {/* Demo Login Modal */}
        {showDemoLogin && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white text-glow">Demo Login</h3>
                <button 
                  onClick={() => setShowDemoLogin(false)}
                  className="text-slate-400 hover:text-white transition-colors scale-hover"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={demoUsername}
                  onChange={(e) => setDemoUsername(e.target.value)}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                  placeholder="Enter admin username"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDemoLogin}
                  className="flex-1 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowDemoLogin(false)}
                  className="border border-slate-600 text-slate-200 px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
                Admin Panel
              </h1>
              <p className="text-slate-400">Manage games, settings, and configurations</p>
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
                onClick={handleLogout}
                className="border border-slate-600 text-slate-200 px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-500 scale-hover ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                  : 'bg-slate-800/30 border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600/50'
              }`}
            >
              <GamepadIcon className="w-5 h-5" />
              Games Management ({games.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-500 scale-hover ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white shadow-lg shadow-[#3834a4]/25'
                  : 'bg-slate-800/30 border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600/50'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>

          {/* Games Tab */}
          {activeTab === 'games' && (
            <>
              {/* Add Game Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsAddingGame(true)}
                  className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Game
                </button>
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
                          onClick={() => handleEditGame(game)}
                          className="flex-1 bg-slate-700/50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-500 hover:bg-slate-600/50 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-500 hover:bg-red-500/30 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-8">
              {/* Discord Settings */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 text-glow">
                  <Globe className="w-6 h-6 text-[#8b7dd8]" />
                  General Settings
                </h3>

                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Discord Invite Link
                    </label>
                    <input
                      type="url"
                      value={settingsFormData.discordInviteLink}
                      onChange={(e) => setSettingsFormData({...settingsFormData, discordInviteLink: e.target.value})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      placeholder="https://discord.gg/your-invite"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">This link will be used in the navigation Discord button</p>
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Settings
                  </button>
                </form>
              </div>

              {/* Key System Providers */}
              <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 scale-hover shimmer">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3 text-glow">
                    <Key className="w-6 h-6 text-[#8b7dd8]" />
                    Key System Providers
                  </h3>
                  <button
                    onClick={() => setIsAddingProvider(true)}
                    className="bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Provider
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settingsFormData.keySystemProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-4 scale-hover shimmer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600/50 rounded-lg">
                            <Key className="w-4 h-4 text-[#8b7dd8]" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{provider.name}</h4>
                            <p className="text-xs text-slate-400">{provider.checkpoints} checkpoints</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleProviderStatus(provider.id)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {provider.isActive ? (
                            <ToggleRight className="w-6 h-6 text-green-400" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-slate-500" />
                          )}
                        </button>
                      </div>

                      <p className="text-slate-400 text-sm mb-3">{provider.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <LinkIcon className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500 truncate">{provider.link}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProvider(provider)}
                          className="flex-1 bg-slate-600/50 text-white px-3 py-2 rounded text-sm font-medium transition-all duration-500 hover:bg-slate-500/50 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(provider.id)}
                          className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm font-medium transition-all duration-500 hover:bg-red-500/30 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Game Modal */}
          {isAddingGame && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white text-glow">
                    {editingGame ? 'Edit Game' : 'Add New Game'}
                  </h3>
                  <button 
                    onClick={resetGameForm}
                    className="text-slate-400 hover:text-white transition-colors scale-hover"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleGameSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Game Name
                      </label>
                      <input
                        type="text"
                        value={gameFormData.name}
                        onChange={(e) => setGameFormData({...gameFormData, name: e.target.value})}
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
                        value={gameFormData.gameLink}
                        onChange={(e) => setGameFormData({...gameFormData, gameLink: e.target.value})}
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
                      value={gameFormData.description}
                      onChange={(e) => setGameFormData({...gameFormData, description: e.target.value})}
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
                      value={gameFormData.features}
                      onChange={(e) => setGameFormData({...gameFormData, features: e.target.value})}
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
                      value={gameFormData.image}
                      onChange={(e) => setGameFormData({...gameFormData, image: e.target.value})}
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
                        value={gameFormData.popularity}
                        onChange={(e) => setGameFormData({...gameFormData, popularity: parseInt(e.target.value)})}
                        className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Status
                      </label>
                      <select
                        value={gameFormData.status}
                        onChange={(e) => setGameFormData({...gameFormData, status: e.target.value as 'active' | 'updating' | 'maintenance'})}
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
                      onClick={resetGameForm}
                      className="border border-slate-600 text-slate-200 px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:bg-slate-800/50 hover:border-[#3834a4]/50 hover:text-[#8b7dd8] scale-hover shimmer backdrop-blur-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add/Edit Provider Modal */}
          {isAddingProvider && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white text-glow">
                    {editingProvider ? 'Edit Provider' : 'Add Key Provider'}
                  </h3>
                  <button 
                    onClick={resetProviderForm}
                    className="text-slate-400 hover:text-white transition-colors scale-hover"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleProviderSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Provider Name
                    </label>
                    <input
                      type="text"
                      value={providerFormData.name}
                      onChange={(e) => setProviderFormData({...providerFormData, name: e.target.value})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      placeholder="e.g., Linkvertise"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Checkpoints
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={providerFormData.checkpoints}
                      onChange={(e) => setProviderFormData({...providerFormData, checkpoints: parseInt(e.target.value)})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={providerFormData.description}
                      onChange={(e) => setProviderFormData({...providerFormData, description: e.target.value})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md h-20 resize-none"
                      placeholder="Brief description of this provider"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Provider Link
                    </label>
                    <input
                      type="url"
                      value={providerFormData.link}
                      onChange={(e) => setProviderFormData({...providerFormData, link: e.target.value})}
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-[#3834a4] focus:outline-none transition-all duration-500 backdrop-blur-md"
                      placeholder="https://linkvertise.com/..."
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={providerFormData.isActive}
                      onChange={(e) => setProviderFormData({...providerFormData, isActive: e.target.checked})}
                      className="w-4 h-4 text-[#3834a4] bg-slate-700 border-slate-600 rounded focus:ring-[#3834a4] focus:ring-2"
                    />
                    <label htmlFor="isActive" className="text-sm text-slate-300">
                      Active (visible to users)
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#3834a4] to-[#4c46b8] text-white py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#3834a4]/25 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {editingProvider ? 'Update Provider' : 'Add Provider'}
                    </button>
                    <button
                      type="button"
                      onClick={resetProviderForm}
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