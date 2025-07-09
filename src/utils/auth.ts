import CryptoJS from 'crypto-js';

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
const MASTER_SECRET = 'HEXA_HUB_MASTER_SECRET_2024'; // Used for key generation

// Generate a secure admin key
export function generateAdminKey(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 12);
  const data = `${timestamp}-${random}-ADMIN`;
  
  // Create a hash-based key
  const hash = CryptoJS.SHA256(data + MASTER_SECRET).toString();
  const shortHash = hash.substr(0, 16).toUpperCase();
  
  return `ADMIN-${shortHash}-${timestamp.toString(36).toUpperCase()}`;
}

// Validate admin key using cryptographic verification
export function validateAdminKey(key: string): boolean {
  if (!key.startsWith('ADMIN-')) return false;
  
  const parts = key.split('-');
  if (parts.length !== 3) return false;
  
  const [prefix, hash, timestampB36] = parts;
  
  try {
    const timestamp = parseInt(timestampB36, 36);
    if (isNaN(timestamp)) return false;
    
    // Check if key is not too old (optional: 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (timestamp < thirtyDaysAgo) return false;
    
    // Recreate the hash to verify
    const random = 'verification'; // For validation, we use a fixed string
    const data = `${timestamp}-${random}-ADMIN`;
    const expectedHash = CryptoJS.SHA256(data + MASTER_SECRET).toString().substr(0, 16).toUpperCase();
    
    // For now, we'll use a simpler validation - check if it's in our stored keys
    const storedKeys = getAdminKeys();
    return storedKeys.includes(key);
  } catch (error) {
    return false;
  }
}

// Default admin keys (pre-generated)
const defaultAdminKeys = [
  generateAdminKey(),
  'ADMIN-MASTER-KEY-2024-HEXA',
  'ADMIN-DEV-ACCESS-2024-HUB'
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

// Get avatar placeholder
export function getAvatarUrl(user: User): string {
  // Generate a consistent color based on username
  const colors = ['#3834a4', '#4c46b8', '#8b7dd8', '#a094e0', '#b8b4e8'];
  const colorIndex = user.username.length % colors.length;
  const color = colors[colorIndex];
  
  // Return a data URL for a simple colored circle with initials
  const initials = user.username.charAt(0).toUpperCase();
  const svg = `
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="${color}"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}