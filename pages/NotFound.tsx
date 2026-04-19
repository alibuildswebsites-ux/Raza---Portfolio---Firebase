import React, { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import PixelButton from '../components/ui/PixelButton';
import ParticleBackground from '../components/ui/ParticleBackground';
import { PixelMoon, PixelStars, PixelCloud } from '../components/ui/PixelDecorations';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { Ghost } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { playHover, playClick } = useAudio();
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Bouncy drop-in for the 404 text
      gsap.from(".error-code", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "bounce.out",
        delay: 0.2
      });

      // Fade up for the message
      gsap.from(".error-message", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.8
      });

      // Pulse animation for the button container
      gsap.fromTo(".error-button", 
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 1.2 }
      );
      
      gsap.to(".error-button", {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.8
      });
      
      // Float animation for the ghost
      gsap.to(".error-ghost", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleGoHome = () => {
    playClick();
    navigate('/');
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[100dvh] bg-pastel-cream text-pastel-charcoal selection:bg-pastel-lavender transition-colors duration-500 overflow-hidden flex flex-col items-center justify-center p-4"
    >
      {/* === BACKGROUND === */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-pastel-blue/10">
        <ParticleBackground />
        {theme === 'night' && <PixelStars />}
        
        <div className="absolute top-24 right-4 md:right-8 lg:right-12 z-10">
          <PixelMoon className="origin-center scale-75 md:scale-100" />
        </div>

        <div className="absolute top-0 left-0 w-full h-[50vh]">
           <PixelCloud isStatic top="15%" left="15%" size="w-16 md:w-24" className="opacity-70" />
           <PixelCloud top="10%" className="opacity-80 scale-75 md:scale-100" size="w-24 md:w-48" duration={30} delay={0} />
           <PixelCloud top="40%" className="opacity-60 scale-75 md:scale-100" size="w-16 md:w-32" duration={22} delay={20} />
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="error-ghost mb-6 text-pastel-blue">
          <Ghost size={80} strokeWidth={1.5} className="drop-shadow-sm" />
        </div>
        
        <h1 className="error-code font-pixel text-7xl md:text-9xl mb-4 text-pastel-charcoal drop-shadow-sm">
          404
        </h1>
        
        <div className="error-message bg-pastel-surface border-4 border-pastel-charcoal shadow-pixel p-6 md:p-8 mb-10 transform -rotate-1">
          <h2 className="font-pixel text-2xl md:text-3xl mb-4 text-pastel-rose">GAME OVER</h2>
          <p className="font-sans text-lg md:text-xl font-medium text-pastel-charcoal/80 leading-relaxed">
            The page you're looking for has been abducted by pixel-aliens or simply doesn't exist.
          </p>
        </div>

        <div className="error-button">
          <PixelButton 
            onClick={handleGoHome} 
            onMouseEnter={playHover}
            size="lg" 
            className="shadow-pixel-lg text-lg px-8 py-4 bg-pastel-mint hover:bg-pastel-blue"
          >
            INSERT COIN TO CONTINUE
            <span className="block text-xs mt-1 font-sans opacity-80">(Return to Homepage)</span>
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
