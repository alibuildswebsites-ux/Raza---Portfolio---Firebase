
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = memo(() => {
  // REDUCED COUNT: Dropped from 35 to 15 to prevent iOS WebKit memory crashes
  const particles = useMemo(() => {
    const colors = ['bg-pastel-blue', 'bg-pastel-lavender', 'bg-pastel-mint', 'bg-pastel-peach'];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.floor(Math.random() * 3 + 2) * 4, // Multiples of 4 for pixel grid
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 20, // Slower, calmer animation
      delay: Math.random() * 10,
      xDrift: (Math.random() - 0.5) * 30
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: `${p.x}vw`, 
            y: "110vh", 
            opacity: 0,
            rotate: 0 
          }}
          animate={{ 
            y: "-10vh", 
            x: `${p.x + p.xDrift}vw`,
            opacity: [0, 0.4, 0.8, 0.4, 0],
            rotate: p.xDrift > 0 ? 90 : -90
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: p.delay,
          }}
          className={`absolute ${p.color} border-2 border-pastel-charcoal/10 shadow-sm will-change-transform`}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
});

export default ParticleBackground;
