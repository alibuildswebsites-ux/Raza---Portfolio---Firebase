import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import ParticleBackground from '../ui/ParticleBackground';
import { PixelCloud, PixelSun, PixelMoon, PixelStars } from '../ui/PixelDecorations';
import Typewriter from '../ui/Typewriter';
import PixelButton from '../ui/PixelButton';

interface HeroSectionProps {
  startTypewriter?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ startTypewriter = true }) => {
  const { theme } = useTheme();

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      const headerOffset = 85; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] pt-[84px] border-b-4 border-pastel-charcoal bg-pastel-blue/10 transition-colors duration-500 overflow-hidden flex flex-col justify-center">
      
      {/* === LAYER 0: DECORATIONS & BACKGROUND === */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <ParticleBackground />
        {theme === 'night' && <PixelStars />}
        
        <div 
           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white opacity-40 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" 
        />

        <div className="absolute top-24 right-4 md:right-8 lg:right-12 z-10">
             {theme === 'day' ? (
                <PixelSun key="sun" className="origin-center scale-75 md:scale-100" />
             ) : (
                <PixelMoon key="moon" className="origin-center scale-75 md:scale-100" />
             )}
        </div>

        <div className="absolute top-[84px] left-0 w-full h-[50vh]">
           {/* Static Clouds */}
           <PixelCloud isStatic top={100} right="10%" size="w-20 md:w-32" className="opacity-90 z-20" />
           <PixelCloud isStatic top="15%" left="15%" size="w-16 md:w-24" className="opacity-70" />

           {/* Moving Clouds */}
           <PixelCloud top="10%" className="opacity-80 scale-75 md:scale-100" size="w-24 md:w-48" duration={30} delay={0} />
           <PixelCloud top="40%" className="opacity-60 scale-75 md:scale-100" size="w-16 md:w-32" duration={22} delay={20} />
           <PixelCloud top="70%" className="opacity-40 scale-75 md:scale-100" size="w-32 md:w-56" duration={35} delay={10} />
        </div>
      </div>

      {/* === LAYER 1: MAIN CONTENT === */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end md:justify-center px-4 md:px-8 lg:px-12 max-w-5xl flex-grow pb-12 md:pb-0">
         
         <h1 className="font-pixel text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 md:mb-6 leading-tight cursor-default drop-shadow-sm mt-[20vh] md:mt-0 text-pastel-charcoal">
           Hi, I'm <br className="hidden md:block" />
           <span className="bg-pastel-blue text-black px-4 py-2 shadow-pixel inline-block transform hover:scale-105 transition-transform mt-2">Raza A.</span>
         </h1>
         
         <div className="font-mono text-base sm:text-lg md:text-xl mb-12 min-h-[80px] border-l-4 border-pastel-blue pl-6 py-2 bg-transparent rounded-r-lg text-left w-full max-w-2xl flex items-center">
           <Typewriter 
             text="I help small and medium sized businesses establish a strong online presence digitally." 
             delay={25} 
             start={startTypewriter}
           />
         </div>
            
         <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <PixelButton onClick={scrollToProjects} size="lg" className="w-full sm:w-auto shadow-pixel-lg">View Projects</PixelButton>
            <PixelButton onClick={() => window.open('https://calendly.com/alibuildswebsites/30min', '_blank', 'noopener,noreferrer')} variant="secondary" size="lg" className="w-full sm:w-auto shadow-pixel-lg">Start Project</PixelButton>
         </div>
         
      </div>
    </div>
  );
};

export default HeroSection;
