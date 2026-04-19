import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ExternalLink, Github, Code } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { getProjects } from '../../services/storage';
import { Project } from '../../types';

const Section = React.forwardRef<HTMLElement, { children: React.ReactNode; id: string; className?: string }>(({ children, id, className = '' }, ref) => (
  <section ref={ref} id={id} className={`w-full py-16 md:py-24 relative overflow-hidden ${className}`}>
    {children}
  </section>
));

const ProjectsSection = () => {
  const { playHover, playClick } = useAudio();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const projectsRef = useRef<HTMLDivElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const p = await getProjects();
      setProjects(p.filter(x => x.isVisible));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  }, [projects]);

  const filteredProjects = useMemo(() => filter === 'All' ? projects : projects.filter(p => p.category === filter), [filter, projects]);

  const onFilterChange = (newFilter: string) => {
    if (newFilter === filter) return;
    const state = Flip.getState(".project-card, .projects-grid");
    flipState.current = state;
    setFilter(newFilter);
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.from(".projects-heading", {
        y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".projects-heading", start: "top 85%", toggleActions: "play none none reverse" }
      });

      gsap.from(".projects-filters", {
        y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".projects-filters", start: "top 85%", toggleActions: "play none none reverse" }
      });

      gsap.from(".project-card-wrapper", {
        y: 40, opacity: 0, duration: 0.6,
        stagger: { amount: 0.4, grid: "auto", from: "start" },
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects-grid", start: "top 85%", toggleActions: "play none none reverse" }
      });
    }, projectsRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [isLoading]);

  useLayoutEffect(() => {
    if (!flipState.current) return;

    Flip.from(flipState.current, {
      targets: ".project-card, .projects-grid",
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.05,
      absolute: ".project-card",
      onEnter: elements => {
        const cards = elements.filter(el => el.classList.contains('project-card'));
        if(cards.length) return gsap.fromTo(cards, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 });
      },
      onLeave: elements => {
        const cards = elements.filter(el => el.classList.contains('project-card'));
        if(cards.length) return gsap.to(cards, { opacity: 0, scale: 0.8, duration: 0.6 });
      }
    });

    flipState.current = null;
  }, [filteredProjects]);

  return (
    <Section id="projects" className="bg-pastel-surface border-t-4 border-pastel-charcoal transition-colors duration-500">
      <div ref={projectsRef} className="max-w-7xl mx-auto relative z-10 px-4 md:px-8">
        <div className="projects-heading flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pt-8 sm:pt-0">
          <div className="w-full">
            <h2 className="font-pixel text-3xl sm:text-4xl mb-2 sm:mb-4">My Projects</h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto">Selected works demonstrating value and functionality.</p>
          </div>
        </div>
          
        <div className="projects-filters flex flex-wrap gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 sticky top-20 z-20 bg-pastel-surface/90 backdrop-blur-sm p-4 border-2 border-pastel-charcoal shadow-pixel mx-auto w-[90%] md:w-fit transition-colors duration-500">
          {categories.map((name) => (
            <button 
              key={name}
              onClick={() => { 
                onFilterChange(name);
                playClick(); 
              }}
              onMouseEnter={playHover}
              className={`
                font-pixel text-lg px-4 py-2 border-2 border-pastel-charcoal transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus-visible:ring-offset-2
                ${filter === name 
                  ? 'bg-pastel-blue shadow-none translate-y-1 text-black' 
                  : 'bg-pastel-surface hover:bg-pastel-gray shadow-pixel hover:-translate-y-1 active:shadow-none active:translate-y-0 text-pastel-charcoal'
                }
              `}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="projects-grid" ref={projectsGridRef}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-16 w-16 bg-pastel-blue animate-pulse mb-6 border-2 border-pastel-charcoal shadow-pixel-sm"></div>
              <div className="font-pixel text-lg animate-pulse text-pastel-charcoal">Loading Projects...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[500px] content-start">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card-wrapper">
                  <div className="project-card h-full bg-pastel-cream border-2 border-pastel-charcoal shadow-pixel group hover:-translate-y-2 hover:shadow-pixel-lg transition-all duration-300 flex flex-col">
                    <div className="h-48 sm:h-56 bg-pastel-gray/30 border-b-2 border-pastel-charcoal relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-pastel-blue/10 group-hover:bg-pastel-blue/20 transition-colors duration-300"></div>
                      <Code size={48} className="text-pastel-charcoal opacity-20 group-hover:opacity-40 transition-opacity duration-300 group-hover:scale-110 transform" />
                      {project.category && (
                        <span className="absolute top-4 right-4 bg-pastel-cream border-2 border-pastel-charcoal px-3 py-1 font-pixel text-xs shadow-pixel-sm text-pastel-charcoal">
                          {project.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-pixel text-xl sm:text-2xl mb-3 text-pastel-charcoal">{project.title}</h3>
                      <p className="text-sm sm:text-base mb-6 flex-grow">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                          <span key={idx} className="bg-pastel-blue/20 text-pastel-charcoal border border-pastel-charcoal/30 px-2 py-1 text-xs font-bold transition-colors duration-500">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="bg-pastel-gray/20 text-pastel-charcoal border border-pastel-charcoal/30 px-2 py-1 text-xs font-bold transition-colors duration-500">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-4 mt-auto pt-4 border-t-2 border-pastel-charcoal/10 transition-colors duration-500">
                        {project.demoUrl && (
                          <a 
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-pastel-blue hover:bg-pastel-pink text-pastel-charcoal border-2 border-pastel-charcoal py-2 px-4 flex items-center justify-center gap-2 font-bold shadow-pixel-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                            onMouseEnter={playHover}
                          >
                            Live Demo <ExternalLink size={16} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-white hover:bg-pastel-gray text-pastel-charcoal border-2 border-pastel-charcoal py-2 px-4 flex items-center justify-center gap-2 font-bold shadow-pixel-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                            onMouseEnter={playHover}
                          >
                            Code <Github size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default ProjectsSection;
