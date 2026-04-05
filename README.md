# MoodFlix - AI-Powered Movie Discovery

MoodFlix is an AI-powered movie discovery platform that helps users find the perfect film based on their mood. Using advanced AI algorithms, it provides personalized recommendations through a chat interface or by browsing.

## Features

- **AI Chat Recommendations**: Describe your mood and get instant movie suggestions.
- **Mood-Based Search**: Browse movies by different moods and genres.
- **Personalized Watchlist**: Save your favorite movies to watch later.
- **Detailed Movie Information**: Get ratings, synopses, and more for every title.

## Deployment

This project is optimized for deployment using Docker.

### Prerequisites

- Docker and Docker Compose installed.
- API keys for **Grok (xAI)** and **TMDB**.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
GROK_API_KEY=your_grok_api_key
TMDB_API_KEY=your_tmdb_api_key
```

### Running with Docker Compose

To launch the entire stack (Frontend + Backend), run:

```bash
docker-compose up --build
```

- **Frontend**: Accessible at `http://localhost:3000`
- **Backend**: Accessible at `http://localhost:8000`

### Manual Setup (Development)

To run the frontend and backend separately for development:

#### **Frontend**
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

#### **Backend**
1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
2.  Start the FastAPI server:
    ```bash
    uvicorn src_backend.main:app --reload
    ```

## Optimization & Parallelism

The project has been optimized for multi-user support:
- **Async Backend**: FastAPI with `AsyncOpenAI` and `httpx` handles requests concurrently.
- **Parallel AI Engine**: TMDB metadata enrichment is performed in parallel using `asyncio.gather`, significantly reducing response times.
- **Production-Ready**: Configurable via environment variables and Dockerized for easy deployment.

## Model Regeneration

Some model files are too large for GitHub (>100MB). If you clone this repo and they are missing, run these scripts in order:

1. **[build_vectors.py](file:///c:/Users/pande/MoodFlix/src_ai/src/build_vectors.py)**: Creates basic movie data and vectors.
2. **[compute_similarity.py](file:///c:/Users/pande/MoodFlix/src_ai/src/compute_similarity.py)**: Generates the large similarity matrix for recommendations.


