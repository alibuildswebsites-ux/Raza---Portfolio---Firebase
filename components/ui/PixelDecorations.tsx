
import { memo, useMemo } from 'react';
import { m } from 'framer-motion';

export const PixelCloud = memo(({ size = "w-32", className = "", duration = 25, delay = 0, top = "10%" }: { size?: string, className?: string, duration?: number, delay?: number, top?: string }) => (
  <m.div
    initial={{ x: "-20vw" }}
    animate={{ x: "110vw" }}
    transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
    className={`absolute z-0 ${size} ${className}`}
    style={{ top, willChange: 'transform' }}
  >
    <svg viewBox="0 0 32 20" className="w-full h-full" style={{ imageRendering: 'pixelated' }} shapeRendering="crispEdges">
       {/* Border Layer (Bluish Pastel) */}
       <path fill="#B0C4DE" d="M14 4h10v1H14zm-6 2h6v1H8zm-5 3h5v1H3zm21-1h5v1h-5zM5 17h22v1H5zm-2-1h2v1H3zm24 0h2v1h-2zM2 10h1v6H2zm5-3h1v3H7zm6-2h1v2h-1zm16 4h1v7h-1zm-5-4h1v4h-1z" />
       {/* Main Cloud Body - White */}
       <path fill="#FFF" d="M5 13h22v4H5zm-2-3h7v6H3zm5-3h8v9H8zm6-2h10v11H14zm8 4h7v7h-7z" />
       {/* Shading */}
       <path fill="#E8E8E8" d="M5 16h22v1H5zm17-6h1v5h-1zm-8-4h1v8h-1z" />
    </svg>
  </m.div>
));

export const PixelSun = memo(({ className = "" }: { className?: string }) => (
  <m.div 
    initial={{ y: 20, opacity: 0, rotate: 0 }}
    animate={{ y: 0, opacity: 0.8, rotate: 360 }}
    transition={{ 
      default: { duration: 1 },
      rotate: { duration: 60, repeat: Infinity, ease: "linear" }
    }}
    className={`w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 z-0 opacity-80 ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
       <path fill="#FFB5A7" d="M8 8h8v8H8zm0-2h8v2H8zm0 10h8v2H8zm-2-8h2v8H6zm10 0h2v8h-2zM11 2h2v3h-2zm0 17h2v3h-2zM2 11h3v2H2zm17 0h3v2h-3z" />
    </svg>
  </m.div>
));

export const PixelMoon = memo(({ className = "" }: { className?: string }) => (
  <m.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1 }}
    className={`w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 z-0 ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" style={{ imageRendering: 'pixelated' }}>
       <path d="M8 3h4v2h3v3h2v8h-2v3h-3v2H8v-2h2v-2h1V7h-1V5H8V3z" fill="#F5F5F5" />
       <path fill="#E0E0E0" d="M13 10h2v2h-2zm-1 6h1v1h-1zm2-10h1v1h-1z" />
    </svg>
  </m.div>
));

export const PixelStars = memo(() => {
  const stars = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 60}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() > 0.5 ? 4 : 2,
    delay: Math.random() * 2
  })), []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
         <m.div 
            key={s.id}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: s.delay }}
            className="absolute bg-white"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, boxShadow: '0 0 4px #fff' }}
         />
      ))}
    </div>
  );
});
