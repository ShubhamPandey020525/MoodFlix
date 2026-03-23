import { movies, type Movie } from "./mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRecommendations(query: string): Promise<Movie[]> {
  await delay(1200);
  const lower = query.toLowerCase();

  const genreMap: Record<string, string> = {
    funny: "Comedy", comedy: "Comedy", hilarious: "Comedy",
    scary: "Horror", horror: "Horror", creepy: "Horror",
    romantic: "Romance", romance: "Romance", love: "Romance",
    action: "Action", thrilling: "Thriller", thriller: "Thriller",
    "sci-fi": "Sci-Fi", scifi: "Sci-Fi", space: "Sci-Fi", science: "Sci-Fi",
    drama: "Drama", emotional: "Drama",
    animated: "Animation", anime: "Animation",
    crime: "Crime", mystery: "Mystery",
    adventure: "Adventure",
    musical: "Musical", music: "Music",
  };

  const moodMap: Record<string, string[]> = {
    funny: ["funny", "lighthearted", "whimsical"],
    sad: ["emotional", "bittersweet", "heartwarming"],
    inspired: ["inspiring", "hopeful", "driven"],
    dark: ["dark", "intense", "unsettling"],
    romantic: ["romantic", "dreamy", "emotional"],
    epic: ["epic", "breathtaking", "intense"],
    chill: ["lighthearted", "whimsical", "charming"],
    intense: ["intense", "gripping", "thrilling"],
  };

  // Check for movie name match
  const titleMatch = movies.filter((m) =>
    lower.includes(m.title.toLowerCase())
  );
  if (titleMatch.length > 0) {
    const ref = titleMatch[0];
    return movies
      .filter(
        (m) =>
          m.id !== ref.id &&
          (m.genres.some((g) => ref.genres.includes(g)) ||
            m.keywords.some((k) => ref.keywords.includes(k)))
      )
      .slice(0, 6);
  }

  // Check genres
  for (const [keyword, genre] of Object.entries(genreMap)) {
    if (lower.includes(keyword)) {
      return movies.filter((m) => m.genres.includes(genre)).slice(0, 6);
    }
  }

  // Check moods
  for (const [keyword, moods] of Object.entries(moodMap)) {
    if (lower.includes(keyword)) {
      return movies
        .filter((m) => m.mood.some((mood) => moods.includes(mood)))
        .slice(0, 6);
    }
  }

  // Fallback: return random 6
  return [...movies].sort(() => Math.random() - 0.5).slice(0, 6);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  await delay(500);
  const lower = query.toLowerCase();
  return movies.filter(
    (m) =>
      m.title.toLowerCase().includes(lower) ||
      m.genres.some((g) => g.toLowerCase().includes(lower))
  );
}

export async function getMovieById(id: number): Promise<Movie | undefined> {
  await delay(300);
  return movies.find((m) => m.id === id);
}

export function generateToonResponse(query: string, results: Movie[]): string {
  const titles = results.map((m) => `* ${m.title}`).join("\n");
  return `@recommendations\ntitles:\n${titles}\n@`;
}

export function getAiMessage(query: string, results: Movie[]): string {
  if (results.length === 0) {
    return "I couldn't find any movies matching that. Try describing a mood, genre, or a movie you liked!";
  }
  const lower = query.toLowerCase();
  if (lower.includes("funny") || lower.includes("comedy")) {
    return `Great choice! Here are some hilarious picks that'll have you laughing all night. I found ${results.length} movies for you:`;
  }
  if (lower.includes("romantic") || lower.includes("romance") || lower.includes("love")) {
    return `Love is in the air! Here are some beautiful romantic films for you:`;
  }
  if (lower.includes("scary") || lower.includes("horror")) {
    return `Feeling brave? Here are some spine-chilling movies to watch with the lights off:`;
  }
  if (lower.includes("sci-fi") || lower.includes("space")) {
    return `To infinity and beyond! Here are some stellar sci-fi recommendations:`;
  }
  return `Based on your request, here are ${results.length} movies I think you'll love:`;
}
