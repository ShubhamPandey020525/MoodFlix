import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { searchMovies } from "@/lib/api";
import type { Movie } from "@/lib/mockData";
import logo from "@/assets/moodflix-logo.png";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const results = await searchMovies(q);
    setSearchResults(results);
    setShowResults(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="MoodFlix" className="h-14 md:h-16" />
        </Link>

        {/* Search - desktop */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Search movies"
            />
          </div>
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {searchResults.slice(0, 5).map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    navigate(`/movie/${movie.id}`);
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-8 h-12 rounded object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600?text=No+Poster"; }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{movie.title}</p>
                    <p className="text-xs text-muted-foreground">{movie.genres.join(", ")}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav links - desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/dashboard" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            Home
          </Link>
          <Link to="/watchlist" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            Watchlist
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-muted-foreground" aria-label="Toggle menu">
          {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden bg-card border-t border-border p-4 space-y-3 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Link to="/dashboard" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Home</Link>
          <Link to="/watchlist" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Watchlist</Link>
        </div>
      )}
    </nav>
  );
}
