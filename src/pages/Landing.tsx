import { Link } from "react-router-dom";
import { Sparkles, Film, MessageSquare, Zap } from "lucide-react";
import logo from "@/assets/moodflix-logo.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cinematic gradient overlays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <img src={logo} alt="MoodFlix" className="h-8" />
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="gradient-btn px-5 py-2.5 text-sm">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-xs text-muted-foreground mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Movie Discovery
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
            Discover Movies<br />
            <span className="text-gradient">by Your Mood</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            An AI-powered movie discovery platform. Tell us how you feel, and we'll find the perfect film for you.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/signup" className="gradient-btn px-8 py-3.5 text-base">
              Get Started — It's Free
            </Link>
            <Link to="/login" className="px-8 py-3.5 text-base border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-28">
          {[
            { icon: MessageSquare, title: "Chat with AI", desc: "Describe your mood and get instant personalized recommendations." },
            { icon: Film, title: "Smart Discovery", desc: "Find movies by genre, keywords, or similar titles you already love." },
            { icon: Zap, title: "Instant Results", desc: "Beautiful movie cards with posters, ratings, and one-click watchlist." },
          ].map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-6 text-left animate-fade-in-up hover:border-primary/30 transition-colors"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 MoodFlix. All rights reserved.
      </footer>
    </div>
  );
}
