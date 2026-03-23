import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Star, Heart, Play, ExternalLink } from "lucide-react";
import { getMovieById } from "@/lib/api";
import { useWatchlist } from "@/contexts/WatchlistContext";
import type { Movie } from "@/lib/mockData";
import Navbar from "@/components/Navbar";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    if (id) {
      getMovieById(Number(id)).then((m) => {
        setMovie(m || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 max-w-5xl mx-auto animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-80 aspect-[2/3] bg-muted rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground">Movie not found.</p>
          <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Backdrop gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="relative pt-24 px-4 max-w-5xl mx-auto pb-12">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
          {/* Poster */}
          <div className="w-full md:w-80 shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl shadow-primary/10"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{movie.title}</h1>
              <p className="text-muted-foreground">{movie.year}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-foreground">{movie.rating}</span>
                <span className="text-muted-foreground text-sm">/ 10</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed">{movie.description}</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="gradient-btn px-6 py-2.5 text-sm flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch Trailer
              </button>
              <button className="px-6 py-2.5 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open on IMDb
              </button>
              <button
                onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className={`px-6 py-2.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                  inWatchlist
                    ? "bg-accent text-accent-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Heart className={`w-4 h-4 ${inWatchlist ? "fill-current" : ""}`} />
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
