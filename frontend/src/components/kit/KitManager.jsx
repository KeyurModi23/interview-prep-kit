"use client";
import { useState } from 'react';
import KitHeader from './KitHeader';
import BuilderTab from './BuilderTab';
import FlashcardTab from './FlashcardTab';
import ScheduleTab from './ScheduleTab';

export default function KitManager({ initialKit, onLogout }) {
  const [kit, setKit] = useState(initialKit);
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <KitHeader kit={kit} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
        {activeTab === 'builder' && <BuilderTab kit={kit} setKit={setKit} />}
        {activeTab === 'flashcards' && <FlashcardTab kit={kit} setKit={setKit} />}
        {activeTab === 'schedule' && <ScheduleTab kit={kit} />}
      </div>
    </div>
  );
}
