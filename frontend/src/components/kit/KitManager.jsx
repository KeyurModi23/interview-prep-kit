"use client";
import { useState, useEffect } from 'react';
import KitHeader from './KitHeader';
import BuilderTab from './BuilderTab';
import FlashcardTab from './FlashcardTab';
import ScheduleTab from './ScheduleTab';

export default function KitManager({ initialKit, onLogout, onClose }) {
  const [kit, setKit] = useState(initialKit);
  const [activeTab, setActiveTab] = useState('builder');

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


  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-amber-500/30 pb-20">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 space-y-8 relative z-10">
        <KitHeader kit={kit} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} onClose={onClose} />
        
        <main className="animate-in slide-in-from-bottom-8 duration-700">
          {activeTab === 'builder' && <BuilderTab kit={kit} setKit={setKit} />}
          {activeTab === 'flashcards' && <FlashcardTab kit={kit} setKit={setKit} />}
          {activeTab === 'schedule' && <ScheduleTab kit={kit} />}
        </main>
      </div>
    </div>
  );
}
