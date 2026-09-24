"use client";
import { useState } from 'react';

export default function BuilderTab({ kit, setKit }) {
  const [editingId, setEditingId] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleEdit = (id, prompt, outline) => {
    setKit(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, prompt, answer_outline: outline, _isEdited: true } : q)
    }));
    setEditingId(null);
  };

  const handleMove = (index, direction) => {
    setKit(prev => {
      const newQs = [...prev.questions];
      if (direction === 'up' && index > 0) {
        [newQs[index - 1], newQs[index]] = [newQs[index], newQs[index - 1]];
      } else if (direction === 'down' && index < newQs.length - 1) {
        [newQs[index + 1], newQs[index]] = [newQs[index], newQs[index + 1]];
      }
      return { ...prev, questions: newQs };
    });
  };

  const handleDelete = (id) => {
    setKit(prev => ({ ...prev, questions: prev.questions.filter(q => q.id !== id) }));
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise(res => setTimeout(res, 1000));
    setKit(prev => {
      const preserved = prev.questions.filter(q => q._isEdited);
      const newQ = {
        id: `q-regen-${Date.now()}`,
        category: 'technical',
        prompt: '[REGENERATED] New deep technical question.',
        answer_outline: 'Generated outline...',
        difficulty: 2
      };
      return { ...prev, questions: [...preserved, newQ] };
    });
    setIsRegenerating(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Requirements Profile</h2>
        <div className="grid grid-cols-1 gap-4">
          {kit.role?.requirements?.map(req => (
            <div key={req.id} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${req.priority === 'must' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                {req.priority}
              </span>
              <div>
                <p className="text-slate-800 font-semibold">{req.text}</p>
                <p className="text-sm text-slate-500 mt-1 capitalize">{req.kind}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Question Bank</h2>
          <button 
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate Section'}
          </button>
        </div>
        
        <div className="space-y-4">
          {kit.questions?.map((q, index) => (
            <div key={q.id} className="group flex gap-5 border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all bg-white">
              <div className="flex flex-col gap-2 justify-center items-center">
                <button onClick={() => handleMove(index, 'up')} className="text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors">▲</button>
                <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                <button onClick={() => handleMove(index, 'down')} className="text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors">▼</button>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold capitalize">{q.category || 'General'}</span>
                    {q._isEdited && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">✓ Pinned</span>}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingId(q.id)} className="text-sm text-slate-400 hover:text-indigo-600 font-bold cursor-pointer transition-colors">Edit</button>
                    <button onClick={() => handleDelete(q.id)} className="text-sm text-slate-400 hover:text-rose-600 font-bold cursor-pointer transition-colors">Delete</button>
                  </div>
                </div>
                {editingId === q.id ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleEdit(q.id, e.target.prompt.value, e.target.outline.value); }} className="space-y-4">
                    <textarea name="prompt" className="w-full p-4 border border-indigo-400 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-semibold transition-all" rows="2" defaultValue={q.prompt} autoFocus />
                    <textarea name="outline" className="w-full p-4 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 transition-all" rows="3" defaultValue={q.answer_outline} placeholder="Answer outline..." />
                    <div className="flex gap-3">
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 cursor-pointer">Save</button>
                      <button type="button" onClick={() => setEditingId(null)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 cursor-pointer">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="cursor-pointer" onClick={() => setEditingId(q.id)}>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">{q.prompt}</h3>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100 leading-relaxed">{q.answer_outline}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
