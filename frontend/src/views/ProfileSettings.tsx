import { useState, useEffect } from 'react';
import { api } from '../api';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  initialTab?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export default function ProfileSettings({ initialTab = 'profile' }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(
    initialTab === 'settings' ? 'settings' : 'profile'
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getUserProfile('usr-rohan-cse');
        setProfile(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (loading || !profile) {
    return (
      <div className="w-full py-8 animate-pulse space-y-6">
        <div className="h-8 bg-surface-container rounded w-1/4" />
        <div className="h-64 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full pb-16 max-w-4xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-3 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-primary-container text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          Academic Profile & Credentials (Screen 11)
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-primary-container text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          Settings & SSO Security (Screen 13)
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 mb-4 rounded-xl bg-secondary-container/30 text-secondary text-xs font-semibold flex items-center gap-2 border border-secondary/20">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {/* =========================================================================
          SCREEN 11: PROFILE & ACADEMIC SETTINGS
          ========================================================================= */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Header Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                alt={profile.name}
                src={profile.avatar_url}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div>
                <h2 className="text-xl font-bold text-on-surface">{profile.name}</h2>
                <div className="text-xs text-on-surface-variant font-mono mt-0.5">
                  USN: {profile.usn} • {profile.department}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                    {profile.batch}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary text-[11px] font-bold">
                    CGPA: {profile.cgpa}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                    {profile.points} Innovation Pts
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-on-surface-variant sm:text-right">
              <div>Campus: <strong>South Campus (Manandavadi)</strong></div>
              <div className="text-secondary font-semibold mt-1">Clearance: IoT Lab Bench 4</div>
            </div>
          </div>

          {/* Academic & Collaboration Details */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">school</span>
              Academic Standing & Teammate Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-on-surface">Registered Student Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full mt-1 bg-surface-container text-on-surface-variant text-xs p-3 rounded-xl border border-surface-container"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface">Academic Department</label>
                <input
                  type="text"
                  disabled
                  value={profile.department}
                  className="w-full mt-1 bg-surface-container text-on-surface-variant text-xs p-3 rounded-xl border border-surface-container"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <input
                  type="checkbox"
                  checked={profile.available_for_collab}
                  onChange={(e) => setProfile({ ...profile, available_for_collab: e.target.checked })}
                  className="rounded text-primary h-4 w-4"
                />
                <div>
                  <div className="text-xs font-bold text-on-surface">Available for Cross-Branch Projects</div>
                  <div className="text-[11px] text-on-surface-variant">
                    Allows other students and faculty to invite you into active capstone teams.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Linked Research & Developer Profiles */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">link</span>
              Linked Research & Developer Profiles
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profile.github_url}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full mt-1 bg-surface-container-low text-on-surface text-xs p-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profile.linkedin_url}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full mt-1 bg-surface-container-low text-on-surface text-xs p-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary text-xs font-bold shadow-sm hover:bg-primary transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          SCREEN 13: SETTINGS & SECURITY
          ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* SSO Authentication Session */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">security</span>
              NIE Institutional Single Sign-On (SSO)
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your account is securely managed via NIE Mysuru LDAP / Microsoft 365 Education Federation. All campus projects and patent submissions are authenticated with your student credential key.
            </p>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-on-surface">Active Session: Desktop Browser</div>
                <div className="text-[11px] text-on-surface-variant">IP: 10.14.88.22 (Campus Wi-Fi • Block C)</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                Active & Verified
              </span>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
              Campus Notification Channels
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-on-surface">Teammate Applications</div>
                  <div className="text-[11px] text-on-surface-variant">Notify when students apply for my open roles.</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary h-4 w-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-on-surface">Duplicate Alerts & Mediation</div>
                  <div className="text-[11px] text-on-surface-variant">Notify when a submitted idea overlaps with other proposals.</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary h-4 w-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-on-surface">Faculty Mentor Reviews</div>
                  <div className="text-[11px] text-on-surface-variant">Notify on lab clearance updates and seed grant reviews.</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary h-4 w-4" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
