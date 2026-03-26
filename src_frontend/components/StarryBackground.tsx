import React, { useEffect, useState } from 'react';

const StarryBackground: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; top: string; left: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate static/falling stars
    const starCount = 100;
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 20}s`,
      size: `${Math.random() * 2 + 1}px`,
    }));
    setStars(newStars);

    // Shooting stars logic
    const shootingStarInterval = setInterval(() => {
      const id = Date.now();
      const newShootingStar = {
        id,
        top: `${Math.random() * 40}%`,
        left: `${Math.random() * 80}%`,
        delay: '0s',
      };
      setShootingStars((prev) => [...prev.slice(-5), newShootingStar]);
      
      // Cleanup shooting star after animation
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, 3000);
    }, 4000);

    return () => clearInterval(shootingStarInterval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Falling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full opacity-40 animate-fall"
          style={{
            left: star.left,
            top: '-10px',
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Shooting Stars (Tutte Taare) */}
      {shootingStars.map((s) => (
        <div
          key={s.id}
          className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star"
          style={{
            top: s.top,
            left: s.left,
            boxShadow: '0 0 15px 2px white',
          }}
        >
          <div className="absolute top-0 left-0 w-[150px] h-[2px] bg-gradient-to-r from-white via-white/50 to-transparent -rotate-[35deg] origin-left" />
        </div>
      ))}
    </div>
  );
};

export default StarryBackground;
