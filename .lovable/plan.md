

# MoodFlix — AI Movie Discovery Platform

## Overview
A cinematic, dark-themed movie discovery app where users interact with an AI chat assistant to get mood-based movie recommendations. Built with React + Vite + Tailwind CSS + TypeScript.

## Logo
The uploaded MoodFlix logo will be embedded throughout the app (navbar, landing page, auth pages).

## Design System
- **Dark cinematic theme**: Primary bg `#0B0B0F`, secondary bg `#14141A`
- **Accent colors**: Blue glow `#00C2FF`, Red/Orange `#FF3B30` with gradient buttons
- **Typography**: Montserrat/Poppins for headings, Inter for body
- **Glass-morphism cards** for auth forms, soft shadows and hover scale on movie cards

## Pages & Features

### 1. Landing Page (`/`)
- Hero with "Discover Movies by Your Mood" heading, cinematic gradient background
- Get Started & Sign In CTAs
- Feature highlights section

### 2. Sign In (`/login`) & Sign Up (`/signup`)
- Glass-style card with blur backdrop
- Email/password inputs, Google button (mock)
- Links between sign in/sign up

### 3. Dashboard (`/dashboard`)
- **Top Navbar**: Logo (left), search bar (center), Home/Watchlist/Profile (right)
- **Split layout**: Left panel = AI Chat, Right panel = Movie recommendation grid
- **AI Chat**: Message bubbles, typing animation, scrollable history. Parses TOON-format mock responses and triggers movie card display
- **Movie Grid**: Responsive flashcards (4/2/1 columns for desktop/tablet/mobile) with poster, title, genre badges, rating, "View Details" & "Add to Watchlist" buttons

### 4. Movie Details (`/movie/:id`)
- Large poster, title, genres, rating, description
- Watch Trailer & Open on IMDb buttons (mock links)

### 5. Watchlist (`/watchlist`)
- Grid of saved movies using same card component
- Remove from watchlist functionality

### 6. Profile (`/profile`)
- User info display (mock data), avatar, preferences

## Mock Data & API Layer
- `lib/mockData.ts` with ~20 movies (title, poster_path, genres, rating, description)
- `lib/api.ts` with mock functions (`getRecommendations`, `searchMovies`, `getMovieById`) that return promises — easily swappable with real APIs later
- TMDB poster URLs: `https://image.tmdb.org/t/p/w500/{poster_path}`
- AI chat simulates TOON format parsing and returns matching movies

## UX Polish
- Skeleton loading states for cards and chat
- Empty states with friendly messages
- Fade-in animations on grid, hover scale on cards, typing dots in chat
- Keyboard navigation and ARIA labels
- Watchlist state managed via React Context + localStorage persistence

