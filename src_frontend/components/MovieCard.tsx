import { useNavigate } from "react-router-dom";
import { Star, Heart, Eye, Play } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import type { Movie } from "@/lib/mockData";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div
      className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/10 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Number Badge */}
      <div className="absolute top-2 left-2 z-20 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[11px] font-black text-primary">
        #{index + 1}
      </div>

      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          crossOrigin="anonymous"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x600?text=No+Poster";
          }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="flex flex-col gap-3 w-full max-w-[160px]">
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/20 shadow-xl"
              aria-label={`View details for ${movie.title}`}
            >
              <Eye className="w-4 h-4" />
              Details
            </button>
            
            <button
              onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all border ${
                inWatchlist
                  ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "bg-white/10 border-white/20 text-white hover:bg-accent hover:border-accent"
              }`}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Heart className={`w-4 h-4 ${inWatchlist ? "fill-current" : ""}`} />
              {inWatchlist ? "Saved" : "Watchlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-heading font-semibold text-sm text-foreground truncate">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {movie.rating}
          </div>
        </div>
      </div>
    </div>
  );
}
