import { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Star, Trash2, Github, Clapperboard, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/moodflix-logo.png";
import VideoBackground from "@/components/VideoBackground";
import ChatPanel from "@/components/ChatPanel";
import MovieGrid from "@/components/MovieGrid";
import type { Movie } from "@/lib/mockData";

export default function Landing() {
  const navigate = useNavigate();
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // --- State Management ---
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
        content: "Hey! I'm MoodFlix AI. Tell me what's on your mind, and I'll find the perfect movie match.",
      },
    ];
  });

  const [hasSearched, setHasSearched] = useState(() => recommendations.length > 0);

  useEffect(() => {
    sessionStorage.setItem("moodflix_recs", JSON.stringify(recommendations));
    sessionStorage.setItem("moodflix_messages", JSON.stringify(messages));
    setHasSearched(recommendations.length > 0);
  }, [recommendations, messages]);

  const handleRecommendations = (movies: Movie[]) => {
    setRecommendations(movies);
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearChat = () => {
    setRecommendations([]);
    setMessages([{
      id: "welcome",
      role: "ai",
      content: "Hey! I'm MoodFlix AI. Tell me what's on your mind, and I'll find the perfect movie match.",
    }]);
    sessionStorage.removeItem("moodflix_recs");
    sessionStorage.removeItem("moodflix_messages");
  };

  return (
    <div className="min-h-screen w-full text-white relative font-sans overflow-x-hidden scroll-smooth selection:bg-primary selection:text-black">
      <VideoBackground />

      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <img 
            src={logo} 
            alt="MoodFlix" 
            className="h-9 md:h-11 drop-shadow-2xl cursor-pointer hover:scale-105 transition-transform" 
            onClick={scrollToTop}
          />
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/watchlist")}
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md"
            >
              <Heart className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-300 group-hover:text-white">Watchlist</span>
            </button>
            <a 
              href="https://github.com/ShubhamPandey020525/MoodFlix"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md"
            >
              <Github className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-300 group-hover:text-white">Repository</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetric Editorial Layout */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center z-20 overflow-hidden">
        <div className="max-w-[1600px] mx-auto w-full px-8 grid grid-cols-12 gap-0 h-full">
          
          {/* Left Side: Massive Vertical Branding */}
          <div className="col-span-2 h-full flex items-center justify-start border-r border-white/5">
            <h2 className="rotate-180 text-[10px] font-black tracking-[1em] uppercase py-8 [writing-mode:vertical-lr] text-gray-500 opacity-50">
              Est. 2026 — Local Intelligence — Mood Based Discovery
            </h2>
          </div>

          {/* Center-Left: Main Content Staggered */}
          <div className="col-span-7 h-full flex flex-col justify-center pl-12 space-y-12">
            <div className="space-y-8 relative group">
              <div className="absolute -left-12 -top-12 text-primary font-black text-9xl opacity-10 select-none group-hover:opacity-20 transition-opacity duration-700">"</div>
              
              <h1 className="font-black leading-[0.85] tracking-tighter uppercase flex flex-col items-start">
                <span className="text-6xl md:text-8xl lg:text-[7.5rem] text-primary drop-shadow-[0_0_30px_rgba(0,255,255,0.3)] animate-pulse">
                  MOODFLIX
                </span>
                
                <span className="text-4xl md:text-6xl lg:text-7xl text-white mt-2 relative flex items-center gap-4">
                  <span className="opacity-90 tracking-[-0.05em]">REDEFINED</span>
                  <div className="h-px w-24 bg-white/20 hidden lg:block" />
                </span>
                
                <span className="text-2xl md:text-4xl lg:text-5xl mt-2 flex items-center gap-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700 font-bold tracking-[0.1em]">
                    BY MOOD.
                  </span>
                  <div className="h-px w-32 bg-primary/20 hidden lg:block" />
                </span>
              </h1>
              
              <div className="relative space-y-4">
                <div className="h-0.5 w-12 bg-primary/50" />
                <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-[0.25em] max-w-md leading-relaxed">
                  A localized neural engine designed to match your raw emotions with the <span className="text-white">perfect frame</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Abstract Visual/Stats */}
          <div className="col-span-3 h-full flex flex-col justify-between py-24 border-l border-white/5 pl-12">
            <div className="space-y-2">
              <div className="text-4xl font-black text-white/20">01.</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Neural Match</div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase">Our Qwen3:8b engine analyzes semantic mood patterns instantly.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-white/20">02.</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Private Local</div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase">Your emotions never leave your machine. 100% offline processing.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-white/20">03.</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Curation</div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase">Access a global database of cinematic masterpieces curated for you.</p>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Indicator - Staggered */}
        <div className="absolute bottom-12 right-24 flex items-center gap-6 rotate-90 origin-right cursor-pointer group" onClick={scrollToChat}>
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-500 group-hover:text-primary transition-colors">Scroll to Chat</span>
          <div className="w-24 h-px bg-white/20 group-hover:bg-primary transition-all group-hover:w-32" />
        </div>
      </section>

      {/* AI Discovery Section */}
      <section 
        id="chat-section" 
        ref={chatSectionRef}
        className="relative h-screen flex flex-col bg-black py-12 px-8 overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col gap-10">
          {/* Section Header - Cleaner */}
          <div className="flex items-end justify-between border-b border-white/5 pb-8 shrink-0">
            <div className="space-y-1">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">AI Assistant</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Powered by Qwen3:8b Local Engine
              </p>
            </div>
            {hasSearched && (
              <button 
                onClick={clearChat}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-gray-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4" />
                Clear Session
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-10 min-h-0">
            {/* Chat Panel - Integrated Terminal Look */}
            <div className="w-full lg:w-[450px] shrink-0 h-full flex flex-col min-h-0">
              <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col group hover:border-primary/20 transition-all duration-500">
                <div className="bg-white/5 px-6 py-4 flex items-center gap-3 border-b border-white/5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  <div className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">MoodFlix_Terminal_v1.0</div>
                </div>
                <div className="flex-1 min-h-0">
                  <ChatPanel 
                    onRecommendations={handleRecommendations} 
                    messages={messages}
                    setMessages={setMessages}
                    transparent={true}
                    hideHeader={true}
                  />
                </div>
              </div>
            </div>

            {/* Recommendations - Clean Grid with Custom Scroll */}
            <div className="flex-1 h-full min-h-0 bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col backdrop-blur-xl">
              {!hasSearched ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <Clapperboard className="w-16 h-16 mb-6 text-gray-500" />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400">Discoveries will appear here</h3>
                  <p className="text-xs text-gray-600 mt-2">TELL AI YOUR CURRENT VIBE TO BEGIN</p>
                </div>
              ) : (
                <>
                  <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl py-6 px-8 border-b border-white/5 flex items-center gap-4">
                    <Star className="text-primary w-6 h-6 fill-current" />
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Your Personalized Selection</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <MovieGrid movies={recommendations} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer Overlay */}
      <footer className="fixed bottom-6 left-8 right-8 z-50 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mix-blend-difference pointer-events-none">
        <div className="flex items-center gap-6">
          <span>Ollama 8B Engine</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>Private Metadata</span>
        </div>
        <span>© 2026 MoodFlix Studio</span>
      </footer>
    </div>
  );
}
