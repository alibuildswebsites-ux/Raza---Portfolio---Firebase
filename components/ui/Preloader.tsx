
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PixelMoon, PixelCloud, PixelStars } from './PixelDecorations';
import Typewriter from './Typewriter';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Minimum load time of 2 seconds
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exit ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-[#100b21] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <PixelStars />
        
        <div className="absolute top-10 right-10 md:top-20 md:right-20">
           <PixelMoon />
        </div>
        
        <PixelCloud top="10%" size="w-32 md:w-48" duration={25} className="opacity-20" />
        <PixelCloud top="30%" size="w-24 md:w-32" duration={35} delay={2} className="opacity-10" />
        <PixelCloud top="60%" size="w-40 md:w-56" duration={20} delay={5} className="opacity-30" />
        <PixelCloud top="80%" size="w-20 md:w-28" duration={40} delay={1} className="opacity-10" />
      </div>

      {/* Greeting Text */}
      <div className="absolute bottom-[20%] w-full flex justify-center px-4 z-20">
        <div className="font-pixel text-2xl md:text-3xl text-white bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] inline-block">
             <Typewriter text="Hi, nice to see you here. I'm Raza A." delay={30} />
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
