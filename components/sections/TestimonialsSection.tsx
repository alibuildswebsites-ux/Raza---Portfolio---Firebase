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
    <>

      {/* --- TESTIMONIALS --- */}
      <Section ref={testimonialsRef} id="testimonials" className="bg-pastel-lavender/30 border-y-4 border-pastel-charcoal relative transition-colors duration-500">
        <PixelCloud top="5%" size="w-24 md:w-32" duration={25} delay={0} className="opacity-50" />
        <PixelCloud top="80%" size="w-32 md:w-48" duration={30} delay={10} className="opacity-50" />
        
        <div className="max-w-4xl mx-auto relative z-10 px-0 sm:px-4">
          {/* 1. Heading */}
          <h2 className="testimonials-heading font-pixel text-3xl sm:text-4xl text-center mb-8 md:mb-16 relative z-10">
            What Clients Say
          </h2>
          
          {/* 2. Testimonial Card */}
          <div className="testimonials-card-container">
            {testimonials.length > 0 ? (
              <div 
                className="bg-pastel-surface border-2 border-pastel-charcoal p-6 md:p-12 shadow-pixel-lg relative mx-2 sm:mx-0 group cursor-pointer"
                onMouseEnter={() => setIsTestimonialPaused(true)}
                onMouseLeave={() => setIsTestimonialPaused(false)}
              >
                <div className="absolute -top-6 left-4 md:left-8 bg-pastel-peach border-2 border-pastel-charcoal p-2 shadow-pixel z-20">
                  <Star className="fill-black text-black" />
                </div>
                
                <div className="overflow-hidden">
                  <div ref={testimonialContentRef} className="relative z-10">
                    <div className="flex gap-1 mb-4 md:mb-6 pt-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} size={20} className="fill-pastel-mint text-pastel-charcoal" />
                        ))}
                    </div>
                    <p className="font-pixel text-xl sm:text-2xl md:text-3xl leading-relaxed mb-6 md:mb-8 text-pastel-charcoal">
                      "{testimonials[currentTestimonial].text}"
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t-2 border-pastel-gray pt-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-pastel-blue rounded-full border-2 border-pastel-charcoal overflow-hidden flex-shrink-0">
                        <img 
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${testimonials[currentTestimonial].avatarSeed || testimonials[currentTestimonial].id}`} 
                            alt="client" 
                            width="48"
                            height="48"
                            className="w-full h-full object-cover"
                          />
                      </div>
                      <div>
                          <div className="font-pixel text-lg sm:text-xl font-bold text-pastel-charcoal">
                              {testimonials[currentTestimonial].clientName || 'Anonymous'}
                          </div>
                          {testimonials[currentTestimonial].companyName && (
                              <div className="font-sans text-sm text-pastel-charcoal/70">
                                  {testimonials[currentTestimonial].companyName}
                              </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {testimonials.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                    <button 
                      onClick={() => { prevTestimonial(); playClick(); }}
                      onMouseEnter={playHover}
                      className="touch-target p-2 border-2 border-pastel-charcoal hover:bg-pastel-blue transition-colors bg-pastel-surface shadow-pixel-sm active:translate-y-1 text-pastel-charcoal focus:outline-none focus:ring-2 focus:ring-pastel-charcoal focus:ring-offset-2"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button 
                      onClick={() => { nextTestimonial(); playClick(); }}
                      onMouseEnter={playHover}
                      className="touch-target p-2 border-2 border-pastel-charcoal hover:bg-pastel-blue transition-colors bg-pastel-surface shadow-pixel-sm active:translate-y-1 text-pastel-charcoal focus:outline-none focus:ring-2 focus:ring-pastel-charcoal focus:ring-offset-2"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center font-pixel text-xl">Testimonials coming soon!</div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

export default TestimonialsSection;