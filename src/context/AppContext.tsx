import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReelPost, Creator, ActiveTab, CommentItem } from '../types';
import { MOCK_REELS, CURRENT_USER, MOCK_COMMENTS } from '../data/mockData';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  reels: ReelPost[];
  currentReelIndex: number;
  setCurrentReelIndex: (index: number) => void;
  currentUser: Creator;
  toggleLike: (reelId: string) => void;
  toggleSave: (reelId: string) => void;
  toggleFollow: (creatorId: string) => void;
  activeCommentsPost: ReelPost | null;
  openComments: (post: ReelPost) => void;
  closeComments: () => void;
  comments: CommentItem[];
  addComment: (text: string) => void;
  activeSharePost: ReelPost | null;
  openShare: (post: ReelPost) => void;
  closeShare: () => void;
  isDownloadModalOpen: boolean;
  openDownloadModal: () => void;
  closeDownloadModal: () => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  isCreatorStudioOpen: boolean;
  openCreatorStudio: () => void;
  closeCreatorStudio: () => void;
  isAdminDashboardOpen: boolean;
  openAdminDashboard: () => void;
  closeAdminDashboard: () => void;
  isSubscriptionModalOpen: boolean;
  subscriptionTargetCreator: Creator | null;
  openSubscriptionModal: (creator?: Creator) => void;
  closeSubscriptionModal: () => void;
  isSplashScreenVisible: boolean;
  showSplashScreen: () => void;
  hideSplashScreen: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  addNewReel: (reel: ReelPost) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reels');
  const [reels, setReels] = useState<ReelPost[]>(() => {
    const saved = localStorage.getItem('zinistag_reels');
    return saved ? JSON.parse(saved) : MOCK_REELS;
  });
  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [currentUser] = useState<Creator>(CURRENT_USER);
  const [activeCommentsPost, setActiveCommentsPost] = useState<ReelPost | null>(null);
  const [comments, setComments] = useState<CommentItem[]>(MOCK_COMMENTS);
  const [activeSharePost, setActiveSharePost] = useState<ReelPost | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [subscriptionTargetCreator, setSubscriptionTargetCreator] = useState<Creator | null>(null);
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('zinistag_reels', JSON.stringify(reels));
  }, [reels]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const showSplashScreen = () => setIsSplashScreenVisible(true);
  const hideSplashScreen = () => setIsSplashScreenVisible(false);

  const toggleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const isLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked,
            likes: isLiked ? reel.likes + 1 : reel.likes - 1
          };
        }
        return reel;
      })
    );
  };

  const toggleSave = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const isSaved = !reel.isSaved;
          showToast(isSaved ? 'Saved to collections 📌' : 'Removed from collections');
          return { ...reel, isSaved };
        }
        return reel;
      })
    );
  };

  const toggleFollow = (creatorId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.creator.id === creatorId) {
          const isFollowing = !reel.creator.isFollowing;
          showToast(isFollowing ? `Following @${reel.creator.username} ✨` : `Unfollowed @${reel.creator.username}`);
          return {
            ...reel,
            creator: { ...reel.creator, isFollowing }
          };
        }
        return reel;
      })
    );
  };

  const openComments = (post: ReelPost) => setActiveCommentsPost(post);
  const closeComments = () => setActiveCommentsPost(null);

  const addComment = (text: string) => {
    if (!text.trim() || !activeCommentsPost) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: currentUser,
      text: text.trim(),
      timestamp: 'Just now',
      likes: 0
    };
    setComments((prev) => [newComment, ...prev]);
    setReels((prev) =>
      prev.map((r) => (r.id === activeCommentsPost.id ? { ...r, commentsCount: r.commentsCount + 1 } : r))
    );
    showToast('Comment posted! 💬');
  };

  const openShare = (post: ReelPost) => setActiveSharePost(post);
  const closeShare = () => setActiveSharePost(null);

  const openDownloadModal = () => setIsDownloadModalOpen(true);
  const closeDownloadModal = () => setIsDownloadModalOpen(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  const openCreatorStudio = () => setIsCreatorStudioOpen(true);
  const closeCreatorStudio = () => setIsCreatorStudioOpen(false);

  const openAdminDashboard = () => setIsAdminDashboardOpen(true);
  const closeAdminDashboard = () => setIsAdminDashboardOpen(false);

  const openSubscriptionModal = (creator?: Creator) => {
    setSubscriptionTargetCreator(creator || null);
    setIsSubscriptionModalOpen(true);
  };
  const closeSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
    setSubscriptionTargetCreator(null);
  };

  const addNewReel = (reel: ReelPost) => {
    setReels((prev) => [reel, ...prev]);
    setCurrentReelIndex(0);
    setActiveTab('reels');
    showToast('Your ZINISTAG reel is live! 🎬');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        reels,
        currentReelIndex,
        setCurrentReelIndex,
        currentUser,
        toggleLike,
        toggleSave,
        toggleFollow,
        activeCommentsPost,
        openComments,
        closeComments,
        comments,
        addComment,
        activeSharePost,
        openShare,
        closeShare,
        isDownloadModalOpen,
        openDownloadModal,
        closeDownloadModal,
        isSettingsOpen,
        openSettings,
        closeSettings,
        isAuthOpen,
        openAuth,
        closeAuth,
        isCreatorStudioOpen,
        openCreatorStudio,
        closeCreatorStudio,
        isAdminDashboardOpen,
        openAdminDashboard,
        closeAdminDashboard,
        isSubscriptionModalOpen,
        subscriptionTargetCreator,
        openSubscriptionModal,
        closeSubscriptionModal,
        isSplashScreenVisible,
        showSplashScreen,
        hideSplashScreen,
        toastMessage,
        showToast,
        addNewReel
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
