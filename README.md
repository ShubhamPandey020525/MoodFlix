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

#### **Environment Setup**
1.  **Create a virtual environment** (using Conda or venv):
    ```bash
    # Using Conda
    conda create -n moodflix python=3.10 -y
    conda activate moodflix
    
    # OR Using venv
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
2.  **Install dependencies**:
    ```bash
    # Backend dependencies
    pip install -r requirements.txt
    
    # Frontend dependencies
    npm install
    ```

#### **Running the Application**

You will need two terminal windows:

1.  **Terminal 1: Backend**
    ```bash
    # Option 1: Standard FastAPI way (Recommended for dev)
    uvicorn src_backend.main:app --reload
    
    # Option 2: Run as a direct python script
    cd src_backend
    python main.py
    ```
    *The API will be available at `http://localhost:8000`*

2.  **Terminal 2: Frontend**
    ```bash
    npm run dev
    ```
    *The app will be available at `http://localhost:3000` (or the port shown in your terminal)*

## Optimization & Parallelism

The project has been optimized for multi-user support:
- **Async Backend**: FastAPI with `AsyncOpenAI` and `httpx` handles requests concurrently.
- **Parallel AI Engine**: TMDB metadata enrichment is performed in parallel using `asyncio.gather`, significantly reducing response times.
- **Production-Ready**: Configurable via environment variables and Dockerized for easy deployment.

## Model Regeneration

Some model files are too large for GitHub (>100MB). If you clone this repo and they are missing, run these scripts in order:

1. **[build_vectors.py](file:///c:/Users/pande/MoodFlix/src_ai/src/build_vectors.py)**: Creates basic movie data and vectors.
2. **[compute_similarity.py](file:///c:/Users/pande/MoodFlix/src_ai/src/compute_similarity.py)**: Generates the large similarity matrix for recommendations.


