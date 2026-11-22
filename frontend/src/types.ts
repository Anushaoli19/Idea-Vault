export interface UserProfile {
  id: string;
  usn: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  cgpa: number;
  role: string;
  avatar_url: string;
  github_url: string;
  linkedin_url: string;
  orcid_url?: string;
  points: number;
  available_for_collab: boolean;
  lab_clearances: string;
}

export interface OpenRole {
  id: string;
  idea_id?: string;
  role_title: string;
  department_required: string;
  skills_required: string;
  total_slots: number;
  filled_slots: number;
  kickoff_date: string;
  idea_title?: string;
  idea_category?: string;
  idea_department?: string;
  author_name?: string;
  author_dept?: string;
  author_avatar?: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  category: string;
  department: string;
  maturity: string;
  summary: string;
  problem_statement: string;
  architecture_description: string;
  tech_tags: string;
  bill_of_materials: string;
  metrics_json: string;
  status: string;
  author_id: string;
  author_name: string;
  author_dept: string;
  author_batch: string;
  author_avatar: string;
  upvotes_count: number;
  interested_count: number;
  faculty_mentor: string;
  lab_status: string;
  created_at: string;
  updated_at: string;
  open_roles?: OpenRole[];
}

export interface SimilarityBreakdown {
  overall_match: number;
  problem_context_match: number;
  hardware_tech_match: number;
  target_demographic_match: number;
}

export interface ConflictingProject {
  id: string;
  title: string;
  category: string;
  department: string;
  summary: string;
  author_name: string;
  author_dept: string;
  author_avatar: string;
  tech_tags: string;
  open_roles_count: number;
}

export interface DuplicateCheckResult {
  is_duplicate: boolean;
  similarity_score: number;
  percentage_match: number;
  level: 'green' | 'yellow' | 'amber';
  message: string;
  breakdown: SimilarityBreakdown;
  conflicting_project?: ConflictingProject;
  suggested_actions: string[];
}

export interface InnovatorPodiumEntry {
  rank: number;
  name: string;
  usn: string;
  department: string;
  batch: string;
  points: number;
  avatar_url: string;
  badge_title: string;
  active_leads: number;
  cross_dept_teams: number;
}

export interface DepartmentRankingEntry {
  department: string;
  total_points: number;
  active_projects: number;
  students_count: number;
  color_accent: string;
}

export interface LeaderboardData {
  top_podium: InnovatorPodiumEntry[];
  department_rankings: DepartmentRankingEntry[];
  student_table: InnovatorPodiumEntry[];
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  action_link: string;
  applicant_id?: string;
  applicant_name?: string;
  applicant_dept?: string;
  role_id?: string;
  role_title?: string;
  is_actionable: boolean;
  action_status: string;
  is_read: boolean;
  created_at: string;
}
