import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
from recommender import recommend_router, get_movie_by_id

# Load environment variables
load_dotenv()

# Initialize Grok Client (OpenAI compatible) - Async version
client = AsyncOpenAI(
    api_key=os.getenv("GROK_API_KEY"),
    base_url="https://api.x.ai/v1",
)

async def parse_user_query(query):
    """
    Uses LLM to extract recommendation parameters from user's natural language.
    """
    prompt = f"You are a movie recommendation assistant. Extract the following parameters from the user's query: movie, genres, keywords, mood. User Query: \"{query}\". Return ONLY a valid JSON object with these keys. If a parameter is not found, set it to null."

    try:
        response = await client.chat.completions.create(
            model="grok-beta",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts structured data from movie queries."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        return json.loads(content)
    except Exception as e:
        print(f"Error parsing query with LLM: {e}")
        return {"movie": None, "genres": None, "keywords": None, "mood": None}

async def explain_recommendations(query, params, recommendations):
    """
    Uses LLM to present the recommendations to the user in a friendly way.
    """
    recs_titles = [r.get("title", "Unknown") if isinstance(r, dict) else str(r) for r in recommendations]
    recs_list = "\n".join([f"- {r}" for r in recs_titles])
    prompt = f"The user asked: \"{query}\". Based on their request, we found these movies: {recs_list}. Provide a friendly, conversational response explaining why these were chosen."

    try:
        response = await client.chat.completions.create(
            model="grok-beta",
            messages=[
                {"role": "system", "content": "You are a friendly movie expert at MoodFlix."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error explaining recommendations: {e}")
        return f"Here are some recommendations for you:\n{recs_list}"

async def chat_with_moodflix(user_input):
    """
    Main entry point for the chat-based recommendation flow.
    """
    try:
        # 1. Parse intent
        params = await parse_user_query(user_input)
        
        # 2. Get recommendations from model (CPU intensive, still sync, but now async for TMDB)
        results = await recommend_router(
            movie=params.get("movie"),
            genres=params.get("genres"),
            keywords=params.get("keywords"),
            mood=params.get("mood")
        )
        
        if "error" in results:
            return {"response": results["error"], "recommendations": []}
        
        # 3. Explain and format results
        friendly_response = await explain_recommendations(user_input, params, results.get("recommendations", []))
        
        return {
            "response": friendly_response,
            "recommendations": results.get("recommendations", [])
        }

    except Exception as e:
        print(f"Error in chat_with_moodflix: {e}")
        return {
            "response": "I'm having a little trouble finding recommendations for you right now. Please try again in a moment.",
            "recommendations": []
        }
