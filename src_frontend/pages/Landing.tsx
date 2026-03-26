import { Link } from "react-router-dom";
import { Sparkles, Film, MessageSquare, Zap } from "lucide-react";
import logo from "@/assets/moodflix-logo.png";

export default function Landing() {
  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Cinematic gradient overlays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between shrink-0">
        <img src={logo} alt="MoodFlix" className="h-10 md:h-14 drop-shadow-[0_0_20px_rgba(var(--primary),0.4)]" />
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="gradient-btn px-4 py-2 text-sm">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 flex-1 flex flex-col justify-center text-center py-2">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3">
            <Sparkles className="w-3 h-3 text-primary" />
            AI-Powered Movie Discovery
          </div>

          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-2 md:mb-3">
            Discover Movies<br />
            <span className="text-gradient">by Your Mood</span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-4 md:mb-5">
            An AI-powered movie discovery platform. Tell us how you feel, and we'll find the perfect film for you.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-6 md:mb-8">
            <Link to="/signup" className="gradient-btn px-6 py-2.5 text-sm md:text-base">
              Get Started — It's Free
            </Link>
            <Link to="/login" className="px-6 py-2.5 text-sm md:text-base border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto w-full">
          {[
            { icon: MessageSquare, title: "Chat with AI", desc: "Describe your mood and get instant personalized recommendations." },
            { icon: Film, title: "Smart Discovery", desc: "Find movies by genre, keywords, or similar titles you already love." },
            { icon: Zap, title: "Instant Results", desc: "Beautiful movie cards with posters, ratings, and one-click watchlist." },
          ].map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-3 md:p-4 text-left animate-fade-in-up hover:border-primary/30 transition-colors"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                <f.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              </div>
              <h3 className="font-heading text-xs md:text-sm font-semibold text-foreground mb-0.5 md:mb-1">{f.title}</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
