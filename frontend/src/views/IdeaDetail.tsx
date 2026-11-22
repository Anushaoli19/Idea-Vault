import { useState, useEffect } from 'react';
import { api } from '../api';
import { IdeaItem } from '../types';

interface IdeaDetailProps {
  ideaId?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export default function IdeaDetail({ ideaId = 'idea-smart-energy-grid', onNavigate }: IdeaDetailProps) {
  const [idea, setIdea] = useState<IdeaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [hasExpressedInterest, setHasExpressedInterest] = useState<boolean>(false);
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>('');
  const [applyNote, setApplyNote] = useState<string>('');
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getIdea(ideaId);
        setIdea(data);
      } catch (err) {
        console.error('Failed to load idea detail:', err);
      } finally {
        // Keep brief skeleton state to showcase Screen 6 fidelity
        setTimeout(() => setLoading(false), 400);
      }
    }
    load();
  }, [ideaId]);

  const handleUpvote = async () => {
    if (!idea) return;
    try {
      const res = await api.toggleUpvote(idea.id);
      setIdea({ ...idea, upvotes_count: res.count });
      setHasUpvoted(res.state);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInterest = async () => {
    if (!idea) return;
    try {
      const res = await api.toggleInterest(idea.id);
      setIdea({ ...idea, interested_count: res.count });
      setHasExpressedInterest(res.state);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyModalOpen(false);
      setApplyNote('');
    }, 1500);
  };

  // =========================================================================
  // SCREEN 6: IDEA DETAIL LOADING STATE SKELETON
  // =========================================================================
  if (loading) {
    return (
      <div className="w-full pb-20 animate-pulse space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-surface-container rounded w-1/4 mb-4" />

        {/* Top Header Card Skeleton */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container space-y-4">
          <div className="h-6 bg-surface-container rounded w-1/3" />
          <div className="h-10 bg-surface-container rounded w-3/4" />
          <div className="h-4 bg-surface-container rounded w-1/2" />
        </div>

        {/* Grid Split Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 bg-surface-container-lowest rounded-2xl border border-surface-container p-6" />
            <div className="h-64 bg-surface-container-lowest rounded-2xl border border-surface-container p-6" />
            <div className="h-40 bg-surface-container-lowest rounded-2xl border border-surface-container p-6" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-surface-container-lowest rounded-2xl border border-surface-container p-6" />
            <div className="h-48 bg-surface-container-lowest rounded-2xl border border-surface-container p-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-on-surface">Idea not found in Vault</h2>
        <button
          onClick={() => onNavigate('explore')}
          className="mt-4 px-4 py-2 bg-primary-container text-on-primary rounded-full text-xs font-semibold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  // Parse metrics
  let metricsObj: Record<string, string> = {};
  try {
    metricsObj = JSON.parse(idea.metrics_json || '{}');
  } catch (e) {
    metricsObj = {};
  }

  const tags = (idea.tech_tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div className="w-full pb-24">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant text-xs mb-6">
        <button
          onClick={() => onNavigate('explore')}
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Explore Ideas</span>
        </button>
        <span className="text-outline-variant font-medium">/</span>
        <span className="text-on-surface font-semibold">{idea.category}</span>
        <span className="text-outline-variant font-medium">/</span>
        <span className="text-on-surface-variant truncate max-w-xs">{idea.title}</span>
      </nav>

      {/* Main Header Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-container/10 text-primary text-xs font-bold border border-primary/20">
                {idea.department} • {idea.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary-container/30 text-secondary text-xs font-semibold">
                Maturity: {idea.maturity}
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">
                {idea.status}
              </span>
            </div>

            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Faculty Verified Capstone
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-on-surface tracking-tight">
            {idea.title}
          </h1>

          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-4xl">
            {idea.summary}
          </p>

          {/* Author Meta Strip */}
          <div className="pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                alt={idea.author_name}
                src={idea.author_avatar}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface">{idea.author_name}</span>
                <span className="text-xs text-on-surface-variant">{idea.author_dept} • {idea.author_batch}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <div>
                <strong>Lab Clearance:</strong> {idea.lab_status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantitative Impact Metric Cards */}
      {Object.keys(metricsObj).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(metricsObj).map(([key, value], idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm"
            >
              <div className="text-2xl font-bold text-primary mb-1">{value}</div>
              <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                {key.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Project Specifications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Problem Statement */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">target</span>
              Problem Statement & Context
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
              {idea.problem_statement}
            </p>
          </div>

          {/* Section 2: Technical Architecture & Schematics */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">developer_board</span>
              System Architecture & Testbed Schematics
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {idea.architecture_description}
            </p>

            {/* Testbed visual block */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                <span>Hardware Testbed Diagram (Lab Bench 4)</span>
                <span className="text-secondary">Modbus RS485 • ESP32 • LoRaWAN Gateway</span>
              </div>
              <div className="h-36 bg-surface-container rounded-lg flex items-center justify-center text-xs text-on-surface-variant border border-dashed border-outline-variant">
                <div className="text-center space-y-1">
                  <span className="material-symbols-outlined text-primary text-[32px]">schema</span>
                  <div>Rooftop Solar PV Array (250 kWp) → Modbus IEM3155 → ESP32 Edge Gateway → LoRaWAN</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tech Stack Tags */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[22px]">code</span>
              Full Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: What We Need Help With (Open Roles) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">group_add</span>
                What We Need Help With (Open Team Slots)
              </h2>
              <span className="text-xs text-secondary font-semibold">
                {idea.open_roles?.length || 0} Vacancies Open
              </span>
            </div>

            {idea.open_roles && idea.open_roles.length > 0 ? (
              <div className="space-y-3">
                {idea.open_roles.map((role) => (
                  <div
                    key={role.id}
                    className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-on-surface">{role.role_title}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                          Target: {role.department_required}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Skills: {role.skills_required} • Kickoff: {role.kickoff_date}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleTitle(role.role_title);
                        setApplyModalOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-full bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold transition-all shadow-sm shrink-0"
                    >
                      Apply for Role
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant">Team capacity is currently full.</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Faculty Mentor Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">school</span>
              Faculty Advisor
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="text-sm font-bold text-on-surface">{idea.faculty_mentor}</div>
              <div className="text-xs text-on-surface-variant mt-0.5">Department of Electrical & Electronics Engg.</div>
              <div className="text-[11px] text-secondary font-medium mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Endorsed for Final Defense</span>
              </div>
            </div>
          </div>

          {/* Project Lifecycle Timeline */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">timeline</span>
              Project Lifecycle
            </h3>
            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container">
              <div className="flex items-start gap-3 relative">
                <span className="w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-on-surface">Ideation & Literature Survey</div>
                  <div className="text-[11px] text-on-surface-variant">Completed • Oct 2026</div>
                </div>
              </div>
              <div className="flex items-start gap-3 relative">
                <span className="w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-on-surface">Prototype & Lab Bench Test</div>
                  <div className="text-[11px] text-secondary font-medium">Active Phase • Bench 4</div>
                </div>
              </div>
              <div className="flex items-start gap-3 relative">
                <span className="w-4 h-4 rounded-full bg-surface-container ring-4 ring-surface-container-lowest shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-on-surface-variant">Live Campus Pilot</div>
                  <div className="text-[11px] text-on-surface-variant">Target: Feb 2026</div>
                </div>
              </div>
              <div className="flex items-start gap-3 relative">
                <span className="w-4 h-4 rounded-full bg-surface-container ring-4 ring-surface-container-lowest shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-on-surface-variant">Final Defense & Archive</div>
                  <div className="text-[11px] text-on-surface-variant">Target: April 2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interested Students Roster */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">group</span>
                Collaborators ({idea.interested_count})
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[10px]">
                    K
                  </div>
                  <span className="font-semibold text-on-surface">Karthik R.</span>
                </div>
                <span className="text-on-surface-variant text-[11px]">ECE '25</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[10px]">
                    P
                  </div>
                  <span className="font-semibold text-on-surface">Priya N.</span>
                </div>
                <span className="text-on-surface-variant text-[11px]">AIML '26</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container py-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant hidden sm:inline">Capstone Actions:</span>
            <span className="text-xs font-bold text-on-surface truncate max-w-xs">{idea.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                hasUpvoted
                  ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              <span>{hasUpvoted ? 'Upvoted' : 'Upvote'} ({idea.upvotes_count})</span>
            </button>

            <button
              onClick={handleInterest}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                hasExpressedInterest
                  ? 'bg-secondary-container text-on-secondary-container border-secondary-container shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <span>{hasExpressedInterest ? 'Interested ✓' : "I'm Interested"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="text-base font-bold text-on-surface">Apply for Team Role</h3>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {appliedSuccess ? (
              <div className="p-6 text-center space-y-2">
                <span className="material-symbols-outlined text-secondary text-[48px]">check_circle</span>
                <h4 className="text-base font-bold text-on-surface">Application Sent!</h4>
                <p className="text-xs text-on-surface-variant">
                  Project lead {idea.author_name} has received your request.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <span className="text-xs text-on-surface-variant">Applying for:</span>
                  <div className="text-sm font-bold text-on-surface">{selectedRoleTitle}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">
                    Brief note on your background & relevant skills:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={applyNote}
                    onChange={(e) => setApplyNote(e.target.value)}
                    placeholder="e.g. 7th sem CSE student with hands-on experience in React and IoT MQTT telemetry."
                    className="w-full bg-surface-container-low p-3 rounded-xl border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-primary-container text-on-primary text-xs font-semibold shadow-sm hover:bg-primary"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
