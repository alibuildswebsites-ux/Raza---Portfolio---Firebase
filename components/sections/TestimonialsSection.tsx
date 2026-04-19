import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { getTestimonials } from '../../services/storage';
import { Testimonial } from '../../types';
import { PixelCloud } from '../ui/PixelDecorations';

const Section = React.forwardRef<HTMLElement, { children: React.ReactNode; id: string; className?: string }>(({ children, id, className = '' }, ref) => (
  <section ref={ref} id={id} className={`w-full py-16 md:py-24 relative overflow-hidden ${className}`}>
    {children}
  </section>
));

const TestimonialsSection = () => {
  const { playHover, playClick } = useAudio();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  const testimonialsRef = useRef<HTMLElement>(null);
  const testimonialContentRef = useRef<HTMLDivElement>(null);
  const lastDirection = useRef<'next' | 'prev'>('next');

  useEffect(() => {
    const loadData = async () => {
      const t = await getTestimonials();
      setTestimonials(t.filter(x => x.isVisible));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const nextTestimonial = () => {
    playClick();
    lastDirection.current = 'next';
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    playClick();
    lastDirection.current = 'prev';
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (isLoading || testimonials.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".testimonials-heading", {
        y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".testimonials-heading", start: "top 85%", toggleActions: "play none none reverse" }
      });

      gsap.from(".testimonials-card-container", {
        y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".testimonials-card-container", start: "top 85%", toggleActions: "play none none reverse" }
      });
    }, testimonialsRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [isLoading, testimonials.length]);

  useLayoutEffect(() => {
    if (testimonials.length === 0 || isLoading) return;
    
    gsap.fromTo(testimonialContentRef.current, 
      { x: lastDirection.current === 'next' ? 50 : -50, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.3 }
    );
  }, [currentTestimonial, isLoading, testimonials.length]);

  useEffect(() => {
    if (testimonials.length > 1 && !isTestimonialPaused) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 6000); 
      return () => clearInterval(interval);
    }
  }, [testimonials.length, isTestimonialPaused]);

  return (
    <Section ref={testimonialsRef} id="testimonials" className="bg-pastel-lavender/30 border-y-4 border-pastel-charcoal relative transition-colors duration-500">
      <PixelCloud top="5%" size="w-24 md:w-32" duration={25} delay={0} className="opacity-50" />
      <PixelCloud top="80%" size="w-32 md:w-48" duration={30} delay={10} className="opacity-50" />
      
      <div className="max-w-4xl mx-auto relative z-10 px-0 sm:px-4">
        <div className="testimonials-heading flex flex-col items-center justify-center mb-10 sm:mb-16 text-center px-4">
          <h2 className="font-pixel text-3xl sm:text-4xl mb-2 sm:mb-4 text-pastel-charcoal">Client Feedback</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto">What others say about working together.</p>
        </div>
        
        <div className="testimonials-card-container px-2 sm:px-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 bg-pastel-pink animate-pulse mb-6 border-2 border-pastel-charcoal shadow-pixel"></div>
            </div>
          ) : testimonials.length > 0 ? (
            <div 
              className="bg-pastel-cream border-2 border-pastel-charcoal shadow-pixel p-6 sm:p-8 md:p-12 relative transition-all duration-300 min-h-[300px] flex flex-col justify-center"
              onMouseEnter={() => setIsTestimonialPaused(true)}
              onMouseLeave={() => setIsTestimonialPaused(false)}
            >
              <div 
                ref={testimonialContentRef} 
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="mb-6 flex gap-1 bg-pastel-surface border-2 border-pastel-charcoal p-2 shadow-pixel-sm transition-colors duration-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < testimonials[currentTestimonial].rating ? "currentColor" : "none"} 
                      className={`transition-colors duration-300 ${i < testimonials[currentTestimonial].rating ? "text-pastel-yellow" : "text-pastel-gray/40"}`} 
                    />
                  ))}
                </div>
                
                <p className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed mb-8 sm:mb-12 italic opacity-90 text-pastel-charcoal">
                  "{testimonials[currentTestimonial].text}"
                </p>
                
                <div className="mt-auto pt-6 border-t-2 border-pastel-charcoal w-full transition-colors duration-500">
                  <div className="flex items-center justify-center gap-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${testimonials[currentTestimonial].avatarSeed || testimonials[currentTestimonial].id}`} 
                      alt={testimonials[currentTestimonial].clientName || 'Client Avatar'} 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-pastel-charcoal bg-white shadow-pixel-sm"
                      loading="lazy"
                    />
                    <div className="text-left">
                      <h4 className="font-pixel text-lg sm:text-xl text-pastel-charcoal">
                        {testimonials[currentTestimonial].clientName || 'Anonymous Client'}
                      </h4>
                      {testimonials[currentTestimonial].companyName && (
                        <p className="text-sm font-bold opacity-70 mt-1 uppercase text-pastel-charcoal">
                          {testimonials[currentTestimonial].companyName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {testimonials.length > 1 && (
                <>
                  <button 
                    onClick={prevTestimonial}
                    className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 bg-pastel-blue hover:bg-pastel-pink text-pastel-charcoal border-2 border-pastel-charcoal p-2 sm:p-3 shadow-pixel transition-colors z-20"
                    aria-label="Previous testimonial"
                    onMouseEnter={playHover}
                  >
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 bg-pastel-blue hover:bg-pastel-pink text-pastel-charcoal border-2 border-pastel-charcoal p-2 sm:p-3 shadow-pixel transition-colors z-20"
                    aria-label="Next testimonial"
                    onMouseEnter={playHover}
                  >
                    <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-pastel-cream border-2 border-pastel-charcoal p-8 text-center shadow-pixel transition-colors duration-500 text-pastel-charcoal">
              <p>No testimonials available yet.</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default TestimonialsSection;
