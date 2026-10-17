import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { HomeFeed } from './components/HomeFeed';
import { DiscoverScreen } from './components/DiscoverScreen';
import { CreateScreen } from './components/CreateScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { CommentsModal } from './components/CommentsModal';
import { ShareModal } from './components/ShareModal';
import { DownloadAabModal } from './components/DownloadAabModal';
import { SettingsScreen } from './components/SettingsScreen';
import { AuthScreen } from './components/AuthScreen';
import { SplashScreen } from './components/SplashScreen';
import { CreatorStudioModal } from './components/CreatorStudioModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SubscriptionModal } from './components/SubscriptionModal';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    toastMessage,
    isSplashScreenVisible,
    hideSplashScreen,
    isCreatorStudioOpen,
    closeCreatorStudio,
    isAdminDashboardOpen,
    closeAdminDashboard,
    isSubscriptionModalOpen,
    closeSubscriptionModal,
    subscriptionTargetCreator
  } = useApp();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      {/* Active Screen View */}
      <div className="flex-1 w-full h-full overflow-hidden relative">
        {activeTab === 'reels' && <HomeFeed />}
        {activeTab === 'discover' && <DiscoverScreen />}
        {activeTab === 'create' && <CreateScreen />}
        {activeTab === 'notifications' && <NotificationsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom Global Navigation Bar */}
      <BottomNavBar />

      {/* Modals & Overlays */}
      <CommentsModal />
      <ShareModal />
      <DownloadAabModal />
      <SettingsScreen />
      <AuthScreen />
      <CreatorStudioModal
        isOpen={isCreatorStudioOpen}
        onClose={closeCreatorStudio}
      />
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={closeAdminDashboard}
      />
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={closeSubscriptionModal}
        creatorId={subscriptionTargetCreator?.id}
        creatorName={subscriptionTargetCreator?.name}
        creatorUsername={subscriptionTargetCreator?.username}
      />

      {/* Production Android Startup Splash Screen */}
      <SplashScreen
        isVisible={isSplashScreenVisible}
        onDismiss={hideSplashScreen}
        autoDismissDelay={2200}
      />

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900/95 border border-white/20 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce pointer-events-none">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AndroidFrame>
        <MainAppContent />
      </AndroidFrame>
    </AppProvider>
  );
}

export default App;
