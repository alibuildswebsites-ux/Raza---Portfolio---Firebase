import React, { useEffect, useState } from 'react';
import PixelButton from '../../components/ui/PixelButton';
import { Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';
import * as db from '../../services/storage';
import { Project } from '../../types';

// Define strict type for form handling
interface ProjectFormData extends Omit<Partial<Project>, 'technologies'> {
  technologies?: string | string[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectFormData>({});
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const loadProjects = async () => {
    const data = await db.getProjects();
    setProjects(data);
  };

  useEffect(() => { loadProjects(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject.title || !currentProject.description) return;

    let technologies: string[] = [];
    if (Array.isArray(currentProject.technologies)) {
      technologies = currentProject.technologies;
    } else if (typeof currentProject.technologies === 'string') {
      technologies = (currentProject.technologies as string).split(',').map(t => t.trim()).filter(Boolean);
    }

    const newProject: Project = {
      id: currentProject.id || Date.now().toString(),
      title: currentProject.title || '',
      description: currentProject.description || '',
      technologies,
      isVisible: currentProject.isVisible !== false,
      category: currentProject.category || 'Web Development',
      dateCompleted: currentProject.dateCompleted || new Date().toISOString(),
      thumbnailUrl: currentProject.thumbnailUrl || 'https://picsum.photos/400/300', 
      demoUrl: currentProject.demoUrl || '#',
      githubUrl: currentProject.githubUrl || ''
    };

    await db.saveProject(newProject);
    setIsEditing(false);
    setCurrentProject({});
    loadProjects();
  };

  const handleDelete = async () => {
    if (showDeleteModal) {
      await db.deleteProject(showDeleteModal);
      setShowDeleteModal(null);
      loadProjects();
    }
  };

  const getTechnologiesString = (techs?: string | string[]): string => {
    if (Array.isArray(techs)) return techs.join(', ');
    return techs || '';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="font-pixel text-2xl sm:text-3xl text-pastel-charcoal">Manage Projects</h2>
        <PixelButton onClick={() => { setCurrentProject({ isVisible: true }); setIsEditing(true); }} className="w-full sm:w-auto">
          <Plus size={18} className="inline mr-2" /> Add Project
        </PixelButton>
      </div>

      {isEditing ? (
        <div className="bg-pastel-surface p-4 sm:p-8 border-2 border-pastel-charcoal shadow-pixel max-w-3xl mx-auto">
          <h3 className="font-pixel text-2xl mb-6 text-pastel-charcoal">{currentProject.id ? 'Edit Project' : 'New Project'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="md:col-span-2">
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Title</label>
                  <input 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                     value={currentProject.title || ''} 
                     onChange={e => setCurrentProject({...currentProject, title: e.target.value})} 
                     required
                  />
               </div>
               <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Visibility</label>
                  <select 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base"
                     value={currentProject.isVisible !== false ? 'visible' : 'hidden'}
                     onChange={e => setCurrentProject({...currentProject, isVisible: e.target.value === 'visible'})}
                  >
                     <option value="visible">Visible</option>
                     <option value="hidden">Hidden</option>
                  </select>
               </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Description</label>
              <textarea 
                 className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                 rows={3}
                 value={currentProject.description || ''} 
                 onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                 required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Category</label>
                  <select 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base"
                     value={currentProject.category || 'Web Development'}
                     onChange={e => setCurrentProject({...currentProject, category: e.target.value as any})}
                  >
                     <option>Web Development</option>
                     <option>UI Design</option>
                     <option>Mobile App</option>
                     <option>Data Science</option>
                  </select>
               </div>
               <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Tech Stack (comma separated)</label>
                  <input 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                     value={getTechnologiesString(currentProject.technologies)}
                     onChange={e => setCurrentProject({...currentProject, technologies: e.target.value})}
                  />
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Demo URL</label>
                  <input 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                     value={currentProject.demoUrl || ''} 
                     onChange={e => setCurrentProject({...currentProject, demoUrl: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">GitHub URL (Optional)</label>
                  <input 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                     value={currentProject.githubUrl || ''} 
                     onChange={e => setCurrentProject({...currentProject, githubUrl: e.target.value})}
                  />
               </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-pastel-gray mt-4">
              <PixelButton type="submit">Save Project</PixelButton>
              <PixelButton type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</PixelButton>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {projects.map(p => (
            <div key={p.id} className={`bg-pastel-surface border-2 border-pastel-charcoal p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-4 relative overflow-hidden ${!p.isVisible ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                 <h3 className="font-bold text-lg flex items-center gap-2 text-pastel-charcoal leading-tight">
                    <span className="truncate">{p.title}</span>
                    {!p.isVisible && <span className="text-xs bg-gray-200 text-black px-2 py-0.5 rounded font-normal shrink-0">Hidden</span>}
                 </h3>
                 <div className="text-xs text-pastel-charcoal/70 truncate mt-1">{p.category} • {p.technologies.join(', ')}</div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                <a href={p.demoUrl} target="_blank" rel="noreferrer" className="p-2 text-pastel-charcoal/50 hover:text-pastel-charcoal transition-colors" title="View Demo">
                   <ExternalLink size={20} />
                </a>
                <button 
                  onClick={() => { setCurrentProject(p); setIsEditing(true); }}
                  className="p-2 text-blue-500 hover:bg-blue-500/10 rounded"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => setShowDeleteModal(p.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-pastel-charcoal/50 italic text-center py-8">No projects found.</p>}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-pastel-surface p-6 sm:p-8 border-2 border-pastel-charcoal shadow-pixel max-w-md w-full">
            <h3 className="font-pixel text-2xl mb-4 text-red-500">Confirm Deletion</h3>
            <p className="mb-6 text-pastel-charcoal">Are you sure you want to delete this project?</p>
            <div className="flex gap-4">
              <PixelButton variant="danger" onClick={handleDelete}>Delete</PixelButton>
              <PixelButton variant="secondary" onClick={() => setShowDeleteModal(null)}>Cancel</PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;