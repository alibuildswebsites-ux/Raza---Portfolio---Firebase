
import React from 'react';
import { m, HTMLMotionProps } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';

// Use intersection type to combine HTML attributes with Motion props properly
type PixelButtonProps = HTMLMotionProps<"button"> & {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
};

const PixelButton: React.FC<PixelButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  className = '',
  disabled,
  onClick,
  onMouseEnter,
  ...props 
}) => {
  const { playHover, playClick } = useAudio();
  
  // Updated focus styles for better A11y (Visible Focus Ring)
  const baseStyles = "relative font-pixel uppercase tracking-wide border-2 border-pastel-charcoal transition-all duration-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variants = {
    // Force text-black for colored buttons to ensure readability in Night (Neon) mode
    primary: "bg-pastel-blue hover:bg-pastel-lavender text-black shadow-pixel active:shadow-pixel-press active:translate-y-[3px] active:translate-x-[3px]",
    secondary: "bg-pastel-surface hover:bg-pastel-gray text-pastel-charcoal shadow-pixel active:shadow-pixel-press active:translate-y-[3px] active:translate-x-[3px]",
    danger: "bg-red-400 hover:bg-red-500 text-white shadow-pixel active:shadow-pixel-press active:translate-y-[3px] active:translate-x-[3px]"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm h-8",
    md: "px-6 py-3 text-base h-12",
    lg: "px-8 py-4 text-xl h-16"
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) playClick();
    if (onClick) onClick(e);
  };

  return (
    <m.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : children}
    </m.button>
  );
};

export default React.memo(PixelButton);
