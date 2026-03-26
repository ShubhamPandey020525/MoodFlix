import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from recommender import recommend_router

# Load environment variables
load_dotenv()

# Initialize Grok Client (OpenAI compatible)
client = OpenAI(
    api_key=os.getenv("GROK_API_KEY"),
    base_url="https://api.x.ai/v1",
)

def parse_user_query(query):
    """
    Uses LLM to extract recommendation parameters from user's natural language.
    """
    prompt = f"""
    You are a movie recommendation assistant. Extract the following parameters from the user's query:
    - movie: (string) A specific movie name mentioned as a reference.
    - genres: (string) Comma-separated list of genres (e.g., "action, comedy").
    - keywords: (string) Specific plot points or themes (e.g., "space travel, dogs").
    - mood: (string) The user's current mood (e.g., "happy", "sad", "scared").

    User Query: "{query}"

    Return ONLY a valid JSON object with these keys. If a parameter is not found, set it to null.
    Example: {{"movie": "Inception", "genres": "thriller", "keywords": "dreams", "mood": "inspired"}}
    """

    try:
        response = client.chat.completions.create(
            model="grok-beta", # Or the current available Grok model
            messages=[
                {{"role": "system", "content": "You are a helpful assistant that extracts structured data from movie queries."}},
                {{"role": "user", "content": prompt}}
            ],
            temperature=0,
        )
        content = response.choices[0].message.content.strip()
        # Handle cases where LLM might wrap JSON in markdown blocks
        if content.startswith("```json"):
            content = content[7:-3].strip()
        return json.loads(content)
    except Exception as e:
        print(f"Error parsing query with LLM: {{e}}")
        return {{"movie": None, "genres": None, "keywords": None, "mood": None}}

def explain_recommendations(query, params, recommendations):
    """
    Uses LLM to present the recommendations to the user in a friendly way.
    """
    recs_list = "\n".join([f"- {{r}}" for r in recommendations])
    prompt = f"""
    The user asked: "{query}"
    Based on their request, we extracted these filters: {{params}}
    Our recommendation engine found these movies:
    {{recs_list}}

    Please provide a friendly, conversational response to the user. 
    Explain briefly why these movies were chosen based on their mood or preferences.
    Keep it concise and engaging.
    """

    try:
        response = client.chat.completions.create(
            model="grok-beta",
            messages=[
                {{"role": "system", "content": "You are a friendly movie expert at MoodFlix."}},
                {{"role": "user", "content": prompt}}
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error explaining recommendations: {{e}}")
        return f"Here are some recommendations for you:\n{{recs_list}}"

def chat_with_moodflix(user_input):
    """
    Main entry point for the chat-based recommendation flow.
    """
    # 1. Parse intent
    params = parse_user_query(user_input)
    
    # 2. Get recommendations from model
    # recommend_router handles None values internally
    results = recommend_router(
        movie=params.get("movie"),
        genres=params.get("genres"),
        keywords=params.get("keywords"),
        mood=params.get("mood")
    )
    
    if "error" in results:
        return results["error"]
    
    # 3. Explain and format results
    friendly_response = explain_recommendations(user_input, params, results["recommendations"])
    return friendly_response

if __name__ == "__main__":
    print("Welcome to MoodFlix AI! How are you feeling today?")
    while True:
        user_msg = input("\nYou: ").strip()
        if user_msg.lower() in ["exit", "quit", "bye"]:
            break
        response = chat_with_moodflix(user_msg)
        print(f"\nMoodFlix: {{response}}")
