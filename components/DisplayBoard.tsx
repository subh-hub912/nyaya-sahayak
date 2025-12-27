
import React, { useState, useEffect } from 'react';
import { ICONS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface DisplayBoardProps {
  language: Language;
}

const DisplayBoard: React.FC<DisplayBoardProps> = ({ language }) => {
  const t = TRANSLATIONS[language].board;
  
  const COMPLEXES = language === 'HI' ? 
    ["साकेत कोर्ट, दिल्ली", "जयपुर जिला अदालत", "बॉम्बे हाई कोर्ट", "कलकत्ता सिटी कोर्ट", "मद्रास हाई कोर्ट"] : 
    ["Saket Court, Delhi", "Jaipur District Court", "Bombay High Court", "Calcutta City Court", "Madras High Court"];

  const ROOMS = language === 'HI' ?
    ["कोर्ट रूम 4 - जस्टिस शर्मा", "कोर्ट रूम 12 - जस्टिस वर्मा", "कोर्ट रूम 1 - मुख्य न्यायाधीश कार्यालय", "कोर्ट रूम 7 - जस्टिस अय्यर", "कोर्ट रूम 21 - जस्टिस दास"] :
    ["Courtroom 4 - Justice Sharma", "Courtroom 12 - Justice Verma", "Courtroom 1 - Chief Justice Office", "Courtroom 7 - Justice Iyer", "Courtroom 21 - Justice Das"];

  const [complex, setComplex] = useState(COMPLEXES[0]);
  const [room, setRoom] = useState(ROOMS[0]);
  const [currentItem, setCurrentItem] = useState(14);
  const [myItem, setMyItem] = useState<number | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => {
      setCurrentItem(Math.floor(Math.random() * 40) + 5);
      setIsUpdating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [complex, room]);

  const waitTime = myItem && myItem > currentItem ? (myItem - currentItem) * 15 : 0;
  
  const getUrgencyColor = () => {
    if (waitTime === 0) return 'text-slate-300';
    if (waitTime < 45) return 'text-red-500';
    if (waitTime < 90) return 'text-gold';
    return 'text-green-500';
  };

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-y-auto px-4 sm:px-12 pb-24 animate-fade-in">
      <div className="max-w-6xl mx-auto w-full py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{t.feed_status}</span>
          </div>
          <h2 className="text-4xl sm:text-6xl serif-heading font-semibold text-black tracking-tight">{t.title}</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-4">
            <label className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span>{ICONS.BUILDING}</span>
              <span>{t.complex}</span>
            </label>
            <select 
              value={complex}
              onChange={(e) => setComplex(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black transition-all outline-none appearance-none cursor-pointer"
            >
              {COMPLEXES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span>{ICONS.GAVEL}</span>
              <span>{t.room}</span>
            </label>
            <select 
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black transition-all outline-none appearance-none cursor-pointer"
            >
              {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Live Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Display */}
          <div className="lg:col-span-2 bg-black text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center min-h-[400px]">
            <div className="absolute top-0 right-0 p-10 opacity-10 scale-[4]">{ICONS.TV}</div>
            
            <div className="relative z-10 text-center space-y-8 w-full">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gold">{t.hearing}</span>
                <h3 className="text-9xl font-black tracking-tighter transition-all duration-500" style={{ opacity: isUpdating ? 0.2 : 1 }}>
                  #{currentItem}
                </h3>
              </div>
              
              <div className="flex flex-col items-center space-y-6">
                 <div className="w-full max-w-md h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${(currentItem/60)*100}%` }}></div>
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Item Progress: {currentItem}/60</p>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-lg border-t border-white/10 pt-8">
                {[currentItem + 1, currentItem + 2, currentItem + 3].map(item => (
                  <div key={item} className="text-center">
                    <span className="block text-[9px] font-bold text-white/30 uppercase mb-1">{t.on_deck}</span>
                    <span className="text-xl font-bold text-gold">#{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Tracker */}
          <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-xl flex flex-col space-y-10">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">{ICONS.TIMER}</div>
                <h4 className="text-sm font-black uppercase tracking-widest">{t.tracker_title}</h4>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {t.tracker_desc}
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block ml-1">{t.your_item}</label>
              <input 
                type="number" 
                value={myItem}
                onChange={(e) => setMyItem(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Ex: 24"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-2xl font-black focus:border-black transition-all outline-none"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
              {myItem && myItem > currentItem ? (
                <div className="space-y-3 animate-slide-up">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.wait_time}</span>
                  <div className={`text-6xl font-black tracking-tight ${getUrgencyColor()}`}>
                    {waitTime}<span className="text-xl ml-1">min</span>
                  </div>
                </div>
              ) : myItem && myItem <= currentItem ? (
                <div className="text-red-500 space-y-2">
                   <div className="text-4xl">⚠️</div>
                   <p className="text-xs font-black uppercase">{t.passed}</p>
                   <p className="text-[9px] font-bold text-slate-400">{t.report}</p>
                </div>
              ) : (
                <div className="text-slate-300 space-y-2">
                  <div className="scale-150 mb-4">{ICONS.TIMER}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Input Item #</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center space-x-6">
           <div className="p-4 bg-white rounded-2xl text-gold shadow-sm">{ICONS.DOC}</div>
           <div className="space-y-1">
             <h5 className="text-[10px] font-black uppercase tracking-widest">{t.disclaimer}</h5>
             <p className="text-xs text-slate-500 font-medium">{t.disclaimer_text}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayBoard;
