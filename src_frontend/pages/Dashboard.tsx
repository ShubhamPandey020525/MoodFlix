import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatPanel from "@/components/ChatPanel";
import MovieGrid from "@/components/MovieGrid";
import type { Movie } from "@/lib/mockData";

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleRecommendations = (movies: Movie[]) => {
    setRecommendations(movies);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 max-w-7xl mx-auto pb-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
          {/* Chat Panel */}
          <div className="w-full lg:w-[380px] shrink-0 h-full lg:h-auto lg:min-h-[600px]">
            <ChatPanel onRecommendations={handleRecommendations} />
          </div>

          {/* Movie Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="text-6xl mb-6">🎬</div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Ready to discover?
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Tell the AI assistant your mood, a genre, or a movie you love — and watch the magic happen.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Recommendations ({recommendations.length})
                </h2>
                <MovieGrid movies={recommendations} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
