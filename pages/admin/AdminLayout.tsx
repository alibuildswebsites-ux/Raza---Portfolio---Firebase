import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, FolderOpen, MessageSquare, Settings, LogOut, Star, Menu, X } from 'lucide-react';
import * as db from '../../services/storage';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await db.logoutUser();
    navigate('/');
  }, [navigate]);

  // Auto Logout on Inactivity
  useEffect(() => {
    const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_LIMIT);
    };

    // Events to track user activity
    // Removed mousemove and scroll to conserve battery/performance
    const events = ['mousedown', 'keypress', 'touchstart', 'click'];

    // Attach listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Start timer immediately
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [handleLogout]);

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
    { to: '/dashboard/projects', icon: <FolderOpen size={20} />, label: 'Projects' },
    { to: '/dashboard/testimonials', icon: <Star size={20} />, label: 'Testimonials' },
    { to: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  // Fixed dark background for sidebar
  const sidebarBg = "bg-[#2D2D2D] text-white";

  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col md:flex-row font-sans text-pastel-charcoal transition-colors duration-500 relative">
      
      {/* Mobile Header - FIXED top */}
      <div className={`md:hidden ${sidebarBg} h-16 px-4 flex justify-between items-center shadow-md z-50 fixed top-0 left-0 w-full`}>
          <span className="font-pixel text-xl text-pastel-blue tracking-widest">ADMIN PANEL</span>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-white hover:text-pastel-blue transition-colors p-1"
            aria-label="Toggle Menu"
          >
             {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
      </div>

      {/* Mobile Menu Overlay - Covers entire screen below header */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-16 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        ${sidebarBg} flex flex-col z-40
        fixed md:sticky 
        top-16 md:top-0 
        left-0 
        w-64 md:w-64 
        h-[calc(100dvh-4rem)] md:h-screen
        transform transition-transform duration-300 ease-in-out 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-2xl md:shadow-none
      `}>
        <div className="p-6 border-b border-gray-700 hidden md:block">
          <h1 className="font-pixel text-2xl text-pastel-blue tracking-widest">ADMIN PANEL</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Manage Portfolio</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
          {navItems.map(item => {
            const isActive = item.exact 
                ? location.pathname === item.to 
                : location.pathname.startsWith(item.to);
                
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded transition-all border-l-4
                  ${isActive 
                    ? 'bg-gray-800 border-pastel-blue text-pastel-blue shadow-inner' 
                    : 'hover:bg-gray-800 border-transparent text-gray-300 hover:text-white'}
                `}
              >
                {item.icon}
                <span className="font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 bg-[#252525]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors rounded"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Added top padding for mobile to account for fixed header */}
      <main className="flex-1 w-full md:ml-0 bg-pastel-cream overflow-y-auto p-4 pt-20 sm:p-6 sm:pt-24 md:p-8 md:pt-8">
        <div className="max-w-6xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;