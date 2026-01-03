
import React, { memo, useMemo } from 'react';

const ParticleBackground = memo(() => {
  // REDUCED COUNT: Kept at 15 to prevent iOS WebKit memory crashes
  const particles = useMemo(() => {
    const colors = ['bg-pastel-blue', 'bg-pastel-lavender', 'bg-pastel-mint', 'bg-pastel-peach'];
    return Array.from({ length: 15 }).map((_, i) => {
      const xDrift = (Math.random() - 0.5) * 30;
      return {
        id: i,
        x: Math.random() * 100,
        size: Math.floor(Math.random() * 3 + 2) * 4, // Multiples of 4 for pixel grid
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 20, // Slower, calmer animation
        delay: Math.random() * 10,
        xDrift,
        rotation: xDrift > 0 ? 90 : -90
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color} border-2 border-pastel-charcoal/10 shadow-sm`}
          style={{ 
            width: `${p.size}px`, 
            height: `${p.size}px`,
            left: `${p.x}vw`,
            // CSS Variables for keyframes
            '--tx': `${p.xDrift}vw`,
            '--r': `${p.rotation}deg`,
            // Animation Props
            animationName: 'particle-float',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            // Hardware Acceleration
            transform: 'translateZ(0)',
            willChange: 'transform, opacity'
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

export default ParticleBackground;
