import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          if (scrollY > 500) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          
          const newScale = Math.min(Math.max(0.5, 0.5 + ((scrollY - 500) / 1000) * 0.5), 1);
          
          if (buttonRef.current) {
            buttonRef.current.style.transform = `scale(${newScale})`;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hide on admin dashboard
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  // Custom Smooth Scroll Function with Easing
  const scrollToTop = () => {
    const duration = 800; // Animation duration in ms
    const start = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function: easeOutQuart (1 - (1 - t)^4)
      const ease = 1 - Math.pow(1 - progress, 4);
      
      window.scrollTo(0, start * (1 - ease));

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div ref={buttonRef} className="origin-center" style={{ transform: 'scale(0.5)' }}>
        <button
          onClick={scrollToTop}
          className="bg-pastel-blue text-pastel-charcoal border-2 border-pastel-charcoal p-3 shadow-pixel hover:shadow-pixel-lg active:shadow-pixel transition-all duration-300 transform-gpu group flex items-center justify-center hover:-translate-y-1 active:translate-y-0"
          title="Back to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
          {/* Pixel tooltip hint (Hidden on mobile to prevent clutter) */}
          <span className="absolute right-full mr-4 bg-white border-2 border-pastel-charcoal px-2 py-1 text-xs font-pixel whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-pixel-sm pointer-events-none hidden md:block">
            Top
          </span>
        </button>
      </div>
    </div>
  );
};

export default ScrollToTop;
