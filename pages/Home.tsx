import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactForm from "../components/sections/ContactForm";

// Section Wrapper
const Section = React.forwardRef<HTMLElement, { children: React.ReactNode; id: string; className?: string }>(({ children, id, className = '' }, ref) => (
  <section ref={ref} id={id} className={`py-16 md:py-32 px-4 relative overflow-hidden ${className}`}>
    <div className="max-w-7xl mx-auto relative z-10">
      {children}
    </div>
  </section>
));

interface HomeProps {
  startTypewriter?: boolean;
}

const Home: React.FC<HomeProps> = ({ startTypewriter = true }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-[100dvh] bg-pastel-cream font-sans text-pastel-charcoal selection:bg-pastel-lavender overflow-x-hidden transition-colors duration-500">
        
        <HeroSection startTypewriter={startTypewriter} />
        <AboutSection />
        <ProjectsSection />
        <TestimonialsSection />

        {/* --- CONTACT --- */}
        <Section id="contact" className="bg-pastel-surface mb-12 md:mb-20 transition-colors duration-500">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* 1. Header & Form */}
            <div className="w-full lg:w-1/2 contact-form-container">
              <div className="text-center mb-8">
                <h2 className="font-pixel text-3xl sm:text-4xl mb-4 text-pastel-charcoal">Let's Build Something Great</h2>
                <p className="mb-0 text-base sm:text-lg text-pastel-charcoal">Have a project in mind? I'm available for freelance work. Send me the details!</p>
              </div>
              <ContactForm />
            </div>
            
            {/* 2. Calendly Section */}
            <div className="w-full lg:w-1/2 flex flex-col items-center contact-calendly-container sticky top-24">
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
                     loading="lazy"
                     sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                   ></iframe>
               </div>
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
