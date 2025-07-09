import { AppSettings } from '../types/settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  notifications: true,
  autoUpdate: true,
  language: 'en',
  apiEndpoint: 'https://api.example.com',
  maxRetries: 3,
  timeout: 5000
};

export const getSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem('app-settings');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Partial<AppSettings>): void => {
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

export const resetSettings = (): void => {
  try {
    localStorage.removeItem('app-settings');
  } catch (error) {
    console.error('Failed to reset settings:', error);
  }
};