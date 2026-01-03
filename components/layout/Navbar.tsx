import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { muted, toggleMute, playHover, playClick, playThemeSwitch } = useAudio();
  
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact', id: 'contact' },
  ];

  // Handle Scroll Spy and Progress Bar (Optimized)
  useEffect(() => {
    let ticking = false;

    const handleScrollLogic = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);

      const scrollPosition = window.scrollY + 100;
      let current = '';
      
      // Iterate through items to find active section
      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = item.id;
            break; // Stop once we found the active section
          }
        }
      }
      setActiveSection(current);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScrollLogic();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    playClick();
    setIsOpen(false);
    const scrollToElement = () => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 85; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToElement, 300);
    } else {
      setTimeout(scrollToElement, 300); 
    }
  };

  const goHome = () => {
    playClick();
    if (location.pathname !== '/') navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
    setActiveSection('');
  };

  const handleThemeToggle = () => {
    toggleTheme();
    playThemeSwitch();
  };

  const handleMuteToggle = () => {
    playClick();
    toggleMute();
  };

  const borderColorClass = theme === 'night' ? 'border-black' : 'border-pastel-charcoal';

  return (
    <nav className={`fixed top-0 w-full z-50 bg-pastel-cream border-b-4 transition-colors duration-500 ${borderColorClass}`}>
      {/* Reading Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full z-50">
        <motion.div 
          className="h-full bg-pastel-blue border-r-2 border-pastel-charcoal"
          style={{ width: `${scrollProgress * 100}%` }}
          initial={{ width: 0 }}
        />
      </div>

      {/* Main Container - Full Width with specific padding requested */}
      <div className="w-full px-3 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT GROUP: Logo/Name */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" 
            onClick={goHome}
            onMouseEnter={playHover}
            role="button"
            tabIndex={0}
            aria-label="Go to Homepage"
            onKeyPress={(e) => { if(e.key === 'Enter') goHome(); }}
          >
             <div className="w-10 h-10 bg-pastel-blue border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel-sm group-hover:bg-pastel-lavender transition-colors">
                <Rocket className="w-6 h-6 text-black group-hover:animate-pulse" />
             </div>
             <span className="font-pixel text-2xl font-bold text-pastel-charcoal tracking-tighter">RAZA A.</span>
          </div>
          
          {/* RIGHT GROUP (Desktop): Links + Icons */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-baseline space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleScrollTo(item.id)}
                  onMouseEnter={playHover}
                  className={`
                    font-pixel text-lg transition-all duration-200 bg-transparent border-none cursor-pointer relative px-2 py-1
                    ${activeSection === item.id 
                      ? 'text-pastel-charcoal bg-pastel-blue/30 border-2 border-pastel-charcoal shadow-pixel-sm -translate-y-1' 
                      : 'text-pastel-charcoal hover:text-pastel-blue border-2 border-transparent'}
                  `}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border-l-2 border-pastel-charcoal/20 pl-6">
              {/* Mute Toggle */}
              <button
                onClick={handleMuteToggle}
                onMouseEnter={playHover}
                className="p-2 hover:bg-pastel-blue/50 rounded-sm transition-colors text-pastel-charcoal"
                title={muted ? "Unmute Sound" : "Mute Sound"}
                aria-label={muted ? "Unmute Sound" : "Mute Sound"}
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                onMouseEnter={playHover}
                className="ml-2 p-2 bg-pastel-gray border-2 border-pastel-charcoal hover:bg-pastel-blue transition-colors shadow-pixel-sm active:translate-y-[2px] active:shadow-none"
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {theme === 'day' ? <Moon size={20} className="text-pastel-charcoal" /> : <Sun size={20} className="text-pastel-charcoal" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Toggle (Visible only on mobile) */}
          <div className="md:hidden flex items-center gap-4">
             <button
                onClick={handleMuteToggle}
                className="p-2 text-pastel-charcoal"
                aria-label={muted ? "Unmute Sound" : "Mute Sound"}
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

            <button
              onClick={handleThemeToggle}
              className="p-2 bg-pastel-gray border-2 border-pastel-charcoal active:translate-y-[2px]"
              aria-label="Toggle Theme"
            >
              {theme === 'day' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => { setIsOpen(!isOpen); playClick(); }}
              className="inline-flex items-center justify-center p-2 text-pastel-charcoal hover:bg-pastel-blue focus:outline-none border-2 border-transparent hover:border-pastel-charcoal transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden bg-pastel-cream border-b-4 overflow-hidden ${borderColorClass}`}
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 shadow-lg">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleScrollTo(item.id)}
                  className={`
                    block w-full text-left px-3 py-3 font-pixel text-xl transition-colors border-2 hover:border-pastel-charcoal mb-2
                    ${activeSection === item.id 
                      ? 'bg-pastel-blue text-black border-pastel-charcoal' 
                      : 'text-pastel-charcoal border-transparent hover:bg-pastel-blue hover:text-black'}
                  `}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;