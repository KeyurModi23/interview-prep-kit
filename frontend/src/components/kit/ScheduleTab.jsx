"use client";
import { CalendarDays, Clock, CheckCircle } from 'lucide-react';

export default function ScheduleTab({ kit }) {
  if (!kit.schedule) return null;
  return (
    <section className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 tracking-tight">The {kit.schedule.days_available}-Day Master Plan</h2>
        <p className="text-slate-400 mt-3 font-medium text-sm">Paced exactly to your timeline to ensure full coverage.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kit.schedule.days.map((dayObj) => (
          <div key={dayObj.day} className="bg-[#111827]/60 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 hover:border-amber-500/30 transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] group">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 text-sm rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                  {dayObj.day}
                </div>
                <h3 className="text-sm font-bold text-white">Day {dayObj.day}</h3>
              </div>
              <span className="flex items-center gap-2 bg-white/5 text-slate-300 px-4 py-2 rounded-full text-sm font-bold border border-white/5">
                <Clock className="w-4 h-4 text-amber-400" /> {dayObj.minutes} mins
              </span>
            </div>
            
            {dayObj.question_ids.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 opacity-50">
                <CheckCircle className="w-8 h-8 text-sm text-amber-400 mb-3" />
                <p className="text-slate-300 font-bold text-sm">Rest & Review Day</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {dayObj.question_ids.map((qid, idx) => {
                  const q = kit.questions?.find(x => x.id === qid);
                  return q ? (
                    <li key={qid} className="text-slate-300 text-sm font-medium flex items-start gap-4 bg-[#030712]/50 p-4 rounded-xl border border-white/5">
                      <span className="text-amber-400 font-black opacity-50 mt-0.5">{idx + 1}.</span>
                      <span className="leading-relaxed">{q.prompt}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
