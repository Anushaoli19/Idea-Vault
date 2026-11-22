from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Idea, Interest, OpenRole, Upvote, User
from app.schemas import (
    ActionResponse,
    DuplicateCheckResult,
    IdeaCheckRequest,
    IdeaCreate,
    IdeaResponse,
    UserActionRequest,
)
from app.similarity import run_similarity_check

router = APIRouter(prefix="/ideas", tags=["Ideas"])

@router.get("", response_model=List[IdeaResponse])
def list_ideas(
    q: Optional[str] = Query(None, description="Search keyword, tech stack, or author name"),
    category: Optional[str] = Query("All", description="Category filter chip"),
    department: Optional[str] = Query("All", description="Department filter"),
    sort: Optional[str] = Query("upvoted", description="Sort order: upvoted or newest"),
    db: Session = Depends(get_db),
):
    query = db.query(Idea)

    if category and category.lower() != "all":
        query = query.filter(Idea.category.ilike(f"%{category}%"))

    if department and department.lower() != "all":
        query = query.filter(Idea.department.ilike(f"%{department}%"))

    ideas = query.all()

    # In-memory keyword filtering for rich cross-field matching
    if q and q.strip():
        term = q.strip().lower()
        ideas = [
            i for i in ideas
            if term in i.title.lower()
            or term in i.summary.lower()
            or term in (i.tech_tags or "").lower()
            or term in i.author_name.lower()
            or term in i.problem_statement.lower()
        ]

    # Sorting
    if sort == "newest":
        ideas.sort(key=lambda x: x.created_at, reverse=True)
    else:
        # Default: most upvoted
        ideas.sort(key=lambda x: x.upvotes_count, reverse=True)

    return ideas

@router.get("/{id}", response_model=IdeaResponse)
def get_idea(id: str, db: Session = Depends(get_db)):
    idea = db.query(Idea).filter(Idea.id == id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found in the registry")
    return idea

@router.post("/check-duplicate", response_model=DuplicateCheckResult)
def check_duplicate(payload: IdeaCheckRequest, db: Session = Depends(get_db)):
    existing_ideas = db.query(Idea).all()
    candidate_dict = {
        "title": payload.title,
        "category": payload.category,
        "department": payload.department,
        "problem_statement": payload.problem_statement,
        "tech_tags": payload.tech_tags,
        "summary": payload.summary or payload.problem_statement[:200],
    }
    result = run_similarity_check(candidate_dict, existing_ideas)
    return result

@router.post("", response_model=IdeaResponse, status_code=status.HTTP_201_CREATED)
def create_idea(payload: IdeaCreate, db: Session = Depends(get_db)):
    # Default to Rohan S. as active submitter if not specified
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=400, detail="No active user found to associate proposal")

    new_idea = Idea(
        title=payload.title,
        category=payload.category,
        department=payload.department,
        maturity=payload.maturity,
        summary=payload.summary,
        problem_statement=payload.problem_statement,
        architecture_description=payload.architecture_description or "",
        tech_tags=payload.tech_tags,
        bill_of_materials=payload.bill_of_materials or "",
        metrics_json=payload.metrics_json or "{}",
        faculty_mentor=payload.faculty_mentor or "Dr. B. K. Sridhara (Prof. & Head)",
        author_id=user.id,
        author_name=user.name,
        author_dept=user.department,
        author_batch=user.batch,
        author_avatar=user.avatar_url,
        upvotes_count=1, # Submitter initial vote
        interested_count=0,
    )
    db.add(new_idea)
    db.commit()
    db.refresh(new_idea)

    if payload.open_roles:
        for r in payload.open_roles:
            role = OpenRole(
                idea_id=new_idea.id,
                role_title=r.role_title,
                department_required=r.department_required,
                skills_required=r.skills_required,
                total_slots=r.total_slots,
                kickoff_date=r.kickoff_date,
            )
            db.add(role)
        db.commit()
        db.refresh(new_idea)

    return new_idea

@router.post("/{id}/upvote", response_model=ActionResponse)
def toggle_upvote(id: str, action: UserActionRequest, db: Session = Depends(get_db)):
    idea = db.query(Idea).filter(Idea.id == id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    existing_vote = db.query(Upvote).filter(Upvote.idea_id == id, Upvote.user_id == action.user_id).first()
    if existing_vote:
        # Untoggle
        db.delete(existing_vote)
        idea.upvotes_count = max(0, idea.upvotes_count - 1)
        db.commit()
        return ActionResponse(success=True, message="Upvote removed", count=idea.upvotes_count, state=False)
    else:
        new_vote = Upvote(idea_id=id, user_id=action.user_id)
        db.add(new_vote)
        idea.upvotes_count += 1
        db.commit()
        return ActionResponse(success=True, message="Upvoted idea successfully", count=idea.upvotes_count, state=True)

@router.post("/{id}/interest", response_model=ActionResponse)
def toggle_interest(id: str, action: UserActionRequest, db: Session = Depends(get_db)):
    idea = db.query(Idea).filter(Idea.id == id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    existing_interest = db.query(Interest).filter(Interest.idea_id == id, Interest.user_id == action.user_id).first()
    if existing_interest:
        db.delete(existing_interest)
        idea.interested_count = max(0, idea.interested_count - 1)
        db.commit()
        return ActionResponse(success=True, message="Interest removed", count=idea.interested_count, state=False)
    else:
        new_interest = Interest(idea_id=id, user_id=action.user_id)
        db.add(new_interest)
        idea.interested_count += 1
        db.commit()
        return ActionResponse(success=True, message="Marked interested in collaborating!", count=idea.interested_count, state=True)
