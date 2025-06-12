export interface Game {
  id: string;
  name: string;
  description: string;
  features: string[];
  popularity: number;
  image: string;
  gameLink: string;
  status: 'active' | 'updating' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

export interface GameFormData {
  name: string;
  description: string;
  features: string;
  popularity: number;
  image: string;
  gameLink: string;
  status: 'active' | 'updating' | 'maintenance';
}