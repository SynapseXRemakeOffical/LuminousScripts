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
    console.log('🔧 Checking auth status...');
    const response = await fetch('/auth/status', {
      credentials: 'include'
    });
    const data = await response.json();
    console.log('🔧 Auth status result:', data);
    return data;
  } catch (error) {
    console.error('❌ Auth status check failed:', error);
    return { authenticated: false };
  }
}

export async function logout(): Promise<boolean> {
  try {
    console.log('🔧 Logging out...');
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    console.log('🔧 Logout result:', data);
    return data.success;
  } catch (error) {
    console.error('❌ Logout failed:', error);
    return false;
  }
}

export function initiateDiscordLogin(): Promise<AuthStatus> {
  return new Promise((resolve, reject) => {
    console.log('🔧 Starting Discord login...');
    
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
      console.error('❌ Popup blocked');
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    console.log('✅ Popup opened');

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        console.log('🔧 Popup closed manually');
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        // If popup was closed manually, check auth status
        checkAuthStatus().then(status => {
          if (status.authenticated) {
            console.log('✅ User authenticated after manual close');
            resolve(status);
          } else {
            console.log('❌ Authentication cancelled');
            reject(new Error('Authentication was cancelled'));
          }
        }).catch(reject);
      }
    }, 1000);

    // Listen for messages from popup
    const messageListener = (event: MessageEvent) => {
      console.log('🔧 Received message:', event.data);
      
      // Only accept messages from our domain
      if (event.origin !== window.location.origin) {
        console.log('🔧 Ignoring message from different origin:', event.origin);
        return;
      }
      
      if (event.data.type === 'DISCORD_AUTH_SUCCESS') {
        console.log('✅ Discord auth success');
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        
        // Return the auth status
        resolve({
          authenticated: true,
          user: event.data.user
        });
      } else if (event.data.type === 'DISCORD_AUTH_ERROR') {
        console.log('❌ Discord auth error:', event.data.error);
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
        console.log('⏰ Authentication timeout');
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