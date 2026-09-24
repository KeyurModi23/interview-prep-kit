"use client";
export default function KitHeader({ kit, activeTab, setActiveTab, onLogout }) {
  return (
    <header className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Your Interview Kit</h1>
        <p className="text-slate-500 font-medium">
          Coverage: {kit.coverage?.passes || 1} pass | Requirements: {kit.role?.requirements?.length || 0}
        </p>
      </div>
      <div className="flex bg-slate-100 rounded-xl p-1 shadow-inner">
        {['builder', 'flashcards', 'schedule'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <button onClick={onLogout} className="px-6 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition-colors cursor-pointer">
        Log out
      </button>
    </header>
  );
}
