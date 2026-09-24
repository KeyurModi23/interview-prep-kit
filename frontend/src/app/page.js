"use client";
import { useState, useEffect } from 'react';
import AuthForm from '../components/auth/AuthForm';
import KitManager from '../components/kit/KitManager';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  
  const [jobDescription, setJobDescription] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [days, setDays] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kit, setKit] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/users/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.data);
      })
      .catch(() => {})
      .finally(() => setIsLoadingSession(false));
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:3001/api/v1/users/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setKit(null);
  };

  if (isLoadingSession) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Session...</div>;

  if (!user) {
    return <AuthForm onAuthSuccess={setUser} />;
  }

  if (kit) {
    return <KitManager initialKit={kit} onLogout={handleLogout} />;
  }

  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(evt.target.result);
          if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
          if (parsed.companyUrl) setCompanyUrl(parsed.companyUrl);
          if (parsed.days) setDays(parsed.days);
        } else {
          setJobDescription(evt.target.result);
        }
      } catch (err) {
        setError('Failed to parse file. Ensure it is valid text or JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/v1/kits/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, companyUrl, days })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Generation failed');
      
      setKit(data.data);

      fetch('http://localhost:3001/api/v1/kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: 'InterviewKit', kit: data.data })
      }).catch(console.error);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100 relative">
        <div className="absolute top-8 right-8">
          <button type="button" onClick={handleLogout} className="px-5 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm cursor-pointer transition-colors">Log out</button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-3 text-slate-900 tracking-tight">InterviewKit</h1>
          <p className="text-slate-500 font-medium">Turn any job description into a personalized prep kit.</p>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          {error && (
            <div className="p-5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium text-sm break-words leading-relaxed max-h-48 overflow-y-auto shadow-inner">
              <span className="font-extrabold block mb-1">Generation Failed</span>
              {error.includes('quota') || error.includes('429') 
                ? "Google Gemini API Quota Exceeded (429).\n\nYou have run out of free tier requests for this Google account. Because our pipeline performs a multi-pass coverage check, it uses multiple requests per generation. Please generate a new API key using a different Google account to continue." 
                : error.length > 300 ? error.substring(0, 300) + '...' : error}
            </div>
          )}
          
          <div>
            
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-slate-700">Job Description</label>
            <label className="text-xs font-extrabold text-indigo-600 cursor-pointer hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg transition-colors">
              📁 Upload File
              <input type="file" accept=".txt,.json" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
            <textarea 
              required rows={6}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all shadow-sm"
              placeholder="Paste the job description here..."
              value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Company URL</label>
              <input 
                type="url" required
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all shadow-sm"
                placeholder="https://acme.com"
                value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Days until Interview</label>
              <input 
                type="number" min="1" max="30" required
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all shadow-sm"
                value={days} onChange={(e) => setDays(Number(e.target.value))}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-5 mt-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold rounded-2xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
          >
            {isLoading ? 'Generating Kit...' : 'Generate Prep Kit'}
          </button>
        </form>
      </div>
    </div>
  );
}