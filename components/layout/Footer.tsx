
import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {

  return (
    <footer className="bg-footer-bg text-footer-text pt-16 pb-8 border-t-4 border-pastel-blue relative overflow-hidden transition-colors duration-500">
      {/* 
        Container Padding Strategy (Matches Navbar):
        - Mobile: px-3 (12px)
        - Tablet: px-6 (24px)
        - Desktop: px-8 (32px)
      */}
      <div className="w-full px-3 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          
          {/* Branding Section - Left on Desktop */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
            <h3 className="font-pixel text-4xl mb-4 text-white tracking-widest drop-shadow-md">RAZA A.</h3>
            <p className="text-footer-muted mb-8 max-w-sm text-lg leading-relaxed opacity-90 font-light">
              Helping small and medium sized businesses establish a strong online presence digitally.
            </p>
            
            <div className="flex gap-4">
               {/* Social Icons */}
               <a 
                 href="https://linkedin.com/in/alibuildswebsites" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="group relative"
                 title="LinkedIn"
               >
                 <div className="absolute inset-0 bg-footer-shadow translate-y-1 translate-x-1 border-2 border-pastel-gray"></div>
                 <div className="relative w-12 h-12 bg-pastel-lavender border-2 border-white flex items-center justify-center text-pastel-charcoal transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-active:translate-y-0 group-active:translate-x-0">
                    <Linkedin size={24} />
                 </div>
               </a>
               
               <a 
                 href="mailto:alibuildswebsites@gmail.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="group relative"
                 title="Send Email"
               >
                 <div className="absolute inset-0 bg-footer-shadow translate-y-1 translate-x-1 border-2 border-pastel-gray"></div>
                 <div className="relative w-12 h-12 bg-pastel-mint border-2 border-white flex items-center justify-center text-pastel-charcoal transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-active:translate-y-0 group-active:translate-x-0">
                    <Mail size={24} />
                 </div>
               </a>
            </div>
          </div>

          {/* Contact Section - Right on Desktop */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right w-full order-1 md:order-2">
             <h4 className="font-pixel text-2xl mb-6 text-pastel-peach border-b-2 border-pastel-peach inline-block pb-1">Get In Touch</h4>
             <ul className="space-y-4 w-full flex flex-col items-center md:items-end">
               <li>
                 <a 
                    href="mailto:alibuildswebsites@gmail.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 group transition-all p-2 rounded hover:bg-white/5"
                 >
                    <div className="bg-pastel-charcoal border border-pastel-gray p-2 text-pastel-cream group-hover:border-pastel-blue group-hover:text-pastel-blue transition-colors rounded-sm">
                      <Mail size={18} />
                    </div>
                    <span className="font-pixel text-xl text-footer-text group-hover:text-pastel-blue tracking-wide">alibuildswebsites@gmail.com</span>
                 </a>
               </li>
               <li>
                 <a 
                    href="https://linkedin.com/in/alibuildswebsites" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 group transition-all p-2 rounded hover:bg-white/5"
                 >
                   <div className="bg-pastel-charcoal border border-pastel-gray p-2 text-pastel-cream group-hover:border-pastel-blue group-hover:text-pastel-blue transition-colors rounded-sm">
                      <Linkedin size={18} />
                   </div>
                   <span className="font-pixel text-xl text-footer-text group-hover:text-pastel-blue tracking-wide">linkedin.com/in/alibuildswebsites</span>
                 </a>
               </li>
             </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-white/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Copyright */}
          <div className="text-center md:text-left order-2 md:order-1">
            <p className="font-pixel text-base text-gray-400 opacity-60 tracking-wide">© 2024 Raza A. All rights reserved.</p>
          </div>
          
          {/* Made With Badge (Centered) */}
          <div className="flex justify-center order-1 md:order-2">
             <div className="flex flex-wrap justify-center items-center gap-2 text-xs md:text-sm text-gray-400 bg-black/20 px-4 py-2 rounded-full border border-white/5 text-center">
                <span>Made with</span>
                <svg width="16" height="14" viewBox="0 0 8 7" className="animate-pulse" shapeRendering="crispEdges">
                  {/* Left Half (Light Pink) */}
                  <path d="M1 0h2v1H1z M0 1h4v3H0z M1 4h3v1H1z M2 5h2v1H2z M3 6h1v1H3z" fill="#FF9EAA" />
                  
                  {/* Right Half (Dark Pink) */}
                  <path d="M5 0h2v1H5z M4 1h4v3H4z M4 4h3v1H4z M4 5h2v1H4z M4 6h1v1H4z" fill="#FF2A6D" />
                </svg>
                <span>using React & Tailwind</span>
             </div>
          </div>
          
          {/* Empty spacer to balance grid */}
          <div className="hidden md:block order-3"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
