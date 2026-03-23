import MovieCard from "./MovieCard";
import type { Movie } from "@/lib/mockData";

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="flex gap-1">
          <div className="h-4 bg-muted rounded-full w-12" />
          <div className="h-4 bg-muted rounded-full w-10" />
        </div>
      </div>
    </div>
  );
}

export default function MovieGrid({ movies, loading }: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🎬</div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No movies found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try another mood or genre. Ask the AI assistant for personalized recommendations!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {movies.map((movie, i) => (
        <MovieCard key={movie.id} movie={movie} index={i} />
      ))}
    </div>
  );
}
