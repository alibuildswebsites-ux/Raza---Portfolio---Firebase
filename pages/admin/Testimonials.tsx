import React, { useEffect, useState } from 'react';
import PixelButton from '../../components/ui/PixelButton';
import { Plus, Trash2, Edit2, EyeOff } from 'lucide-react';
import * as db from '../../services/storage';
import { Testimonial } from '../../types';

const Testimonials: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<Testimonial>>({});
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const load = async () => {
    const data = await db.getTestimonials();
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem.text) return;

    // Fix: Ensure ID is generated for new items so storage service doesn't crash
    const newItem: Testimonial = {
      id: currentItem.id || Date.now().toString(),
      clientName: currentItem.clientName,
      companyName: currentItem.companyName,
      text: currentItem.text,
      // photoUrl removed as per request
      rating: Number(currentItem.rating) || 5,
      dateReceived: currentItem.dateReceived || new Date().toISOString(),
      isVisible: currentItem.isVisible !== false,
      isFeatured: currentItem.isFeatured || false,
    };

    await db.saveTestimonial(newItem);
    setIsEditing(false);
    setCurrentItem({});
    load();
  };

  const handleDelete = async () => {
    if (showDeleteModal) {
      await db.deleteTestimonial(showDeleteModal);
      setShowDeleteModal(null);
      load();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="font-pixel text-2xl sm:text-3xl text-pastel-charcoal">Manage Testimonials</h2>
        <PixelButton onClick={() => { setCurrentItem({ rating: 5, isVisible: true, isFeatured: false }); setIsEditing(true); }} className="w-full sm:w-auto">
          <Plus size={18} className="inline mr-2" /> Add Testimonial
        </PixelButton>
      </div>

      {isEditing ? (
        <div className="bg-pastel-surface p-4 sm:p-8 border-2 border-pastel-charcoal shadow-pixel max-w-2xl mx-auto">
          <h3 className="font-pixel text-2xl mb-6 text-pastel-charcoal">{currentItem.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Client Name (Optional)</label>
                  <input 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                     value={currentItem.clientName || ''} 
                     onChange={e => setCurrentItem({...currentItem, clientName: e.target.value})} 
                  />
               </div>
               <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Company</label>
                  <input 
                     className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                     value={currentItem.companyName || ''} 
                     onChange={e => setCurrentItem({...currentItem, companyName: e.target.value})} 
                  />
               </div>
            </div>
            <div>
              <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Quote</label>
              <textarea 
                 className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none text-sm sm:text-base" 
                 rows={4}
                 value={currentItem.text || ''} 
                 onChange={e => setCurrentItem({...currentItem, text: e.target.value})}
                 required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Rating</label>
                  <input 
                      type="number" 
                      min="1" 
                      max="5"
                      className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 text-sm sm:text-base"
                      value={currentItem.rating || 5}
                      onChange={e => setCurrentItem({...currentItem, rating: Number(e.target.value)})}
                  />
                </div>
                <div>
                   <label className="block font-bold mb-1 text-pastel-charcoal text-sm">Date</label>
                   <input 
                      type="date"
                      className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 text-sm sm:text-base"
                      value={currentItem.dateReceived?.split('T')[0] || ''}
                      onChange={e => setCurrentItem({...currentItem, dateReceived: e.target.value})}
                   />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
               <label className="flex items-center gap-2 cursor-pointer select-none text-pastel-charcoal text-sm sm:text-base">
                  <input 
                     type="checkbox" 
                     className="w-5 h-5 accent-pastel-blue"
                     checked={currentItem.isVisible !== false}
                     onChange={e => setCurrentItem({...currentItem, isVisible: e.target.checked})}
                  />
                  <span>Visible on Site</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer select-none text-pastel-charcoal text-sm sm:text-base">
                  <input 
                     type="checkbox" 
                     className="w-5 h-5 accent-pastel-peach"
                     checked={currentItem.isFeatured || false}
                     onChange={e => setCurrentItem({...currentItem, isFeatured: e.target.checked})}
                  />
                  <span>Featured (Top of List)</span>
               </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-pastel-gray mt-2">
              <PixelButton type="submit">Save</PixelButton>
              <PixelButton type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</PixelButton>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(t => (
            <div key={t.id} className={`bg-pastel-surface border-2 border-pastel-charcoal p-6 shadow-sm relative ${!t.isVisible ? 'opacity-60 grayscale' : ''}`}>
              {t.isFeatured && (
                 <div className="absolute top-0 right-0 bg-pastel-peach text-xs font-bold px-2 py-1 border-b-2 border-l-2 border-pastel-charcoal text-black">FEATURED</div>
              )}
              
              <div className="absolute top-4 right-4 flex gap-2 mt-4 md:mt-0 z-10">
                 <button onClick={() => { setCurrentItem(t); setIsEditing(true); }} className="text-blue-500 hover:bg-blue-500/10 p-1 rounded"><Edit2 size={16}/></button>
                 <button onClick={() => setShowDeleteModal(t.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded"><Trash2 size={16}/></button>
              </div>

              <div className="text-yellow-400 mb-2 flex items-center gap-2">
                 {'★'.repeat(t.rating)}
                 {!t.isVisible && <EyeOff size={16} className="text-pastel-charcoal/50" />}
              </div>
              <p className="italic mb-4 text-pastel-charcoal/80 line-clamp-4 text-sm sm:text-base">"{t.text}"</p>
              <div className="flex items-center gap-3">
                 <div>
                    <div className="font-bold text-sm text-pastel-charcoal">{t.clientName || 'Anonymous'}</div>
                    <div className="text-xs text-pastel-charcoal/60">{t.companyName}</div>
                 </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-pastel-charcoal/50 italic text-center py-8 border-2 border-dashed border-pastel-charcoal/30 p-8 rounded">
              No testimonials yet. Click "Add Testimonial" to get started.
            </p>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-pastel-surface p-6 sm:p-8 border-2 border-pastel-charcoal shadow-pixel max-w-md w-full">
            <h3 className="font-pixel text-2xl mb-4 text-red-500">Confirm Deletion</h3>
            <p className="mb-6 text-pastel-charcoal">Delete this testimonial?</p>
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

export default Testimonials;