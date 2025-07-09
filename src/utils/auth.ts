export interface User {
  id: string;
  username: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

const ADMIN_KEYS_STORAGE_KEY = 'admin_keys';
const CURRENT_USER_STORAGE_KEY = 'current_admin_user';

// Default admin keys
const defaultAdminKeys = [
  'ADMIN-2024-HEXA-HUB-MASTER',
  'LUMINOUS-ADMIN-KEY-2024',
  'HEXA-ADMIN-ACCESS-2024'
];

export function getAdminKeys(): string[] {
  try {
    const stored = localStorage.getItem(ADMIN_KEYS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default keys
    localStorage.setItem(ADMIN_KEYS_STORAGE_KEY, JSON.stringify(defaultAdminKeys));
    return defaultAdminKeys;
  } catch (error) {
    console.error('Error loading admin keys:', error);
    return defaultAdminKeys;
  }
}

export function addAdminKey(key: string): boolean {
  try {
    const keys = getAdminKeys();
    if (!keys.includes(key)) {
      keys.push(key);
      localStorage.setItem(ADMIN_KEYS_STORAGE_KEY, JSON.stringify(keys));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding admin key:', error);
    return false;
  }
}

export function removeAdminKey(key: string): boolean {
  try {
    const keys = getAdminKeys();
    const filteredKeys = keys.filter(k => k !== key);
    if (filteredKeys.length !== keys.length) {
      localStorage.setItem(ADMIN_KEYS_STORAGE_KEY, JSON.stringify(filteredKeys));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing admin key:', error);
    return false;
  }
}

export function generateAdminKey(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 8).toUpperCase();
  return `ADMIN-${timestamp}-${random}`;
}

export function validateAdminKey(key: string): boolean {
  const keys = getAdminKeys();
  return keys.includes(key);
}

export async function loginWithKey(key: string, username: string): Promise<AuthStatus> {
  if (validateAdminKey(key)) {
    const user: User = {
      id: `admin_${Date.now()}`,
      username: username || 'Admin User'
    };
    
    // Store current user
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    
    return {
      authenticated: true,
      user
    };
  }
  
  return { authenticated: false };
}

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      return {
        authenticated: true,
        user
      };
    }
    return { authenticated: false };
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false };
  }
}

export async function logout(): Promise<boolean> {
  try {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

// Utility function to format user
export function formatUser(user: User): string {
  return user.username;
}