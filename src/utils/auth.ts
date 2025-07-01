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

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const response = await fetch('/auth/status');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false };
  }
}

export async function logout(): Promise<boolean> {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

export function initiateDiscordLogin(): void {
  window.location.href = '/auth/discord';
}

export function getAvatarUrl(user: User): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  }
  // Default Discord avatar
  const defaultAvatarNumber = parseInt(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
}