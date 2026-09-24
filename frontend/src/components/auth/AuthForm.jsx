"use client";
import { useState } from 'react';
import { ArrowRight, Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';

export default function AuthForm({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    setError(null); setEmail(''); setPassword(''); setName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(null);
    try {
      const endpoint = authMode === 'login' ? '/api/v1/users/login' : '/api/v1/users/register';
      const body = authMode === 'login' ? { email, password } : { name, email, password };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Auth failed');
      
      if (authMode === 'register') {
        setAuthMode('login');
        setError('Registration successful! Please log in.');
        setPassword('');
        return;
      }
      onAuthSuccess(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full bg-[#111827]/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2 pb-1">
            InterviewKit
          </h1>
          <p className="text-slate-400 text-sm font-medium">Your personalized AI interview coach.</p>
        </div>
        
        {error && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${error.includes('successful') ? 'bg-emerald-500/10 text-amber-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {authMode === 'register' && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <User className="w-4 h-4 text-amber-400" /> Name
              </label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)} 
                className="w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none" 
                placeholder="John Doe" 
              />
            </div>
          )}
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <Mail className="w-4 h-4 text-amber-400" /> Email Address
            </label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none" 
              placeholder="you@example.com" 
            />
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <Lock className="w-4 h-4 text-amber-400" /> Password
            </label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none" 
              placeholder="••••••••" 
            />
          </div>
          
          <button 
            type="submit" disabled={isLoading} 
            className="w-full py-3 mt-4 text-sm bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} type="button" className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer">
            {authMode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
