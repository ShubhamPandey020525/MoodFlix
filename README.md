# 🎬 MoodFlix - AI-Powered Movie Discovery Redefined

MoodFlix is a premium, AI-driven movie discovery platform designed to match your raw emotions with the perfect cinematic frame. Powered by **Grok LLM** and a custom **Neural Recommendation Engine**, it transforms the way you find movies through an immersive, chat-based experience.

---

## 📺 Demo & Experience

### [Watch the Full Demo Video](https://drive.google.com/file/d/1unre1P1zSo23IHvQyWs7G31vWWkpUKs8/view?usp=sharing)

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

## �🚀 Key Features

- **🧠 Neural Chat Assistant**: Describe your mood, a specific vibe, or even a vague feeling. Our AI (Grok-powered) extracts your intent and explains why each recommendation was chosen.
- **🔢 Structured Presentation**: Recommendations are delivered in a clean, numbered list format within a terminal-inspired chat interface.
- **❤️ Personal Watchlist**: Save your favorite discoveries to a locally managed watchlist for later viewing.
- **✨ Cinematic UI/UX**: Immersive dark theme featuring high-definition video backgrounds, smooth animations, and a premium editorial layout.
- **📱 Responsive Discovery**: Seamlessly switch between the landing page and a dedicated dashboard with full mobile support.
- **⚡ Optimized Performance**: Asynchronous backend processing ensures lightning-fast metadata enrichment (posters, ratings, descriptions).

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI, Lucide Icons.
- **Backend**: FastAPI (Python), AsyncOpenAI, HTTPX.
- **AI/ML Engine**: Grok LLM (Intent Parsing & Natural Response), Scikit-learn (Cosine Similarity), Pandas.
- **Metadata**: TMDB API Integration for real-time movie posters and data.

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

#### **Backend Setup**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python src_backend/main.py
```

#### **Frontend Setup**
```bash
bun install  # or npm install
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


