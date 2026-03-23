import Navbar from "@/components/Navbar";
import MovieGrid from "@/components/MovieGrid";
import { useWatchlist } from "@/contexts/WatchlistContext";

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">My Watchlist</h1>
          <p className="text-muted-foreground mt-1">
            {watchlist.length > 0
              ? `${watchlist.length} movie${watchlist.length !== 1 ? "s" : ""} saved`
              : "Your watchlist is empty"}
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Nothing here yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Start adding movies to your watchlist from the dashboard. Click the heart icon on any movie card!
            </p>
          </div>
        ) : (
          <MovieGrid movies={watchlist} />
        )}
      </div>
    </div>
  );
}
