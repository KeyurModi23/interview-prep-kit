"use client";
import { useState } from 'react';
import { Target, CheckCircle2, ChevronUp, ChevronDown, Edit2, Trash2, RefreshCw, Pin } from 'lucide-react';

export default function BuilderTab({ kit, setKit }) {
  const [editingId, setEditingId] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleAdd = () => {
    setKit(prev => {
      const newQ = { id: `q-custom-${Date.now()}`, category: 'technical', prompt: '[NEW QUESTION]', answer_outline: '[ANSWER OUTLINE]', _isEdited: true };
      return { ...prev, questions: [newQ, ...prev.questions] };
    });
    setEditingId(`q-custom-${Date.now()}`);
  };

  const handleEdit = (id, prompt, outline, category) => {
    setKit(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, prompt, answer_outline: outline, category: category || q.category, _isEdited: true } : q)
    }));
    setEditingId(null);
  };

  const handleMove = (index, direction) => {
    setKit(prev => {
      const newQs = [...prev.questions];
      if (direction === 'up' && index > 0) [newQs[index - 1], newQs[index]] = [newQs[index], newQs[index - 1]];
      else if (direction === 'down' && index < newQs.length - 1) [newQs[index + 1], newQs[index]] = [newQs[index], newQs[index + 1]];
      return { ...prev, questions: newQs };
    });
  };

  const handleDelete = (id) => setKit(prev => ({ ...prev, questions: prev.questions.filter(q => q.id !== id) }));

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise(res => setTimeout(res, 1000)); // Fake delay for UI demo
    setKit(prev => {
      const preserved = prev.questions.filter(q => q._isEdited);
      const newQ = { id: `q-regen-${Date.now()}`, category: 'technical', prompt: '[NEW] Regenerated behavioral scenario.', answer_outline: 'Generated outline...', difficulty: 2 };
      return { ...prev, questions: [...preserved, newQ] };
    });
    setIsRegenerating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Context & Requirements */}
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-[#111827]/60 backdrop-blur-xl rounded-[2rem] p-5 border border-white/10 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-amber-400" /> Target Profile</h2>
          <div className="space-y-4">
            {kit.role?.requirements?.map(req => (
              <div key={req.id} className="flex gap-4 p-4 rounded-2xl bg-[#030712]/50 border border-white/5 hover:border-amber-500/30 transition-colors group">
                <div className="mt-1">
                  <CheckCircle2 className={`w-5 h-5 ${req.priority === 'must' ? 'text-rose-400' : 'text-sky-400'}`} />
                </div>
                <div>
                  <p className="text-slate-300 font-medium leading-snug">{req.text}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{req.kind}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">•</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${req.priority === 'must' ? 'text-rose-500' : 'text-sky-500'}`}>{req.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Question Bank */}
      <div className="lg:col-span-8">
        <section className="bg-[#111827]/60 backdrop-blur-xl rounded-[2rem] p-5 border border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold text-white">Question Bank</h2>
              <p className="text-sm text-slate-400 mt-1">Curated specifically for your requirements</p>
            </div>
            <button  
              onClick={handleRegenerate} disabled={isRegenerating}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold rounded-xl transition-all border border-amber-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Analyzing gaps...' : 'Regenerate Unpinned'}
            </button>
          </div>
          
          <div className="space-y-4">
            {kit.questions?.map((q, index) => (
              <div key={q.id} className="group flex gap-4 bg-[#030712]/40 border border-white/5 rounded-2xl p-4 hover:border-amber-500/40 hover:bg-[#030712]/60 transition-all">
                <div className="flex flex-col gap-1 justify-center items-center opacity-30 group-hover:opacity-100 transition-opacity">
                  <button  onClick={() => handleMove(index, 'up')} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <span className="text-xs font-bold text-slate-600">{index + 1}</span>
                  <button  onClick={() => handleMove(index, 'down')} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-white/5 text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{q.category || 'General'}</span>
                      {q._isEdited && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-emerald-500/10 px-3 py-1 rounded-full"><Pin className="w-3 h-3" /> Pinned</span>}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button  onClick={() => setEditingId(q.id)} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button  onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  
                  {editingId === q.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleEdit(q.id, e.target.prompt.value, e.target.outline.value, e.target.category.value); }} className="space-y-4 mt-4 animate-in fade-in">
                      
                        <select name="category" className="w-full p-3 bg-[#111827] border border-white/10 rounded-xl outline-none text-sm text-slate-300 focus:border-amber-500/50" defaultValue={q.category || 'technical'}>
                          <option value="technical">Technical</option>
                          <option value="behavioural">Behavioural</option>
                          <option value="system-design">System Design</option>
                          <option value="company-fit">Company Fit</option>
                        </select>
                        <select name="category" className="w-full p-3 bg-[#111827] border border-white/10 rounded-xl outline-none text-sm text-slate-300 focus:border-amber-500/50 mb-4" defaultValue={q.category || 'technical'}>
                          <option value="technical">Technical</option>
                          <option value="behavioural">Behavioural</option>
                          <option value="system-design">System Design</option>
                          <option value="company-fit">Company Fit</option>
                        </select>
                        <textarea name="prompt" className="w-full p-4 bg-[#111827] border border-amber-500/50 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white font-medium" rows="2" defaultValue={q.prompt} autoFocus />
                      <textarea name="outline" className="w-full p-4 bg-[#111827] border border-white/10 rounded-xl outline-none text-sm text-slate-300 focus:border-amber-500/50" rows="4" defaultValue={q.answer_outline} />
                      <div className="flex gap-3">
                        <button  type="submit" className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-500 transition-colors">Save Question</button>
                        <button  type="button" onClick={() => setEditingId(null)} className="px-5 py-2 bg-white/5 text-slate-300 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="cursor-pointer pr-4" onClick={() => setEditingId(q.id)}>
                      <h3 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-amber-300 transition-colors leading-snug">{q.prompt}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed transition-all">{q.answer_outline}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
