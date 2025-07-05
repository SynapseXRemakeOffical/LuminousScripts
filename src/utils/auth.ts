export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

// For frontend-only deployment, we'll use localStorage for demo purposes
// In production, you'd want proper backend authentication
const AUTH_STORAGE_KEY = 'admin_auth_status';
const DEMO_ADMIN_USER: User = {
  id: '123456789',
  username: 'Admin',
  discriminator: '0001',
  avatar: ''
};

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    // Check if user is authenticated via localStorage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const authData = JSON.parse(stored);
      // Check if auth hasn't expired (24 hours)
      const now = Date.now();
      if (now - authData.timestamp < 24 * 60 * 60 * 1000) {
        return {
          authenticated: true,
          user: authData.user
        };
      } else {
        // Auth expired, clear it
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    
    return { authenticated: false };
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false };
  }
}

export async function logout(): Promise<boolean> {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

export function initiateDiscordLogin(): void {
  // For demo purposes, we'll simulate a successful login
  // In production, this would redirect to Discord OAuth
  const authData = {
    user: DEMO_ADMIN_USER,
    timestamp: Date.now()
  };
  
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  
  // Simulate redirect back to admin panel
  window.location.href = '/xk9m2p7q8w3n5r1t?authenticated=true';
}

export function getAvatarUrl(user: User): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  }
  // Default Discord avatar
  const defaultAvatarNumber = parseInt(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
}

// Demo function to simulate admin access
export function simulateAdminLogin(username: string = 'Admin'): void {
  const authData = {
    user: {
      ...DEMO_ADMIN_USER,
      username: username
    },
    timestamp: Date.now()
  };
  
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}