import sys
import os
from fastapi import FastAPI, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

# Internal imports
from .schemas.schemas import (
    ChatQuery, ChatResponse
)

# Paths for AI src imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(os.path.dirname(CURRENT_DIR), "src_ai", "src"))
from llm_recommender import chat_with_moodflix, get_movie_by_id

app = FastAPI(title="MoodFlix API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "Welcome to MoodFlix API"}

@app.post("/chat", response_model=ChatResponse)
async def chat(query: ChatQuery):
    """
    Connects frontend message to Grok LLM and ML Models.
    """
    try:
        # Get raw data from AI engine
        data = await chat_with_moodflix(query.message)
        
        # Safety-net mapping to ChatResponse schema
        response_text = str(data.get("response", "I found some movies for you!"))
        recommendations = data.get("recommendations", [])
        
        if not isinstance(recommendations, list):
            recommendations = []

        return {
            "response": response_text,
            "recommendations": recommendations
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {str(e)}")

@app.get("/movie/{movie_id}")
async def get_movie(movie_id: int):
    """
    Fetch single movie details by ID for the details page.
    """
    movie = await get_movie_by_id(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie
