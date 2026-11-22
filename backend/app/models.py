import uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    usn = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)
    batch = Column(String, nullable=False)
    cgpa = Column(Float, default=9.0)
    role = Column(String, default="student")
    avatar_url = Column(String, default="")
    github_url = Column(String, default="")
    linkedin_url = Column(String, default="")
    orcid_url = Column(String, default="")
    points = Column(Integer, default=100)
    available_for_collab = Column(Boolean, default=True)
    lab_clearances = Column(String, default="IoT Lab (Block C), Robotics Testbed")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Idea(Base):
    __tablename__ = "ideas"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True) # AI/ML, Web, IoT, App, Other
    department = Column(String, nullable=False, index=True) # CSE, ISE, ECE, Mech, AIML, Civil
    maturity = Column(String, default="Concept") # Concept, Prototype, Validation
    summary = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    architecture_description = Column(Text, default="")
    tech_tags = Column(String, default="") # comma-separated: ESP32, OpenCV, React
    bill_of_materials = Column(Text, default="")
    metrics_json = Column(Text, default="{}") # e.g. {"daily_waste_reduction": "45 kg", "latency": "120ms"}
    status = Column(String, default="Approved & Open") # Approved & Open, Under Faculty Review, Team Formed, Draft
    faculty_mentor = Column(String, default="Dr. B. K. Sridhara (Prof. & Head)")
    lab_status = Column(String, default="Cleared for Bench 4, ECE Embedded Lab")
    
    author_id = Column(String, ForeignKey("users.id"), nullable=False)
    author_name = Column(String, nullable=False)
    author_dept = Column(String, nullable=False)
    author_batch = Column(String, nullable=False)
    author_avatar = Column(String, default="")
    
    upvotes_count = Column(Integer, default=0)
    interested_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    open_roles = relationship("OpenRole", back_populates="idea", cascade="all, delete-orphan")

class OpenRole(Base):
    __tablename__ = "open_roles"

    id = Column(String, primary_key=True, default=generate_uuid)
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False)
    role_title = Column(String, nullable=False) # e.g., "ECE Embedded Systems Engineer"
    department_required = Column(String, default="Any") # ECE, CSE, etc.
    skills_required = Column(String, default="") # "C++, FreeRTOS, ESP32"
    total_slots = Column(Integer, default=2)
    filled_slots = Column(Integer, default=0)
    kickoff_date = Column(String, default="Upcoming Sprint")

    idea = relationship("Idea", back_populates="open_roles")
    applications = relationship("Application", back_populates="role", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    role_id = Column(String, ForeignKey("open_roles.id"), nullable=False)
    applicant_id = Column(String, ForeignKey("users.id"), nullable=False)
    applicant_name = Column(String, nullable=False)
    applicant_dept = Column(String, nullable=False)
    applicant_batch = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, accepted, declined
    note = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    role = relationship("OpenRole", back_populates="applications")

class Upvote(Base):
    __tablename__ = "upvotes"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Interest(Base):
    __tablename__ = "interests"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, default="teammates") # teammates, upvotes, comments, grants
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    action_link = Column(String, default="")
    applicant_id = Column(String, default="")
    applicant_name = Column(String, default="")
    applicant_dept = Column(String, default="")
    role_id = Column(String, default="")
    role_title = Column(String, default="")
    is_actionable = Column(Boolean, default=False)
    action_status = Column(String, default="") # accepted, declined, pending
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
