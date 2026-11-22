import { useState } from 'react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  unreadCount?: number;
  onOpenDrawer: () => void;
}

export default function Header({ currentTab, onNavigate, unreadCount = 3, onOpenDrawer }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-surface-container shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-sm">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <span className="text-lg font-bold text-on-surface tracking-tight whitespace-nowrap">
              Idea Vault
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium tracking-wide">
              NIE Mysuru
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('explore')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'explore'
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-b-none'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Explore Ideas
            </button>
            <button
              onClick={() => onNavigate('teammates')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'teammates'
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-b-none'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Teammate Hub
            </button>
            <button
              onClick={() => onNavigate('submissions')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'submissions'
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-b-none'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              My Submissions
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'leaderboard'
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-b-none'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Campus Leaderboard
            </button>
          </nav>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('post')}
            type="button"
            className="inline-flex items-center gap-1.5 bg-primary-container hover:bg-primary text-on-primary font-medium text-sm px-4 py-2 rounded-full transition-all shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Post Idea</span>
          </button>

          {/* Notifications button */}
          <button
            onClick={() => onNavigate('notifications')}
            aria-label="Campus Notifications"
            type="button"
            className={`relative p-2 rounded-full transition-colors ${
              currentTab === 'notifications'
                ? 'bg-primary-container/10 text-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest animate-pulse"></span>
            )}
          </button>

          {/* User Profile Avatar / Drawer trigger */}
          <button
            onClick={onOpenDrawer}
            type="button"
            className="flex items-center gap-2 pl-2 border-l border-surface-container focus:outline-none hover:opacity-90 transition-opacity"
          >
            <img
              alt="Rohan S."
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-on-surface leading-tight">Rohan S.</span>
              <span className="text-[11px] text-on-surface-variant leading-tight">CSE '25</span>
            </div>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface focus:outline-none"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-container bg-surface-container-lowest px-4 py-3 space-y-2">
          <button
            onClick={() => { onNavigate('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low"
          >
            Explore Ideas
          </button>
          <button
            onClick={() => { onNavigate('teammates'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low"
          >
            Teammate Hub
          </button>
          <button
            onClick={() => { onNavigate('submissions'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low"
          >
            My Submissions
          </button>
          <button
            onClick={() => { onNavigate('leaderboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low"
          >
            Campus Leaderboard
          </button>
          <button
            onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low"
          >
            Profile & Settings
          </button>
        </div>
      )}
    </header>
  );
}
