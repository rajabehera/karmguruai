
import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Activity, Volume2, Loader2 } from 'lucide-react';
import { GeminiLiveSession } from '../../services/liveApi';
import { generateInterviewFeedback } from '../../services/gemini';
import { InterviewConfig, InterviewReport } from '../../types';
import InterviewCompletion from './InterviewCompletion';

interface VoiceInterviewProps {
  config: InterviewConfig;
  onExit?: () => void;
}

const VoiceInterview: React.FC<VoiceInterviewProps> = ({ config, onExit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<string>("Ready to Start");
  const [isFinished, setIsFinished] = useState(false);
  const [report, setReport] = useState<InterviewReport | null>(null);
  
  const sessionRef = useRef<GeminiLiveSession | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const startSession = async () => {
    setStatus("Connecting to AI Core...");
    sessionRef.current = new GeminiLiveSession({
      role: config.subRole,
      config: config,
      onAudioData: (buffer) => {
        setStatus("Interviewer Speaking...");
      },
      onClose: () => {
        setIsRecording(false);
      },
      onError: (e) => {
        setIsRecording(false);
        setStatus("Error: " + e.message);
      }
    });

    await sessionRef.current.connect();
    setIsRecording(true);
    setStatus("Interview in Progress - Listening...");
  };

  const stopSession = async () => {
    if (sessionRef.current) {
      await sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    setIsRecording(false);
    setStatus("Analyzing Session Performance...");
    
    const reportData = await generateInterviewFeedback(config);
    setReport(reportData);
    setIsFinished(true);
  };

  const handleRetake = () => {
    setReport(null);
    setIsFinished(false);
    setStatus("Ready to Start");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isRecording) {
        ctx.beginPath();
        ctx.strokeStyle = '#A4B5B9'; // Karm Gold (Slate Blue)
        ctx.lineWidth = 2;
        
        const time = Date.now() / 100;
        const centerY = canvas.height / 2;
        
        for (let x = 0; x < canvas.width; x += 5) {
            const amplitude = status.includes("Speaking") ? 30 : 10;
            const y = centerY + Math.sin(x * 0.05 + time) * Math.cos(x * 0.01 + time * 2) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, status]);

  if (isFinished && report) {
    return <InterviewCompletion report={report} onRetake={handleRetake} onHome={onExit || (() => {})} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-8 animate-fade-in bg-karm-light">
      <div className="relative w-full max-w-2xl h-64 glass-panel rounded-3xl flex items-center justify-center overflow-hidden border border-karm-sage bg-white">
         <div className="absolute w-48 h-48 bg-karm-gold/20 rounded-full blur-3xl animate-pulse"></div>
         
         <canvas ref={canvasRef} width={600} height={256} className="w-full h-full relative z-10" />
         
         <div className="absolute top-4 left-6 flex items-center space-x-2 text-karm-dark">
           <Activity className="w-4 h-4 text-karm-gold" />
           <span className="text-sm font-mono tracking-widest uppercase">{status}</span>
         </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold font-sans text-karm-dark">AI Voice Interview</h2>
        <div className="flex justify-center gap-2 text-sm">
           <span className="px-2 py-0.5 bg-karm-gold/20 text-karm-dark rounded border border-karm-gold/30">{config.subRole}</span>
           <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded border border-gray-300">{config.company}</span>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        {!isRecording ? (
          <button 
            onClick={startSession}
            disabled={status.includes("Analyzing")}
            className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-karm-gold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.includes("Analyzing") ? <Loader2 className="w-8 h-8 text-karm-gold animate-spin" /> : <Mic className="w-8 h-8 text-karm-gold" />}
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border-2 border-red-500 shadow-lg hover:shadow-red-200 transition-all duration-300"
          >
             <Square className="w-8 h-8 text-red-500 fill-current" />
             <span className="absolute -bottom-10 text-xs text-red-500 font-mono font-bold">END SESSION</span>
          </button>
        )}
      </div>
      
      <div className="w-full max-w-md p-4 glass-panel rounded-xl text-xs text-karm-muted font-mono text-center bg-white border border-karm-sage">
        <p>AI will listen and respond in real-time. Speak clearly.</p>
        <p className="mt-1 flex items-center justify-center gap-2"><Volume2 className="w-3 h-3"/> System Volume: 100%</p>
      </div>
    </div>
  );
};

export default VoiceInterview;