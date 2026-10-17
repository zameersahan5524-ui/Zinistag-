import { Creator, ReelPost, CommentItem, NotificationItem } from '../types';

export const CURRENT_USER: Creator = {
  id: 'current_user',
  name: 'Zameer Sahan',
  username: 'zameersahan',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Visual story creator & motion explorer 🪐 Exploring next-gen video on ZINISTAG',
  followers: 14200,
  following: 342,
  verified: true
};

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'creator_1',
    name: 'Elena Rostova',
    username: 'elenarost',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Cinematographer & Cyberpunk aesthetics',
    followers: 89400,
    following: 210,
    verified: true
  },
  {
    id: 'creator_2',
    name: 'Marcus Vance',
    username: 'marcus_vfx',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Synthwave & 3D soundscapes 🎛️',
    followers: 43200,
    following: 195,
    verified: true
  },
  {
    id: 'creator_3',
    name: 'Aria Chen',
    username: 'ariachen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    bio: 'Tokyo street culture & neon vibes ✨',
    followers: 120500,
    following: 480,
    verified: true
  },
  {
    id: 'creator_4',
    name: 'Kofi Mensah',
    username: 'koficuts',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Fast-paced action & drone reels 🛸',
    followers: 67100,
    following: 310,
    verified: false
  },
  {
    id: 'creator_5',
    name: 'Sophia Laurent',
    username: 'sophialaurent',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    bio: 'High-fashion motion & editorial lens 📸',
    followers: 95400,
    following: 160,
    verified: true
  }
];

export const MOCK_REELS: ReelPost[] = [
  {
    id: 'reel-1',
    videoUrl: '/videos/reel-1.mp4',
    caption: 'Neon horizons beneath the Tokyo skyline. The pulse of the night never stops ✨ #cyberpunk #tokyo #nightlife #zinistag',
    creator: MOCK_CREATORS[0],
    likes: 18420,
    commentsCount: 342,
    sharesCount: 1240,
    tags: ['cyberpunk', 'tokyo', 'nightlife', 'zinistag'],
    audio: {
      id: 'a1',
      title: 'Midnight Resonance (Original Mix)',
      artist: 'Elena Rostova & SynthWave',
      cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    },
    isLiked: false,
    isSaved: false,
    createdAt: '2h ago'
  },
  {
    id: 'reel-2',
    videoUrl: '/videos/reel-2.mp4',
    caption: 'Gravity-defying visual rhythms. Rendered in real-time on our custom spatial engine 🚀 #motion #render #3d #vfx',
    creator: MOCK_CREATORS[1],
    likes: 24890,
    commentsCount: 512,
    sharesCount: 2900,
    tags: ['motion', 'render', '3d', 'vfx'],
    audio: {
      id: 'a2',
      title: 'Hyperdrive Warp Pulse',
      artist: 'Marcus Vance',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    isLiked: true,
    isSaved: true,
    createdAt: '4h ago'
  },
  {
    id: 'reel-3',
    videoUrl: '/videos/reel-3.mp4',
    caption: 'Golden hour reflections along the Pacific coastal highway. Pure cinematic calm 🌊 #pacific #sunset #cinematic #peace',
    creator: MOCK_CREATORS[2],
    likes: 31200,
    commentsCount: 780,
    sharesCount: 3410,
    tags: ['pacific', 'sunset', 'cinematic', 'peace'],
    audio: {
      id: 'a3',
      title: 'Tides of Eternity',
      artist: 'Aria Chen Ambient',
      cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
    },
    isLiked: false,
    isSaved: false,
    createdAt: '7h ago'
  },
  {
    id: 'reel-4',
    videoUrl: '/videos/reel-4.mp4',
    caption: 'FPV acrobatic run through the mist valleys. Hold on tight! 🌪️ #fpv #drone #adventure #speed',
    creator: MOCK_CREATORS[3],
    likes: 42100,
    commentsCount: 920,
    sharesCount: 4500,
    tags: ['fpv', 'drone', 'adventure', 'speed'],
    audio: {
      id: 'a4',
      title: 'Apex Flight Overdrive',
      artist: 'Kofi Mensah Beats',
      cover: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    isLiked: false,
    isSaved: false,
    createdAt: '12h ago'
  },
  {
    id: 'reel-5',
    videoUrl: '/videos/reel-5.mp4',
    caption: 'Parisian fashion atelier backstage glimpses. Haute couture in ultra slow-motion 👗 #hautecouture #paris #fashion #editorial',
    creator: MOCK_CREATORS[4],
    likes: 15600,
    commentsCount: 280,
    sharesCount: 890,
    tags: ['hautecouture', 'paris', 'fashion', 'editorial'],
    audio: {
      id: 'a5',
      title: 'Silk & Shadows',
      artist: 'Sophia Laurent Collective',
      cover: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80'
    },
    isLiked: true,
    isSaved: false,
    createdAt: '1d ago'
  },
  {
    id: 'reel-6',
    videoUrl: '/videos/reel-6.mp4',
    caption: 'Sound frequencies turned into liquid mercury patterns. Science meets hypnotic art 🧪 #cymatics #physics #soundart #vibes',
    creator: MOCK_CREATORS[1],
    likes: 58900,
    commentsCount: 1420,
    sharesCount: 7800,
    tags: ['cymatics', 'physics', 'soundart', 'vibes'],
    audio: {
      id: 'a6',
      title: 'Resonance in 432Hz',
      artist: 'Cymatics Labs',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    isLiked: false,
    isSaved: false,
    createdAt: '2d ago'
  }
];

export const MOCK_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: MOCK_CREATORS[1],
    text: 'This color grading is absolute perfection! What LUT did you use?',
    timestamp: '1h ago',
    likes: 84
  },
  {
    id: 'c2',
    author: MOCK_CREATORS[2],
    text: 'The frame transitions are crazy smooth 🔥',
    timestamp: '45m ago',
    likes: 32
  },
  {
    id: 'c3',
    author: MOCK_CREATORS[3],
    text: 'ZINISTAG video player performance is incredible ⚡',
    timestamp: '20m ago',
    likes: 19
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    user: MOCK_CREATORS[0],
    text: 'liked your recent reel "Tokyo After Hours"',
    timestamp: '5m ago',
    read: false
  },
  {
    id: 'n2',
    type: 'comment',
    user: MOCK_CREATORS[1],
    text: 'commented: "The frame rate on this is insane!"',
    timestamp: '25m ago',
    read: false
  },
  {
    id: 'n3',
    type: 'follow',
    user: MOCK_CREATORS[2],
    text: 'started following your creative journey',
    timestamp: '2h ago',
    read: true
  }
];
