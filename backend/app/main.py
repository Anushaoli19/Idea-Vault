from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routes import ideas, leaderboard, notifications, teammates, users
from app.seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    # Seed initial data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="NIE Idea Vault REST API with Scikit-Learn TF-IDF Duplicate Detection Engine",
    version="1.0.0",
    lifespan=lifespan,
)

# Enforce strict CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "NIE Idea Vault API",
        "similarity_engine": "Scikit-Learn TF-IDF Online",
        "institution": "The National Institute of Engineering, Mysuru",
    }

# Include API routers
app.include_router(ideas.router, prefix=settings.API_V1_PREFIX)
app.include_router(teammates.router, prefix=settings.API_V1_PREFIX)
app.include_router(leaderboard.router, prefix=settings.API_V1_PREFIX)
app.include_router(notifications.router, prefix=settings.API_V1_PREFIX)
app.include_router(users.router, prefix=settings.API_V1_PREFIX)
