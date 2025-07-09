export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  status: 'active' | 'updating' | 'maintenance';
  popularity: number;
  gameLink: string;
  features: string[];
}

export const getGames = (): Game[] => {
  return [
    {
      id: '1',
      name: 'Blox Fruits',
      description: 'Advanced auto-farming and combat scripts for the popular Roblox game',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      popularity: 95,
      gameLink: 'https://www.roblox.com/games/2753915549/Blox-Fruits',
      features: ['Auto Farm', 'Auto Combat', 'Teleport', 'ESP', 'Speed Hack', 'No Clip']
    },
    {
      id: '2',
      name: 'Arsenal',
      description: 'Precision aimbot and ESP features for competitive gameplay',
      image: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      popularity: 88,
      gameLink: 'https://www.roblox.com/games/286090429/Arsenal',
      features: ['Aimbot', 'ESP', 'Wallhack', 'Triggerbot', 'Radar', 'Auto Reload']
    },
    {
      id: '3',
      name: 'Pet Simulator X',
      description: 'Automated pet collection and trading system',
      image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'updating',
      popularity: 82,
      gameLink: 'https://www.roblox.com/games/6284583030/Pet-Simulator-X',
      features: ['Auto Collect', 'Auto Hatch', 'Auto Trade', 'Dupe Items', 'Speed Boost', 'Teleport']
    },
    {
      id: '4',
      name: 'Adopt Me',
      description: 'Trading automation and pet management tools',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      popularity: 79,
      gameLink: 'https://www.roblox.com/games/920587237/Adopt-Me',
      features: ['Auto Trade', 'Pet Tracker', 'Value Calculator', 'Auto Care', 'Teleport', 'Speed Hack']
    },
    {
      id: '5',
      name: 'Jailbreak',
      description: 'Enhanced movement and robbery automation scripts',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      popularity: 85,
      gameLink: 'https://www.roblox.com/games/606849621/Jailbreak',
      features: ['Auto Rob', 'Speed Hack', 'Teleport', 'No Clip', 'ESP', 'Auto Arrest']
    },
    {
      id: '6',
      name: 'Murder Mystery 2',
      description: 'Detection and gameplay enhancement tools',
      image: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'maintenance',
      popularity: 73,
      gameLink: 'https://www.roblox.com/games/142823291/Murder-Mystery-2',
      features: ['Role ESP', 'Item ESP', 'Speed Hack', 'Teleport', 'Auto Collect', 'Aimbot']
    }
  ];
};