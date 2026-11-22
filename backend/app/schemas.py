from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict, Field

# User Schemas
class UserBase(BaseModel):
    usn: str
    name: str
    email: str
    department: str
    batch: str
    cgpa: float = 9.0
    role: str = "student"
    avatar_url: str = ""
    github_url: str = ""
    linkedin_url: str = ""
    orcid_url: str = ""
    points: int = 100
    available_for_collab: bool = True
    lab_clearances: str = ""

class UserResponse(UserBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    batch: Optional[str] = None
    cgpa: Optional[float] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    orcid_url: Optional[str] = None
    available_for_collab: Optional[bool] = None
    lab_clearances: Optional[str] = None

# Open Role Schemas
class OpenRoleCreate(BaseModel):
    role_title: str
    department_required: str = "Any"
    skills_required: str = ""
    total_slots: int = 2
    kickoff_date: str = "Upcoming Sprint"

class OpenRoleResponse(BaseModel):
    id: str
    idea_id: str
    role_title: str
    department_required: str
    skills_required: str
    total_slots: int
    filled_slots: int
    kickoff_date: str
    model_config = ConfigDict(from_attributes=True)

# Idea Schemas
class IdeaCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    category: str
    department: str
    maturity: str = "Concept"
    summary: str
    problem_statement: str
    architecture_description: Optional[str] = ""
    tech_tags: str = ""
    bill_of_materials: Optional[str] = ""
    metrics_json: Optional[str] = "{}"
    faculty_mentor: Optional[str] = "Dr. B. K. Sridhara (Prof. & Head)"
    open_roles: Optional[List[OpenRoleCreate]] = []

class IdeaResponse(BaseModel):
    id: str
    title: str
    category: str
    department: str
    maturity: str
    summary: str
    problem_statement: str
    architecture_description: str
    tech_tags: str
    bill_of_materials: str
    metrics_json: str
    status: str
    author_id: str
    author_name: str
    author_dept: str
    author_batch: str
    author_avatar: str
    upvotes_count: int
    interested_count: int
    faculty_mentor: str
    lab_status: str
    created_at: datetime
    updated_at: datetime
    open_roles: List[OpenRoleResponse] = []
    model_config = ConfigDict(from_attributes=True)

# Duplicate Similarity Schemas
class IdeaCheckRequest(BaseModel):
    title: str
    category: str
    department: str
    problem_statement: str
    tech_tags: str = ""
    summary: Optional[str] = ""

class SimilarityBreakdown(BaseModel):
    overall_match: int
    problem_context_match: int
    hardware_tech_match: int
    target_demographic_match: int

class ConflictingProjectSummary(BaseModel):
    id: str
    title: str
    category: str
    department: str
    summary: str
    author_name: str
    author_dept: str
    author_avatar: str
    tech_tags: str
    open_roles_count: int

class DuplicateCheckResult(BaseModel):
    is_duplicate: bool
    similarity_score: float
    percentage_match: int
    level: str # green, yellow, red/amber
    message: str
    breakdown: SimilarityBreakdown
    conflicting_project: Optional[ConflictingProjectSummary] = None
    suggested_actions: List[str]

# Actions Schemas
class UserActionRequest(BaseModel):
    user_id: str

class ActionResponse(BaseModel):
    success: bool
    message: str
    count: Optional[int] = None
    state: Optional[bool] = None

class RoleApplyRequest(BaseModel):
    role_id: str
    applicant_id: str
    note: Optional[str] = ""

class RoleApplyResponse(BaseModel):
    success: bool
    application_id: str
    message: str

# Leaderboard Schemas
class InnovatorPodiumEntry(BaseModel):
    rank: int
    name: str
    usn: str
    department: str
    batch: str
    points: int
    avatar_url: str
    badge_title: str
    active_leads: int
    cross_dept_teams: int

class DepartmentRankingEntry(BaseModel):
    department: str
    total_points: int
    active_projects: int
    students_count: int
    color_accent: str

class LeaderboardResponse(BaseModel):
    top_podium: List[InnovatorPodiumEntry]
    department_rankings: List[DepartmentRankingEntry]
    student_table: List[InnovatorPodiumEntry]

# Notification Schemas
class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    action_link: str
    applicant_id: str
    applicant_name: str
    applicant_dept: str
    role_id: str
    role_title: str
    is_actionable: bool
    action_status: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class NotificationActionRequest(BaseModel):
    action: str # "accept" or "decline"
