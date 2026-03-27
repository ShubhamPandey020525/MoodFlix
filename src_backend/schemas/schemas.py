from pydantic import BaseModel
from typing import Optional, List

# Recommendation Schemas
class ChatQuery(BaseModel):
    message: str

class Movie(BaseModel):
    id: int
    title: str
    poster_path: Optional[str] = None
    genres: List[str] = []
    rating: Optional[float] = 0.0
    year: Optional[int] = 0
    description: Optional[str] = ""
    keywords: List[str] = []
    mood: List[str] = []

class ChatResponse(BaseModel):
    response: str
    recommendations: List[Movie]
