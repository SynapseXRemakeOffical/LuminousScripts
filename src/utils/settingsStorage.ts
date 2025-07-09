import { AppSettings, SettingsFormData, KeySystemProvider } from '../types/settings';

const SETTINGS_STORAGE_KEY = 'hexa_hub_settings';

// Default settings
const defaultSettings: AppSettings = {
  id: 'app_settings',
  discordInviteLink: 'https://discord.gg/your-discord-invite',
  keySystemProviders: [
    {
      id: 'linkvertise',
      name: 'Linkvertise',
      checkpoints: 2,
      description: 'Quick and easy verification with just 2 simple steps',
      link: 'https://linkvertise.com/your-linkvertise-link',
      isActive: true
    },
    {
      id: 'lootlabs',
      name: 'Lootlabs',
      checkpoints: 3,
      description: 'More checkpoints but reliable verification process',
      link: 'https://loot-labs.com/your-lootlabs-link',
      isActive: true
    }
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

export function getSettings(): AppSettings {
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
    // Initialize with default settings if none exist
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
}

export function updateSettings(settingsData: SettingsFormData): AppSettings {
  const currentSettings = getSettings();
  
  const updatedSettings: AppSettings = {
    ...currentSettings,
    ...settingsData,
    updatedAt: new Date()
  };
  
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
  return updatedSettings;
}

export function addKeySystemProvider(provider: Omit<KeySystemProvider, 'id'>): AppSettings {
  const settings = getSettings();
  const newProvider: KeySystemProvider = {
    ...provider,
    id: `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  settings.keySystemProviders.push(newProvider);
  settings.updatedAt = new Date();
  
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  return settings;
}

export function updateKeySystemProvider(id: string, provider: Partial<KeySystemProvider>): AppSettings {
  const settings = getSettings();
  const index = settings.keySystemProviders.findIndex(p => p.id === id);
  
  if (index !== -1) {
    settings.keySystemProviders[index] = {
      ...settings.keySystemProviders[index],
      ...provider
    };
    settings.updatedAt = new Date();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }
  
  return settings;
}

export function deleteKeySystemProvider(id: string): AppSettings {
  const settings = getSettings();
  settings.keySystemProviders = settings.keySystemProviders.filter(p => p.id !== id);
  settings.updatedAt = new Date();
  
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  return settings;
}