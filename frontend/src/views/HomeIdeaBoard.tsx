import { useState, useEffect } from 'react';
import { api } from '../api';
import { IdeaItem } from '../types';

interface HomeIdeaBoardProps {
  onNavigate: (tab: string, param?: string) => void;
}

export default function HomeIdeaBoard({ onNavigate }: HomeIdeaBoardProps) {
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('upvoted');
  const [upvotingIds, setUpvotingIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'AI/ML', 'Web', 'IoT', 'App', 'Other'];

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const data = await api.getIdeas({
        q: searchQuery,
        category: selectedCategory,
        sort: sortOrder,
      });
      setIdeas(data);
    } catch (err) {
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [selectedCategory, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIdeas();
  };

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpvote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (upvotingIds.has(id)) return;
    setUpvotingIds((prev) => new Set(prev).add(id));

    // Optimistic UI update
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, upvotes_count: item.upvotes_count + 1 } : item
      )
    );

    try {
      const res = await api.toggleUpvote(id);
      setIdeas((prev) =>
        prev.map((item) => (item.id === id ? { ...item, upvotes_count: res.count } : item))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpvotingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleInterest = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Optimistic UI update
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, interested_count: item.interested_count + 1 } : item
      )
    );

    try {
      const res = await api.toggleInterest(id);
      setIdeas((prev) =>
        prev.map((item) => (item.id === id ? { ...item, interested_count: res.count } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Dynamic Atmospheric Glow Hero Banner */}
      <div className="relative w-full overflow-hidden mb-6 rounded-2xl bg-surface-container-low shadow-sm border border-surface-container/60">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-16 w-80 h-80 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-semibold shadow-sm mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>NIE Mysuru Student Innovation Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              Empowering Engineering Ingenuity
            </h1>
            <p className="text-base text-on-surface-variant mt-2 leading-relaxed">
              Share final year capstones, hackathon prototypes, and cross-departmental research breakthroughs.
            </p>
          </div>

          {/* Quick Metrics Counter Pill */}
          <div className="flex items-center gap-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-sm self-start md:self-auto border border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
              <span className="text-base font-bold text-on-surface">148</span>
              <span className="text-xs text-on-surface-variant">Archived</span>
            </div>
            <div className="w-px h-5 bg-surface-container" />
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">handshake</span>
              <span className="text-base font-bold text-on-surface">52</span>
              <span className="text-xs text-on-surface-variant">Formed Teams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Smart Filter Controls Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input Container */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
              search
            </span>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ideas by keyword, tech stack, or student name..."
              className="w-full pl-12 pr-14 h-12 bg-surface-container-lowest border border-surface-container rounded-xl text-sm text-on-surface placeholder:text-outline shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <kbd className="hidden sm:inline-flex items-center absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-surface-container text-xs text-on-surface-variant font-mono">
              ⌘K
            </kbd>
          </form>

          {/* Segmented Sort Toggle */}
          <div className="inline-flex p-1 bg-surface-container-lowest border border-surface-container rounded-xl shadow-sm self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setSortOrder('upvoted')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                sortOrder === 'upvoted'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>Most Upvoted</span>
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('newest')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                sortOrder === 'newest'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Newest</span>
            </button>
          </div>
        </div>

        {/* Category Pill Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-xs text-on-surface-variant">
            Showing <strong className="text-on-surface">{ideas.length}</strong> project proposals
          </div>
        </div>
      </div>

      {/* Ideas Card Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container animate-pulse space-y-4"
            >
              <div className="h-4 bg-surface-container rounded w-1/3" />
              <div className="h-6 bg-surface-container rounded w-4/5" />
              <div className="h-14 bg-surface-container rounded" />
              <div className="h-8 bg-surface-container rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-container">
          <span className="material-symbols-outlined text-outline text-[48px] mb-3">search_off</span>
          <h3 className="text-lg font-bold text-on-surface">No projects matched your criteria</h3>
          <p className="text-sm text-on-surface-variant mt-1 max-w-md mx-auto">
            Try broadening your search term or select "All" categories to discover other engineering ideas.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-4 px-4 py-2 rounded-full bg-primary-container text-on-primary text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => {
            const tags = (idea.tech_tags || '').split(',').map((t) => t.trim()).filter(Boolean);

            return (
              <div
                key={idea.id}
                onClick={() => onNavigate('idea', idea.id)}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Card Header & Dept Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-primary text-xs font-semibold border border-primary/10">
                      {idea.department} • {idea.category}
                    </span>
                    <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {idea.maturity}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {idea.title}
                  </h3>

                  {/* 2-line summary */}
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                    {idea.summary}
                  </p>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {tags.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px]">
                        +{tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer / Author & Actions */}
                <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      alt={idea.author_name}
                      src={idea.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-surface-container"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-on-surface leading-tight">
                        {idea.author_name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant leading-tight">
                        {idea.author_batch}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Upvote Button */}
                    <button
                      type="button"
                      onClick={(e) => handleUpvote(e, idea.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-primary/10 text-on-surface hover:text-primary text-xs font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                      <span>{idea.upvotes_count}</span>
                    </button>

                    {/* Collab/Interested Pill */}
                    <button
                      type="button"
                      onClick={(e) => handleInterest(e, idea.id)}
                      title="Interested in collaborating"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface-container-low hover:bg-secondary/10 text-on-surface-variant hover:text-secondary text-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">handshake</span>
                      <span>{idea.interested_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
