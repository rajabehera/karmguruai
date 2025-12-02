
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, Briefcase, UserCircle, Settings, Play, StopCircle, Radio, MessageSquare, Volume2, Globe, MessageCircle, User, Users, FileText, ClipboardList, PenTool, Star, ChevronRight, Lightbulb, CheckSquare } from 'lucide-react';
import { GeminiLiveSession } from '../services/liveApi';
import { generateCandidateResponse } from '../services/gemini';

const PERSONAS = [
  { id: 'Confident', desc: 'Clear, concise, professional.' },
  { id: 'Nervous', desc: 'Hesitant, filler words, anxious.' },
  { id: 'Arrogant', desc: 'Overconfident, slightly dismissive.' },
  { id: 'Detailed', desc: 'Very technical, lengthy explanations.' }
];

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Product Manager', 'Data Scientist', 'UI/UX Designer',
  'DevOps Engineer', 'Mobile Developer', 'QA Automation Engineer'
];

const EXP_LEVELS = ['Junior (0-2y)', 'Mid-Level (3-5y)', 'Senior (5-8y)', 'Principal / Lead (8y+)'];

const VOICE_MODELS = [
  { id: 'v1', label: 'US Male (Standard)', voice: 'Puck', gender: 'M', accent: 'American', prompt: 'Speak with a standard American accent.', flag: '🇺🇸' },
  { id: 'v2', label: 'US Female (Professional)', voice: 'Kore', gender: 'F', accent: 'American', prompt: 'Speak with a professional American accent.', flag: '🇺🇸' },
  { id: 'v3', label: 'UK Male (Formal)', voice: 'Fenrir', gender: 'M', accent: 'British', prompt: 'Speak with a formal British accent.', flag: '🇬🇧' },
  { id: 'v4', label: 'UK Female (Polite)', voice: 'Aoede', gender: 'F', accent: 'British', prompt: 'Speak with a polite British RP accent.', flag: '🇬🇧' },
  { id: 'v5', label: 'Indian Male (Tech)', voice: 'Charon', gender: 'M', accent: 'Indian', prompt: 'Speak with a clear Indian English accent.', flag: '🇮🇳' },
];

// Helper to generate mock profile data based on role
const getCandidateProfile = (role: string, exp: string) => {
  const skillsMap: Record<string, string[]> = {
    'Frontend Developer': ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    'Backend Developer': ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    'Data Scientist': ['Python', 'Pandas', 'PyTorch', 'SQL'],
    'Product Manager': ['Jira', 'Roadmapping', 'User Research', 'SQL'],
    'UI/UX Designer': ['Figma', 'Prototyping', 'User Flows', 'Wireframing']
  };

  const defaultSkills = ['Communication', 'Problem Solving', 'Git', 'Agile'];
  const skills = skillsMap[role] || defaultSkills;

  return {
    name: "Jordan Lee",
    summary: `Aspiring ${role} with experience in building scalable applications. Passionate about clean code and user experience. Currently looking for opportunities to leverage ${exp} years of experience.`,
    skills: [...skills, ...defaultSkills].slice(0, 6),
    education: "B.S. Computer Science, Tech University (2020)",
    lastRole: `${role} at Generic Corp`
  };
};

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  'Frontend Developer': [
    "Explain the Virtual DOM in React.",
    "How do you optimize website performance?",
    "Describe a challenging UI bug you fixed."
  ],
  'Backend Developer': [
    "Explain the difference between SQL and NoSQL.",
    "How do you handle API authentication?",
    "Describe your experience with microservices."
  ],
  'default': [
    "Tell me about yourself.",
    "What is your greatest strength?",
    "Describe a time you faced a conflict at work."
  ]
};

const ReverseInterview: React.FC = () => {
  const [step, setStep] = useState<'SETUP' | 'INTERVIEW'>('SETUP');
  const [config, setConfig] = useState({
    role: 'Frontend Developer',
    experience: 'Junior (0-2y)',
    personality: 'Confident',
    mode: 'VOICE' as 'VOICE' | 'TEXT' | 'MIXED',
    voiceId: 'v2'
  });

  const [messages, setMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState('');
  
  // Extra Features State
  const [notes, setNotes] = useState('');
  const [evaluation, setEvaluation] = useState({ technical: 0, communication: 0, culture: 0 });
  const [showScorecard, setShowScorecard] = useState(false);

  const liveSessionRef = useRef<GeminiLiveSession | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition not supported in this browser.");
        return;
    }
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (config.mode === 'MIXED') {
         handleSendMessage(transcript);
      } else {
         setInputText(transcript);
      }
    };
    recognition.start();
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;
    const newMsgs = [...messages, { sender: 'user' as const, text: text }];
    setMessages(newMsgs);
    setInputText('');
    setLoading(true);
    const voiceModel = VOICE_MODELS.find(v => v.id === config.voiceId);
    const personalityWithAccent = `${config.personality}. ${voiceModel?.prompt || ''}`;
    const response = await generateCandidateResponse(text, config.role, config.experience, personalityWithAccent);
    setMessages([...newMsgs, { sender: 'ai' as const, text: response }]);
    setLoading(false);
  };

  const startLiveSession = async () => {
    setLiveStatus("Connecting to Candidate...");
    setIsLiveActive(true);
    const voiceModel = VOICE_MODELS.find(v => v.id === config.voiceId) || VOICE_MODELS[1];
    
    liveSessionRef.current = new GeminiLiveSession({
      role: 'Candidate',
      systemInstruction: `You are a job candidate interviewing for a position. 
      Role: ${config.role}. 
      Experience Level: ${config.experience}. 
      Personality Trait: ${config.personality}.
      Accent/Voice Instruction: ${voiceModel.prompt}
      
      Your goal is to answer the interviewer's questions based on your persona.
      Keep answers concise (under 45 seconds) and natural.`,
      voiceName: voiceModel.voice,
      onAudioData: (buffer) => {
        setLiveStatus("Candidate Speaking...");
      },
      onClose: () => {
        stopLiveSession();
      },
      onError: (err) => {
        setLiveStatus("Error: " + err.message);
        setTimeout(stopLiveSession, 2000);
      }
    });

    try {
      await liveSessionRef.current.connect();
      setLiveStatus("Connected: Interview in Progress");
    } catch (e) {
      setLiveStatus("Connection Failed");
      setIsLiveActive(false);
    }
  };

  const stopLiveSession = async () => {
    if (liveSessionRef.current) {
        await liveSessionRef.current.disconnect();
        liveSessionRef.current = null;
    }
    setIsLiveActive(false);
    setLiveStatus("");
  };

  // Canvas visualizer for Live Audio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLiveActive) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#A4B5B9'; // Karm Gold (Slate)
      ctx.lineWidth = 2;
      const time = Date.now() / 100;
      const centerY = canvas.height / 2;
      
      for (let x = 0; x < canvas.width; x += 5) {
          const amplitude = liveStatus.includes("Speaking") ? 25 : 5;
          const y = centerY + Math.sin(x * 0.05 + time) * Math.cos(x * 0.01 + time * 2) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
      }
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isLiveActive, liveStatus]);

  const candidateProfile = getCandidateProfile(config.role, config.experience);
  const suggestions = SUGGESTED_QUESTIONS[config.role] || SUGGESTED_QUESTIONS['default'];

  if (step === 'SETUP') {
    return (
        <div className="flex flex-col h-full bg-karm-light">
           <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-karm-gold" />
                    </div>
                    <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Reverse <span className="text-karm-gold">Interview</span></h1>
                    <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
                    <p className="text-xs text-karm-muted font-mono hidden md:block">EVALUATE TALENT</p>
                </div>
            </div>

           <div className="flex-1 overflow-y-auto scrollbar-hide p-8 w-full">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="glass-panel p-8 rounded-2xl bg-white border border-karm-sage shadow-sm space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase text-gray-500 font-bold">Candidate Role</label>
                                    <select 
                                        className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-karm-dark outline-none focus:border-karm-gold"
                                        value={config.role}
                                        onChange={(e) => setConfig({...config, role: e.target.value})}
                                    >
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase text-gray-500 font-bold">Experience Level</label>
                                    <select 
                                        className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-karm-dark outline-none focus:border-karm-gold"
                                        value={config.experience}
                                        onChange={(e) => setConfig({...config, experience: e.target.value})}
                                    >
                                        {EXP_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase text-gray-500 font-bold">Candidate Persona</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PERSONAS.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setConfig({...config, personality: p.id})}
                                            className={`p-3 rounded-xl border text-left transition-all ${config.personality === p.id ? 'bg-karm-dark text-white border-karm-dark shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className="font-bold text-sm mb-1">{p.id}</div>
                                            <div className={`text-[10px] leading-tight ${config.personality === p.id ? 'text-gray-300' : 'text-gray-500'}`}>{p.desc}</div>
                                        </button>
                                    ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase text-gray-500 font-bold">Voice Model</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {VOICE_MODELS.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setConfig({...config, voiceId: v.id})}
                                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${config.voiceId === v.id ? 'bg-karm-dark border-karm-dark text-white shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <span className="text-2xl">{v.flag}</span>
                                            <div className="text-left">
                                                <div className="font-bold text-sm">{v.label}</div>
                                                <div className={`text-[10px] ${config.voiceId === v.id ? 'text-gray-300' : 'text-gray-500'}`}>{v.gender} • {v.accent}</div>
                                            </div>
                                        </button>
                                    ))}
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                   <h3 className="font-bold text-karm-dark mb-2">Instructions</h3>
                                   <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                                      <li>You are the Interviewer. The AI is the Candidate.</li>
                                      <li>Configure the role and personality above.</li>
                                      <li>Use Voice or Text mode to conduct the interview.</li>
                                      <li>Evaluate the AI's responses using the built-in scorecard.</li>
                                   </ul>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end border-t border-gray-100">
                            <button 
                            onClick={() => setStep('INTERVIEW')}
                            className="px-8 py-3 bg-karm-dark text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 hover:bg-[#1F2130]"
                            >
                            Start Interview <Play className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    );
  }

  // INTERVIEW MODE
  return (
    <div className="h-full flex flex-col bg-karm-light">
       <div className="h-16 border-b border-karm-sage bg-white px-6 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setStep('SETUP')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <Settings className="w-5 h-5"/>
             </button>
             <div>
                <h2 className="font-bold text-karm-dark">Interviewing: {candidateProfile.name}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                   <span>{config.role}</span>
                   <span>•</span>
                   <span>{config.experience}</span>
                </div>
             </div>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
             <button onClick={() => setConfig({...config, mode: 'VOICE'})} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${config.mode === 'VOICE' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}>
                <Radio className="w-3 h-3"/> Voice
             </button>
             <button onClick={() => setConfig({...config, mode: 'TEXT'})} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${config.mode === 'TEXT' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}>
                <MessageSquare className="w-3 h-3"/> Text
             </button>
             <button onClick={() => setConfig({...config, mode: 'MIXED'})} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${config.mode === 'MIXED' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}>
                <Settings className="w-3 h-3"/> Hybrid
             </button>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANEL: Candidate Profile & Help */}
          <div className="hidden lg:flex flex-col w-80 border-r border-karm-sage bg-white overflow-y-auto">
             <div className="p-6 border-b border-gray-100">
                 <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                    {candidateProfile.name[0]}
                 </div>
                 <h3 className="text-center font-bold text-karm-dark text-lg">{candidateProfile.name}</h3>
                 <p className="text-center text-gray-500 text-sm mb-4">{candidateProfile.lastRole}</p>
                 <div className="flex flex-wrap justify-center gap-1">
                    {candidateProfile.skills.map(s => (
                       <span key={s} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600">{s}</span>
                    ))}
                 </div>
             </div>

             <div className="p-6 space-y-6">
                <div>
                   <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-2"><FileText className="w-3 h-3"/> Bio / Summary</h4>
                   <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {candidateProfile.summary}
                   </p>
                </div>

                <div>
                   <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-2"><Lightbulb className="w-3 h-3 text-yellow-500"/> Suggested Questions</h4>
                   <ul className="space-y-2">
                      {suggestions.map((q, i) => (
                         <li key={i} className="text-xs p-2 bg-yellow-50 text-yellow-800 rounded border border-yellow-100 cursor-pointer hover:bg-yellow-100" onClick={() => { setInputText(q); if(config.mode !== 'VOICE') {} }}>
                            {q}
                         </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>

          {/* MAIN PANEL: Interview Interaction */}
          <div className="flex-1 flex flex-col relative bg-gray-50/50">
             {config.mode === 'VOICE' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                   <div className="relative w-64 h-64 rounded-full bg-white border-4 border-karm-sage flex items-center justify-center shadow-inner overflow-hidden">
                      <div className={`absolute inset-0 bg-karm-gold/20 rounded-full blur-3xl transition-opacity duration-500 ${isLiveActive ? 'opacity-100' : 'opacity-0'}`}></div>
                      <UserCircle className="w-32 h-32 text-gray-300 relative z-10" />
                      
                      {isLiveActive && (
                         <div className="absolute inset-0 z-20 flex items-center justify-center">
                             <canvas ref={canvasRef} width={256} height={256} className="w-full h-full opacity-50" />
                         </div>
                      )}
                   </div>

                   <div className="text-center space-y-2">
                      <div className={`text-lg font-mono font-bold ${isLiveActive ? 'text-karm-gold animate-pulse' : 'text-gray-400'}`}>
                         {isLiveActive ? liveStatus : "Ready to Connect"}
                      </div>
                      <p className="text-sm text-gray-500 max-w-md">
                         Start the call to interview the AI candidate in real-time. Use the suggested questions on the left or create your own.
                      </p>
                   </div>

                   {!isLiveActive ? (
                      <button 
                        onClick={startLiveSession}
                        className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                      >
                         <Radio className="w-5 h-5"/> Initiate Call
                      </button>
                   ) : (
                      <button 
                        onClick={stopLiveSession}
                        className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                      >
                         <StopCircle className="w-5 h-5"/> End Interview
                      </button>
                   )}
                </div>
             ) : (
                <>
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {messages.map((msg, idx) => (
                         <div key={idx} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${msg.sender === 'user' ? 'bg-karm-dark text-white' : 'bg-karm-gold text-karm-dark'}`}>
                               {msg.sender === 'user' ? 'You' : 'AI'}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-white border border-gray-200 text-gray-800 rounded-tr-none shadow-sm' : 'bg-white border border-karm-gold/50 text-gray-800 rounded-tl-none shadow-sm'}`}>
                               {msg.text}
                            </div>
                         </div>
                      ))}
                      {loading && (
                         <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-karm-gold flex items-center justify-center text-xs font-bold text-karm-dark">AI</div>
                            <div className="bg-white border border-karm-gold/30 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                               <div className="w-2 h-2 bg-karm-gold rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-karm-gold rounded-full animate-bounce delay-100"></div>
                               <div className="w-2 h-2 bg-karm-gold rounded-full animate-bounce delay-200"></div>
                            </div>
                         </div>
                      )}
                      <div ref={messagesEndRef} />
                   </div>

                   {config.mode === 'MIXED' && (
                       <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
                          <button 
                             onClick={startListening}
                             className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 transition-all ${listening ? 'bg-red-500 border-red-200 text-white animate-pulse scale-110' : 'bg-karm-dark border-karm-gold text-white hover:scale-105'}`}
                          >
                             <Mic className="w-8 h-8"/>
                          </button>
                          <div className="text-center mt-2 text-xs font-bold text-gray-500 bg-white/80 px-2 py-1 rounded backdrop-blur">
                             {listening ? "Listening..." : "Tap to Speak"}
                          </div>
                       </div>
                   )}

                   <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex items-center gap-2 max-w-4xl mx-auto">
                         {config.mode === 'TEXT' && (
                             <button 
                               onClick={startListening}
                               className={`p-3 rounded-full transition-all ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                             >
                                <Mic className="w-5 h-5"/>
                             </button>
                         )}
                         <input 
                           type="text" 
                           value={inputText}
                           onChange={e => setInputText(e.target.value)}
                           onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                           placeholder={config.mode === 'MIXED' ? "Or type your question here..." : "Ask the candidate a question..."}
                           className="flex-1 bg-gray-100 border-0 rounded-full px-6 py-3 focus:ring-2 focus:ring-karm-gold outline-none"
                         />
                         <button 
                           onClick={() => handleSendMessage()}
                           disabled={!inputText.trim() || loading}
                           className="p-3 bg-karm-dark text-white rounded-full hover:bg-[#1F2130] transition-all disabled:opacity-50"
                         >
                            <Send className="w-5 h-5"/>
                         </button>
                      </div>
                   </div>
                </>
             )}
          </div>

          {/* RIGHT PANEL: Evaluation & Notes */}
          <div className="hidden lg:flex flex-col w-80 border-l border-karm-sage bg-white overflow-y-auto">
             <div className="p-6 border-b border-gray-100">
                 <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2"><ClipboardList className="w-3 h-3"/> Interviewer Notes</h4>
                 <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jot down strengths, weaknesses, or red flags..."
                    className="w-full h-48 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:border-yellow-400 resize-none font-mono"
                 />
             </div>

             <div className="p-6">
                 <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2"><Star className="w-3 h-3"/> Candidate Scoring</h4>
                 <div className="space-y-4">
                    {['Technical Skills', 'Communication', 'Culture Fit'].map((criteria, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-sm mb-1 text-gray-700">
                              <span>{criteria}</span>
                              <span className="font-bold">{(evaluation as any)[criteria.toLowerCase().split(' ')[0]]}/10</span>
                           </div>
                           <input 
                              type="range" min="0" max="10" 
                              value={(evaluation as any)[criteria.toLowerCase().split(' ')[0]]}
                              onChange={(e) => setEvaluation({...evaluation, [criteria.toLowerCase().split(' ')[0]]: parseInt(e.target.value)})}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-karm-dark"
                           />
                        </div>
                    ))}
                 </div>

                 <div className="mt-8 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => setShowScorecard(true)}
                      className="w-full py-3 bg-karm-dark text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1F2130] transition-all"
                    >
                       <CheckSquare className="w-4 h-4"/> Complete Evaluation
                    </button>
                 </div>
             </div>
          </div>
       </div>

       {showScorecard && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
             <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                 <h3 className="text-2xl font-bold text-karm-dark mb-2">Evaluation Summary</h3>
                 <p className="text-gray-500 mb-6">You have rated <strong>{candidateProfile.name}</strong>.</p>
                 
                 <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Technical</span>
                        <span className="font-bold text-karm-dark">{evaluation.technical}/10</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Communication</span>
                        <span className="font-bold text-karm-dark">{evaluation.communication}/10</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Culture Fit</span>
                        <span className="font-bold text-karm-dark">{evaluation.culture}/10</span>
                     </div>
                 </div>

                 <button 
                   onClick={() => { setShowScorecard(false); setStep('SETUP'); }}
                   className="w-full py-3 bg-karm-gold text-karm-dark rounded-xl font-bold hover:opacity-90 transition-all"
                 >
                    Submit & Finish
                 </button>
             </div>
          </div>
       )}
    </div>
  );
};

export default ReverseInterview;
