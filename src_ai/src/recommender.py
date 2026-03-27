import os
import pickle
import httpx
import asyncio
import pandas as pd
from dotenv import load_dotenv
from difflib import get_close_matches
from sklearn.metrics.pairwise import cosine_similarity

# -------------------------
# Config + env
# -------------------------
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie"
TMDB_DETAIL_URL = "https://api.themoviedb.org/3/movie/{}"

TOP_K = 100

# -------------------------
# Load artifacts (once)
# -------------------------
# Use absolute path relative to the current file to make it deployment-friendly
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.getenv("MODELS_DIR", os.path.join(BASE_DIR, "models"))

try:
    movies = pickle.load(open(os.path.join(MODELS_DIR, "movies.pkl"), "rb"))        # DataFrame with 'title' & (optionally) tags/overview
    vectors = pickle.load(open(os.path.join(MODELS_DIR, "vectors.pkl"), "rb"))      # ndarray (n_movies x n_features)
    vectorizer = pickle.load(open(os.path.join(MODELS_DIR, "vectorizer.pkl"), "rb"))# fitted CountVectorizer or similar
    similarity = pickle.load(open(os.path.join(MODELS_DIR, "similarity.pkl"), "rb"))# precomputed similarity matrix
except Exception as e:
    # Fallback for local development if MODELS_DIR fails
    LOCAL_MODELS_DIR = r"C:\Users\pande\MoodFlix\src_ai\models"
    try:
        movies = pickle.load(open(os.path.join(LOCAL_MODELS_DIR, "movies.pkl"), "rb"))
        vectors = pickle.load(open(os.path.join(LOCAL_MODELS_DIR, "vectors.pkl"), "rb"))
        vectorizer = pickle.load(open(os.path.join(LOCAL_MODELS_DIR, "vectorizer.pkl"), "rb"))
        similarity = pickle.load(open(os.path.join(LOCAL_MODELS_DIR, "similarity.pkl"), "rb"))
    except:
        raise RuntimeError(f"Missing or unreadable model files in {MODELS_DIR} or {LOCAL_MODELS_DIR}.") from e

titles = movies["title"].astype(str).values
lower_titles = [t.lower() for t in titles]
lower_to_index = {t.lower(): idx for idx, t in enumerate(titles)}

# -------------------------
# Mood map (extendable)
# -------------------------
mood_map = {
    "happy": "comedy fun family uplifting",
    "sad": "drama emotional melancholic relationship",
    "romantic": "romance love relationship sentimental",
    "thrilled": "action thriller suspense",
    "scared": "horror supernatural thriller",
    "inspired": "biography motivation true story",
}

# -------------------------
# Helpers
# -------------------------
def pd_notnull(v):
    return v is not None and (not (isinstance(v, float) and (v != v)))

def format_movie_record(movie_data, idx=0):
    """
    Ensures a movie record (dict) matches the Movie schema in src_backend/schemas/schemas.py
    """
    def to_list(val):
        if not pd_notnull(val): return []
        if isinstance(val, list): return val
        if isinstance(val, str): return [s.strip() for s in val.split(",") if s.strip()]
        return []

    try:
        title = str(movie_data.get("title", "Unknown"))
        poster = movie_data.get("poster_path")
        
        return {
            "id": int(movie_data.get("id", idx)),
            "title": title,
            "poster_path": str(poster) if pd_notnull(poster) else None,
            "genres": to_list(movie_data.get("genres")),
            "rating": float(movie_data.get("rating", movie_data.get("vote_average", 0.0))) if pd_notnull(movie_data.get("rating")) or pd_notnull(movie_data.get("vote_average")) else 0.0,
            "year": int(movie_data.get("year", 0)) if pd_notnull(movie_data.get("year")) else 0,
            "description": str(movie_data.get("overview", movie_data.get("description", ""))),
            "keywords": to_list(movie_data.get("keywords")),
            "mood": to_list(movie_data.get("mood"))
        }
    except Exception as e:
        print(f"[RECO] Formatting error for {movie_data.get('title')}: {e}")
        return {
            "id": idx, "title": str(movie_data.get("title", "Unknown")), "poster_path": None,
            "genres": [], "rating": 0.0, "year": 0, "description": "", "keywords": [], "mood": []
        }

async def fetch_metadata_tmdb_async(movie_title, year=None):
    if not TMDB_API_KEY:
        return {"genres": "", "overview": movie_title, "poster_path": None}
    
    try:
        raw_title = str(movie_title).strip()
        clean_title = raw_title.split("(")[0].split(" - ")[0].split(": ")[0].strip()
        
        search_year = None
        if year and pd_notnull(year):
            try:
                search_year = int(float(year))
                if search_year < 1900 or search_year > 2030:
                    search_year = None
            except:
                search_year = None

        search_attempts = [
            {"query": clean_title, "year": search_year},
            {"query": raw_title, "year": search_year},
            {"query": clean_title},
            {"query": raw_title},
            {"query": clean_title.split(":")[0].split("-")[0].strip()}
        ]

        async with httpx.AsyncClient() as client:
            for params in search_attempts:
                if not params.get("query"): continue
                search_params = {"api_key": TMDB_API_KEY, **params}
                r = await client.get(TMDB_SEARCH_URL, params=search_params, timeout=5)
                r.raise_for_status()
                results = r.json().get("results", [])
                if results:
                    break

        if not results:
            return {"genres": "", "overview": movie_title, "poster_path": None}
        
        match = results[0]
        return {
            "genres": "", 
            "overview": match.get("overview", "") or "", 
            "poster_path": match.get("poster_path"),
            "vote_average": match.get("vote_average", 0.0)
        }
    except Exception as e:
        print(f"[TMDB] Async request error for {movie_title}: {e}")
        return {"genres": "", "overview": movie_title, "poster_path": None}

async def enrich_movie_with_poster_async(movie_dict):
    if not pd_notnull(movie_dict.get("poster_path")):
        tmdb = await fetch_metadata_tmdb_async(movie_dict["title"], year=movie_dict.get("year"))
        if tmdb.get("poster_path"):
            movie_dict["poster_path"] = tmdb["poster_path"]
            if not movie_dict.get("description") or len(movie_dict["description"]) < 10:
                movie_dict["description"] = tmdb["overview"]
            if movie_dict.get("rating") == 0:
                movie_dict["rating"] = tmdb["vote_average"]
    return movie_dict

# -------------------------
# Core recommenders
# -------------------------
def recommend_existing_by_index(movie_index, top_k=TOP_K):
    row = similarity[movie_index]
    ranked = sorted(list(enumerate(row)), key=lambda x: x[1], reverse=True)
    results = []
    for idx, score in ranked:
        if idx == movie_index: continue
        results.append(format_movie_record(movies.iloc[idx].to_dict(), idx))
        if len(results) >= top_k: break
    return results

def recommend_dynamic(new_tags, top_k=TOP_K):
    new_vec = vectorizer.transform([new_tags]).toarray()
    scores = cosine_similarity(new_vec, vectors)[0]
    ranked = sorted(list(enumerate(scores)), key=lambda x: x[1], reverse=True)
    results = []
    for idx, score in ranked:
        results.append(format_movie_record(movies.iloc[idx].to_dict(), idx))
        if len(results) >= top_k: break
    return results

# Alias for compatibility
def recommend_by_tags(tags, top_k=TOP_K):
    return recommend_dynamic(tags, top_k=top_k)

async def recommend_router(movie=None, genres=None, keywords=None, mood=None, top_k=TOP_K):
    movie_in = movie.strip() if (movie and movie.strip()) else None
    genres_in = genres.strip() if (genres and genres.strip()) else None
    keywords_in = keywords.strip() if (keywords and keywords.strip()) else None
    mood_in = mood.strip() if (mood and mood.strip()) else None

    recs = []
    path = ""

    if movie_in:
        lower_movie = movie_in.lower()
        if lower_movie in lower_to_index:
            idx = lower_to_index[lower_movie]
            if genres_in or keywords_in or mood_in:
                movie_tags = str(movies.loc[idx, "tags"]) if "tags" in movies.columns and pd_notnull(movies.loc[idx, "tags"]) else movie_in
                user_tags = build_user_tags(genres_in, keywords_in, mood_in)
                combined_tags = f"{movie_tags} {user_tags}".strip()
                recs = recommend_by_tags(combined_tags, top_k=top_k)
                path = "combined_tags"
            else:
                recs = recommend_existing_by_index(idx, top_k=top_k)
                path = "dataset_exact"
        else:
            match = get_close_matches(lower_movie, lower_titles, n=1, cutoff=0.7)
            if match:
                matched_idx = lower_to_index[match[0]]
                if genres_in or keywords_in or mood_in:
                    movie_tags = str(movies.loc[matched_idx, "tags"]) if "tags" in movies.columns and pd_notnull(movies.loc[matched_idx, "tags"]) else titles[matched_idx]
                    user_tags = build_user_tags(genres_in, keywords_in, mood_in)
                    combined_tags = f"{movie_tags} {user_tags}".strip()
                    recs = recommend_by_tags(combined_tags, top_k=top_k)
                    path = "combined_tags_fuzzy"
                else:
                    recs = recommend_existing_by_index(matched_idx, top_k=top_k)
                    path = "dataset_fuzzy"
            else:
                meta = await fetch_metadata_tmdb_async(movie_in)
                base_tags = f"{meta.get('genres','')} {meta.get('overview','')}".strip()
                user_tags = build_user_tags(genres_in, keywords_in, mood_in)
                combined = f"{base_tags} {user_tags}".strip() if user_tags else (base_tags or movie_in)
                recs = recommend_by_tags(combined, top_k=top_k)
                path = "dynamic_tmdb"

    elif genres_in or keywords_in or mood_in:
        tags = build_user_tags(genres_in, keywords_in, mood_in)
        recs = recommend_dynamic(tags, top_k=top_k)
        path = "mood_only" if (not genres_in and not keywords_in and mood_in) else "tags_only"
    
    if not recs:
        recs = [format_movie_record(row, i) for i, row in movies.sample(min(top_k, len(movies))).iterrows()]
        path = "random_fallback"

    # SPEED FIX: Use parallel tasks to fetch posters for ALL recommendations
    if TMDB_API_KEY:
        tasks = [enrich_movie_with_poster_async(r) for r in recs]
        recs = await asyncio.gather(*tasks)

    return {"path": path, "recommendations": recs}

def build_user_tags(genres, keywords, mood):
    parts = []
    if genres: parts.append(genres)
    if keywords: parts.append(keywords)
    if mood: parts.append(mood_map.get(mood.lower(), mood))
    return " ".join([p for p in parts if p]).strip()

async def get_movie_by_id(movie_id):
    """
    Finds a movie in the dataframe by its ID and enriches it with TMDB data if needed.
    """
    try:
        movie_data = None
        
        # 1. Search in dataframe
        if "id" in movies.columns:
            matches = movies[movies["id"] == movie_id]
            if not matches.empty:
                movie_data = matches.iloc[0].to_dict()
        
        if movie_data is None and 0 <= movie_id < len(movies):
            movie_data = movies.iloc[movie_id].to_dict()
            
        if movie_data:
            formatted = format_movie_record(movie_data, movie_id)
            return await enrich_movie_with_poster_async(formatted)
            
        return None
    except Exception as e:
        print(f"[RECO] Error fetching movie by ID {movie_id}: {e}")
        return None
