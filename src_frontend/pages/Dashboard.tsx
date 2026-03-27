import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatPanel from "@/components/ChatPanel";
import MovieGrid from "@/components/MovieGrid";
import type { Movie } from "@/lib/mockData";

export default function Dashboard() {
  // Load state from sessionStorage if it exists
  const [recommendations, setRecommendations] = useState<Movie[]>(() => {
    const saved = sessionStorage.getItem("moodflix_recs");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = sessionStorage.getItem("moodflix_messages");
    return saved ? JSON.parse(saved) : [
      {
        id: "welcome",
        role: "ai",
        content: "Hey! 👋 I'm your MoodFlix AI assistant. Tell me your mood, a genre, or a movie you like — and I'll find the perfect recommendations for you!",
      },
    ];
  });

  const [hasSearched, setHasSearched] = useState(() => {
    return recommendations.length > 0;
  });

  // Save state whenever it changes
  useEffect(() => {
    sessionStorage.setItem("moodflix_recs", JSON.stringify(recommendations));
    sessionStorage.setItem("moodflix_messages", JSON.stringify(messages));
    setHasSearched(recommendations.length > 0);
  }, [recommendations, messages]);

  const handleRecommendations = (movies: Movie[]) => {
    setRecommendations(movies);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 max-w-7xl mx-auto pb-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
          {/* Chat Panel */}
          <div className="w-full lg:w-[380px] shrink-0 h-full lg:h-auto lg:min-h-[600px]">
            <ChatPanel 
              onRecommendations={handleRecommendations} 
              messages={messages}
              setMessages={setMessages}
            />
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Recommendations ({recommendations.length})
                  </h2>
                  <button 
                    onClick={() => {
                      setRecommendations([]);
                      setMessages([{
                        id: "welcome",
                        role: "ai",
                        content: "Hey! 👋 I'm your MoodFlix AI assistant. Tell me your mood, a genre, or a movie you like — and I'll find the perfect recommendations for you!",
                      }]);
                      sessionStorage.removeItem("moodflix_recs");
                      sessionStorage.removeItem("moodflix_messages");
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clear Chat
                  </button>
                </div>
                <MovieGrid movies={recommendations} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
