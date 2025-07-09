import { AppSettings, KeySystemProvider } from '../types/settings';

const SETTINGS_STORAGE_KEY = 'luminous-settings';

const DEFAULT_SETTINGS: AppSettings = {
  id: 'default',
  discordInviteLink: 'https://discord.gg/luminous',
  keySystemProviders: [
    {
      id: '1',
      name: 'Linkvertise',
      checkpoints: 2,
      description: 'Fast and reliable key system with 2 simple steps',
      link: 'https://linkvertise.com/example',
      isActive: true
    },
    {
      id: '2',
      name: 'Sub2Unlock',
      checkpoints: 3,
      description: 'Support creators while getting your key in 3 easy steps',
      link: 'https://sub2unlock.com/example',
      isActive: true
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

export const getSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      return {
        ...settings,
        createdAt: new Date(settings.createdAt),
        updatedAt: new Date(settings.updatedAt)
      };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage, using defaults:', error);
  }
  
  // Initialize with default settings
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    const settingsToSave = {
      ...settings,
      updatedAt: new Date()
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

export const updateSettings = (updates: Partial<Omit<AppSettings, 'id' | 'createdAt'>>): AppSettings => {
  const currentSettings = getSettings();
  const updatedSettings: AppSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date()
  };
  
  saveSettings(updatedSettings);
  return updatedSettings;
};

export const addKeySystemProvider = (provider: Omit<KeySystemProvider, 'id'>): KeySystemProvider => {
  const settings = getSettings();
  const newProvider: KeySystemProvider = {
    ...provider,
    id: Date.now().toString()
  };
  
  const updatedSettings = {
    ...settings,
    keySystemProviders: [...settings.keySystemProviders, newProvider],
    updatedAt: new Date()
  };
  
  saveSettings(updatedSettings);
  return newProvider;
};

export const updateKeySystemProvider = (id: string, updates: Partial<Omit<KeySystemProvider, 'id'>>): KeySystemProvider | null => {
  const settings = getSettings();
  const providerIndex = settings.keySystemProviders.findIndex(p => p.id === id);
  
  if (providerIndex === -1) {
    return null;
  }
  
  const updatedProvider: KeySystemProvider = {
    ...settings.keySystemProviders[providerIndex],
    ...updates
  };
  
  settings.keySystemProviders[providerIndex] = updatedProvider;
  settings.updatedAt = new Date();
  
  saveSettings(settings);
  return updatedProvider;
};

export const deleteKeySystemProvider = (id: string): boolean => {
  const settings = getSettings();
  const filteredProviders = settings.keySystemProviders.filter(p => p.id !== id);
  
  if (filteredProviders.length === settings.keySystemProviders.length) {
    return false; // Provider not found
  }
  
  const updatedSettings = {
    ...settings,
    keySystemProviders: filteredProviders,
    updatedAt: new Date()
  };
  
  saveSettings(updatedSettings);
  return true;
};

export const resetSettings = (): AppSettings => {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset settings:', error);
  }
  
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};