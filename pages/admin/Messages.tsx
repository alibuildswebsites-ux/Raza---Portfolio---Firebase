import React, { useEffect, useState } from 'react';
import * as db from '../../services/storage';
import { ContactSubmission } from '../../types';
import { CheckCircle, Trash2 } from 'lucide-react';
import PixelButton from '../../components/ui/PixelButton';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await db.getMessages();
      setMessages(data);
    };
    load();
  }, []);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Store previous state for rollback
    const previousMessages = [...messages];

    // Optimistic Update: Update UI immediately
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, status: 'read' } : msg
    ));

    try {
      await db.markMessageRead(id);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      alert("Failed to mark message as read. Please try again.");
      
      // Revert UI on failure
      setMessages(previousMessages);
      
      // Force refresh data from server to be safe
      const data = await db.getMessages();
      setMessages(data);
    }
  };

  const handleDelete = async () => {
    if (showDeleteModal) {
       await db.deleteMessage(showDeleteModal);
       const data = await db.getMessages();
       setMessages(data);
       setShowDeleteModal(null);
    }
  };

  return (
    <div>
      <h2 className="font-pixel text-2xl sm:text-3xl mb-8 text-pastel-charcoal">Inbox</h2>
      <div className="space-y-4">
        {messages.length === 0 && <p className="text-pastel-charcoal/50 italic border-2 border-dashed border-pastel-charcoal/30 p-8 text-center rounded">No messages yet.</p>}
        {messages.map(msg => (
          <div key={msg.id} className={`bg-pastel-surface border-2 border-pastel-charcoal p-4 sm:p-6 shadow-sm ${msg.status === 'unread' ? 'border-l-8 border-l-pastel-blue' : ''}`}>
             <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
               <div className="w-full sm:w-auto overflow-hidden">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-pastel-charcoal truncate">
                     {msg.status === 'unread' && <span className="bg-blue-500 w-2 h-2 rounded-full shrink-0"></span>}
                     {msg.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <a href={`mailto:${msg.email}`} className="text-blue-500 hover:underline truncate">{msg.email}</a>
                    <span className="hidden sm:inline text-pastel-charcoal/50">|</span>
                    <span className="text-pastel-charcoal/50 text-xs">{new Date(msg.submittedAt).toLocaleDateString()} {new Date(msg.submittedAt).toLocaleTimeString()}</span>
                  </div>
               </div>
               <div className="flex gap-2 self-end sm:self-start shrink-0">
                  {msg.status === 'unread' && (
                    <button 
                      onClick={(e) => handleMarkRead(msg.id, e)} 
                      type="button"
                      className="text-green-500 text-sm flex items-center gap-1 hover:bg-green-500/10 px-2 py-1 rounded transition-colors" 
                      title="Mark as Read"
                    >
                        <CheckCircle size={18} />
                    </button>
                  )}
                  <button onClick={() => setShowDeleteModal(msg.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors" title="Delete Message">
                     <Trash2 size={18} />
                  </button>
               </div>
             </div>
             <div className="bg-pastel-cream p-3 sm:p-4 border border-pastel-charcoal/20 rounded text-pastel-charcoal whitespace-pre-wrap font-mono text-sm break-words">
                {msg.message}
             </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-pastel-surface p-6 sm:p-8 border-2 border-pastel-charcoal shadow-pixel max-w-md w-full">
            <h3 className="font-pixel text-2xl mb-4 text-red-500">Confirm Deletion</h3>
            <p className="mb-6 text-pastel-charcoal">Are you sure you want to delete this message?</p>
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

export default Messages;