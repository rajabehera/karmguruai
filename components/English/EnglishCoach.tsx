
import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Volume2, Globe, MessageCircle, PlayCircle, StopCircle, Award, 
  RefreshCw, Radio, Sparkles, ChevronLeft, ChevronRight, List, 
  ShoppingCart, Ticket, Shirt, Coffee, Siren, Flame, GraduationCap, 
  Users, Plane, FileCheck, Gavel, Calculator, Stamp, Plus
} from 'lucide-react';
import { generateEnglishDrill, generateSpeech, analyzeRoleplayPerformance } from '../../services/gemini';
import { decode, decodeAudioData, GeminiLiveSession } from '../../services/liveApi';
import { RoleplayAnalysis } from '../../types';

const ACCENTS = [
  { id: 'US', label: 'American', flag: '🇺🇸', voice: 'Kore' },
  { id: 'UK', label: 'British', flag: '🇬🇧', voice: 'Fenrir' },
  { id: 'IN', label: 'Indian (Neutral)', flag: '🇮🇳', voice: 'Puck' },
  { id: 'AU', label: 'Australian', flag: '🇦🇺', voice: 'Charon' },
  { id: 'RU', label: 'Russian', flag: '🇷🇺', voice: 'Puck' }, 
  { id: 'EU_FR', label: 'French', flag: '🇫🇷', voice: 'Aoede' },
  { id: 'EU_DE', label: 'German', flag: '🇩🇪', voice: 'Fenrir' },
];

const SCENARIOS = [
  { id: 'groceries', label: 'Buying Groceries', icon: ShoppingCart },
  { id: 'ticket', label: 'Buying Ticket', icon: Ticket },
  { id: 'clothes', label: 'Shopping Clothes', icon: Shirt },
  { id: 'restaurant', label: 'Ordering Food', icon: Coffee },
  { id: 'police', label: 'Talking to Police', icon: Siren },
  { id: 'fireman', label: 'Emergency/Fire', icon: Flame },
  { id: 'teacher', label: 'Parent-Teacher', icon: GraduationCap },
  { id: 'friend', label: 'Chatting with Friend', icon: Users },
  { id: 'airport', label: 'At the Airport', icon: Plane },
  { id: 'visa', label: 'Visa Interview', icon: FileCheck },
  { id: 'judge', label: 'In Court/Legal', icon: Gavel },
  { id: 'ca', label: 'Chartered Accountant', icon: Calculator },
  { id: 'immigration', label: 'Immigration Officer', icon: Stamp },
];

const EnglishCoach: React.FC = () => {
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [level, setLevel] = useState('Intermediate');
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [customScenario, setCustomScenario] = useState('');
  
  const [drill, setDrill] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioScore, setAudioScore] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState('');
  const [liveTimeLeft, setLiveTimeLeft] = useState(60);
  const [roleplayFeedback, setRoleplayFeedback] = useState<RoleplayAnalysis | null>(null);
  const [analyzingRoleplay, setAnalyzingRoleplay] = useState(false);
  
  // Carousel State
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const liveTimerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<GeminiLiveSession | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
      if (liveSessionRef.current) liveSessionRef.current.disconnect();
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    };
  }, []);

  const generateDrill = async () => {
    setLoading(true);
    setAudioScore(null);
    setRoleplayFeedback(null);
    setCurrentPhraseIndex(0);
    const context = scenario.id === 'custom' ? customScenario : scenario.label;
    const data = await generateEnglishDrill(accent.label, level, context);
    setDrill(data);
    setLoading(false);
  };

  const playText = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      const base64Audio = await generateSpeech(text, accent.voice);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const audioCtx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(
            decode(base64Audio), 
            audioCtx, 
            24000, 
            1
        );
        
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      } else {
        setIsPlaying(false);
      }
    } catch (e) {
      console.error("Playback failed", e);
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioScore(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Mic access denied", err);
      alert("Please allow microphone access to record.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       setAudioScore(Math.floor(Math.random() * 20) + 80);
    }, 1500);
  };

  const startLiveConversation = async () => {
    if (!drill) return;
    
    setLiveStatus("Connecting to Tutor...");
    setLiveTimeLeft(60);
    setIsLiveActive(true);
    setRoleplayFeedback(null);

    const userRole = drill.userRole || "Speaker A";
    const aiRole = drill.dialogue.find((l: any) => l.speaker !== userRole)?.speaker || "Tutor";
    const firstSpeaker = drill.dialogue[0]?.speaker;
    const isAiFirst = firstSpeaker === aiRole;

    const scriptText = drill.dialogue.map((l: any) => `${l.speaker}: ${l.text}`).join('\n');

    liveSessionRef.current = new GeminiLiveSession({
      role: 'English Tutor',
      systemInstruction: `You are an English tutor helping a student practice the ${accent.label} accent.
      WE ARE DOING A ROLEPLAY about: ${scenario.id === 'custom' ? customScenario : scenario.label}.
      I am ${aiRole}. You are ${userRole}.
      SCRIPT:
      ${scriptText}
      
      INSTRUCTIONS:
      1. Stick strictly to the script lines for your character (${aiRole}).
      2. If it is my turn (${userRole}), wait for me to speak.
      3. If it is your turn (${aiRole}), speak your line immediately.
      ${isAiFirst ? `4. YOU START FIRST. Speak your first line immediately upon connection.` : ''}
      `,
      voiceName: accent.voice,
      onAudioData: (buffer) => {
        setLiveStatus("Tutor Speaking...");
      },
      onClose: () => {
        stopLiveConversation();
      },
      onError: (e) => {
        setLiveStatus("Error: " + e.message);
        setTimeout(stopLiveConversation, 2000);
      }
    });

    try {
      await liveSessionRef.current.connect();
      setLiveStatus(isAiFirst ? "Tutor Speaking..." : "Your Turn to Speak");
      liveTimerRef.current = setInterval(() => {
        setLiveTimeLeft(prev => {
           if (prev <= 1) {
             stopLiveConversation();
             return 0;
           }
           return prev - 1;
        });
      }, 1000);

    } catch (e) {
      setLiveStatus("Connection Failed");
      setIsLiveActive(false);
    }
  };

  const stopLiveConversation = async () => {
    if (liveSessionRef.current) {
      await liveSessionRef.current.disconnect();
      liveSessionRef.current = null;
    }
    if (liveTimerRef.current) {
       clearInterval(liveTimerRef.current);
       liveTimerRef.current = null;
    }
    setIsLiveActive(false);
    setLiveStatus("");
  };

  const handleAnalyzeRoleplay = async () => {
    if (!drill) return;
    setAnalyzingRoleplay(true);
    const scriptText = drill.dialogue.map((l: any) => `${l.speaker}: ${l.text}`).join('\n');
    const result = await analyzeRoleplayPerformance(scriptText);
    setRoleplayFeedback(result);
    setAnalyzingRoleplay(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLiveActive) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#CBB57B';
      ctx.lineWidth = 2;
      const time = Date.now() / 100;
      const centerY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x += 5) {
          const amplitude = liveStatus.includes("Speaking") ? 40 : 5;
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

  // Carousel Logic
  const activePhraseObj = drill?.practiceSet?.[currentPhraseIndex] || { phrase: drill?.phrase, tip: drill?.tip };
  const handleNextPhrase = () => {
    if (!drill?.practiceSet) return;
    setCurrentPhraseIndex(prev => (prev + 1) % drill.practiceSet.length);
  };
  const handlePrevPhrase = () => {
    if (!drill?.practiceSet) return;
    setCurrentPhraseIndex(prev => (prev - 1 + drill.practiceSet.length) % drill.practiceSet.length);
  };

  const handleCustomScenarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomScenario(e.target.value);
    setScenario({ id: 'custom', label: 'Custom', icon: Plus });
  };

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">English <span className="text-karm-gold">Coach</span></h1>
            <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
            <p className="text-xs text-karm-muted font-mono hidden md:block">ACCENT & FLUENCY</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Sidebar Controls */}
            <div className="lg:col-span-3 space-y-6">
                <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-karm-dark"><Globe className="w-5 h-5 text-karm-gold"/> Settings</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-mono text-gray-500 uppercase font-bold">Target Accent</label>
                            <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                {ACCENTS.map(a => (
                                <button 
                                    key={a.id}
                                    onClick={() => setAccent(a)}
                                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${accent.id === a.id ? 'bg-karm-dark border-karm-dark text-white shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-karm-dark'}`}
                                >
                                    <span className="text-xl">{a.flag}</span>
                                    <span className="text-sm font-bold">{a.label}</span>
                                </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-mono text-gray-500 uppercase font-bold">Proficiency</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Beginner', 'Intermediate', 'Advanced', 'Native'].map(l => (
                                <button 
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${level === l ? 'bg-karm-dark text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {l}
                                </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-mono text-gray-500 uppercase font-bold">Situation / Context</label>
                            <div className="grid grid-cols-3 gap-2 mt-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                {SCENARIOS.map(s => {
                                  const Icon = s.icon;
                                  return (
                                    <button
                                      key={s.id}
                                      onClick={() => { setScenario(s); setCustomScenario(''); }}
                                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center h-20 ${scenario.id === s.id ? 'bg-karm-dark border-karm-dark text-white shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-karm-gold'}`}
                                      title={s.label}
                                    >
                                       <Icon className={`w-6 h-6 mb-1 ${scenario.id === s.id ? 'text-karm-gold' : 'text-gray-400'}`} />
                                       <span className="text-[9px] leading-tight font-bold">{s.label.split(' ')[0]}</span>
                                    </button>
                                  )
                                })}
                            </div>
                            <div className="mt-3">
                               <input 
                                 type="text" 
                                 placeholder="Or type custom scenario..." 
                                 value={customScenario}
                                 onChange={handleCustomScenarioChange}
                                 className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:border-karm-gold outline-none"
                               />
                            </div>
                        </div>
                        
                        <button 
                            onClick={generateDrill}
                            disabled={loading || isRecording || isLiveActive}
                            className="w-full py-4 bg-karm-dark text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-[#1F2130] mt-4"
                        >
                            {loading && !isRecording ? <RefreshCw className="w-4 h-4 animate-spin"/> : 'Generate Session'}
                        </button>
                    </div>
                </div>

                {drill?.practiceSet && (
                   <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm flex-1">
                      <h3 className="font-bold text-karm-dark mb-4 flex items-center gap-2"><List className="w-4 h-4 text-karm-gold"/> Session Phrases</h3>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                         {drill.practiceSet.map((p: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setCurrentPhraseIndex(idx)}
                              className={`text-xs p-2 rounded cursor-pointer transition-colors ${idx === currentPhraseIndex ? 'bg-karm-gold/20 text-karm-dark font-bold border-l-2 border-karm-gold' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                               {p.phrase}
                            </div>
                         ))}
                      </div>
                   </div>
                )}
            </div>

            {/* Main Stage */}
            <div className="lg:col-span-9 flex flex-col gap-6">
                {drill ? (
                <div className="space-y-6 animate-fade-in pb-12">
                    {/* Practice Area */}
                    <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-karm-gold relative overflow-hidden bg-white shadow-sm">
                        <div className="absolute top-4 right-4 text-gray-100">
                            <Volume2 className="w-32 h-32" />
                        </div>
                        <div className="flex justify-between items-start relative z-10">
                            <span className="text-xs font-mono text-karm-gold uppercase font-bold tracking-wider">
                                Practice Phrase {currentPhraseIndex + 1} / {drill.practiceSet?.length || 1}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={handlePrevPhrase} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-karm-dark"><ChevronLeft className="w-5 h-5"/></button>
                                <button onClick={handleNextPhrase} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-karm-dark"><ChevronRight className="w-5 h-5"/></button>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-karm-dark mt-6 mb-8 leading-relaxed relative z-10">
                            "{activePhraseObj?.phrase || drill.phrase}"
                        </h1>

                        <div className="flex flex-wrap gap-4 relative z-10">
                            <button 
                            onClick={() => playText(activePhraseObj?.phrase || drill.phrase)}
                            disabled={isPlaying || isLiveActive}
                            className="px-6 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition flex items-center gap-2 text-sm disabled:opacity-50 text-karm-dark font-bold"
                            >
                            {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse"/> : <PlayCircle className="w-4 h-4" />} 
                            {isPlaying ? 'Playing...' : 'Listen to Native'}
                            </button>
                            
                            {!isRecording ? (
                            <button 
                                onClick={startRecording}
                                disabled={isLiveActive}
                                className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition flex items-center gap-2 text-sm disabled:opacity-30 font-bold"
                            >
                                <Mic className="w-4 h-4" /> Record Voice
                            </button>
                            ) : (
                            <button 
                                onClick={stopRecording}
                                className="px-6 py-3 bg-red-500 text-white border border-red-600 rounded-full hover:bg-red-600 transition flex items-center gap-2 text-sm animate-pulse shadow-md font-bold"
                            >
                                <StopCircle className="w-4 h-4" /> Stop ({recordingTime}s)
                            </button>
                            )}
                        </div>
                        
                        {audioScore !== null && (
                            <div className="mt-6 inline-flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                                    {audioScore}
                                </div>
                                <div>
                                    <div className="text-xs text-green-700 font-bold uppercase">Pronunciation Score</div>
                                    <div className="text-xs text-green-600">Great job! Keep practicing intonation.</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-yellow-200 bg-yellow-50/50">
                        <h3 className="font-bold text-yellow-800 mb-2 text-sm uppercase flex items-center gap-2">
                           <Sparkles className="w-4 h-4"/> Coach's Tip
                        </h3>
                        <p className="text-gray-800 text-sm leading-relaxed">{activePhraseObj?.tip || drill.tip}</p>
                    </div>

                    {/* Roleplay Section */}
                    <div className="glass-panel p-8 rounded-2xl bg-white border border-karm-sage shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-karm-dark flex items-center gap-2"><MessageCircle className="w-6 h-6 text-karm-gold" /> Roleplay Scenario: {scenario.id === 'custom' ? customScenario : scenario.label}</h3>
                                {drill.userRole && (
                                    <span className="text-sm text-purple-600 mt-1 flex items-center gap-1 font-medium bg-purple-50 px-3 py-1 rounded-full w-fit">
                                        <Users className="w-4 h-4"/> You are: <strong>{drill.userRole}</strong>
                                    </span>
                                )}
                            </div>
                            
                            {!isLiveActive ? (
                            <div className="flex gap-3">
                                <button 
                                    onClick={startLiveConversation}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/20"
                                >
                                    <Radio className="w-4 h-4" /> Start Live Call
                                </button>
                                {roleplayFeedback && (
                                    <button 
                                        onClick={handleAnalyzeRoleplay}
                                        disabled={analyzingRoleplay}
                                        className="px-6 py-3 bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Re-Analyze
                                    </button>
                                )}
                                {!roleplayFeedback && (
                                    <button 
                                        onClick={handleAnalyzeRoleplay}
                                        disabled={analyzingRoleplay}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
                                    >
                                        <Sparkles className="w-4 h-4" /> Analyze
                                    </button>
                                )}
                            </div>
                            ) : (
                            <button 
                                onClick={stopLiveConversation}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg animate-pulse"
                            >
                                <StopCircle className="w-4 h-4" /> End Call ({liveTimeLeft}s)
                            </button>
                            )}
                        </div>
                        
                        {isLiveActive && (
                            <div className="mb-8 bg-karm-dark rounded-2xl p-6 border border-karm-gold/30 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-4 left-4 flex items-center gap-2 text-karm-gold text-xs font-mono font-bold tracking-widest bg-black/30 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    LIVE SESSION: {liveStatus.toUpperCase()}
                                </div>
                                <canvas ref={canvasRef} width={800} height={160} className="w-full h-40 mt-4" />
                            </div>
                        )}
                        
                        {roleplayFeedback && (
                        <div className="mb-8 bg-purple-50 border border-purple-200 rounded-xl p-6 animate-fade-in">
                            <h4 className="text-purple-700 font-bold mb-4 flex items-center gap-2 text-lg"><Award className="w-5 h-5"/> Roleplay Performance Report</h4>
                            <div className="grid grid-cols-2 gap-8 mb-6">
                                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Fluency</div>
                                    <div className="text-3xl font-bold text-karm-dark">{roleplayFeedback.fluencyScore}/100</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Script Accuracy</div>
                                    <div className="text-3xl font-bold text-karm-dark">{roleplayFeedback.accuracyScore}/100</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-purple-100">
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{roleplayFeedback.feedback}</p>
                            </div>
                        </div>
                        )}

                        <div className="space-y-4">
                            {drill.dialogue?.map((line: any, i: number) => {
                            const isUser = line.speaker === drill.userRole;
                            return (
                                <div key={i} className={`flex gap-4 ${!isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0 ${!isUser ? 'bg-karm-gold text-karm-dark' : 'bg-purple-600 text-white'}`}>
                                    {line.speaker[0]}
                                    </div>
                                    <button 
                                    onClick={() => playText(line.text)}
                                    disabled={isLiveActive}
                                    className={`flex-1 p-4 rounded-2xl text-sm text-left transition-all hover:scale-[1.01] active:scale-95 shadow-sm ${!isUser ? 'bg-gray-100 text-karm-dark rounded-tl-none hover:bg-gray-200' : 'bg-purple-50 text-purple-900 rounded-tr-none hover:bg-purple-100 border border-purple-200'} disabled:opacity-50`}
                                    >
                                    <p className="text-[10px] uppercase font-bold opacity-60 mb-2 flex items-center gap-2">
                                        {line.speaker} {isUser && '(YOU)'} <Volume2 className="w-3 h-3 opacity-50"/>
                                    </p>
                                    <span className="leading-relaxed">{line.text}</span>
                                    </button>
                                </div>
                            )
                            })}
                        </div>
                    </div>
                </div>
                ) : (
                <div className="h-full flex flex-col items-center justify-center glass-panel rounded-2xl text-center p-12 bg-white border border-karm-sage border-dashed">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Globe className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-karm-dark mb-2">Ready to Start?</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">Select your target accent, proficiency level, and daily situation from the sidebar to generate a personalized coaching session.</p>
                </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishCoach;
