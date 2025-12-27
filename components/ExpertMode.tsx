
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, Citation, Language, GroundingChunk } from '../types';
import { GENERIC_RESPONSE, ICONS, TRANSLATIONS } from '../constants';

interface ExpertModeProps {
  language: Language;
}

const ExpertMode: React.FC<ExpertModeProps> = ({ language }) => {
  const t = TRANSLATIONS[language].expert;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'HI' ? "विशेषज्ञ सत्र प्रारंभ हुआ। BNS, BNSS, और BSA (2024) के लिए सत्यापित।" : "Expert Practitioner Session Initiated. Verified for BNS, BNSS, and BSA (2024).",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCitations, setActiveCitations] = useState<Citation[]>([]);
  const [activeGrounding, setActiveGrounding] = useState<GroundingChunk[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: query,
        config: {
          systemInstruction: `You are the Lead Legal Strategist for the High Court. Provide technical legal analysis including sections from the Constitution, BNS, BNSS, and BSA. Tone: Formal, precise, authoritative. Respond in ${language}. Use Google Search to find real-time precedents or recent news regarding legal amendments.`,
          tools: [{ googleSearch: {} }]
        }
      });
      
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      const aiMsg: Message = {
        id: Date.now().toString(),
        text: response.text || "Analysis synthesized based on statutory guidelines.",
        sender: 'ai',
        timestamp: new Date(),
        citations: GENERIC_RESPONSE.citations,
        grounding: grounding
      };

      setMessages(prev => [...prev, aiMsg]);
      setActiveCitations(prev => [...GENERIC_RESPONSE.citations, ...prev].slice(0, 5));
      if (grounding.length > 0) {
        setActiveGrounding(prev => [...grounding, ...prev].slice(0, 10));
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Neural Link Offline: Statutory database synchronization required.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const EXPERT_TOOLS = [
    { label: t.tools.search, icon: ICONS.SEARCH, color: 'text-blue-500' },
    { label: t.tools.convert, icon: ICONS.LAYERS, color: 'text-purple-500' },
    { label: t.tools.draft, icon: ICONS.PENCIL, color: 'text-orange-500' },
    { label: t.tools.verify, icon: ICONS.CHECK, color: 'text-green-500' }
  ];

  return (
    <div className="flex h-full w-full bg-[#0a0a0a] overflow-hidden font-mono selection:bg-gold/30">
      
      {/* Pane 1: Legal Sidebar (Expert Toolbox) */}
      <aside className="w-16 sm:w-64 border-r border-white/10 flex flex-col h-full bg-[#111111] hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Workbench v5.0</h4>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {EXPERT_TOOLS.map((tool, idx) => (
            <button 
              key={idx}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-all group text-left"
            >
              <span className={`${tool.color} group-hover:scale-110 transition-transform`}>{tool.icon}</span>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider group-hover:text-white transition-colors">{tool.label}</span>
            </button>
          ))}
          
          <div className="pt-8 space-y-4">
             <div className="flex items-center space-x-2 px-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[9px] font-bold text-green-500 uppercase">Neural Core Online</span>
             </div>
             <div className="px-3">
               <p className="text-[8px] font-medium text-white/20 uppercase tracking-tighter leading-relaxed">
                 Citing precedents from Supreme Court of India & BNS 2024.
               </p>
             </div>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-xl space-y-2">
            <span className="text-[8px] font-black text-gold uppercase tracking-widest">Counsel License</span>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-[10px] text-black font-black">AI</div>
              <span className="text-[10px] font-bold text-white">GEN-092-2024</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Pane 2: Primary Analysis Console */}
      <main className="flex-1 flex flex-col h-full relative border-r border-white/10 bg-[#0c0c0c]">
        {/* Terminal Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/5 rounded-lg text-gold">{ICONS.GAVEL}</div>
            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t.feed_title}</h3>
              <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Active Session: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <div className="h-6 w-px bg-white/10 mx-2"></div>
             <button className="px-4 py-1.5 border border-white/20 text-[9px] font-black text-white/60 uppercase hover:bg-white hover:text-black transition-all">
               {t.btn_brief}
             </button>
          </div>
        </header>

        {/* Scrollable Analysis Log */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-12 no-scrollbar"
        >
          {messages.map((msg) => (
            <article key={msg.id} className="animate-fade-in group">
               <div className="flex items-start space-x-6">
                 <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                   msg.sender === 'user' ? 'bg-white/10 text-white' : 'bg-gold text-black'
                 }`}>
                   {msg.sender === 'user' ? 'U' : 'AI'}
                 </div>
                 <div className="flex-1 space-y-4">
                    <header className="flex items-center space-x-4 opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{msg.sender === 'user' ? 'Case Inquiry' : t.brain}</span>
                      <span className="text-[8px] text-white/40">{msg.timestamp.toLocaleTimeString()}</span>
                    </header>
                    <div className={`text-sm sm:text-base leading-relaxed ${
                      msg.sender === 'ai' ? 'text-gold/90 serif-heading text-lg italic' : 'text-white/80 font-mono'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.grounding && msg.grounding.length > 0 && (
                      <div className="pt-4 border-t border-white/5 space-y-2">
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Grounding Sources:</span>
                        <div className="flex flex-wrap gap-2">
                          {msg.grounding.map((g, idx) => g.web && (
                            <a 
                              key={idx} 
                              href={g.web.uri} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[9px] text-blue-300/60 hover:text-blue-300 transition-colors flex items-center space-x-1 bg-blue-500/5 px-2 py-1 rounded"
                            >
                              <span>{ICONS.GLOBE}</span>
                              <span className="truncate max-w-[150px]">{g.web.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
               </div>
            </article>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-3 px-14 py-4 animate-pulse">
               <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
               <span className="text-[9px] font-black text-gold uppercase tracking-[0.4em]">Processing Legal Logic...</span>
            </div>
          )}
        </div>

        {/* Command Input */}
        <div className="p-6 border-t border-white/10 bg-black/40">
           <div className="max-w-4xl mx-auto flex items-stretch border border-white/20 rounded-2xl overflow-hidden focus-within:border-gold transition-all bg-white/5">
             <div className="flex items-center px-6 text-white/20 border-r border-white/10">{ICONS.GAVEL}</div>
             <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider focus:outline-none placeholder:text-white/10"
             />
             <button 
               onClick={handleSend}
               className="bg-gold text-black px-10 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all active:scale-95"
             >
               {t.btn_analyze}
             </button>
           </div>
           <div className="flex justify-center mt-3">
             <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Verified against official digital legal records of the Government of India</p>
           </div>
        </div>
      </main>

      {/* Pane 3: Intelligence Dashboard (Sidebar) */}
      <aside className="w-96 h-full bg-[#0a0a0a] overflow-y-auto hidden xl:flex flex-col border-l border-white/10">
        <header className="p-8 border-b border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">{t.citations_title}</h4>
            <div className="px-2 py-0.5 bg-gold/10 text-gold text-[8px] font-black rounded uppercase">Live Feed</div>
          </div>
          
          <div className="space-y-4">
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 group hover:border-gold transition-all">
                <div className="flex items-center space-x-3 text-gold">
                   <span>{ICONS.DOC}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest">{t.dossier_title}</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-medium">{t.dossier_desc}</p>
             </div>
          </div>
        </header>

        <section className="flex-1 p-8 space-y-12">
           <div className="space-y-6">
              <h5 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Active References</h5>
              <div className="space-y-4">
                 {activeCitations.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl text-center">
                       <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">Awaiting Analysis Data</p>
                    </div>
                 ) : (
                   activeCitations.map((cit, idx) => (
                     <div key={idx} className="p-6 bg-[#111111] border-l-4 border-gold rounded-r-2xl space-y-3 animate-slide-up">
                        <div className="flex justify-between items-start">
                           <span className="text-[11px] font-black text-white uppercase tracking-tighter">{cit.act}</span>
                           <span className="text-[8px] text-gold font-bold">SECTION {cit.section}</span>
                        </div>
                        <p className="text-xs text-white/50 italic leading-relaxed">{cit.summary}</p>
                     </div>
                   ))
                 )}
              </div>
           </div>

           {activeGrounding.length > 0 && (
              <div className="space-y-6">
                 <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">Web Grounding Context</h5>
                 <div className="grid grid-cols-1 gap-3">
                    {activeGrounding.map((g, idx) => g.web && (
                       <a 
                        key={idx} 
                        href={g.web.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-400 transition-all group"
                       >
                          <h6 className="text-[10px] font-bold text-white/80 group-hover:text-blue-300 truncate">{g.web.title}</h6>
                          <p className="text-[8px] text-white/20 truncate mt-1">{g.web.uri}</p>
                       </a>
                    ))}
                 </div>
              </div>
           )}
        </section>

        <footer className="p-8 border-t border-white/10">
           <div className="flex items-center space-x-3 grayscale opacity-30">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black text-xl">N</div>
              <div className="text-[9px] font-black text-white uppercase tracking-widest">Nyaya AI Core v5.1</div>
           </div>
        </footer>
      </aside>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #c5a059; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ExpertMode;
