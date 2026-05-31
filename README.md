# 🎬 MoodFlix - AI-Powered Movie Discovery Redefined

MoodFlix is a premium, AI-driven movie discovery platform designed to match your raw emotions with the perfect cinematic frame. Powered by **Grok LLM** and a custom **Neural Recommendation Engine**, it transforms the way you find movies through an immersive, chat-based experience.

---

## 📺 Live Demo & Immersive Experience

> [!IMPORTANT]
> **[WATCH THE FULL PROJECT DEMO VIDEO HERE](https://drive.google.com/file/d/1unre1P1zSo23IHvQyWs7G31vWWkpUKs8/view?usp=sharing)**
> 
> Experience the seamless AI-powered movie discovery, cinematic UI transitions, and neural chat assistant in action.

---

## �️ Visual Proofs

### 1. Hero Experience
![Hero Section](./proofs/page%201.png)

### 2. Neural Discovery Chat
![AI Chat](./proofs/page%202.png)

### 3. Movie Recommendations Grid
![Movie Grid](./proofs/page%203.png)

### 4. Cinematic Detailed View
![Movie Details](./proofs/page%204.png)

### 5. Personalized Watchlist
![Watchlist](./proofs/page%205.png)

---

## � Key Features

- **🧠 Neural Chat Assistant**: Describe your mood, a specific vibe, or even a vague feeling. Our AI (Grok-powered) extracts your intent and explains why each recommendation was chosen.
- **🔢 Structured Presentation**: Recommendations are delivered in a clean, numbered list format within a terminal-inspired chat interface.
- **❤️ Personal Watchlist**: Save your favorite discoveries to a locally managed watchlist for later viewing.
- **✨ Cinematic UI/UX**: Immersive dark theme featuring high-definition video backgrounds, smooth animations, and a premium editorial layout.
- **📱 Responsive Discovery**: Seamlessly switch between the landing page and a dedicated dashboard with full mobile support.
- **⚡ Optimized Performance**: Asynchronous backend processing ensures lightning-fast metadata enrichment (posters, ratings, descriptions).

---

## 🛠️ Technology Stack & Technical Deep-Dive

### **Frontend: Immersive User Experience**
- **React 18 & TypeScript**: Robust, type-safe component architecture.
- **Tailwind CSS**: Utility-first styling for a custom cinematic dark theme.
- **Framer Motion & Lucide**: Smooth, physics-based animations and high-quality vector iconography.
- **Client-Side State**: Efficient state management using React Hooks and SessionStorage for persistent chat sessions.
- **Responsive Layout**: Advanced CSS Grid and Flexbox for an editorial-grade experience across all devices.

### **Backend: High-Performance Neural Bridge**
- **FastAPI**: Asynchronous Python web framework for lightning-fast API responses.
- **Uvicorn**: ASGI server implementation for production-grade performance.
- **Pydantic**: Strict data validation and settings management using Python type annotations.
- **Asynchronous Flow**: Leveraging `asyncio` for non-blocking I/O operations, especially during AI inference and metadata fetching.

### **AI & Recommendation Engine: The Neural Core**
- **LLM Integration (Grok)**: Advanced natural language understanding to extract user intent (mood, genre, keywords) from raw chat messages.
- **Content-Based Filtering**: A custom recommendation engine using **TF-IDF (Term Frequency-Inverse Document Frequency)** and **Cosine Similarity** to match movie "tags" (genres + overview + keywords).
- **Vector Space Modeling**: Movies are mapped into a multi-dimensional vector space using `scikit-learn`'s `CountVectorizer`.
- **Parallel Metadata Enrichment**: Real-time fetching of posters, ratings, and descriptions from **TMDB** using parallel `httpx` requests, reducing latency by up to 70%.
- **Fuzzy Matching**: `difflib` integration for handling user typos and approximate movie title searches.

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js / Bun
- TMDB API Key
- Grok API Key (or OpenAI-compatible endpoint)

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
GROK_API_KEY=your_grok_api_key
TMDB_API_KEY=your_tmdb_api_key
```

### 2. Manual Installation

#### **Backend Setup (Conda)**
```bash
# Create and activate environment
conda create -n moodflix python=3.10 -y
conda activate moodflix

# Install dependencies
pip install -r requirements.txt

# Run Backend
python src_backend/main.py
```

#### **Frontend Setup**
```bash
# Install dependencies
bun install  # or npm install

# Run Frontend
bun dev      # or npm run dev
```

### 3. Docker Deployment (Recommended)
```bash
docker-compose up --build
```

---

## 🧬 Neural Model Regeneration

If the similarity artifacts are missing (due to size constraints), regenerate them using the included scripts:
1. `python src_ai/src/build_vectors.py`: Processes movie data and generates feature vectors.
2. `python src_ai/src/compute_similarity.py`: Computes the high-dimensional similarity matrix.

---

© 2026 MoodFlix Studio. Cinema Redefined by Mood.


