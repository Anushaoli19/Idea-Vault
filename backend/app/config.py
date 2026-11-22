import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "NIE Idea Vault Backend"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.40"))
    HIGH_SIMILARITY_THRESHOLD: float = float(os.getenv("HIGH_SIMILARITY_THRESHOLD", "0.75"))

settings = Settings()
