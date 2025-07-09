import { Game } from '../types/game';

const GAMES_STORAGE_KEY = 'luminous-games';

const DEFAULT_GAMES: Game[] = [
  {
    id: '1',
    name: 'Blox Fruits',
    description: 'Advanced auto-farming and combat scripts for the popular Roblox game',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'active',
    popularity: 95,
    gameLink: 'https://www.roblox.com/games/2753915549/Blox-Fruits',
    features: ['Auto Farm', 'Auto Combat', 'Teleport', 'ESP', 'Speed Hack', 'No Clip'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Arsenal',
    description: 'Precision aimbot and ESP features for competitive gameplay',
    image: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'active',
    popularity: 88,
    gameLink: 'https://www.roblox.com/games/286090429/Arsenal',
    features: ['Aimbot', 'ESP', 'Wallhack', 'Triggerbot', 'Radar', 'Auto Reload'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Pet Simulator X',
    description: 'Automated pet collection and trading system',
    image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'updating',
    popularity: 82,
    gameLink: 'https://www.roblox.com/games/6284583030/Pet-Simulator-X',
    features: ['Auto Collect', 'Auto Hatch', 'Auto Trade', 'Dupe Items', 'Speed Boost', 'Teleport'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Adopt Me',
    description: 'Trading automation and pet management tools',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'active',
    popularity: 79,
    gameLink: 'https://www.roblox.com/games/920587237/Adopt-Me',
    features: ['Auto Trade', 'Pet Tracker', 'Value Calculator', 'Auto Care', 'Teleport', 'Speed Hack'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Jailbreak',
    description: 'Enhanced movement and robbery automation scripts',
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'active',
    popularity: 85,
    gameLink: 'https://www.roblox.com/games/606849621/Jailbreak',
    features: ['Auto Rob', 'Speed Hack', 'Teleport', 'No Clip', 'ESP', 'Auto Arrest'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Murder Mystery 2',
    description: 'Detection and gameplay enhancement tools',
    image: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'maintenance',
    popularity: 73,
    gameLink: 'https://www.roblox.com/games/142823291/Murder-Mystery-2',
    features: ['Role ESP', 'Item ESP', 'Speed Hack', 'Teleport', 'Auto Collect', 'Aimbot'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getGames = (): Game[] => {
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
  } catch (error) {
    console.warn('Failed to load games from localStorage, using defaults:', error);
  }
  
  // Initialize with default games
  saveGames(DEFAULT_GAMES);
  return DEFAULT_GAMES;
};

export const saveGames = (games: Game[]): void => {
  try {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.error('Failed to save games to localStorage:', error);
  }
};

export const addGame = (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Game => {
  const games = getGames();
  const newGame: Game = {
    ...gameData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const updatedGames = [...games, newGame];
  saveGames(updatedGames);
  return newGame;
};

export const updateGame = (id: string, gameData: Partial<Omit<Game, 'id' | 'createdAt'>>): Game | null => {
  const games = getGames();
  const gameIndex = games.findIndex(game => game.id === id);
  
  if (gameIndex === -1) {
    return null;
  }
  
  const updatedGame: Game = {
    ...games[gameIndex],
    ...gameData,
    updatedAt: new Date()
  };
  
  games[gameIndex] = updatedGame;
  saveGames(games);
  return updatedGame;
};

export const deleteGame = (id: string): boolean => {
  const games = getGames();
  const filteredGames = games.filter(game => game.id !== id);
  
  if (filteredGames.length === games.length) {
    return false; // Game not found
  }
  
  saveGames(filteredGames);
  return true;
};

export const getGameById = (id: string): Game | null => {
  const games = getGames();
  return games.find(game => game.id === id) || null;
};