import React, { useState, useEffect } from "react";

// Massive library of high-quality HD movie and anime trailers
const trailers = [
  "L_L3zRQXfIE", // Joker: Folie à Deux
  "YoHD9XEInc0", // Inception
  "qEVUtrk8_B4", // John Wick 4
  "hXzcyx9V0xw", // Dune: Part Two
  "HhesaQXLuRY", // The Batman
  "8hP9D6kZseM", // Interstellar
  "k8Yv86Zp-Vw", // Demon Slayer: Mugen Train
  "M25zXh667m8", // Your Name
  "G_Z3lmidmrY", // Suzume
  "Ym3Z6E4O_C8", // Spirited Away
  "6ZfuNTqbHE8", // Avengers: Endgame
  "giXco2jaZ_4", // Top Gun: Maverick
  "TcMBFSGVi1c", // Avengers: Infinity War
  "uYPbbksJxIg", // Oppenheimer
  "shW9i6k8cB0", // Spider-Man: Into the Spider-Verse
  "JfVOs4VSpmA", // Spider-Man: No Way Home
  "P5ieIbInFpg", // The Matrix Resurrections
  "Go8nTmfrQd8", // Mad Max: Fury Road
  "8Qn_sciBA8M", // Blade Runner 2049
  "vKQiV5BO5ok", // Tenet
  "aWzlQ2N6qqg", // Parasite
  "1v_l7T695S0", // Weathering With You
  "m8_m00_v1Yc", // A Silent Voice
  "BYW6C44nWz4", // Jujutsu Kaisen 0
  "qH096_S_9_0", // One Piece Film: Red
  "f_XAsBDSg9o", // Evangelion: 3.0+1.0
  "r5X-S_Y-S6o", // Akira
  "wMeqsiCPZ88", // Princess Mononoke
  "h0vTQm_S1_0", // Howl's Moving Castle
  "zSWdZVtXT7E", // Interstellar Official
  "giXco2jaZ_4", // Top Gun Maverick
  "f_XAsBDSg9o", // Evangelion
  "qH096_S_9_0", // One Piece Film Red
];

export default function VideoBackground() {
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    // Select a random trailer on component mount
    const randomId = trailers[Math.floor(Math.random() * trailers.length)];
    setVideoId(randomId);
  }, []);

  if (!videoId) return <div className="absolute inset-0 bg-black" />;

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none z-0 bg-background">
      {/* Refined Overlays for better visibility */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
      
      <div className="w-full h-full scale-[1.25]">
        <iframe
          className="w-full h-full opacity-80"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
}
