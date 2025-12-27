
import React, { useState } from 'react';
import { AppMode, Language } from './types';
import SahayakMode from './components/SahayakMode';
import ExpertMode from './components/ExpertMode';
import DisplayBoard from './components/DisplayBoard';
import { ICONS, LANGUAGES, TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('SAHAYAK');
  const [lang, setLang] = useState<Language>('EN');

  const t = TRANSLATIONS[lang];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white selection:bg-gold/30">
      {/* Premium Glass Header */}
      <nav className="flex flex-col border-b border-slate-100 z-50 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 sm:px-10 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black text-gold rounded-2xl flex items-center justify-center animate-pulse shadow-xl">
              {ICONS.SCALE}
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight uppercase leading-none">Nyaya-Sahayak</h1>
              <span className="text-[8px] font-bold text-slate-400 tracking-[0.3em] uppercase">Legal Intelligence Unit</span>
            </div>
          </div>

          {/* Minimal Language Bar */}
          <div className="flex items-center space-x-1 bg-slate-100/80 rounded-2xl px-2 py-1.5 overflow-x-auto no-scrollbar">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex-shrink-0 px-3 py-1.5 text-[9px] font-bold uppercase rounded-xl transition-all ${lang === l.code ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-black'}`}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Mode Selector */}
        <div className="flex justify-center pb-4 px-6">
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setMode('SAHAYAK')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1.2rem] ${mode === 'SAHAYAK' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-black'}`}
            >
              <span>{ICONS.USER_VOICE}</span>
              <span className="whitespace-nowrap">{t.portal_citizen}</span>
            </button>
            <button 
              onClick={() => setMode('DISPLAY')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1.2rem] ${mode === 'DISPLAY' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-black'}`}
            >
              <span>{ICONS.TV}</span>
              <span className="whitespace-nowrap">{t.portal_display}</span>
            </button>
            <button 
              onClick={() => setMode('EXPERT')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1.2rem] ${mode === 'EXPERT' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-black'}`}
            >
              <span>{ICONS.GAVEL}</span>
              <span className="whitespace-nowrap">{t.portal_expert}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 relative overflow-hidden bg-white">
        <div className="h-full overflow-y-auto">
          {mode === 'SAHAYAK' ? (
            <SahayakMode language={lang} />
          ) : mode === 'DISPLAY' ? (
            <DisplayBoard language={lang} />
          ) : (
            <ExpertMode language={lang} />
          )}
        </div>
      </main>

      {/* Elegant Mini-Footer */}
      <footer className="bg-white border-t border-slate-50 px-10 py-4 hidden sm:flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
        <div className="flex items-center space-x-4">
           <span className="text-black">GOVERNMENT OF INDIA</span>
           <span className="opacity-20">|</span>
           <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">LIVE_MONITOR_v1</span>
        </div>
        <div className="flex space-x-6">
          <span>Sovereign Encryption Enabled</span>
        </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
