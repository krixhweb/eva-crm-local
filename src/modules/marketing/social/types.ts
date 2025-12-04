
export type Platform = 'facebook' | 'instagram' | 'x' | 'linkedin' | 'tiktok' | 'youtube' | 'pinterest';

export interface SocialAccount {
  id: string;
  provider: Platform;
  name: string;
  username: string;
  profileImage?: string;
  connectedAt: string;
  status: 'connected' | 'error' | 'revoked';
  followersCount?: number;
}

export interface SocialAttachment {
  id: string;
  url: string;
  type: 'image' | 'video';
  file?: File;
  size?: number;
}

export interface LinkMetadata {
  url: string;
  domain: string;
  title: string;
  description: string;
  image?: string;
}

export interface SocialPost {
  id: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'trash';
  platforms: Platform[];
  accountIds: string[];
  attachments: SocialAttachment[];
  linkPreview?: LinkMetadata | null;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  labels?: string[];
  stats?: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    clicks: number;
    engagementRate: number;
  };
  author: {
    name: string;
    avatar: string;
  };
}

export const PLATFORM_CONFIG: Record<Platform, { 
  name: string; 
  charLimit: number; 
  icon: string; 
  color: string;
  bg: string;
  mediaLimit: number;
}> = {
  facebook: { name: 'Facebook', charLimit: 63206, icon: 'facebook', color: 'text-blue-600', bg: 'bg-blue-600', mediaLimit: 10 },
  instagram: { name: 'Instagram', charLimit: 2200, icon: 'instagram', color: 'text-pink-600', bg: 'bg-pink-600', mediaLimit: 10 },
  x: { name: 'X (Twitter)', charLimit: 280, icon: 'twitter', color: 'text-black dark:text-white', bg: 'bg-black', mediaLimit: 4 },
  linkedin: { name: 'LinkedIn', charLimit: 3000, icon: 'linkedin', color: 'text-blue-700', bg: 'bg-blue-700', mediaLimit: 9 },
  tiktok: { name: 'TikTok', charLimit: 2200, icon: 'tiktok', color: 'text-black dark:text-white', bg: 'bg-black', mediaLimit: 1 },
  youtube: { name: 'YouTube', charLimit: 5000, icon: 'youtube', color: 'text-red-600', bg: 'bg-red-600', mediaLimit: 1 },
  pinterest: { name: 'Pinterest', charLimit: 500, icon: 'pinterest', color: 'text-red-500', bg: 'bg-red-500', mediaLimit: 1 },
};
