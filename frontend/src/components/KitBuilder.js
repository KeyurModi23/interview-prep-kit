"use client";

import { useState } from 'react';

export default function KitBuilder({ initialKit, daysAvailable = 4 }) {
  const [kit, setKit] = useState(initialKit);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('builder'); // builder, flashcards, schedule
  
  // Flashcard State
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- STATE MANAGEMENT LOGIC ---

  const handleEditQuestion = (id, newPrompt, newOutline) => {
    setKit(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, prompt: newPrompt, answer_outline: newOutline, _isEdited: true } : q
      )
    }));
    setEditingQuestionId(null);
  };

  const handleMove = (index, direction) => {
    setKit(prev => {
      const newQuestions = [...prev.questions];
      if (direction === 'up' && index > 0) {
        [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
      } else if (direction === 'down' && index < newQuestions.length - 1) {
        [newQuestions[index + 1], newQuestions[index]] = [newQuestions[index], newQuestions[index + 1]];
      }
      return { ...prev, questions: newQuestions };
    });
  };

  const handleDelete = (id) => {
    setKit(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const handleAddQuestion = () => {
    const newQ = {
      id: `q-manual-${Date.now()}`,
      requirement_ids: [],
      category: 'technical',
      prompt: 'New Question',
      answer_outline: '',
      difficulty: 1,
      _isEdited: true
    };
    setKit(prev => ({ ...prev, questions: [newQ, ...prev.questions] }));
    setEditingQuestionId(newQ.id);
  };

  const handleRegenerateCategory = async (category) => {
    setIsRegenerating(true);
    try {
      await new Promise(res => setTimeout(res, 1500));
      setKit(prev => {
        const preservedQuestions = prev.questions.filter(q => q.category !== category || q._isEdited);
        const newQ = {
          id: `q-regen-${Date.now()}`,
          requirement_ids: [],
          category,
          prompt: `[REGENERATED] New ${category} question focusing on deep technical concepts.`,
          answer_outline: 'Generated outline covering key technical requirements...',
          difficulty: 2
        };
        return { ...prev, questions: [...preservedQuestions, newQ] };
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  // --- SCHEDULE LOGIC ---
  const generateSchedule = () => {
    const schedule = Array.from({ length: daysAvailable }, () => []);
    kit.questions.forEach((q, idx) => {
      const dayIndex = idx % daysAvailable;
      schedule[dayIndex].push(q);
    });
    return schedule;
  };

  const scheduleData = generateSchedule();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Interview Prep Kit</h1>
            <p className="text-gray-500">Coverage Pass: {kit.coverage?.passes || 1} | Extracted Requirements: {kit.requirements?.length || 0} | Days: {daysAvailable}</p>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setActiveTab('builder')} className={`px-4 py-2 rounded-md font-semibold transition-all ${activeTab === 'builder' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Builder</button>
            <button onClick={() => { setActiveTab('flashcards'); setIsFlipped(false); setActiveFlashcard(0); }} className={`px-4 py-2 rounded-md font-semibold transition-all ${activeTab === 'flashcards' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Flashcards</button>
            <button onClick={() => setActiveTab('schedule')} className={`px-4 py-2 rounded-md font-semibold transition-all ${activeTab === 'schedule' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Schedule</button>
          </div>
        </header>

        {activeTab === 'builder' && (
          <>
            {/* Requirements Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements Profile</h2>
              <div className="grid grid-cols-1 gap-4">
                {kit.requirements?.map(req => (
                  <div key={req.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${req.priority === 'must' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {req.priority}
                    </span>
                    <div>
                      <p className="text-gray-800 font-medium">{req.text}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">{req.kind} • ID: {req.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Questions Section (The Builder) */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Question Bank (The Builder)</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    + Add Question
                  </button>
                  <button 
                    onClick={() => handleRegenerateCategory('technical')}
                    disabled={isRegenerating}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isRegenerating ? 'Regenerating...' : 'Regenerate Technical'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {kit.questions?.map((q, index) => (
                  <div key={q.id} className="group flex gap-4 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all bg-white">
                    <div className="flex flex-col gap-1 border-r border-gray-100 pr-4 justify-center items-center">
                      <button onClick={() => handleMove(index, 'up')} className="text-gray-400 hover:text-indigo-600 p-1">▲</button>
                      <span className="text-xs font-bold text-gray-300">{index + 1}</span>
                      <button onClick={() => handleMove(index, 'down')} className="text-gray-400 hover:text-indigo-600 p-1">▼</button>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold capitalize">{q.category}</span>
                          {q._isEdited && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">✓ Pinned</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditingQuestionId(q.id)} className="text-sm text-gray-500 hover:text-indigo-600 font-medium">Edit</button>
                          <button onClick={() => handleDelete(q.id)} className="text-sm text-red-400 hover:text-red-600 font-medium">Delete</button>
                        </div>
                      </div>
                      {editingQuestionId === q.id ? (
                        <form 
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditQuestion(q.id, e.target.prompt.value, e.target.outline.value);
                          }}
                        >
                          <textarea name="prompt" className="w-full p-4 border border-indigo-500 rounded-lg focus:ring-0 text-gray-900 font-semibold" rows="2" defaultValue={q.prompt} autoFocus />
                          <textarea name="outline" className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700" rows="2" defaultValue={q.answer_outline} placeholder="Answer outline..." />
                          <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Save Changes</button>
                            <button type="button" onClick={() => setEditingQuestionId(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <div className="cursor-pointer" onClick={() => setEditingQuestionId(q.id)}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{q.prompt}</h3>
                          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">{q.answer_outline}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'flashcards' && kit.questions.length > 0 && (
          <section className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Practice Mode</h2>
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-2xl min-h-[300px] bg-white rounded-3xl shadow-lg border border-gray-100 p-10 cursor-pointer transition-all transform hover:scale-[1.02] flex flex-col justify-center text-center relative"
            >
              <span className="absolute top-6 left-6 text-sm font-bold text-indigo-400 uppercase tracking-widest">
                {isFlipped ? 'Answer Outline' : 'Question'}
              </span>
              <span className="absolute top-6 right-6 text-sm font-medium text-gray-400">
                {activeFlashcard + 1} / {kit.questions.length}
              </span>

              {isFlipped ? (
                <p className="text-xl text-gray-700 leading-relaxed font-medium mt-4">{kit.questions[activeFlashcard].answer_outline}</p>
              ) : (
                <h3 className="text-3xl text-gray-900 font-bold mt-4 leading-tight">{kit.questions[activeFlashcard].prompt}</h3>
              )}
              
              <div className="absolute bottom-6 left-0 w-full text-center text-gray-400 text-sm font-medium animate-pulse">
                Click to flip
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                disabled={activeFlashcard === 0}
                onClick={() => { setActiveFlashcard(prev => prev - 1); setIsFlipped(false); }}
                className="px-6 py-3 bg-white text-gray-800 font-bold rounded-xl shadow-sm border border-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={activeFlashcard === kit.questions.length - 1}
                onClick={() => { setActiveFlashcard(prev => prev + 1); setIsFlipped(false); }}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
              >
                Next Question
              </button>
            </div>
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your {daysAvailable}-Day Study Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {scheduleData.map((dayQs, dayIndex) => (
                <div key={dayIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b pb-2">Day {dayIndex + 1}</h3>
                  {dayQs.length === 0 ? (
                    <p className="text-gray-500 italic">Rest day!</p>
                  ) : (
                    <ul className="space-y-3">
                      {dayQs.map(q => (
                        <li key={q.id} className="text-gray-800 text-sm font-medium flex gap-2">
                          <span className="text-indigo-400">•</span> {q.prompt.substring(0, 70)}...
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
