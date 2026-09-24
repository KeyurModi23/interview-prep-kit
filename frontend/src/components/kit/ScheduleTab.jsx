"use client";
export default function ScheduleTab({ kit }) {
  if (!kit.schedule) return null;
  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your {kit.schedule.days_available}-Day Master Plan</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {kit.schedule.days.map((dayObj) => (
          <div key={dayObj.day} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-2xl font-extrabold text-indigo-700">Day {dayObj.day}</h3>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold">{dayObj.minutes} mins</span>
            </div>
            {dayObj.question_ids.length === 0 ? (
              <p className="text-slate-400 font-semibold italic text-center py-6">Rest and review day!</p>
            ) : (
              <ul className="space-y-4">
                {dayObj.question_ids.map(qid => {
                  const q = kit.questions?.find(x => x.id === qid);
                  return q ? (
                    <li key={qid} className="text-slate-700 text-sm font-medium flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="mt-1 w-2 h-2 rounded-full bg-indigo-400 shrink-0"></div>
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
