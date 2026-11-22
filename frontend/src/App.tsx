import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileDrawer from './components/ProfileDrawer';
import HomeIdeaBoard from './views/HomeIdeaBoard';
import PostIdea from './views/PostIdea';
import IdeaDetail from './views/IdeaDetail';
import TeammateMatching from './views/TeammateMatching';
import Leaderboard from './views/Leaderboard';
import NotificationCenter from './views/NotificationCenter';
import MySubmissions from './views/MySubmissions';
import ProfileSettings from './views/ProfileSettings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('explore');
  const [currentIdeaId, setCurrentIdeaId] = useState<string>('idea-smart-energy-grid');
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  const handleNavigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'idea' && param) {
      setCurrentIdeaId(param);
    }
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (currentTab === 'notifications') {
      setUnreadCount(0);
    }
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface font-sans selection:bg-primary-container selection:text-on-primary">
      {/* Persistent Shell Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        unreadCount={unreadCount}
        onOpenDrawer={() => setProfileDrawerOpen(true)}
      />

      {/* Main Container */}
      <main className="w-full pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        {currentTab === 'explore' && <HomeIdeaBoard onNavigate={handleNavigate} />}
        {currentTab === 'post' && <PostIdea onNavigate={handleNavigate} />}
        {currentTab === 'idea' && <IdeaDetail ideaId={currentIdeaId} onNavigate={handleNavigate} />}
        {currentTab === 'teammates' && <TeammateMatching onNavigate={handleNavigate} />}
        {currentTab === 'leaderboard' && <Leaderboard />}
        {currentTab === 'notifications' && <NotificationCenter onNavigate={handleNavigate} />}
        {currentTab === 'submissions' && <MySubmissions onNavigate={handleNavigate} />}
        {currentTab === 'profile' && <ProfileSettings initialTab="profile" onNavigate={handleNavigate} />}
        {currentTab === 'settings' && <ProfileSettings initialTab="settings" onNavigate={handleNavigate} />}
      </main>

      {/* Slide-over Profile Drawer (Screen 12) */}
      <ProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Persistent Shell Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
