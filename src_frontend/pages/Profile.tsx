import Navbar from "@/components/Navbar";
import { User, Mail, Film, Heart } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";

export default function Profile() {
  const { watchlist } = useWatchlist();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 max-w-3xl mx-auto pb-12">
        <div className="glass-card p-8 animate-fade-in">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Movie Lover</h1>
            <p className="text-muted-foreground text-sm">moviefan@example.com</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{watchlist.length}</p>
                <p className="text-xs text-muted-foreground">Watchlist</p>
              </div>
            </div>
            <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">42</p>
                <p className="text-xs text-muted-foreground">Movies Discovered</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-foreground">Account Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm text-foreground">Movie Lover</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">moviefan@example.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <h2 className="font-heading font-semibold text-foreground">Favorite Genres</h2>
            <div className="flex flex-wrap gap-2">
              {["Sci-Fi", "Thriller", "Drama", "Comedy", "Action"].map((g) => (
                <span key={g} className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground border border-border">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
