import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      // Creates a natural feel: starts fast, slows down gently
      const ease = 1 - Math.pow(1 - progress, 4);
      
      window.scrollTo(0, start * (1 - ease));

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-pastel-blue text-pastel-charcoal border-2 border-pastel-charcoal p-3 shadow-pixel hover:-translate-y-1 hover:shadow-pixel-lg active:translate-y-0 active:shadow-pixel transition-all group flex items-center justify-center"
          title="Back to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
          {/* Pixel tooltip hint (Hidden on mobile to prevent clutter) */}
          <span className="absolute right-full mr-4 bg-white border-2 border-pastel-charcoal px-2 py-1 text-xs font-pixel whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-pixel-sm pointer-events-none hidden md:block">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;