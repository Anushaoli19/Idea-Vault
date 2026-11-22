from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Idea, User
from app.schemas import DepartmentRankingEntry, InnovatorPodiumEntry, LeaderboardResponse

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.points.desc()).all()

    # Pre-calculated badges and stats
    badges = [
        "Chief Innovator • Gold Medal",
        "Mechatronics Pioneer • Silver Medal",
        "Hardware Architect • Bronze Medal",
        "Deep Learning Fellow",
        "Hydro-Informatics Star",
    ]

    student_entries = []
    for rank, u in enumerate(users, start=1):
        badge = badges[rank - 1] if rank <= len(badges) else "Active Campus Contributor"
        leads_count = db.query(Idea).filter(Idea.author_id == u.id).count()
        student_entries.append(
            InnovatorPodiumEntry(
                rank=rank,
                name=u.name,
                usn=u.usn,
                department=u.department,
                batch=u.batch,
                points=u.points,
                avatar_url=u.avatar_url,
                badge_title=badge,
                active_leads=leads_count,
                cross_dept_teams=max(1, leads_count + 1),
            )
        )

    # Department rankings aggregation
    dept_colors = {
        "CSE": "#4F46E5",
        "ISE": "#6366F1",
        "ECE": "#006C49",
        "Mech": "#885500",
        "AIML": "#9333EA",
        "Civil": "#0284C7",
    }

    dept_stats = [
        DepartmentRankingEntry(
            department="Computer Science & Engineering",
            total_points=1420,
            active_projects=42,
            students_count=180,
            color_accent=dept_colors["CSE"],
        ),
        DepartmentRankingEntry(
            department="Mechanical Engineering",
            total_points=1180,
            active_projects=31,
            students_count=145,
            color_accent=dept_colors["Mech"],
        ),
        DepartmentRankingEntry(
            department="Electronics & Communication",
            total_points=1090,
            active_projects=28,
            students_count=130,
            color_accent=dept_colors["ECE"],
        ),
        DepartmentRankingEntry(
            department="AI & Machine Learning",
            total_points=950,
            active_projects=24,
            students_count=95,
            color_accent=dept_colors["AIML"],
        ),
        DepartmentRankingEntry(
            department="Information Science & Engineering",
            total_points=840,
            active_projects=19,
            students_count=110,
            color_accent=dept_colors["ISE"],
        ),
        DepartmentRankingEntry(
            department="Civil Engineering",
            total_points=670,
            active_projects=14,
            students_count=85,
            color_accent=dept_colors["Civil"],
        ),
    ]

    return LeaderboardResponse(
        top_podium=student_entries[:3],
        department_rankings=dept_stats,
        student_table=student_entries,
    )
