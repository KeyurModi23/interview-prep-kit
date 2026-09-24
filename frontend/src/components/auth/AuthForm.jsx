"use client";
import { useState } from 'react';

export default function AuthForm({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = authMode === 'login' ? '/api/v1/users/login' : '/api/v1/users/register';
      const body = authMode === 'login' ? { email, password } : { name, email, password };
      const response = await fetch(`http://localhost:3001${endpoint}`, {
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-slate-800 tracking-tight">InterviewKit</h1>
        {error && <div className={`p-4 mb-6 rounded-xl text-sm border ${error.includes('successful') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all" />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 mt-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? 'Processing...' : (authMode === 'login' ? 'Log In' : 'Create Account')}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} type="button" className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors">
            {authMode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
