import { createContext, useContext, useState, useRef, useEffect, useMemo, useCallback, PropsWithChildren } from 'react';

interface AudioContextType {
  muted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playThemeSwitch: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: PropsWithChildren) => {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('sound_muted') === 'true';
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('sound_muted', String(muted));
  }, [muted]);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playOscillator = useCallback((
    type: OscillatorType,
    freqStart: number,
    freqEnd: number,
    duration: number,
    vol: number = 0.1
  ) => {
    if (muted) return;
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
    if (freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [muted, initAudio]);

  const playHover = useCallback(() => {
    playOscillator('sine', 800, 400, 0.05, 0.05);
  }, [playOscillator]);

  const playClick = useCallback(() => {
    playOscillator('square', 150, 100, 0.05, 0.05);
  }, [playOscillator]);

  const playThemeSwitch = useCallback(() => {
    if (muted) return;
    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; 
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.6);
    });
  }, [muted, initAudio]);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const value = useMemo(() => ({
    muted, toggleMute, playHover, playClick, playThemeSwitch
  }), [muted, toggleMute, playHover, playClick, playThemeSwitch]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
