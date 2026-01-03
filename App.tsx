import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from './components/ui/ScrollToTop';
import Preloader from './components/ui/Preloader';
import * as db from './services/storage';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';

// ============================================================================
// EAGER IMPORTS (Critical Path - Loaded Immediately)
// ============================================================================
import Home from './pages/Home'; // Keep eager - this is what visitors see first

// ============================================================================
// LAZY IMPORTS (Code-Splitting - Loaded on Demand)
// ============================================================================

// AUTH CHUNK - Only loaded when user navigates to /admin
const Login = lazy(() => import('./pages/Login'));

// ADMIN CHUNK - Only loaded after successful authentication
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Projects = lazy(() => import('./pages/admin/Projects'));
const Testimonials = lazy(() => import('./pages/admin/Testimonials'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const Settings = lazy(() => import('./pages/admin/Settings'));

// ============================================================================
// LOADING FALLBACK COMPONENTS
// ============================================================================

// Skeleton for Login page
const LoginSkeleton = () => (
  <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-pastel-surface border-4 border-pastel-charcoal p-8 w-full max-w-md shadow-pixel-lg"
    >
      <div className="h-10 bg-pastel-gray animate-pulse mb-8 w-3/4 mx-auto"></div>
      <div className="space-y-6">
        <div className="h-12 bg-pastel-gray animate-pulse"></div>
        <div className="h-12 bg-pastel-gray animate-pulse"></div>
        <div className="h-12 bg-pastel-blue/30 animate-pulse"></div>
      </div>
    </motion.div>
  </div>
);

// Skeleton for Admin Dashboard
const AdminSkeleton = () => (
  <div className="min-h-screen bg-pastel-cream flex">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="hidden md:block w-64 bg-[#2D2D2D] border-r-4 border-pastel-charcoal"
    >
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 bg-gray-700 animate-pulse rounded"></div>
        ))}
      </div>
    </motion.div>
    <div className="flex-1 p-8">
      <div className="h-8 bg-pastel-gray animate-pulse w-1/3 mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-pastel-surface border-2 border-pastel-charcoal animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// ERROR BOUNDARY FALLBACK
// ============================================================================

class LazyLoadErrorBoundary extends React.Component<
  { children?: React.ReactNode }, 
  { hasError: boolean; error: Error | null }
> {
  public state: { hasError: boolean; error: Error | null };
  public props: { children?: React.ReactNode };

  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.props = props;
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy load error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-4">
          <div className="bg-pastel-surface border-4 border-red-500 p-8 max-w-md text-center">
            <h2 className="font-pixel text-2xl text-red-500 mb-4">Chunk Load Error</h2>
            <p className="mb-6 text-pastel-charcoal">
              Failed to load this section. This might be due to a network issue.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-pastel-blue text-white px-6 py-3 border-2 border-pastel-charcoal hover:bg-pastel-lavender transition-colors font-bold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// PROTECTED ROUTE WITH AUTH CHECK
// ============================================================================

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    db.checkSession().then(auth => setIsAuth(auth));
  }, []);

  // Loading state - show admin skeleton
  if (isAuth === null) {
    return <AdminSkeleton />;
  }

  // Not authenticated - redirect
  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  // Authenticated - render children
  return <>{children}</>;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <LazyLoadErrorBoundary>
      <ThemeProvider>
        <AudioProvider>
          <HashRouter>
            <ScrollToTop />
            <AnimatePresence>
              {loading && <Preloader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            <Routes>
              {/* PUBLIC ROUTE - Eager loaded */}
              <Route path="/" element={<Home startTypewriter={!loading} />} />

              {/* AUTH ROUTE - Lazy loaded with skeleton */}
              <Route 
                path="/admin" 
                element={
                  <Suspense fallback={<LoginSkeleton />}>
                    <Login />
                  </Suspense>
                } 
              />

              {/* ADMIN ROUTES - Lazy loaded with skeleton */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route 
                  index 
                  element={
                    <Suspense fallback={<div className="animate-pulse p-4">Loading dashboard...</div>}>
                      <Dashboard />
                    </Suspense>
                  } 
                />
                <Route 
                  path="projects" 
                  element={
                    <Suspense fallback={<div className="animate-pulse p-4">Loading projects...</div>}>
                      <Projects />
                    </Suspense>
                  } 
                />
                <Route 
                  path="testimonials" 
                  element={
                    <Suspense fallback={<div className="animate-pulse p-4">Loading testimonials...</div>}>
                      <Testimonials />
                    </Suspense>
                  } 
                />
                <Route 
                  path="messages" 
                  element={
                    <Suspense fallback={<div className="animate-pulse p-4">Loading messages...</div>}>
                      <Messages />
                    </Suspense>
                  } 
                />
                <Route 
                  path="settings" 
                  element={
                    <Suspense fallback={<div className="animate-pulse p-4">Loading settings...</div>}>
                      <Settings />
                    </Suspense>
                  } 
                />
              </Route>

              {/* CATCH-ALL */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </AudioProvider>
      </ThemeProvider>
    </LazyLoadErrorBoundary>
  );
};

export default App;