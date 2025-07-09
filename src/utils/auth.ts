// Authentication utilities
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const AUTH_STORAGE_KEY = 'luminous-auth';

export const getAuthState = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const auth = JSON.parse(stored);
      return {
        ...auth,
        user: auth.user ? {
          ...auth.user,
          createdAt: new Date(auth.user.createdAt)
        } : null
      };
    }
  } catch (error) {
    console.warn('Failed to load auth state from localStorage:', error);
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
};

export const saveAuthState = (authState: AuthState): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Failed to save auth state to localStorage:', error);
  }
};

export const login = (user: User, token: string): void => {
  const authState: AuthState = {
    isAuthenticated: true,
    user,
    token
  };
  saveAuthState(authState);
};

export const logout = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};

export const isAdmin = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated && authState.user?.role === 'admin';
};

export const getAuthToken = (): string | null => {
  const authState = getAuthState();
  return authState.token;
};