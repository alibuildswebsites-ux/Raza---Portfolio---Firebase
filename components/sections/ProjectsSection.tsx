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
    <>

      {/* --- PROJECTS --- */}
      <Section id="projects" className="bg-pastel-surface border-t-4 border-pastel-charcoal transition-colors duration-500">
        <div
           ref={projectsRef as React.RefObject<HTMLDivElement>}
           className="max-w-7xl mx-auto relative z-10 px-4 md:px-8"
        >
          {/* 1. Header Text */}
          <div
            className="projects-heading flex flex-col justify-center items-center mb-8 gap-6 text-center"
          >
            <div className="w-full">
              <h2 className="font-pixel text-3xl sm:text-4xl mb-2 sm:mb-4">My Projects</h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto">Selected works demonstrating value and functionality.</p>
            </div>
          </div>

          {/* 2. Filter Buttons */}
          <div
            className="projects-filters flex flex-wrap justify-center gap-3 w-full mb-12"
          >
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

          {/* 3. Project Grid */}
          {!isLoading ? (
            <div
                ref={projectsGridRef}
                className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 min-h-[200px]"
            >
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="project-card-wrapper h-full">
                      <div
                        className="project-card group bg-pastel-surface border-2 border-pastel-charcoal shadow-pixel flex flex-col h-full hover:shadow-pixel-lg transition-all duration-300 relative hover:-translate-y-1 hover:z-10"
                        onMouseEnter={playHover}
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

                        <p className="text-gray-600 mb-8 font-sans text-sm leading-relaxed flex-grow break-words line-clamp-4">
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
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              onClick={playClick}
                              onMouseEnter={playHover}
                              className="flex-1 bg-pastel-charcoal text-pastel-cream font-pixel text-lg border-2 border-pastel-charcoal hover:bg-pastel-blue hover:text-black hover:border-pastel-charcoal transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-charcoal focus:ring-offset-2"
                            >
                              <ExternalLink size={18} /> Live Demo
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              onClick={playClick}
                              onMouseEnter={playHover}
                              className="w-14 border-2 border-pastel-charcoal flex items-center justify-center hover:bg-gray-100 transition-colors bg-pastel-surface text-pastel-charcoal focus:outline-none focus:ring-2 focus:ring-pastel-charcoal focus:ring-offset-2"
                              title="View Code"
                            >
                              <Github size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    </div>
                  ))}

                {filteredProjects.length === 0 && (
                   <div
                     className="w-full col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 opacity-50 bg-gray-50 border-2 border-dashed border-gray-300"
                   >
                      <div className="w-16 h-16 bg-gray-200 border-2 border-gray-400 mb-4 flex items-center justify-center">
                        <Code className="text-gray-400" />
                      </div>
                      <p className="font-pixel text-xl text-black">Projects coming soon.</p>
                   </div>
                )}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <span className="font-pixel text-xl animate-pulse text-pastel-charcoal">Loading projects...</span>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default ProjectsSection;
