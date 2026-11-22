import { useState, useEffect } from 'react';
import { api } from '../api';

interface MySubmissionsProps {
  onNavigate: (tab: string, param?: string) => void;
}

export default function MySubmissions({ onNavigate }: MySubmissionsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSegment, setActiveSegment] = useState<string>('Approved & Open');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getUserSubmissions('usr-rohan-cse');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full py-8 animate-pulse space-y-6">
        <div className="h-8 bg-surface-container rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-surface-container rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics, ideas } = data;
  const filteredIdeas = ideas.filter((i: any) =>
    activeSegment === 'All' ? true : i.status === activeSegment
  );

  return (
    <div className="w-full pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            My Submissions & Project Vault
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Track your registered proposals, team formation sprints, and lab bench approvals.
          </p>
        </div>

        <button
          onClick={() => onNavigate('post')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container text-on-primary text-xs font-bold shadow-sm hover:bg-primary transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Submit New Proposal</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <div className="text-xs text-on-surface-variant font-medium">Active Capstones</div>
          <div className="text-2xl font-bold text-primary mt-1">{metrics.active_capstones}</div>
          <div className="text-[11px] text-secondary font-medium mt-1">Registered in Vault</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <div className="text-xs text-on-surface-variant font-medium">Total Endorsements</div>
          <div className="text-2xl font-bold text-on-surface mt-1">{metrics.total_endorsements}</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Campus Upvotes</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <div className="text-xs text-on-surface-variant font-medium">Collaborator Inquiries</div>
          <div className="text-2xl font-bold text-secondary mt-1">{metrics.collaborator_inquiries}</div>
          <div className="text-[11px] text-secondary font-medium mt-1">Applicants & Teammates</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <div className="text-xs text-on-surface-variant font-medium">Prototyping Lab Status</div>
          <div className="text-sm font-bold text-on-surface mt-2 truncate">{metrics.lab_status}</div>
          <div className="text-[11px] text-secondary font-semibold mt-1">Cleared for Bench 4</div>
        </div>
      </div>

      {/* Segmented Status Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-3 mb-6 overflow-x-auto">
        {['Approved & Open', 'Under Faculty Review', 'Team Formed', 'All'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSegment(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeSegment === tab
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {filteredIdeas.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">folder_open</span>
            <h3 className="text-base font-bold text-on-surface">No proposals in this category</h3>
            <p className="text-xs text-on-surface-variant mt-1">Select "All" to view your full history.</p>
          </div>
        ) : (
          filteredIdeas.map((idea: any) => (
            <div
              key={idea.id}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-xs font-semibold">
                    {idea.department} • {idea.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-xs font-semibold">
                    {idea.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface">{idea.title}</h3>
                <div className="text-xs text-on-surface-variant flex items-center gap-4">
                  <span>Mentor: <strong>{idea.faculty_mentor}</strong></span>
                  <span>•</span>
                  <span>Upvotes: <strong>{idea.upvotes_count}</strong></span>
                  <span>•</span>
                  <span>Inquiries: <strong>{idea.interested_count}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <button
                  onClick={() => onNavigate('idea', idea.id)}
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-primary-container hover:text-on-primary text-xs font-semibold text-on-surface transition-colors"
                >
                  View Live Showcase
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
