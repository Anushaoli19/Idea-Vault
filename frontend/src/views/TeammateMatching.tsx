import { useState, useEffect } from 'react';
import { api } from '../api';
import { OpenRole } from '../types';

interface TeammateMatchingProps {
  onNavigate: (tab: string, param?: string) => void;
}

export default function TeammateMatching({ onNavigate }: TeammateMatchingProps) {
  const [roles, setRoles] = useState<OpenRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [applyingRoleId, setApplyingRoleId] = useState<string | null>(null);
  const [applicationSent, setApplicationSent] = useState<boolean>(false);

  const domains = ['All', 'Frontend', 'AI/ML', 'Hardware', 'UI/UX', 'Cloud'];

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await api.getOpenRoles({ domain: domainFilter, department: deptFilter });
      setRoles(data);
    } catch (err) {
      console.error('Error fetching open roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [domainFilter, deptFilter]);

  const handleApply = async (roleId: string) => {
    try {
      await api.applyForRole({
        role_id: roleId,
        applicant_id: 'usr-rohan-cse',
        note: 'Interested in contributing to this capstone sprint!',
      });
      setApplyingRoleId(roleId);
      setApplicationSent(true);
      setTimeout(() => {
        setApplyingRoleId(null);
        setApplicationSent(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Banner */}
      <div className="relative w-full overflow-hidden mb-6 rounded-2xl bg-surface-container-low p-6 md:p-8 border border-surface-container">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-secondary text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Cross-Branch Collaboration Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Teammate Matching & Open Roles
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Find innovative capstone projects seeking your engineering specialization. Team up across CSE, ECE, Mech, AIML, and Civil.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setDomainFilter(dom)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                domainFilter === dom
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-on-surface-variant">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-surface-container-lowest border border-surface-container rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Mech">Mech</option>
            <option value="AIML">AIML</option>
            <option value="Civil">Civil</option>
          </select>
        </div>
      </div>

      {/* Vacancy Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container animate-pulse" />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">group_off</span>
          <h3 className="text-base font-bold text-on-surface">No open vacancies for this filter</h3>
          <p className="text-xs text-on-surface-variant mt-1">Try switching to "All" domains to see all active project openings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-xs font-semibold">
                    Target: {role.department_required}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
                    <span className="font-semibold text-on-surface">{role.filled_slots} of {role.total_slots} Filled</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-on-surface mb-1">{role.role_title}</h3>
                
                <button
                  type="button"
                  onClick={() => role.idea_id && onNavigate('idea', role.idea_id)}
                  className="text-xs font-semibold text-primary hover:underline block mb-3 text-left"
                >
                  Project: {role.idea_title} ↗
                </button>

                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-1 mb-4">
                  <div className="text-[11px] font-semibold text-on-surface-variant">Required Skills:</div>
                  <div className="text-xs font-medium text-on-surface">{role.skills_required}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    alt={role.author_name}
                    src={role.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-on-surface">{role.author_name}</span>
                    <span className="text-[10px] text-on-surface-variant">Kickoff: {role.kickoff_date}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApply(role.id)}
                  disabled={applyingRoleId === role.id && applicationSent}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all shadow-sm disabled:bg-secondary"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {applyingRoleId === role.id && applicationSent ? 'check' : 'send'}
                  </span>
                  <span>{applyingRoleId === role.id && applicationSent ? 'Applied!' : 'Request to Join'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
