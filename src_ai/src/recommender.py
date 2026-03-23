# src/recommender.py
"""
Combined recommender CLI:
 - Accepts any combination of: movie, genres, keywords, mood (user can skip any).
 - Priorities & behavior:
    * If movie provided -> try exact (case-insensitive) match in dataset.
      - If exact or FUZZY match found -> by default USE precomputed similarity (fast).
      - If movie matched AND user also provided genres/keywords/mood -> build combined tags
        (movie metadata + user inputs) and use dynamic vector-based similarity so preferences blend.
      - If movie not found in dataset -> fetch TMDB metadata (if TMDB key present), combine with
        user inputs and use vector-based similarity (dynamic).
    * If movie NOT provided -> build tags from genres/keywords/mood and use vector-based similarity.
 - Outputs top 20 recommendations (titles) and prints which path was used.
 - Uses existing saved artifacts in models/: movies.pkl, vectors.pkl, vectorizer.pkl, similarity.pkl
"""

import os
import pickle
import requests
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

TOP_K = 20

# -------------------------
# Load artifacts (once)
# -------------------------
try:
    movies = pickle.load(open("models/movies.pkl", "rb"))        # DataFrame with 'title' & (optionally) tags/overview
    vectors = pickle.load(open("models/vectors.pkl", "rb"))      # ndarray (n_movies x n_features)
    vectorizer = pickle.load(open("models/vectorizer.pkl", "rb"))# fitted CountVectorizer or similar
    similarity = pickle.load(open("models/similarity.pkl", "rb"))# precomputed similarity matrix
except Exception as e:
    raise RuntimeError("Missing or unreadable model files in models/ directory.") from e

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
    # add more as needed
}

# -------------------------
# Helper: TMDB metadata fetch
# -------------------------
def fetch_metadata_tmdb(movie_title):
    """
    Returns dict: {'genres': 'g1 g2', 'overview': '...'}
    If TMDB not configured or not found, returns fallback with overview=movie_title.
    """
    if not TMDB_API_KEY:
        return {"genres": "", "overview": movie_title}

    try:
        r = requests.get(TMDB_SEARCH_URL, params={"api_key": TMDB_API_KEY, "query": movie_title}, timeout=8)
        r.raise_for_status()
        results = r.json().get("results", [])
        if not results:
            return {"genres": "", "overview": movie_title}

        movie_id = results[0]["id"]
        r2 = requests.get(TMDB_DETAIL_URL.format(movie_id), params={"api_key": TMDB_API_KEY}, timeout=8)
        r2.raise_for_status()
        details = r2.json()
        genres = " ".join([g.get("name", "") for g in details.get("genres", [])]).strip()
        overview = details.get("overview", "") or ""
        return {"genres": genres, "overview": overview}
    except Exception:
        return {"genres": "", "overview": movie_title}

# -------------------------
# Core recommenders
# -------------------------
def recommend_existing_by_index(movie_index, top_k=TOP_K):
    row = similarity[movie_index]
    ranked = sorted(list(enumerate(row)), key=lambda x: x[1], reverse=True)
    results = []
    for idx, score in ranked:
        if idx == movie_index:
            continue
        results.append(titles[idx])
        if len(results) >= top_k:
            break
    return results

def recommend_by_tags(tags, top_k=TOP_K):
    # tags -> vector -> cosine similarity with dataset vectors
    new_vec = vectorizer.transform([tags]).toarray()
    scores = cosine_similarity(new_vec, vectors)[0]
    ranked = sorted(list(enumerate(scores)), key=lambda x: x[1], reverse=True)
    results = [titles[idx] for idx, s in ranked[:top_k]]
    return results

# -------------------------
# Router that handles combinations
# -------------------------
def recommend_router(movie=None, genres=None, keywords=None, mood=None, fuzzy_cutoff=0.6, top_k=TOP_K):
    """
    movie, genres, keywords, mood are strings or None.
    Returns dictionary:
      { "path": <one of: dataset_exact, dataset_fuzzy, dynamic_tmdb, combined_tags, mood_only, tags_only>,
        "used_title_or_tags": ...,
        "recommendations": [titles...] }
    Rules:
      - If movie provided: try exact (case-insensitive). If found -> dataset_exact (fast).
      - If movie provided but not exact: try fuzzy against dataset. If fuzzy match found -> dataset_fuzzy (fast).
      - If movie provided AND any of genres/keywords/mood are provided -> build combined tags (movie metadata + user inputs)
         and use recommend_by_tags (path 'combined_tags') so user preferences are blended.
      - If movie NOT in dataset or user requested blending -> dynamic path:
         fetch TMDB metadata (if available), combine with user inputs, and use recommend_by_tags (path 'dynamic_tmdb').
      - If only genres/keywords/mood provided (no movie) -> build tags and use recommend_by_tags (path 'tags_only' or 'mood_only').
    """
    # normalize inputs
    movie_in = (movie.strip() if movie and movie.strip() else None)
    genres_in = (genres.strip() if genres and genres.strip() else None)
    keywords_in = (keywords.strip() if keywords and keywords.strip() else None)
    mood_in = (mood.strip().lower() if mood and mood.strip() else None)

    # 1) If movie provided -> check dataset exact
    if movie_in:
        lower_movie = movie_in.lower()
        if lower_movie in lower_to_index:
            # exact found
            idx = lower_to_index[lower_movie]
            # if user also provided extra filters -> blend via tags
            if genres_in or keywords_in or mood_in:
                # build combined tags: dataset movie metadata if available + user inputs
                # try to use movies['tags'] or movies columns if present
                movie_tags = ""
                if "tags" in movies.columns:
                    movie_tags = str(movies.loc[idx, "tags"]) if pd_notnull(movies.loc[idx, "tags"]) else ""
                # fallback to title if no tags
                if not movie_tags:
                    movie_tags = movie_in
                user_tags = build_user_tags(genres_in, keywords_in, mood_in)
                combined_tags = f"{movie_tags} {user_tags}".strip()
                recs = recommend_by_tags(combined_tags, top_k=top_k)
                return {"path": "combined_tags", "used_title_or_tags": combined_tags, "recommendations": recs}
            # else pure dataset exact fast path
            recs = recommend_existing_by_index(idx, top_k=top_k)
            return {"path": "dataset_exact", "used_title_or_tags": titles[idx], "recommendations": recs}

        # 2) not exact -> fuzzy against dataset titles (only to find if user meant dataset movie)
        match = get_close_matches(lower_movie, lower_titles, n=1, cutoff=fuzzy_cutoff)
        if match:
            matched_lower = match[0]
            matched_idx = lower_to_index[matched_lower]
            # same blending rule: if extra inputs provided, blend via tags; else fast fuzzy path
            if genres_in or keywords_in or mood_in:
                movie_tags = ""
                if "tags" in movies.columns:
                    movie_tags = str(movies.loc[matched_idx, "tags"]) if pd_notnull(movies.loc[matched_idx, "tags"]) else ""
                if not movie_tags:
                    movie_tags = titles[matched_idx]
                user_tags = build_user_tags(genres_in, keywords_in, mood_in)
                combined_tags = f"{movie_tags} {user_tags}".strip()
                recs = recommend_by_tags(combined_tags, top_k=top_k)
                return {"path": "combined_tags_fuzzy", "used_title_or_tags": combined_tags, "recommendations": recs}
            recs = recommend_existing_by_index(matched_idx, top_k=top_k)
            return {"path": "dataset_fuzzy", "used_title_or_tags": titles[matched_idx], "recommendations": recs}

        # 3) movie provided but not found in dataset -> dynamic TMDB + user inputs
        meta = fetch_metadata_tmdb(movie_in)
        base_tags = f"{meta.get('genres','')} {meta.get('overview','')}".strip()
        user_tags = build_user_tags(genres_in, keywords_in, mood_in)
        combined = f"{base_tags} {user_tags}".strip() if user_tags else (base_tags or movie_in)
        recs = recommend_by_tags(combined, top_k=top_k)
        return {"path": "dynamic_tmdb", "used_title_or_tags": combined, "recommendations": recs}

    # 4) No movie provided: use genres/keywords/mood
    if genres_in or keywords_in or mood_in:
        tags = build_user_tags(genres_in, keywords_in, mood_in)
        recs = recommend_by_tags(tags, top_k=top_k)
        path = "mood_only" if (not genres_in and not keywords_in and mood_in) else "tags_only"
        return {"path": path, "used_title_or_tags": tags, "recommendations": recs}

    # 5) nothing provided
    return {"error": "No valid input provided. Provide movie or genres/keywords/mood."}

# -------------------------
# Small helpers
# -------------------------
def pd_notnull(v):
    # lightweight helper to check pandas-like not-null without importing pandas in top scope
    return v is not None and (not (isinstance(v, float) and (v != v)))  # NaN check

def build_user_tags(genres, keywords, mood):
    parts = []
    if genres:
        parts.append(genres)
    if keywords:
        parts.append(keywords)
    if mood:
        parts.append(mood_map.get(mood.lower(), mood))
    return " ".join([p for p in parts if p]).strip()

# -------------------------
# CLI: minimal interactive terminal run
# -------------------------
if __name__ == "__main__":
    print("Provide any of: movie (name), genres (comma/space separated), keywords, mood (one word). Leave blank to skip.")
    movie = input("Movie (or leave blank): ").strip()
    genres = input("Genres (or leave blank): ").strip()
    keywords = input("Keywords (or leave blank): ").strip()
    mood = input("Mood (or leave blank): ").strip()

    out = recommend_router(movie=movie or None, genres=genres or None, keywords=keywords or None, mood=mood or None, top_k=TOP_K)
    if "error" in out:
        print("ERROR:", out["error"])
    else:
        print(f"\nPath used: {out['path']}")
        print(f"Used title/tags: {out['used_title_or_tags']}\n")
        print(f"Top {TOP_K} recommendations:")
        for i, t in enumerate(out["recommendations"], start=1):
            print(f"{i:2d}. {t}")