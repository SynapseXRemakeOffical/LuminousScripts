import { Game, GameFormData } from '../types/game';

const GAMES_STORAGE_KEY = 'hexa_hub_games';

// Default games data
const defaultGames: Game[] = [
  {
    id: 'game1',
    name: 'Game One',
    description: 'Complete automation with advanced farming and grinding capabilities for enhanced gameplay.',
    features: ['Auto Farm', 'Boss Kill', 'Item Collector', 'Safe Mode'],
    popularity: 98,
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=400',
    gameLink: 'https://www.roblox.com/games/placeholder-game-1',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'game2',
    name: 'Game Two',
    description: 'Advanced targeting and visual enhancement features with customizable settings for competitive play.',
    features: ['Aimbot', 'ESP', 'Speed Hack', 'No Recoil'],
    popularity: 95,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    gameLink: 'https://www.roblox.com/games/placeholder-game-2',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'game3',
    name: 'Game Three',
    description: 'Enhanced visual detection for items and players, auto-collection features, and strategic advantages.',
    features: ['Item ESP', 'Player ESP', 'Auto Collect', 'Kill Aura'],
    popularity: 92,
    image: 'https://images.pexels.com/photos/1708977/pexels-photo-1708977.jpeg?auto=compress&cs=tinysrgb&w=400',
    gameLink: 'https://www.roblox.com/games/placeholder-game-3',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'game4',
    name: 'Game Four',
    description: 'Automated location interactions, vehicle modifications, and defensive features for ultimate gameplay.',
    features: ['Auto Rob', 'Vehicle Speed', 'Nitro Hack', 'Anti Arrest'],
    popularity: 89,
    image: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=400',
    gameLink: 'https://www.roblox.com/games/placeholder-game-4',
    status: 'updating',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'game5',
    name: 'Game Five',
    description: 'Trading assistance, progression automation, and resource farming with secure trading features.',
    features: ['Auto Age', 'Item Duper', 'Money Farm', 'Trade Bot'],
    popularity: 87,
    image: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=400',
    gameLink: 'https://www.roblox.com/games/placeholder-game-5',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export function getGames(): Game[] {
  try {
    const stored = localStorage.getItem(GAMES_STORAGE_KEY);
    if (stored) {
      const games = JSON.parse(stored);
      return games.map((game: any) => ({
        ...game,
        createdAt: new Date(game.createdAt),
        updatedAt: new Date(game.updatedAt)
      }));
    }
    // Initialize with default games if none exist
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(defaultGames));
    return defaultGames;
  } catch (error) {
    console.error('Error loading games:', error);
    return defaultGames;
  }
}

export function saveGame(gameData: GameFormData): Game {
  const games = getGames();
  const newGame: Game = {
    id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...gameData,
    features: gameData.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  games.push(newGame);
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  return newGame;
}

export function updateGame(id: string, gameData: GameFormData): Game | null {
  const games = getGames();
  const index = games.findIndex(game => game.id === id);
  
  if (index === -1) return null;
  
  const updatedGame: Game = {
    ...games[index],
    ...gameData,
    features: gameData.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
    updatedAt: new Date()
  };
  
  games[index] = updatedGame;
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  return updatedGame;
}

export function deleteGame(id: string): boolean {
  const games = getGames();
  const filteredGames = games.filter(game => game.id !== id);
  
  if (filteredGames.length === games.length) return false;
  
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(filteredGames));
  return true;
}