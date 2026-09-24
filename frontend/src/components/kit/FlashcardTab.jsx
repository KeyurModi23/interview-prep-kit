"use client";
import { useState } from 'react';

export default function FlashcardTab({ kit, setKit }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cards = kit.flashcards || [];

  const rateCard = (score) => {
    setKit(prev => {
      const newFc = [...prev.flashcards];
      newFc[activeIdx] = { ...newFc[activeIdx], confidence: score };
      return { ...prev, flashcards: newFc };
    });
    if (activeIdx < cards.length - 1) {
      setTimeout(() => { setActiveIdx(p => p + 1); setIsFlipped(false); }, 300);
    }
  };

  const handleSort = () => {
    setKit(prev => ({
      ...prev,
      flashcards: [...prev.flashcards].sort((a, b) => (a.confidence || 0) - (b.confidence || 0))
    }));
    setActiveIdx(0);
    setIsFlipped(false);
  };

  if (cards.length === 0) return <div className="text-center py-20 text-slate-500 font-semibold">No flashcards available.</div>;

  return (
    <section className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
      <div className="flex w-full max-w-2xl justify-between items-center mb-8">
        <span className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          Card {activeIdx + 1} of {cards.length}
        </span>
        <button onClick={handleSort} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer">
          Sort by Weakest
        </button>
      </div>

      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full max-w-2xl min-h-[350px] bg-white rounded-3xl shadow-xl border border-slate-100 p-12 cursor-pointer transition-all transform hover:scale-[1.02] flex flex-col justify-center text-center relative group"
      >
        <span className="absolute top-8 left-8 text-xs font-extrabold text-indigo-400 uppercase tracking-widest">
          {isFlipped ? 'Answer Outline' : 'Question'}
        </span>
        
        <div className="mt-6">
          {isFlipped ? (
            <p className="text-xl text-slate-700 leading-relaxed font-medium">{cards[activeIdx].back}</p>
          ) : (
            <h3 className="text-3xl text-slate-900 font-extrabold leading-tight">{cards[activeIdx].front}</h3>
          )}
        </div>
        
        <div className="absolute bottom-8 left-0 w-full text-center text-slate-400 text-sm font-bold opacity-50 group-hover:opacity-100 transition-opacity">
          Click to flip
        </div>
      </div>

      <div className="h-24 mt-10">
        {isFlipped ? (
          <div className="flex gap-4 animate-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => rateCard(1)} className="px-8 py-3.5 bg-rose-100 text-rose-700 rounded-2xl font-extrabold shadow-sm hover:bg-rose-200 hover:-translate-y-1 transition-all cursor-pointer">Hard (1)</button>
            <button onClick={() => rateCard(2)} className="px-8 py-3.5 bg-amber-100 text-amber-700 rounded-2xl font-extrabold shadow-sm hover:bg-amber-200 hover:-translate-y-1 transition-all cursor-pointer">Medium (2)</button>
            <button onClick={() => rateCard(3)} className="px-8 py-3.5 bg-emerald-100 text-emerald-700 rounded-2xl font-extrabold shadow-sm hover:bg-emerald-200 hover:-translate-y-1 transition-all cursor-pointer">Easy (3)</button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button disabled={activeIdx === 0} onClick={() => { setActiveIdx(p => p - 1); setIsFlipped(false); }} className="px-8 py-3.5 bg-white text-slate-700 font-bold rounded-2xl shadow-sm border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer">Previous</button>
            <button disabled={activeIdx === cards.length - 1} onClick={() => { setActiveIdx(p => p + 1); setIsFlipped(false); }} className="px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-md disabled:opacity-50 hover:bg-indigo-700 hover:shadow-lg transition-all cursor-pointer">Next</button>
          </div>
        )}
      </div>
    </section>
  );
}
