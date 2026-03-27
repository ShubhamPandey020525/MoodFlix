import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Watchlist from "./pages/Watchlist";
import MovieDetails from "./pages/MovieDetails";
import NotFound from "./pages/NotFound";
import StarryBackground from "./components/StarryBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WatchlistProvider>
        <StarryBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WatchlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
