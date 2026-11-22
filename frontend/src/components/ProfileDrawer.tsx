interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export default function ProfileDrawer({ isOpen, onClose, onNavigate }: ProfileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-container">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">account_circle</span>
                Student Profile & Account
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* User Identity Card */}
            <div className="mt-6 p-4 rounded-xl bg-surface-container-low flex items-center gap-4 border border-surface-container">
              <img
                alt="Rohan S."
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-on-surface">Rohan S.</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                    Verified Innovator
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant mt-0.5 font-mono">USN: 4NI21CS142</span>
                <span className="text-xs text-on-surface-variant">Computer Science & Engineering • CSE '25</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-surface-container text-center">
                <div className="text-lg font-bold text-primary">485</div>
                <div className="text-[11px] text-on-surface-variant font-medium">Innovation Pts</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container text-center">
                <div className="text-lg font-bold text-secondary">9.32</div>
                <div className="text-[11px] text-on-surface-variant font-medium">Cumulative GPA</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container text-center">
                <div className="text-lg font-bold text-on-surface">2</div>
                <div className="text-[11px] text-on-surface-variant font-medium">Active Leads</div>
              </div>
            </div>

            {/* Lab Authorizations */}
            <div className="mt-5 p-3 rounded-lg bg-surface-container-low border border-surface-container">
              <div className="text-xs font-semibold text-on-surface flex items-center gap-1.5 mb-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                Active Lab Clearances
              </div>
              <p className="text-xs text-on-surface-variant">
                IoT Lab (Block C), High Performance Computing Hub (North Campus)
              </p>
            </div>

            {/* Menu List */}
            <div className="mt-6 space-y-1">
              <button
                onClick={() => { onNavigate('profile'); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <span>Academic Profile & Credentials</span>
              </button>
              <button
                onClick={() => { onNavigate('submissions'); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">folder_special</span>
                <span>My Submissions & Vault Dashboard</span>
              </button>
              <button
                onClick={() => { onNavigate('teammates'); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">group_add</span>
                <span>Teammate Applications</span>
              </button>
              <button
                onClick={() => { onNavigate('settings'); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-outline text-[20px]">security</span>
                <span>Settings & SSO Security</span>
              </button>
            </div>
          </div>

          {/* Footer of Drawer */}
          <div className="pt-4 border-t border-surface-container">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>Logged in via NIE LDAP SSO</span>
              <span className="text-secondary font-medium">Session Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
