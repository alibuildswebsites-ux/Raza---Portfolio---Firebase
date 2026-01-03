import React, { useState, useEffect } from 'react';
import PixelButton from '../components/ui/PixelButton';
import * as db from '../services/storage';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    db.checkSession().then(isAuth => {
      if(isAuth) navigate('/dashboard');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await db.loginUser(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col items-center justify-center p-4 relative z-50 text-pastel-charcoal transition-colors duration-500">
      <div className="bg-pastel-surface border-4 border-pastel-charcoal p-8 w-full max-w-md shadow-pixel-lg">
        <h2 className="font-pixel text-4xl text-center mb-8 text-pastel-charcoal">ADMIN LOGIN</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-bold mb-2 text-pastel-charcoal">Email</label>
            <input 
              type="email" 
              className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-3 focus:outline-none focus:shadow-pixel"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-pastel-charcoal">Password</label>
            <input 
              type="password" 
              className="w-full border-2 border-pastel-charcoal bg-pastel-cream text-pastel-charcoal p-3 focus:outline-none focus:shadow-pixel"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="bg-red-100 text-red-600 p-3 text-center border-2 border-red-200">{error}</div>}
          
          <PixelButton type="submit" className="w-full" isLoading={isLoading}>Enter Dashboard</PixelButton>
        </form>
        <div className="mt-4">
          <PixelButton variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/')} type="button">
            <ArrowLeft size={16} /> Back to Website
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
export default Login;