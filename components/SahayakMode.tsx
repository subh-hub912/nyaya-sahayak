
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { ICONS, LANGUAGES, TRANSLATIONS, MOCK_LAWYERS } from '../constants';
import { Language, Lawyer } from '../types';

type State = 'IDLE' | 'LISTENING' | 'THINKING' | 'RESULT';

interface LegalAnalysis {
  roadmap: string[];
  simpleLaw: string;
  rights: string;
  sourceDoc: {
    title: string;
    section: string;
    date: string;
  };
}

// Helper functions for audio processing as per Gemini API guidelines
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SahayakMode: React.FC<{ language: Language }> = ({ language }) => {
  const [state, setState] = useState<State>('IDLE');
  const [dots, setDots] = useState('');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ data: string; mime: string } | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLawyers, setShowLawyers] = useState(false);

  const t = TRANSLATIONS[language];
  const currentLangConfig = LANGUAGES.find(l => l.code === language);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    let interval: any;
    if (state === 'LISTENING' || state === 'THINKING') {
      interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [state]);

  const speakResult = async (text: string) => {
    if (isPlaying) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in ${currentLangConfig?.label}: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio data received");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        audioContextRef.current,
        24000,
        1
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      
      audioSourceRef.current = source;
      source.start();
    } catch (err) {
      console.error("Gemini TTS Error:", err);
      setIsPlaying(false);
      // Fallback to browser synthesis if Gemini fails
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLangConfig?.voice || 'en-IN';
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const startVoiceCapture = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = currentLangConfig?.voice || 'en-IN';

      recognitionRef.current.onstart = () => {
        setState('LISTENING');
        setTranscript('');
        setInterimTranscript('');
        setFileData(null);
        setFileName(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) setTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access was denied.");
        }
        setState('IDLE');
      };

      recognitionRef.current.start();
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required for voice input.");
      setState('IDLE');
    }
  };

  const stopAndProcess = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setState('THINKING');
  };

  useEffect(() => {
    if (state === 'THINKING') {
      const finalQuery = transcript + interimTranscript || textInput || (fileData ? "Analyzing document." : "General query.");
      generateRoadmap(finalQuery);
    }
  }, [state]);

  const generateRoadmap = async (query: string) => {
    setIsGenerating(true);
    setShowLawyers(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [{ 
        text: `Analyze the user query: "${query}". Provide a legal response in ${currentLangConfig?.label}.` 
      }];

      if (fileData) {
        parts.push({
          inlineData: {
            data: fileData.data,
            mimeType: fileData.mime
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          systemInstruction: `You are Nyaya-Sahayak, an Indian legal AI. 
          Provide output in ${currentLangConfig?.label}.
          
          Output structure: {
            "roadmap": ["Step 1", "Step 2", "Step 3", "Step 4"],
            "simpleLaw": "Short legal explanation",
            "rights": "Relevant fundamental right",
            "sourceDoc": {
              "title": "Official Act Title",
              "section": "Exact section",
              "date": "Year"
            }
          }.`,
          responseMimeType: "application/json"
        }
      });
      const data = JSON.parse(response.text || '{}');
      setAnalysis(data);
      setState('RESULT');
      
      // Auto-speak summary
      setTimeout(() => {
        speakResult(`${data.simpleLaw}. ${data.rights}`);
      }, 800);

    } catch (e) {
      setAnalysis({
        roadmap: ["Visit local station", "Consult legal help", "Keep evidence"],
        simpleLaw: "Please refer to BNS guidelines.",
        rights: "Right to legal remedy.",
        sourceDoc: { title: "BNS", section: "General", date: "2024" }
      });
      setState('RESULT');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFileData({ data: base64, mime: file.type });
      setState('THINKING');
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setState('THINKING');
  };

  const SUGGESTIONS = [
    { label: t.topics.fir, icon: ICONS.POLICE, hint: "Crime reporting" },
    { label: t.topics.property, icon: ICONS.HOME, hint: "Land & House" },
    { label: t.topics.fraud, icon: ICONS.MONEY, hint: "Money cheated" },
    { label: t.topics.bail, icon: ICONS.UNLOCK, hint: "Court release" },
    { label: t.topics.violence, icon: ICONS.SHIELD, hint: "Family safety" }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-y-auto px-4 sm:px-12 pb-24">
      {state === 'IDLE' && (
        <div className="max-w-6xl mx-auto w-full py-12 space-y-16 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-slate-100 px-4 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Cognitive Neural Core Active</span>
            </div>
            <h2 className="text-4xl sm:text-6xl serif-heading font-semibold text-black tracking-tight">{t.hero_title}</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed text-sm sm:text-lg">{t.hero_subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 sm:px-0">
            <button 
              onClick={startVoiceCapture}
              className="group relative flex flex-col items-center justify-center p-12 bg-black text-white rounded-[2rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold/20 transition-all"></div>
              <div className="mb-6 scale-[1.8] text-gold group-hover:rotate-12 transition-transform">{ICONS.MIC}</div>
              <span className="text-2xl font-bold tracking-tight">{t.btn_speak}</span>
              <span className="text-[10px] mt-4 opacity-40 font-bold uppercase tracking-[0.2em]">{currentLangConfig?.label} {t.btn_speak}</span>
            </button>

            <div className="flex flex-col space-y-4">
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] transition-all hover:border-black group relative hover:bg-white hover:shadow-xl active:scale-[0.98]">
                <label className="cursor-pointer flex flex-col items-center text-center w-full h-full justify-center">
                  <div className="mb-4 scale-[1.5] text-slate-400 group-hover:text-black group-hover:-translate-y-1 transition-all">{ICONS.UPLOAD}</div>
                  <span className="text-xl font-bold tracking-tight text-slate-800">{t.btn_scan}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload} 
                  />
                </label>
              </div>

              <form onSubmit={handleManualSubmit} className="flex space-x-2 bg-white border-2 border-slate-100 rounded-2xl p-2 shadow-sm focus-within:border-black transition-all">
                <input 
                  type="text" 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t.placeholder_type}
                  className="flex-1 px-4 py-2 text-sm font-medium outline-none bg-transparent"
                />
                <button type="submit" className="bg-black text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
                  {ICONS.CHECK}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8 pt-8 px-4 sm:px-0">
            <div className="flex items-center space-x-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">{t.quick_topics}</h3>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {SUGGESTIONS.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setTranscript(s.label);
                    setState('THINKING');
                  }}
                  className="p-6 group flex flex-col items-center text-center space-y-4 transition-all bg-white border border-slate-100 rounded-3xl hover:border-gold hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-gold/10 group-hover:text-gold transition-colors">{s.icon}</div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">{s.label}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{s.hint}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(state === 'LISTENING' || state === 'THINKING') && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-fade-in px-4">
          <div className={`p-16 bg-black rounded-[3rem] shadow-2xl relative overflow-hidden group transition-all ${state === 'LISTENING' ? 'scale-110' : 'scale-100'}`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent opacity-50"></div>
            <div className="flex space-x-3 items-center h-24 relative z-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <div key={i} className="w-1.5 bg-gold animate-neural-pulse" style={{
                        height: '30px',
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: state === 'LISTENING' ? '0.6s' : '1.2s'
                    }}></div>
                ))}
            </div>
          </div>
          <div className="text-center space-y-6 max-w-2xl w-full">
            <h3 className="text-3xl font-bold tracking-tight italic">
                {state === 'LISTENING' ? `${t.label_listening}${dots}` : `${t.label_thinking}${dots}`}
            </h3>
            
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
               <p className="text-slate-600 text-lg font-bold italic leading-relaxed">
                 {fileName ? `Scanning: ${fileName}` : (interimTranscript || transcript || "...")}
               </p>
            </div>

            {state === 'LISTENING' && (
              <button 
                onClick={stopAndProcess}
                className="px-12 py-4 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                {t.btn_stop}
              </button>
            )}
            
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Justice Intelligence Node v5.0</p>
          </div>
        </div>
      )}

      {state === 'RESULT' && (
        <div className="max-w-4xl mx-auto w-full py-12 space-y-12 animate-slide-up px-4 sm:px-0">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 text-white p-10 flex flex-col sm:flex-row justify-between items-start gap-8">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-gold/20 text-gold text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Citizen Justice Portal</span>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{t.label_processed}</h5>
                  <p className="text-2xl sm:text-4xl serif-heading italic leading-tight text-slate-100">
                    "{fileName ? `Document: ${fileName}` : (transcript || textInput || "Query")}"
                  </p>
                </div>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl text-gold backdrop-blur-xl border border-white/10 hidden sm:block">{ICONS.SCALE}</div>
            </div>
            
            <div className="p-8 sm:p-12 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Audio Briefing */}
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col space-y-6 relative overflow-hidden">
                  <button 
                    onClick={() => speakResult(`${analysis?.simpleLaw}. ${analysis?.rights}`)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 ${isPlaying ? 'bg-gold text-white animate-pulse' : 'bg-black text-gold'}`}
                  >
                    {isPlaying ? <div className="flex space-x-1"><div className="w-1 h-3 bg-white"></div><div className="w-1 h-3 bg-white"></div></div> : ICONS.VOLUME}
                  </button>
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.label_briefing}</h4>
                     <p className="text-xs font-bold text-slate-800 mt-1">{isPlaying ? 'Playing...' : 'Play Summary'}</p>
                  </div>
                  <div className="flex space-x-1 h-6 items-end">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-gold' : 'bg-slate-200'}`} style={{ height: isPlaying ? `${20 + Math.random() * 80}%` : '20%' }}></div>
                    ))}
                  </div>
                </div>

                {/* Legit Source Card */}
                <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] flex flex-col space-y-6 group hover:border-black transition-all">
                   <div className="flex justify-between items-start">
                     <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-black group-hover:text-white transition-all">{ICONS.DOC}</div>
                     <span className="text-[8px] font-black uppercase bg-green-100 text-green-600 px-3 py-1 rounded-full">{t.label_official}</span>
                   </div>
                   <div className="space-y-2">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.label_source}</h4>
                     <p className="text-sm font-black text-slate-900 leading-tight">
                        {analysis?.sourceDoc.title} ({analysis?.sourceDoc.date})
                     </p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Section: {analysis?.sourceDoc.section}</p>
                   </div>
                   <button className="w-full py-3 text-[9px] font-black uppercase tracking-widest border border-slate-100 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center space-x-2">
                      <span>{ICONS.UPLOAD}</span>
                      <span>Snippet</span>
                   </button>
                </div>
              </div>

              {/* Final Statutory Insight (Expert Summary) */}
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">{t.label_insight}</h4>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group border-l-8 border-gold shadow-2xl">
                  <p className="text-xl sm:text-3xl serif-heading italic leading-relaxed text-gold relative z-10">
                    {analysis?.simpleLaw}
                  </p>
                </div>
              </div>

              {/* Legal Roadmap Steps */}
              <div className="space-y-10">
                <div className="flex items-center space-x-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{t.label_roadmap}</h4>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {analysis?.roadmap.map((step, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[2rem] hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-xl group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-black text-slate-200 group-hover:text-gold transition-colors">{String(i + 1).padStart(2, '0')}</span>
                        <div className="text-slate-300 group-hover:text-black transition-colors">{ICONS.CHECK}</div>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lawyer Marketplace Integration */}
              {showLawyers ? (
                <div className="space-y-8 pt-8 animate-fade-in">
                   <div className="flex items-center space-x-6">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">{t.label_marketplace}</h4>
                      <div className="flex-1 h-px bg-slate-100"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {MOCK_LAWYERS.map((lawyer) => (
                        <div key={lawyer.id} className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden hover:border-black transition-all hover:shadow-2xl group flex flex-col">
                           <div className="p-6 bg-slate-50 flex items-center space-x-4">
                              <img src={lawyer.image} alt={lawyer.name} className="w-16 h-16 rounded-2xl bg-white border border-slate-200" />
                              <div className="flex-1 overflow-hidden">
                                 <h5 className="font-black text-sm text-slate-900 truncate">{lawyer.name}</h5>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{lawyer.court}</p>
                                 <div className="flex items-center space-x-1 text-gold mt-1">
                                    <span className="scale-75">{ICONS.STAR}</span>
                                    <span className="text-[10px] font-black">{lawyer.rating}</span>
                                    <span className="text-[8px] text-slate-300">({lawyer.feedbackCount})</span>
                                 </div>
                              </div>
                           </div>
                           <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                              <div className="flex flex-wrap gap-1.5">
                                 {lawyer.specialization.map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-slate-100 rounded-md text-[8px] font-black uppercase text-slate-500">{s}</span>
                                 ))}
                              </div>
                              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                                 <div>
                                    <span className="block text-[8px] font-black text-slate-400 uppercase">{t.label_fee}</span>
                                    <span className="text-xs font-black text-green-600">₹{lawyer.fee}</span>
                                 </div>
                                 <div className="text-right">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase">{t.label_cases}</span>
                                    <span className="text-xs font-black text-slate-900">{lawyer.wins + lawyer.losses}</span>
                                 </div>
                              </div>
                              <div className="flex space-x-2 pt-2">
                                 <div className="flex-1 bg-green-50 rounded-xl p-2 text-center">
                                    <span className="block text-[7px] font-black text-green-600 uppercase">{t.label_wins}</span>
                                    <span className="text-xs font-black text-green-700">{lawyer.wins}</span>
                                 </div>
                                 <div className="flex-1 bg-red-50 rounded-xl p-2 text-center">
                                    <span className="block text-[7px] font-black text-red-400 uppercase">{t.label_losses}</span>
                                    <span className="text-xs font-black text-red-600">{lawyer.losses}</span>
                                 </div>
                              </div>
                              <button className="w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all mt-4">
                                 {t.btn_consult}
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  <button 
                    onClick={() => {
                      if (audioSourceRef.current) audioSourceRef.current.stop();
                      setIsPlaying(false);
                      setState('IDLE');
                      setTranscript('');
                      setTextInput('');
                      setFileData(null);
                      setFileName(null);
                    }}
                    className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-black transition-all"
                  >
                    {t.btn_new}
                  </button>
                  <button 
                    onClick={() => setShowLawyers(true)}
                    className="flex-1 py-5 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center space-x-3"
                  >
                    <span>{ICONS.USERS}</span>
                    <span>{t.btn_aid}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes neural-pulse {
          0%, 100% { height: 10px; opacity: 0.3; border-radius: 10px; }
          50% { height: 70px; opacity: 1; border-radius: 2px; }
        }
        .animate-neural-pulse {
          animation: neural-pulse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default SahayakMode;
