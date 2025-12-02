
import React, { useState, useEffect } from 'react';
import { generateMCQs, evaluateDescriptiveAnswer, generateInterviewFeedback, generateDescriptiveQuestion } from '../../services/gemini';
import { MCQuestion, InterviewConfig, InterviewReport } from '../../types';
import { Timer, CheckCircle, AlertCircle, Send, ArrowRight, BookOpen } from 'lucide-react';
import InterviewCompletion from './InterviewCompletion';

interface TextInterviewProps {
  config: InterviewConfig;
  onExit?: () => void;
}

const TextInterview: React.FC<TextInterviewProps> = ({ config, onExit }) => {
  const [mcqs, setMcqs] = useState<MCQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [descQuestion, setDescQuestion] = useState("");
  const [descAnswer, setDescAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    if (config.mode === 'MCQ') {
      loadMCQs();
    } else {
      loadDescriptiveQuestion();
    }
  }, [config]);

  const loadMCQs = async () => {
    setLoading(true);
    // Include Category in the topic prompt
    const topic = `${config.category} questions for a ${config.subRole} at ${config.company}. Tech Stack: ${config.techStack.join(', ')}`;
    const questions = await generateMCQs(topic, 5, config.resumeContext);
    setMcqs(questions);
    setLoading(false);
  };

  const loadDescriptiveQuestion = async () => {
     if (config.resumeContext) {
        setLoading(true);
        const question = await generateDescriptiveQuestion(config);
        setDescQuestion(question);
        setLoading(false);
     } else {
        setDescQuestion(`Explain the core principles of ${config.subRole} at ${config.company} and how you utilize ${config.techStack[0] || 'modern tech'} in your workflow.`);
     }
  };

  useEffect(() => {
    if (config.mode === 'MCQ' && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
        handleNextQuestion();
    }
  }, [timeLeft, isFinished, config.mode]);

  const handleNextQuestion = async () => {
    const currentQ = mcqs[currentQIndex];
    let selectedText = "Skipped";
    
    if (selectedOption !== null) {
        selectedText = currentQ.options[selectedOption];
        if (selectedOption === currentQ.correctAnswer) {
            setScore(s => s + 1);
        }
    }
    
    const updatedAnswers = [...userAnswers, selectedText];
    setUserAnswers(updatedAnswers);
    
    if (currentQIndex < mcqs.length - 1) {
      setCurrentQIndex(p => p + 1);
      setSelectedOption(null);
      setTimeLeft(60);
    } else {
      await finishTest(updatedAnswers);
    }
  };

  const finishTest = async (finalAnswers: string[]) => {
      setLoading(true);
      const actualData = {
          questions: mcqs.map(q => q.question),
          userAnswers: finalAnswers
      };
      const reportData = await generateInterviewFeedback(config, actualData);
      reportData.overallScore = Math.round((score / mcqs.length) * 100);
      reportData.metrics.technicalAccuracy = reportData.overallScore;
      
      setReport(reportData);
      setIsFinished(true);
      setLoading(false);
  };

  const handleEvaluate = async () => {
    if (!descAnswer.trim()) return;
    setEvaluating(true);
    
    const actualData = {
        questions: [descQuestion],
        userAnswers: [descAnswer]
    };
    
    const reportData = await generateInterviewFeedback(config, actualData);
    setReport(reportData);
    setEvaluating(false);
    setIsFinished(true);
  };

  const handleRetake = () => {
    setIsFinished(false);
    setScore(0);
    setCurrentQIndex(0);
    setDescAnswer("");
    setUserAnswers([]);
    setReport(null);
    if (config.mode === 'MCQ') {
      loadMCQs();
    } else {
      loadDescriptiveQuestion();
    }
  };

  if (loading) return (
      <div className="flex flex-col h-full items-center justify-center space-y-4 bg-karm-light">
          <div className="w-12 h-12 border-4 border-karm-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="text-karm-dark animate-pulse tracking-widest font-mono uppercase">Analyzing Performance Data...</div>
      </div>
  );

  if (isFinished && report) {
    return <InterviewCompletion report={report} onRetake={handleRetake} onHome={onExit || (() => {})} />;
  }

  if (config.mode === 'MCQ') {
    const currentQ = mcqs[currentQIndex];
    if (!currentQ) return <div className="p-8 text-center text-karm-muted">No Questions Available</div>;

    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in bg-karm-light h-full">
        <div className="flex justify-between items-center text-sm font-mono text-karm-muted">
           <span>Question {currentQIndex + 1}/{mcqs.length}</span>
           <div className="flex items-center gap-2 px-3 py-1 rounded bg-white border border-karm-sage shadow-sm"><Timer className="w-4 h-4 text-karm-gold" /> {timeLeft}s</div>
        </div>

        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border border-karm-sage bg-white shadow-sm">
           <div className="absolute top-0 left-0 w-1 h-full bg-karm-gold"></div>
           <h3 className="text-xl font-semibold mb-6 leading-relaxed text-karm-dark">{currentQ.question}</h3>
           
           <div className="space-y-4">
             {currentQ.options.map((opt, idx) => (
               <button
                 key={idx}
                 onClick={() => setSelectedOption(idx)}
                 className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                   selectedOption === idx 
                   ? 'bg-karm-gold/10 border-karm-gold text-karm-dark' 
                   : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                 }`}
               >
                 <span className="inline-block w-8 font-mono text-gray-400 font-bold">{String.fromCharCode(65 + idx)}.</span>
                 {opt}
               </button>
             ))}
           </div>
        </div>

        <div className="flex justify-end">
           <button 
             onClick={handleNextQuestion}
             disabled={selectedOption === null}
             className="px-8 py-3 bg-karm-gold text-karm-dark rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all"
           >
             Next Question <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    );
  }

  // Descriptive Mode
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 h-full bg-karm-light">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-karm-gold relative bg-white shadow-sm">
          <div className="flex items-center gap-2 text-karm-gold font-mono text-xs uppercase mb-2">
             <BookOpen className="w-3 h-3" /> {config.category} Scenario {config.resumeContext && "(Personalized)"}
          </div>
          <h3 className="text-lg text-karm-dark leading-relaxed font-medium">{descQuestion}</h3>
          <button 
             onClick={() => loadDescriptiveQuestion()} 
             className="text-xs text-gray-400 mt-4 hover:text-karm-dark transition-colors underline"
           >
            Generate New Scenario
          </button>
        </div>

        <div className="relative group">
            <textarea
            value={descAnswer}
            onChange={(e) => setDescAnswer(e.target.value)}
            placeholder="Structure your answer using the STAR method..."
            className="relative w-full h-64 bg-white border border-karm-sage rounded-xl p-4 focus:border-karm-gold focus:ring-1 focus:ring-karm-gold outline-none resize-none font-sans text-karm-dark shadow-sm placeholder:text-gray-400"
            />
        </div>

        <button 
          onClick={handleEvaluate}
          disabled={evaluating || !descAnswer}
          className="w-full py-4 bg-karm-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:bg-black"
        >
          {evaluating ? <span className="animate-spin">⟳</span> : <Send className="w-4 h-4" />}
          Submit Answer for Analysis
        </button>
    </div>
  );
};

export default TextInterview;