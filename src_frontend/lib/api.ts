import { movies, type Movie } from "./mockData";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ChatApiResponse {
  response: string;
  recommendations: Movie[];
}

export async function getRecommendations(query: string): Promise<ChatApiResponse> {
  const response = await axios.post(`${API_BASE_URL}/chat`, {
    message: query,
  });
  return response.data;
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
  try {
    const response = await axios.get(`${API_BASE_URL}/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return undefined;
  }
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
