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
    const response = await fetch('/auth/status', {
      credentials: 'include'
    });
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

export function initiateDiscordLogin(): Promise<AuthStatus> {
  return new Promise((resolve, reject) => {
    // Calculate popup position (centered)
    const width = 500;
    const height = 700;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    // Open popup window
    const popup = window.open(
      '/auth/discord',
      'discord-auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,location=no`
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        // If popup was closed manually, check auth status
        checkAuthStatus().then(status => {
          if (status.authenticated) {
            resolve(status);
          } else {
            reject(new Error('Authentication was cancelled'));
          }
        }).catch(reject);
      }
    }, 1000);

    // Listen for messages from popup
    const messageListener = (event: MessageEvent) => {
      // Only accept messages from our domain
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'DISCORD_AUTH_SUCCESS') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        
        // Return the auth status
        resolve({
          authenticated: true,
          user: event.data.user
        });
      } else if (event.data.type === 'DISCORD_AUTH_ERROR') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        reject(new Error(event.data.error || 'Authentication failed'));
      }
    };

    window.addEventListener('message', messageListener);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        reject(new Error('Authentication timeout - please try again'));
      }
    }, 300000); // 5 minutes
  });
}

export function getAvatarUrl(user: User): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  }
  // Default Discord avatar based on discriminator
  const defaultAvatarNumber = parseInt(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
}

// Utility function to format Discord username
export function formatDiscordUser(user: User): string {
  return `${user.username}#${user.discriminator}`;
}