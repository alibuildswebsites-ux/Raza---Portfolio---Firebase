import React, { useState, useEffect, memo } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  start?: boolean;
}

const Typewriter = memo(({ text, delay = 50, start = true }: TypewriterProps) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (start && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, start]);

  return (
    <span className="inline-block break-words min-h-[80px] leading-snug">
      {currentText}
      <span className="animate-pulse inline-block w-[2px] h-[1em] bg-pastel-charcoal ml-1 align-middle"></span>
    </span>
  );
});

export default Typewriter;