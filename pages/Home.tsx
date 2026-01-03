import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import PixelButton from '../components/ui/PixelButton';
import Footer from '../components/layout/Footer';
import ParticleBackground from '../components/ui/ParticleBackground';
import Typewriter from '../components/ui/Typewriter';
import { PixelCloud, PixelSun, PixelMoon, PixelStars } from '../components/ui/PixelDecorations';
import { 
  Linkedin, ExternalLink, Code, 
  Briefcase, Star, Send, ArrowRight, ArrowLeft, Mail, Github
} from 'lucide-react';
import * as db from '../services/storage';
import { Project, Testimonial } from '../types';
import emailjs from '@emailjs/browser';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

// --- ANIMATION VARIANTS ---

// 1. Simplified fadeInUp with standard easing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

// 2. Header Wrapper (Staggers the Title and the Filters)
const headerWrapperVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

// 3. Grid Variants (Waits for header, then shows all cards at once)
const projectGridVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4, // Wait for header/filters to finish
      staggerChildren: 0  // Animate all cards simultaneously
    }
  }
};

// Section Wrapper
const Section: React.FC<{ children: React.ReactNode; id: string; className?: string }> = ({ children, id, className = '' }) => (
  <section id={id} className={`py-16 md:py-32 px-4 relative overflow-hidden ${className}`}>
    <div className="max-w-7xl mx-auto relative z-10">
      {children}
    </div>
  </section>
);

interface HomeProps {
  startTypewriter?: boolean;
}

const Home: React.FC<HomeProps> = ({ startTypewriter = true }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { playHover, playClick } = useAudio();
  
  // Testimonial State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadData = async () => {
      const p = await db.getProjects();
      const t = await db.getTestimonials();
      setProjects(p.filter(x => x.isVisible));
      setTestimonials(t.filter(x => x.isVisible));
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter Logic
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  }, [projects]);

  const filteredProjects = useMemo(() => filter === 'All' ? projects : projects.filter(p => p.category === filter), [filter, projects]);

  // --- TESTIMONIAL NAVIGATION ---
  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // --- AUTO-SCROLL LOGIC ---
  useEffect(() => {
    if (testimonials.length > 1 && !isTestimonialPaused) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 6000); 
      return () => clearInterval(interval);
    }
  }, [testimonials.length, isTestimonialPaused]);

  // --- CONTACT HANDLER ---
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    const SERVICE_ID = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID || '';
    const TEMPLATE_ID = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID || ''; 
    const PUBLIC_KEY = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY || '';

    const templateParams = {
      from_name: contactForm.name,
      from_email: contactForm.email,
      phone: contactForm.phone,
      message: contactForm.message,
      to_name: "Raza A." 
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      await db.saveMessage(contactForm);
      setFormStatus('success');
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (err) {
      console.error('EmailJS Error:', err);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const testimonialVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

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
    <div className="min-h-screen bg-pastel-cream font-sans text-pastel-charcoal selection:bg-pastel-lavender overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full min-h-[100dvh] pt-[84px] border-b-4 border-pastel-charcoal bg-pastel-blue/10 transition-colors duration-500 overflow-hidden flex flex-col justify-center">
        
        {/* === LAYER 0: DECORATIONS & BACKGROUND === */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <ParticleBackground />
          {theme === 'night' && <PixelStars />}
          
          <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white opacity-40 rounded-full blur-3xl" 
          />

          <div className="absolute top-24 right-4 md:right-8 lg:right-12 z-10">
            <AnimatePresence mode="wait">
               {theme === 'day' ? (
                  <PixelSun key="sun" className="origin-center scale-75 md:scale-100" />
               ) : (
                  <PixelMoon key="moon" className="origin-center scale-75 md:scale-100" />
               )}
            </AnimatePresence>
          </div>

          <div className="absolute top-[84px] left-0 w-full h-[50vh]">
             <PixelCloud top="10%" className="opacity-80 scale-75 md:scale-100" size="w-24 md:w-48" duration={60} delay={0} />
             <PixelCloud top="40%" className="opacity-60 scale-75 md:scale-100" size="w-16 md:w-32" duration={45} delay={20} />
             <PixelCloud top="70%" className="opacity-40 scale-75 md:scale-100" size="w-32 md:w-56" duration={70} delay={10} />
          </div>
        </div>

        {/* === LAYER 1: MAIN CONTENT === */}
        <div className="relative z-10 w-full px-3 md:px-6 lg:px-8 flex flex-col justify-center py-12 md:py-0 h-full flex-grow">
           <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start text-left z-20 max-w-5xl"
           >
              <h1 className="font-pixel text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight cursor-default drop-shadow-sm">
                Hi, I'm <br className="hidden md:block" />
                <span className="bg-pastel-blue text-black px-4 py-2 shadow-pixel inline-block transform hover:scale-105 transition-transform mt-2">Raza A.</span>
              </h1>
              
              <div className="font-mono text-base sm:text-lg md:text-xl mb-8 min-h-[80px] border-l-4 border-pastel-blue pl-6 py-2 bg-pastel-surface/60 backdrop-blur-sm rounded-r-lg text-left w-full max-w-2xl">
                <Typewriter 
                  text="I help small and medium sized businesses establish a strong online presence digitally." 
                  delay={25} 
                  start={startTypewriter}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <PixelButton onClick={scrollToProjects} size="lg" className="w-full sm:w-auto shadow-pixel-lg">View Projects</PixelButton>
                <PixelButton onClick={() => window.open('https://calendly.com/alibuildswebsites/30min', '_blank')} variant="secondary" size="lg" className="w-full sm:w-auto shadow-pixel-lg">Start Project</PixelButton>
              </div>
           </motion.div>
        </div>
      </div>

      {/* --- ABOUT ME --- */}
      <Section id="about" className="bg-pastel-surface/90 backdrop-blur-sm transition-colors duration-500">
        <div className="flex flex-col items-center max-w-4xl mx-auto">
          {/* Text Block - Fades in Up */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="font-pixel text-3xl sm:text-4xl mb-6 inline-flex items-center gap-3">
              <span className="w-3 h-8 sm:h-10 bg-pastel-peach border-2 border-pastel-charcoal"></span>
              About Me
            </h2>
            <div className="prose prose-lg text-pastel-charcoal space-y-4 font-medium text-base sm:text-lg max-w-2xl mx-auto">
              <p>Hi, nice to see you here. I'm Raza A.</p>
              <p>For the past few years, I've been helping businesses turn their outdated or underperforming websites into something that actually works for them. If you're frustrated by low conversions or worried about standing out in a crowded market, I get it. I've been there helping others bridge that gap.</p>
              <p>I'm currently pursuing my career in data science, and creating digital experiences that blend clean, intuitive design with smart development.</p>
              <p className="font-bold">Let's chat about building solutions that sets you apart.</p>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <a 
                href="https://linkedin.com/in/alibuildswebsites" 
                target="_blank" 
                rel="noreferrer" 
                onMouseEnter={playHover}
                onClick={playClick}
                className="flex items-center justify-center gap-2 border-2 border-pastel-charcoal px-4 py-2 hover:bg-pastel-blue transition-colors shadow-pixel-sm text-pastel-charcoal bg-pastel-surface"
              >
                <Linkedin size={20} /> LinkedIn
              </a>
              <a 
                href="mailto:alibuildswebsites@gmail.com" 
                target="_blank" 
                rel="noreferrer" 
                onMouseEnter={playHover}
                onClick={playClick}
                className="flex items-center justify-center gap-2 border-2 border-pastel-charcoal px-4 py-2 hover:bg-pastel-mint transition-colors shadow-pixel-sm text-pastel-charcoal bg-pastel-surface"
              >
                <Mail size={20} /> Email Me
              </a>
            </div>
          </motion.div>

          {/* Stats Cards - Staggered */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            {[
              { label: 'Years Exp', value: '5+', icon: <Briefcase /> },
              { label: 'Projects', value: '20+', icon: <Code /> },
              { label: 'Satisfaction', value: '100%', icon: <Star /> },
              { label: 'Availability', value: 'Project', icon: <Briefcase /> }
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                onMouseEnter={playHover}
                className="bg-pastel-cream border-2 border-pastel-charcoal p-3 sm:p-6 shadow-pixel hover:translate-y-[-4px] transition-transform text-left"
              >
                <div className="mb-2 text-pastel-blue scale-75 sm:scale-100 origin-left">{stat.icon}</div>
                <div className="font-pixel text-2xl sm:text-3xl md:text-4xl mb-1 text-pastel-charcoal">{stat.value}</div>
                <div className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-pastel-charcoal">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* --- PROJECTS --- */}
      <Section id="projects" className="bg-pastel-surface border-t-4 border-pastel-charcoal transition-colors duration-500">
        <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8">
          
          {/* GROUPED HEADER & FILTERS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={headerWrapperVariants}
            className="mb-12"
          >
            {/* 1. Header Text */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col justify-center items-center mb-8 gap-6 text-center"
            >
              <div className="w-full">
                <h2 className="font-pixel text-3xl sm:text-4xl mb-2 sm:mb-4">My Projects</h2>
                <p className="text-base sm:text-lg max-w-2xl mx-auto">Selected works demonstrating value and functionality.</p>
              </div>
            </motion.div>
            
            {/* 2. Filter Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-3 w-full"
            >
              {categories.map((name) => (
                <button 
                  key={name}
                  onClick={() => { setFilter(name); playClick(); }}
                  onMouseEnter={playHover}
                  className={`
                    font-pixel text-lg px-4 py-2 border-2 border-pastel-charcoal transition-all duration-200
                    ${filter === name 
                      ? 'bg-pastel-blue shadow-none translate-y-1 text-black' 
                      : 'bg-pastel-surface hover:bg-pastel-gray shadow-pixel hover:-translate-y-1 active:shadow-none active:translate-y-0 text-pastel-charcoal'
                    }
                  `}
                >
                  {name}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* 3. Project Grid */}
          {!isLoading ? (
            <motion.div 
                // Grid Animation triggered independently or flow after header (via delayChildren)
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }} 
                variants={projectGridVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 min-h-[200px]"
            >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout // Layout prop kept here for filtering transitions
                      variants={fadeInUp}
                      exit="exit"
                      whileHover={{ scale: 1.02, y: -5, zIndex: 10 }}
                      onMouseEnter={playHover}
                      className="group bg-pastel-surface border-2 border-pastel-charcoal shadow-pixel flex flex-col h-full hover:shadow-pixel-lg transition-shadow duration-300 relative"
                    >
                       {/* --- FLOATING ICON BADGE --- */}
                       <div className="absolute -top-4 -right-4 w-12 h-12 bg-pastel-blue border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel z-20 transform rotate-0 group-hover:rotate-[9deg] transition-transform duration-300">
                          <Code size={24} className="text-black" />
                       </div>

                      {/* Content Body */}
                      <div className="p-6 md:p-8 flex flex-col flex-1 h-full">
                        <div className="mb-6">
                          <div className="inline-block bg-pastel-lavender border-2 border-pastel-charcoal px-3 py-1 shadow-sm">
                             <span className="font-pixel text-xs font-bold tracking-widest uppercase text-black">
                                {project.category}
                             </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-pixel text-3xl leading-none group-hover:text-pastel-blue transition-colors text-pastel-charcoal">
                            {project.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 mb-8 font-sans text-sm leading-relaxed flex-grow">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.technologies.slice(0, 4).map(t => (
                            <span key={t} className="border-2 border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex gap-3 h-12">
                          <a 
                            href={project.demoUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={playClick} 
                            onMouseEnter={playHover}
                            className="flex-1 bg-pastel-charcoal text-pastel-cream font-pixel text-lg border-2 border-pastel-charcoal hover:bg-pastel-blue hover:text-black hover:border-pastel-charcoal transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <ExternalLink size={18} /> Live Demo
                          </a>
                          
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              onClick={playClick} 
                              onMouseEnter={playHover}
                              className="w-14 border-2 border-pastel-charcoal flex items-center justify-center hover:bg-gray-100 transition-colors bg-pastel-surface text-pastel-charcoal" 
                              title="View Code"
                            >
                              <Github size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredProjects.length === 0 && (
                   <motion.div 
                     variants={fadeInUp}
                     // Force visibility if list is empty
                     initial="hidden" 
                     animate="visible"
                     className="w-full col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 opacity-50 bg-gray-50 border-2 border-dashed border-gray-300"
                   >
                      <div className="w-16 h-16 bg-gray-200 border-2 border-gray-400 mb-4 flex items-center justify-center">
                        <Code className="text-gray-400" />
                      </div>
                      <p className="font-pixel text-xl text-black">Projects coming soon.</p>
                   </motion.div>
                )}
            </motion.div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <span className="font-pixel text-xl animate-pulse text-pastel-charcoal">Loading projects...</span>
            </div>
          )}
        </div>
      </Section>

      {/* --- TESTIMONIALS --- */}
      <Section id="testimonials" className="bg-pastel-lavender/30 border-y-4 border-pastel-charcoal relative transition-colors duration-500">
        <PixelCloud top="5%" size="w-24 md:w-32" duration={50} delay={0} className="opacity-50" />
        <PixelCloud top="80%" size="w-32 md:w-48" duration={60} delay={10} className="opacity-50" />
        
        <h2 className="font-pixel text-3xl sm:text-4xl text-center mb-8 md:mb-16 relative z-10">What Clients Say</h2>
        
        <div className="max-w-4xl mx-auto relative z-10 px-0 sm:px-4">
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
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentTestimonial}
                    variants={testimonialVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                     <div className="flex gap-1 mb-4 md:mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} size={20} className="fill-pastel-mint text-pastel-charcoal" />
                        ))}
                     </div>
                     <p className="font-pixel text-xl sm:text-2xl md:text-3xl leading-relaxed mb-6 md:mb-8 text-pastel-charcoal">
                       "{testimonials[currentTestimonial].text}"
                     </p>
                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t-2 border-pastel-gray pt-6">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-pastel-blue rounded-full border-2 border-pastel-charcoal overflow-hidden flex-shrink-0">
                         {/* Using generic avatar if photoUrl is empty */}
                         <img 
                            src={testimonials[currentTestimonial].photoUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${testimonials[currentTestimonial].id}`} 
                            alt="client" 
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
                  </motion.div>
                </AnimatePresence>
              </div>

              {testimonials.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                  <button 
                    onClick={() => { prevTestimonial(); playClick(); }}
                    onMouseEnter={playHover}
                    className="p-2 border-2 border-pastel-charcoal hover:bg-pastel-blue transition-colors bg-pastel-surface shadow-pixel-sm active:translate-y-1 text-pastel-charcoal"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    onClick={() => { nextTestimonial(); playClick(); }}
                    onMouseEnter={playHover}
                    className="p-2 border-2 border-pastel-charcoal hover:bg-pastel-blue transition-colors bg-pastel-surface shadow-pixel-sm active:translate-y-1 text-pastel-charcoal"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {!isTestimonialPaused && testimonials.length > 1 && (
                 <motion.div 
                    key={currentTestimonial} // resets on change
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-pastel-blue/30"
                 />
              )}
            </div>
          ) : (
            <div className="text-center font-pixel text-xl">Testimonials coming soon!</div>
          )}
        </div>
      </Section>

      {/* --- CONTACT --- */}
      <Section id="contact" className="bg-pastel-surface mb-12 md:mb-20 transition-colors duration-500">
        <div className="max-w-3xl mx-auto flex flex-col gap-16">
          {/* Form */}
          <div className="w-full">
            <div className="text-center mb-8">
              <h2 className="font-pixel text-3xl sm:text-4xl mb-4 text-pastel-charcoal">Let's Build Something Great</h2>
              <p className="mb-0 text-base sm:text-lg text-gray-700">Have a project in mind? I'm available for freelance work. Send me the details!</p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4 md:space-y-6 bg-pastel-cream p-5 sm:p-8 border-2 border-pastel-charcoal shadow-pixel relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Send size={100} />
              </div>
              <div>
                <label className="block font-pixel text-lg mb-2 text-pastel-charcoal">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.name}
                  onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block font-pixel text-lg mb-2 text-pastel-charcoal">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
                  placeholder="john@example.com"
                />
              </div>
               <div>
                <label className="block font-pixel text-lg mb-2 text-pastel-charcoal">Phone (Optional)</label>
                <input 
                  type="tel" 
                  value={contactForm.phone}
                  onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                  className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="block font-pixel text-lg mb-2 text-pastel-charcoal">Project Details</label>
                <textarea 
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
                  placeholder="Tell me about your website needs..."
                />
              </div>
              <div className="relative z-10">
                {formStatus === 'success' ? (
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-pastel-mint border-2 border-pastel-charcoal p-4 text-center font-bold flex flex-col items-center justify-center gap-2 shadow-pixel w-full py-6 text-black"
                    >
                      <span className="text-3xl bg-white rounded-full w-12 h-12 flex items-center justify-center border-2 border-pastel-charcoal">✓</span> 
                      <span className="text-lg">Message Sent Successfully!</span>
                      <span className="text-sm font-normal">I'll get back to you within 24 hours.</span>
                    </motion.div>
                ) : formStatus === 'error' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-200 border-2 border-pastel-charcoal p-4 text-center font-bold shadow-pixel w-full text-black"
                    >
                      <span className="text-xl mr-2">⚠</span> Something went wrong. Please try again.
                    </motion.div>
                ) : (
                    <PixelButton type="submit" size="lg" className="w-full" isLoading={formStatus === 'submitting'}>
                      Send Message
                    </PixelButton>
                )}
              </div>
            </form>
          </div>
          
          <div className="w-full flex flex-col items-center">
             <div className="text-center mb-6">
                <h3 className="font-pixel text-2xl text-pastel-charcoal">Or Schedule a Free 30-Minute Consultation</h3>
             </div>
             <div className="w-full bg-pastel-surface border-2 border-pastel-charcoal shadow-pixel relative overflow-hidden h-[500px] sm:h-[600px]">
                 <iframe 
                   src="https://calendly.com/alibuildswebsites/30min?embed_domain=1&embed_type=Inline&background_color=ffffff&text_color=4a4a4a&primary_color=a8daff" 
                   width="100%" 
                   height="100%"
                   frameBorder="0"
                   title="Schedule a consultation"
                 ></iframe>
             </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default Home;