import { useState, useEffect } from 'react';
import { api } from '../api';
import { LeaderboardData } from '../types';

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getLeaderboard();
        setData(res);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full py-8 animate-pulse space-y-6">
        <div className="h-10 bg-surface-container rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-surface-container rounded-2xl" />
          <div className="h-72 bg-surface-container rounded-2xl" />
          <div className="h-64 bg-surface-container rounded-2xl" />
        </div>
      </div>
    );
  }

  const { top_podium, department_rankings, student_table } = data;

  return (
    <div className="w-full pb-16">
      {/* Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-bold mb-3">
          <span className="material-symbols-outlined text-[16px]">emoji_events</span>
          <span>NIE Campus Innovation Index • Academic Year 2026</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
          Campus Innovation Leaderboard
        </h1>
        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
          Celebrating student innovators, patent applicants, and cross-departmental teams leading Mysuru campus engineering advancements.
        </p>
      </div>

      {/* Podium: 2nd, 1st, 3rd Layout */}
      {top_podium.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto mb-12">
          {/* 2nd Place: Silver */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container text-center shadow-sm relative flex flex-col items-center order-2 md:order-1">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm mb-3 shadow-inner">
              2nd
            </div>
            <img
              alt={top_podium[1].name}
              src={top_podium[1].avatar_url}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-300 mb-2"
            />
            <h3 className="text-base font-bold text-on-surface">{top_podium[1].name}</h3>
            <span className="text-xs text-on-surface-variant">{top_podium[1].department}</span>
            <div className="mt-3 px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-primary">
              {top_podium[1].points} pts
            </div>
            <span className="text-[11px] text-on-surface-variant mt-2">{top_podium[1].badge_title}</span>
          </div>

          {/* 1st Place: Gold (Elevated) */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border-2 border-primary/30 text-center shadow-lg relative flex flex-col items-center order-1 md:order-2 md:-translate-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-base mb-3 shadow-md">
              1st
            </div>
            <img
              alt={top_podium[0].name}
              src={top_podium[0].avatar_url}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 mb-2"
            />
            <h3 className="text-lg font-bold text-on-surface">{top_podium[0].name}</h3>
            <span className="text-xs text-on-surface-variant">{top_podium[0].department}</span>
            <div className="mt-3 px-4 py-1.5 rounded-full bg-primary-container text-on-primary text-sm font-bold shadow-sm">
              {top_podium[0].points} pts
            </div>
            <span className="text-xs text-primary font-semibold mt-2">{top_podium[0].badge_title}</span>
          </div>

          {/* 3rd Place: Bronze */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container text-center shadow-sm relative flex flex-col items-center order-3">
            <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-900 flex items-center justify-center font-bold text-sm mb-3">
              3rd
            </div>
            <img
              alt={top_podium[2].name}
              src={top_podium[2].avatar_url}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-700/40 mb-2"
            />
            <h3 className="text-base font-bold text-on-surface">{top_podium[2].name}</h3>
            <span className="text-xs text-on-surface-variant">{top_podium[2].department}</span>
            <div className="mt-3 px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-primary">
              {top_podium[2].points} pts
            </div>
            <span className="text-[11px] text-on-surface-variant mt-2">{top_podium[2].badge_title}</span>
          </div>
        </div>
      )}

      {/* Department Rankings Cup */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container shadow-sm mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">military_tech</span>
            Department Rankings Cup
          </h2>
          <span className="text-xs text-on-surface-variant">Points aggregated across approved capstones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {department_rankings.map((dept, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2 text-center"
            >
              <div className="text-xs font-bold text-on-surface truncate">{dept.department.split(' ')[0]}</div>
              <div className="text-xl font-bold" style={{ color: dept.color_accent }}>
                {dept.total_points}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {dept.active_projects} Projects • {dept.students_count} Students
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Leaderboard Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
        <div className="p-6 border-b border-surface-container flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface">Full Campus Student Rankings</h3>
          <span className="text-xs text-on-surface-variant">Criteria: 100 base + 10/upvote + 50/team + 150/grant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-on-surface-variant uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">USN & Branch</th>
                <th className="px-6 py-3">Specialization Badge</th>
                <th className="px-6 py-3">Active Leads</th>
                <th className="px-6 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface font-medium">
              {student_table.map((st) => (
                <tr key={st.usn} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">#{st.rank}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      alt={st.name}
                      src={st.avatar_url}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-bold">{st.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-on-surface-variant">
                    {st.usn} • {st.department}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                      {st.badge_title}
                    </span>
                  </td>
                  <td className="px-6 py-4">{st.active_leads} Proposals</td>
                  <td className="px-6 py-4 text-right font-bold text-primary text-sm">{st.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
