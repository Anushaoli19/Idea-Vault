import {
  DuplicateCheckResult,
  IdeaItem,
  LeaderboardData,
  NotificationItem,
  OpenRole,
  UserProfile,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = {
  // Ideas
  async getIdeas(params?: { q?: string; category?: string; sort?: string; dept?: string }): Promise<IdeaItem[]> {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category) query.append('category', params.category);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.dept) query.append('department', params.dept);

    const res = await fetch(`${API_BASE}/ideas?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch ideas');
    return res.json();
  },

  async getIdea(id: string): Promise<IdeaItem> {
    const res = await fetch(`${API_BASE}/ideas/${id}`);
    if (!res.ok) throw new Error('Failed to fetch idea details');
    return res.json();
  },

  async checkDuplicate(payload: {
    title: string;
    category: string;
    department: string;
    problem_statement: string;
    tech_tags: string;
    summary?: string;
  }): Promise<DuplicateCheckResult> {
    const res = await fetch(`${API_BASE}/ideas/check-duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Duplicate check failed');
    return res.json();
  },

  async createIdea(payload: Partial<IdeaItem>): Promise<IdeaItem> {
    const res = await fetch(`${API_BASE}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create idea');
    return res.json();
  },

  async toggleUpvote(id: string, userId: string = 'usr-rohan-cse'): Promise<{ success: boolean; count: number; state: boolean }> {
    const res = await fetch(`${API_BASE}/ideas/${id}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!res.ok) throw new Error('Failed to toggle upvote');
    return res.json();
  },

  async toggleInterest(id: string, userId: string = 'usr-rohan-cse'): Promise<{ success: boolean; count: number; state: boolean }> {
    const res = await fetch(`${API_BASE}/ideas/${id}/interest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!res.ok) throw new Error('Failed to toggle interest');
    return res.json();
  },

  // Teammates
  async getOpenRoles(params?: { domain?: string; department?: string }): Promise<OpenRole[]> {
    const query = new URLSearchParams();
    if (params?.domain) query.append('domain', params.domain);
    if (params?.department) query.append('department', params.department);

    const res = await fetch(`${API_BASE}/teammates/roles?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch open roles');
    return res.json();
  },

  async applyForRole(payload: { role_id: string; applicant_id: string; note?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/teammates/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Application failed');
    return res.json();
  },

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardData> {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  },

  // Notifications
  async getNotifications(category: string = 'all', userId: string = 'usr-rohan-cse'): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications?category=${category}&user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async handleNotificationAction(id: string, action: 'accept' | 'decline'): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/notifications/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Action failed');
    return res.json();
  },

  async markAllRead(userId: string = 'usr-rohan-cse'): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read?user_id=${userId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    return res.json();
  },

  // Profile
  async getUserProfile(userId: string = 'usr-rohan-cse'): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/users/${userId}/profile`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async getUserSubmissions(userId: string = 'usr-rohan-cse'): Promise<{
    user: any;
    metrics: { active_capstones: number; total_endorsements: number; collaborator_inquiries: number; lab_status: string };
    ideas: any[];
  }> {
    const res = await fetch(`${API_BASE}/users/${userId}/submissions`);
    if (!res.ok) throw new Error('Failed to fetch user submissions');
    return res.json();
  },
};
