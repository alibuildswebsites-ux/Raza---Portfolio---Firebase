import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Mail, Briefcase, Code, Star } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const Section = React.forwardRef<HTMLElement, { children: React.ReactNode; id: string; className?: string }>(({ children, id, className = '' }, ref) => (
  <section ref={ref} id={id} className={`py-16 md:py-32 px-4 relative overflow-hidden ${className}`}>
    <div className="max-w-7xl mx-auto relative z-10">
      {children}
    </div>
  </section>
));

const AboutSection = () => {
  const { playHover, playClick } = useAudio();
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(aboutContentRef.current, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutSectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.from(".about-heading", {
        y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".about-heading", start: "top 85%", toggleActions: "play none none reverse" }
      });

      gsap.from(".about-desc", {
        y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".about-desc", start: "top 85%", toggleActions: "play none none reverse" }
      });

      gsap.from(".about-buttons", {
        y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".about-buttons", start: "top 85%", toggleActions: "play none none reverse" }
      });

      gsap.from(".about-stat-card", {
        y: 40, opacity: 0, duration: 0.6,
        stagger: { amount: 0.4, grid: "auto", from: "start" },
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-stats-grid", start: "top 85%", toggleActions: "play none none reverse" }
      });
    }, aboutSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>

      {/* --- ABOUT ME --- */}
      <Section ref={aboutSectionRef} id="about" className="bg-pastel-surface/90 backdrop-blur-sm transition-colors duration-500">
        <div 
          ref={aboutContentRef}
          className="flex flex-col items-center max-w-4xl mx-auto opacity-0"
        >
          {/* 1. Heading */}
          <h2 
            className="about-heading font-pixel text-3xl sm:text-4xl mb-6 inline-flex items-center gap-3 text-center"
          >
            <span className="w-3 h-8 sm:h-10 bg-pastel-peach border-2 border-pastel-charcoal"></span>
            About Me
          </h2>

          {/* 2. Description */}
          <div
            className="about-desc text-center mb-12"
          >
            <div className="prose prose-lg text-pastel-charcoal space-y-4 font-medium text-base sm:text-lg max-w-2xl mx-auto">
              <p>Hi, nice to see you here. I'm Raza A.</p>
              <p>For the past few years, I've been helping businesses turn their outdated or underperforming websites into something that actually works for them. If you're frustrated by low conversions or worried about standing out in a crowded market, I get it. I've been there helping others bridge that gap.</p>
              <p>I'm currently pursuing my career in data science, and creating digital experiences that blend clean, intuitive design with smart development.</p>
              <p className="font-bold">Let's chat about building solutions that sets you apart.</p>
            </div>
          </div>
            
          {/* 3. Buttons (Links) */}
          <div className="about-buttons mt-0 mb-12 flex justify-center gap-4">
              <a 
                href="https://linkedin.com/in/alibuildswebsites" 
                target="_blank" 
                rel="noreferrer noopener" 
                onMouseEnter={playHover}
                onClick={playClick}
                className="flex items-center justify-center gap-2 border-2 border-pastel-charcoal px-4 py-2 hover:bg-pastel-blue transition-colors shadow-pixel-sm text-pastel-charcoal bg-pastel-surface focus:outline-none focus:ring-2 focus:ring-pastel-charcoal focus:ring-offset-2"
              >
                <Linkedin size={20} /> LinkedIn
              </a>
              <a 
                href="mailto:alibuildswebsites@gmail.com" 
                target="_blank" 
                rel="noreferrer noopener" 
                onMouseEnter={playHover}
                onClick={playClick}
                className="flex items-center justify-center gap-2 border-2 border-pastel-charcoal px-4 py-2 hover:bg-pastel-mint transition-colors shadow-pixel-sm text-pastel-charcoal bg-pastel-surface focus:outline-none focus:ring-2 focus:ring-pastel-charcoal focus:ring-offset-2"
              >
                <Mail size={20} /> Email Me
              </a>
          </div>

          {/* 4. Stats Grid */}
          <div 
            className="about-stats-grid grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            {[
              { label: 'Years Exp', value: '5+', icon: <Briefcase /> },
              { label: 'Projects', value: '20+', icon: <Code /> },
              { label: 'Satisfaction', value: '100%', icon: <Star /> },
              { label: 'Availability', value: 'Project', icon: <Briefcase /> }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                onMouseEnter={playHover}
                className="about-stat-card bg-pastel-cream border-2 border-pastel-charcoal p-3 sm:p-6 shadow-pixel hover:translate-y-[-4px] transition-transform text-left"
              >
                <div className="mb-2 text-pastel-blue scale-75 sm:scale-100 origin-left">{stat.icon}</div>
                <div className="font-pixel text-2xl sm:text-3xl md:text-4xl mb-1 text-pastel-charcoal">{stat.value}</div>
                <div className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-pastel-charcoal">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default AboutSection;