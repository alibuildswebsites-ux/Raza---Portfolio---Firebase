
import React, { useState, useEffect } from 'react';
import PixelButton from '../../components/ui/PixelButton';
import { getFirebase } from '../../services/firebaseConfig';
import { updatePassword, onAuthStateChanged } from 'firebase/auth';

const Settings: React.FC = () => {
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // Password State
  const [pwd, setPwd] = useState({ new: '', confirm: '' });

  // Load current user email on mount
  useEffect(() => {
    const { auth } = getFirebase();
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setCurrentUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    // 1. Validation
    if (pwd.new.length < 6) {
      setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (pwd.new !== pwd.confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    const { auth } = getFirebase();
    if (!auth?.currentUser) {
      setMsg({ type: 'error', text: 'No user logged in.' });
      return;
    }

    // 2. Update via Firebase
    try {
      await updatePassword(auth.currentUser, pwd.new);
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setPwd({ new: '', confirm: '' });
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message || 'Failed to update password. You may need to re-login.' });
    }
  };

  return (
    <div>
      <h2 className="font-pixel text-2xl sm:text-3xl mb-6 sm:mb-8 text-pastel-charcoal">Account Settings</h2>
      
      {msg.text && (
        <div className={`p-4 mb-6 border-2 text-sm sm:text-base ${msg.type === 'error' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-green-100 border-green-300 text-green-700'}`}>
           {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Account Info */}
        <div className="bg-pastel-surface border-2 border-pastel-charcoal p-6 sm:p-8 shadow-pixel">
           <h3 className="font-pixel text-xl mb-4 border-b border-pastel-gray pb-2 text-pastel-charcoal">Account Info</h3>
           <p className="mb-4 text-pastel-charcoal/80 break-words">
             Logged in as: <strong>{currentUserEmail || 'Loading...'}</strong>
           </p>
           <p className="text-sm text-pastel-charcoal/60 italic">
             To change your email, please use the Firebase Console.
           </p>
        </div>

        {/* Change Password */}
        <div className="bg-pastel-surface border-2 border-pastel-charcoal p-6 sm:p-8 shadow-pixel">
           <h3 className="font-pixel text-xl mb-4 border-b border-pastel-gray pb-2 text-pastel-charcoal">Change Password</h3>
           <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                 <label className="block text-sm font-bold mb-1 text-pastel-charcoal">New Password</label>
                 <input 
                    type="password" 
                    required 
                    className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none" 
                    value={pwd.new} 
                    onChange={e => setPwd({...pwd, new: e.target.value})} 
                    placeholder="Min 6 chars"
                 />
              </div>
              <div>
                 <label className="block text-sm font-bold mb-1 text-pastel-charcoal">Confirm New Password</label>
                 <input 
                    type="password" 
                    required 
                    className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-2 focus:border-pastel-blue outline-none" 
                    value={pwd.confirm} 
                    onChange={e => setPwd({...pwd, confirm: e.target.value})} 
                 />
              </div>
              <PixelButton type="submit" className="w-full mt-4">Update Password</PixelButton>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
