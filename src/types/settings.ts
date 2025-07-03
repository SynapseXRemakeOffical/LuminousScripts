export interface AppSettings {
  id: string;
  discordInviteLink: string;
  keySystemProviders: KeySystemProvider[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KeySystemProvider {
  id: string;
  name: string;
  checkpoints: number;
  description: string;
  link: string;
  isActive: boolean;
}

export interface SettingsFormData {
  discordInviteLink: string;
  keySystemProviders: KeySystemProvider[];
}