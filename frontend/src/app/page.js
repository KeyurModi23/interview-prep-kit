"use client";

import { useState } from 'react';
import KitBuilder from '../components/KitBuilder';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [days, setDays] = useState(4);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kit, setKit] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, URL should be an env variable, but we hardcode for local dev
      const response = await fetch('http://localhost:3000/api/v1/kits/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, companyUrl, days })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Generation failed');
      }

      setKit(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (kit) {
    return <KitBuilder initialKit={kit} daysAvailable={days} />;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-8 py-10 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">PrepForge</h1>
          <p className="text-indigo-200 text-lg">Turn any job description into a personalized interview kit.</p>
        </div>
        
        <form onSubmit={handleGenerate} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
            <textarea 
              required
              rows={8}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800"
              placeholder="Paste the raw job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company URL</label>
              <input 
                type="url"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800"
                placeholder="https://acme.com"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Days until Interview</label>
              <input 
                type="number"
                min="1"
                max="30"
                required
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Job & Generating Kit...</span>
              </>
            ) : (
              'Forge My Kit'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
