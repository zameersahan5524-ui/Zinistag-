export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers?: number;
  following?: number;
  verified?: boolean;
  isFollowing?: boolean;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  cover?: string;
}

export interface ReelPost {
  id: string;
  videoUrl: string;
  caption: string;
  creator: Creator;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  audio: AudioTrack;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  author: Creator;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: Creator;
  text: string;
  timestamp: string;
  targetReelId?: string;
  read: boolean;
}

export type ActiveTab = 'reels' | 'discover' | 'create' | 'notifications' | 'profile';
