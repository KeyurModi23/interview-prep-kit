"use client";
import { useState, useEffect } from 'react';
import { Sparkles, FileText, Globe, CalendarDays, UploadCloud, LogOut, Loader2, History } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import KitManager from '@/components/kit/KitManager';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [kit, setKit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [jobDescription, setJobDescription] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [days, setDays] = useState(7);
  const [pastKits, setPastKits] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.success) setUser(data.data); })
      .catch(() => {})
      .finally(() => setIsLoadingSession(false));
  }, []);

  useEffect(() => {
    if (kit && kit._id && !kit._isNew) {
      const timer = setTimeout(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/kits/${kit._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ kit })
        }).catch(console.error);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [kit]);

  useEffect(() => {
    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/kits`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.success) setPastKits(data.data);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/logout`, { method: 'POST', credentials: 'include' });
    setUser(null); setKit(null);
  };

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
    setIsLoading(true); setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/kits/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, companyUrl, days })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Generation failed');
      setKit({ ...data.data, _isNew: true });
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/kits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: data.data.role?.title || 'Untitled', kit: data.data })
      })
      .then(res => res.json())
      .then(savedData => {
        if (savedData.success) {
          setPastKits(prev => [savedData.data, ...prev]);
        }
      })
      .catch(console.error);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSession) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-amber-400"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  if (!user) return <AuthForm onAuthSuccess={setUser} />;
  if (kit) return <KitManager initialKit={kit} onLogout={handleLogout} onClose={() => setKit(null)} />;

  


  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 z-50">
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all border border-white/10">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto mt-20 relative z-10">
        <div className="text-center mb-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-sm font-semibold mb-6 ring-1 ring-amber-500/20">
            <Sparkles className="w-4 h-4" /> AI-Powered Preparation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-6 pb-2">
            InterviewKit
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Paste a job description and company URL. We'll crawl the web, extract requirements, and build your ultimate study plan.
          </p>
        </div>
        
        <div className="bg-[#111827]/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-12 duration-700 delay-150">
          <form onSubmit={handleGenerate} className="space-y-8">
            {error && (
              <div className="p-6 bg-rose-500/10 text-rose-300 rounded-2xl border border-rose-500/20 font-medium text-sm leading-relaxed max-h-48 overflow-y-auto">
                <span className="font-extrabold block mb-2 text-rose-400">Generation Failed</span>
                {error.includes('quota') || error.includes('429') 
                  ? `Google Gemini API Quota Exceeded (429).

You have run out of free tier requests. Please provide a new API key.` 
                  : error.length > 300 ? error.substring(0, 300) + '...' : error}
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-300"><FileText className="w-4 h-4 text-amber-400" /> Job Description</label>
                <label className="flex items-center gap-2 text-xs font-bold text-amber-300 cursor-pointer hover:text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full transition-colors border border-amber-500/20">
                  <UploadCloud className="w-4 h-4" /> Bulk Upload CSV/JSON
                  <input disabled={isLoading} type="file" accept=".txt,.json" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              <textarea disabled={isLoading} 
                required rows={4}
                className="w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none resize-none"
                placeholder="Paste the full job description here..."
                value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-300"><Globe className="w-4 h-4 text-amber-400" /> Company URL</label>
                <input 
                  type="url" required
                  disabled={isLoading} className={isLoading ? "opacity-50 cursor-not-allowed w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none" : "w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none"}
                  placeholder="https://acme.com"
                  value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-300"><CalendarDays className="w-4 h-4 text-amber-400" /> Days until Interview</label>
                <input 
                  type="number" min="1" max="30" required
                  disabled={isLoading} className={isLoading ? "opacity-50 cursor-not-allowed w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none" : "w-full p-3 text-sm bg-[#030712]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-slate-200 placeholder-slate-600 transition-all outline-none"}
                  value={days} onChange={(e) => setDays(Number(e.target.value))}
                />
              </div>
            </div>

            <button  
              type="submit" disabled={isLoading}
              className="w-full py-3 mt-4 text-sm bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-500 hover:to-rose-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Company & Requirements...</>
              ) : (
                <><Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" /> Generate Prep Kit</>
              )}
            </button>
          </form>
        </div>

        {pastKits.length > 0 && (
          <div className="mt-12 animate-in slide-in-from-bottom-16 duration-700 delay-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" /> Recent Prep Kits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastKits.map(pk => (
                <div 
                  key={pk._id} 
                  onClick={() => setKit(pk.data)}
                  className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/5 hover:border-amber-500/50 hover:bg-[#111827] transition-all cursor-pointer group"
                >
                  <h4 className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">{pk.title || "Untitled Role"}</h4>
                  <p className="text-xs text-slate-500 mt-2">Generated on {new Date(pk.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
