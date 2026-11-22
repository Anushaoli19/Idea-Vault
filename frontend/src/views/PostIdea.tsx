import { useState } from 'react';
import { api } from '../api';
import { DuplicateCheckResult } from '../types';

interface PostIdeaProps {
  onNavigate: (tab: string, param?: string) => void;
}

export default function PostIdea({ onNavigate }: PostIdeaProps) {
  // Form fields
  const [title, setTitle] = useState('Automated Hostel Mess Food Waste Auditor');
  const [category, setCategory] = useState('iot');
  const [department, setDepartment] = useState('ECE');
  const [maturity, setMaturity] = useState('Concept');
  const [problemStatement, setProblemStatement] = useState(
    'Over 65 kg of edible food is discarded daily across hostel dining halls at NIE Mysuru without objective per-meal quantification. Using overhead computer vision cameras and load cell strain gauges to track tray returns.'
  );
  const [architectureDescription, setArchitectureDescription] = useState(
    'Raspberry Pi 4 running lightweight MobileNet-V2 food classification model synchronized with load cell strain gauge matrix underneath return conveyors. InfluxDB records per-tray discarded weight.'
  );
  const [techTags, setTechTags] = useState('IoT, Computer Vision, Raspberry Pi, Python, OpenCV');
  const [seekingTeammates, setSeekingTeammates] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    'ECE Embedded Systems Engineer',
    'CSE Backend Developer',
  ]);

  // Loading & Duplicate state
  const [checking, setChecking] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<DuplicateCheckResult | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const availableRoles = [
    'ECE Embedded Systems Engineer',
    'CSE Backend Developer',
    'UI/UX & Mobile App Designer',
    'Edge AI & CV Specialist',
    'Power Electronics Engineer',
  ];

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCheckAndPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);

    try {
      // 1. Run AI duplicate similarity check
      const checkResult = await api.checkDuplicate({
        title,
        category: category.toUpperCase(),
        department,
        problem_statement: problemStatement,
        tech_tags: techTags,
        summary: problemStatement.slice(0, 200),
      });

      setDuplicateResult(checkResult);

      if (checkResult.is_duplicate) {
        // Trigger Screen 3: Duplicate Warning
        setShowWarningModal(true);
      } else {
        // Direct publish
        await publishProject();
      }
    } catch (err) {
      console.error('Error during duplicate check:', err);
    } finally {
      setChecking(false);
    }
  };

  const publishProject = async () => {
    try {
      const openRolesPayload = seekingTeammates
        ? selectedRoles.map((r) => ({
            role_title: r,
            department_required: r.includes('ECE') ? 'ECE' : r.includes('CSE') ? 'CSE' : 'Any',
            skills_required: techTags,
            total_slots: 2,
            kickoff_date: 'Upcoming Sprint',
          }))
        : [];

      const created = await api.createIdea({
        title,
        category: category.toUpperCase(),
        department,
        maturity,
        summary: problemStatement.slice(0, 180) + '...',
        problem_statement: problemStatement,
        architecture_description: architectureDescription,
        tech_tags: techTags,
        open_roles: openRolesPayload as any,
      });

      setShowWarningModal(false);
      onNavigate('idea', created.id);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  return (
    <div className="w-full py-4 pb-20">
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
        <span className="text-on-surface font-semibold">Post a New Idea</span>
      </nav>

      {/* Page Header */}
      <div className="max-w-3xl mx-auto w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold tracking-wide">
            NIE Capstone & Hackathon Registry
          </span>
          <span className="flex items-center gap-1 text-xs text-secondary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Sem 6 & 8 Intake Open
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Submit a Project Idea
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Share your concept with fellow NIE students and discover collaborators, mentors, and teammates.
        </p>
      </div>

      {/* Primary Form Card */}
      <div className="max-w-3xl mx-auto w-full bg-surface-container-lowest rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden border border-surface-container">
        {/* Subtle top aura glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-fixed rounded-full blur-3xl opacity-40 pointer-events-none" />

        <form onSubmit={handleCheckAndPost} className="space-y-6 relative z-10">
          {/* Field 1: Project Title with character counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="idea-title" className="text-sm font-semibold text-on-surface flex items-center gap-1">
                Project Title <span className="text-error font-bold">*</span>
              </label>
              <span className="text-xs text-outline">{title.length} / 100</span>
            </div>
            <input
              id="idea-title"
              type="text"
              required
              minLength={10}
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Automated Hostel Mess Food Waste Auditor"
              className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-2.5 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">info</span>
              Keep it descriptive and specific (min 10 characters).
            </p>
          </div>

          {/* Field 2: Category & Maturity Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="category-select" className="text-sm font-semibold text-on-surface flex items-center gap-1">
                Category <span className="text-error font-bold">*</span>
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-2.5 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="aiml">AI / ML</option>
                <option value="webdev">Web Development</option>
                <option value="iot">IoT & Embedded Systems</option>
                <option value="mobile">Mobile App</option>
                <option value="interdisciplinary">Other / Interdisciplinary</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-on-surface">Project Maturity</label>
                <span className="text-[11px] text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full font-medium">
                  {maturity}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-[42px]">
                {['Concept', 'Prototype', 'Validation'].map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setMaturity(stage)}
                    className={`text-xs font-semibold rounded-xl flex items-center justify-center transition-all ${
                      maturity === stage
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Department selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface">Department Host</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['CSE', 'ISE', 'ECE', 'Mech', 'AIML', 'Civil'].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartment(dept)}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    department === dept
                      ? 'bg-primary-container text-on-primary border-primary-container'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:border-primary/30'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Field 3: Problem Statement */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-1">
              Problem Statement <span className="text-error font-bold">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="What core challenge or inefficiencies does this project address?"
              className="w-full bg-surface-container-low text-on-surface text-sm p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
            />
          </div>

          {/* Field 4: Solution Architecture */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface">
              Technical Architecture & Schematics
            </label>
            <textarea
              rows={3}
              value={architectureDescription}
              onChange={(e) => setArchitectureDescription(e.target.value)}
              placeholder="Hardware testbed components, cloud pipelines, edge devices, etc."
              className="w-full bg-surface-container-low text-on-surface text-sm p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
            />
          </div>

          {/* Field 5: Tech Stack Tags */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={techTags}
              onChange={(e) => setTechTags(e.target.value)}
              placeholder="e.g., IoT, Computer Vision, Raspberry Pi, Python, OpenCV"
              className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-2.5 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Field 6: Teammate Seeking */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seekingTeammates}
                  onChange={(e) => setSeekingTeammates(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-semibold text-on-surface">
                  Actively Recruiting Teammates across Branches
                </span>
              </label>
              <span className="text-[11px] text-secondary font-medium">Interdisciplinary</span>
            </div>

            {seekingTeammates && (
              <div className="pt-2 border-t border-surface-container/60 space-y-2">
                <span className="text-xs text-on-surface-variant font-medium">
                  Select required team specializations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleToggle(role)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedRoles.includes(role)
                          ? 'bg-secondary-container text-on-secondary-container font-semibold'
                          : 'bg-surface-container-lowest text-on-surface-variant border border-surface-container'
                      }`}
                    >
                      {selectedRoles.includes(role) ? '✓ ' : '+ '}
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={checking}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-container hover:bg-primary text-on-primary font-semibold text-sm transition-all shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-lg disabled:opacity-50"
            >
              {checking ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>Analyzing Similarity Engine...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Check & Post Idea</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          SCREEN 3: DUPLICATE WARNING & SIMILARITY ANALYSIS MODAL
          ========================================================================= */}
      {showWarningModal && duplicateResult && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-surface-container">
            {/* Ambient amber glow */}
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-tertiary-fixed opacity-40 blur-3xl pointer-events-none" />

            <div className="p-6 md:p-8 space-y-6 relative z-10">
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-tertiary-container text-on-tertiary shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">warning</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">
                      Similar idea already exists in Idea Vault
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      NIE Mysuru • Automated Capstone IP Validation
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-tertiary text-on-tertiary text-xs font-bold shadow-sm self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                  <span>{duplicateResult.percentage_match}% match detected</span>
                </div>
              </div>

              {/* Explanatory description */}
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                We found an active capstone submission by another NIE team that closely overlaps with your proposed architecture. Under NIE IP & Project Guidelines, collaborating on an existing initiative is preferred over repeating research effort!
              </p>

              {/* Conflicting Project Card */}
              {duplicateResult.conflicting_project && (
                <div className="bg-surface-container-low rounded-xl p-5 border border-surface-container shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
                        {duplicateResult.percentage_match}% Technical Similarity
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-medium">
                        {duplicateResult.conflicting_project.category}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        Looking for 2 CSE Teammates
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      Active in Registry
                    </span>
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-bold text-on-surface">
                        {duplicateResult.conflicting_project.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowWarningModal(false);
                          onNavigate('idea', duplicateResult.conflicting_project!.id);
                        }}
                        className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline shrink-0"
                      >
                        <span>View idea repository</span>
                        <span className="material-symbols-outlined text-[14px]">north_east</span>
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                      {duplicateResult.conflicting_project.summary}
                    </p>
                  </div>

                  {/* Author stack bar */}
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        alt={duplicateResult.conflicting_project.author_name}
                        src={duplicateResult.conflicting_project.author_avatar}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-surface-container"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface leading-tight">
                          {duplicateResult.conflicting_project.author_name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant leading-tight">
                          {duplicateResult.conflicting_project.author_dept}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      Tech: {duplicateResult.conflicting_project.tech_tags}
                    </span>
                  </div>
                </div>
              )}

              {/* Similarity Breakdown: 3 Meters */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-on-surface uppercase tracking-wider">
                  Similarity Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Meter 1: Problem Context */}
                  <div className="p-4 rounded-xl bg-surface-container border border-surface-container">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-on-surface">Problem Context</span>
                      <span className="text-xs font-bold text-tertiary">
                        {duplicateResult.breakdown.problem_context_match}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tertiary-container rounded-full"
                        style={{ width: `${duplicateResult.breakdown.problem_context_match}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant mt-1.5 block">
                      High overlap in mess food waste quantification
                    </span>
                  </div>

                  {/* Meter 2: Hardware/Tech Choice */}
                  <div className="p-4 rounded-xl bg-surface-container border border-surface-container">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-on-surface">Hardware / Tech</span>
                      <span className="text-xs font-bold text-tertiary">
                        {duplicateResult.breakdown.hardware_tech_match}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tertiary rounded-full"
                        style={{ width: `${duplicateResult.breakdown.hardware_tech_match}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant mt-1.5 block">
                      Common OpenCV, Raspberry Pi & sensor components
                    </span>
                  </div>

                  {/* Meter 3: Target Demographic */}
                  <div className="p-4 rounded-xl bg-surface-container border border-surface-container">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-on-surface">Demographic & Campus</span>
                      <span className="text-xs font-bold text-tertiary">
                        {duplicateResult.breakdown.target_demographic_match}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tertiary-container rounded-full"
                        style={{ width: `${duplicateResult.breakdown.target_demographic_match}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant mt-1.5 block">
                      Identical deployment at Mysore hostel facility
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowWarningModal(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Edit My Proposal
                </button>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      alert('A mediation request has been logged with the NIE Research Cell & Capstone Faculty Committee.');
                      setShowWarningModal(false);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface border border-surface-container hover:bg-surface-container-low transition-colors"
                  >
                    Request Mentor Mediation
                  </button>

                  <button
                    type="button"
                    onClick={() => publishProject()}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-error border border-error/30 hover:bg-error/5 transition-colors"
                  >
                    Proceed with Separate Submission
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (duplicateResult.conflicting_project) {
                        setShowWarningModal(false);
                        onNavigate('idea', duplicateResult.conflicting_project.id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">group_add</span>
                    <span>Upvote / Join Team Instead</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
