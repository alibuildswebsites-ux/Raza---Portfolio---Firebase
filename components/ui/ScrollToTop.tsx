
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { m, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Hook for scroll position monitoring
  const { scrollY } = useScroll();
  
  // Transform scroll Y position to scale value
  // 500px (Trigger point): Scale 0.5
  // 1500px: Scale 1.0
  // This ensures the button grows gradually as user scrolls further down
  const buttonScale = useTransform(scrollY, [500, 1500], [0.5, 1]);

  useEffect(() => {
    // Use the Motion scrollY value to trigger state changes
    // This is more performant than a native scroll listener when using Framer Motion
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY]);

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
    <AnimatePresence>
      {isVisible && (
        <m.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{ scale: buttonScale }}
          whileHover={{ y: -5 }}
          whileTap={{ y: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-pastel-blue text-pastel-charcoal border-2 border-pastel-charcoal p-3 shadow-pixel hover:shadow-pixel-lg active:shadow-pixel transition-shadow group flex items-center justify-center origin-center"
          title="Back to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
          {/* Pixel tooltip hint (Hidden on mobile to prevent clutter) */}
          <span className="absolute right-full mr-4 bg-white border-2 border-pastel-charcoal px-2 py-1 text-xs font-pixel whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-pixel-sm pointer-events-none hidden md:block">
            Top
          </span>
        </m.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;