"use client";
import { useState } from 'react';
import { BrainCircuit, Zap, RefreshCcw, ThumbsUp, ThumbsDown, Check } from 'lucide-react';

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
      setTimeout(() => { setActiveIdx(p => p + 1); setIsFlipped(false); }, 200);
    }
  };

  const handleSort = () => {
    setKit(prev => ({
      ...prev,
      flashcards: [...prev.flashcards].sort((a, b) => (a.confidence || 0) - (b.confidence || 0))
    }));
    setActiveIdx(0); setIsFlipped(false);
  };

  if (cards.length === 0) return <div className="text-center py-32 text-slate-500 font-semibold"><BrainCircuit className="w-16 h-16 mx-auto mb-4 opacity-20" /> No flashcards generated.</div>;

  return (
    <section className="flex flex-col items-center justify-center py-6">
      <div className="flex w-full max-w-3xl justify-between items-center mb-8">
        <div className="bg-[#111827]/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 text-sm font-bold text-slate-300 shadow-lg">
          Card <span className="text-white">{activeIdx + 1}</span> of {cards.length}
        </div>
        <button  onClick={handleSort} className="flex items-center gap-2 text-sm font-bold text-emerald-300 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <Zap className="w-4 h-4" /> Focus Weakest First
        </button>
      </div>

      <div className="relative w-full max-w-3xl perspective-1000">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[250px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2.5rem] border border-slate-700/50 p-6 cursor-pointer transition-all duration-500 transform-style-3d shadow-2xl hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] flex flex-col justify-center text-center relative group ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          <div className={`absolute inset-0 p-6 flex flex-col justify-center backface-hidden ${isFlipped ? 'hidden' : ''}`}>
            <span className="absolute top-4 left-4 text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Question</span>
            <h3 className="text-base md:text-lg text-white font-extrabold leading-tight tracking-tight">{cards[activeIdx].front}</h3>
            <div className="absolute bottom-4 left-0 w-full text-center text-slate-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click anywhere to reveal answer</div>
          </div>
          
          <div className={`absolute inset-0 p-6 flex flex-col justify-center backface-hidden ${!isFlipped ? 'hidden' : ''}`} style={{ transform: 'rotateY(180deg)' }}>
            <span className="absolute top-4 left-4 text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2"><Check className="w-4 h-4" /> Answer Outline</span>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed font-medium">{cards[activeIdx].back}</p>
          </div>
        </div>
      </div>

      <div className="h-28 mt-12 w-full max-w-3xl flex justify-center">
        {isFlipped ? (
          <div className="flex gap-4 animate-in slide-in-from-bottom-8 duration-300">
            <button  onClick={() => rateCard(1)} className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer bg-rose-500/10 text-rose-400 rounded-2xl font-bold border border-rose-500/20 hover:bg-rose-500/20 transition-all hover:-translate-y-1"><ThumbsDown className="w-5 h-5" /> Hard (1)</button>
            <button  onClick={() => rateCard(2)} className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer bg-amber-500/10 text-amber-400 rounded-2xl font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all hover:-translate-y-1">Medium (2)</button>
            <button  onClick={() => rateCard(3)} className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer bg-emerald-500/10 text-amber-400 rounded-2xl font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all hover:-translate-y-1"><ThumbsUp className="w-5 h-5" /> Easy (3)</button>
          </div>
        ) : (
          <div className="flex gap-4 opacity-50 pointer-events-none">
            <div className="px-4 py-2 text-sm cursor-pointer bg-white/5 rounded-2xl font-bold border border-white/10 blur-sm">Rate Difficulty</div>
          </div>
        )}
      </div>
    </section>
  );
}
