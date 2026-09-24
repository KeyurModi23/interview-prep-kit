"use client";
import { LogOut, BookOpen, Layers, Calendar, ArrowLeft } from 'lucide-react';

export default function KitHeader({ kit, activeTab, setActiveTab, onLogout, onClose }) {
  const tabs = [
    { id: 'builder', label: 'Requirements & Builder', icon: Layers },
    { id: 'flashcards', label: 'Practice Mode', icon: BookOpen },
    { id: 'schedule', label: 'Master Schedule', icon: Calendar },
  ];

  return (
    <header className="bg-[#111827]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-4 flex flex-col xl:flex-row justify-between items-center gap-8 shadow-2xl">
      <div className="flex-1 w-full text-center xl:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/20">
          {kit.source?.company || 'Company'} • {kit.source?.role || 'Role'}
        </div>
        <h1 className="text-xl font-extrabold text-white mb-2 tracking-tight">Your Prep Dashboard</h1>
        <p className="text-slate-400 font-medium">Coverage: <span className="text-amber-400">{kit.coverage?.passes || 1} Passes</span> | Detected Requirements: <span className="text-amber-400">{kit.role?.requirements?.length || 0}</span></p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 bg-[#030712]/50 rounded-2xl p-2 border border-white/5">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button  
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl font-bold text-sm transition-all ${
                isActive 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
  <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 text-xs cursor-pointer font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-white/20">
    <ArrowLeft className="w-4 h-4" /> Dashboard
  </button>
  <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-xs cursor-pointer font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-xl transition-all border border-rose-500/20 hover:shadow-lg hover:shadow-rose-600/20">
    <LogOut className="w-4 h-4" /> Log out
  </button>
</div>
    </header>
  );
}
