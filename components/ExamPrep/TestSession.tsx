
import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Bookmark, Flag } from 'lucide-react';
import { ExamQuestion } from '../../types';
import Scorecard from './Scorecard';

interface TestSessionProps {
  questions: ExamQuestion[];
  onExit: () => void;
  title: string;
}

const TestSession: React.FC<TestSessionProps> = ({ questions: initialQuestions, onExit, title }) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isFinished, setIsFinished] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const finishTest = () => {
    setIsFinished(true);
  };

  const handleAnswer = (optionIndex: number) => {
    const updated = [...questions];
    updated[currentIndex].userAnswer = optionIndex;
    setQuestions(updated);
  };

  const toggleMark = () => {
    const updated = [...questions];
    updated[currentIndex].isMarked = !updated[currentIndex].isMarked;
    setQuestions(updated);
  };

  const handleRetest = () => {
     const resetQuestions = questions.map(q => ({...q, userAnswer: undefined, isMarked: false}));
     const shuffled = [...resetQuestions].sort(() => Math.random() - 0.5);
     setQuestions(shuffled);
     setIsFinished(false);
     setTimeLeft(1800);
     setTimeSpent(0);
     setCurrentIndex(0);
  };

  if (isFinished) {
    return <Scorecard questions={questions} timeSpent={timeSpent} onRetest={handleRetest} onExit={onExit} />;
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="h-full flex flex-col bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white shadow-sm">
         <div>
           <h3 className="font-bold text-karm-dark">{title}</h3>
           <div className="text-xs text-gray-500">Question {currentIndex + 1} of {questions.length}</div>
         </div>
         <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-gray-50 border-gray-200 text-karm-dark'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
           <div className="max-w-3xl mx-auto space-y-8">
              <div className="glass-panel p-8 rounded-2xl relative bg-white border border-karm-sage shadow-sm">
                 <div className="absolute top-0 left-0 w-1 h-full bg-karm-gold"></div>
                 <div className="flex justify-between items-start mb-6">
                    <span className="bg-gray-100 text-xs px-2 py-1 rounded font-mono text-gray-600">MCQ • {currentQ.difficulty}</span>
                    <button onClick={toggleMark} className={`${currentQ.isMarked ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}>
                       <Flag className="w-5 h-5 fill-current" />
                    </button>
                 </div>
                 <h2 className="text-xl font-medium leading-relaxed mb-8 text-karm-dark">{currentQ.question}</h2>

                 <div className="space-y-3">
                   {currentQ.options.map((opt, idx) => (
                     <button
                       key={idx}
                       onClick={() => handleAnswer(idx)}
                       className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group ${
                         currentQ.userAnswer === idx
                         ? 'bg-karm-gold/10 border-karm-gold text-karm-dark'
                         : 'bg-white border-karm-sage hover:bg-gray-50 text-gray-600'
                       }`}
                     >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${currentQ.userAnswer === idx ? 'border-karm-gold bg-karm-gold text-white' : 'border-gray-300 text-gray-400'}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="flex-1">{opt}</span>
                     </button>
                   ))}
                 </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                 <button 
                   onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
                   disabled={currentIndex === 0}
                   className="px-6 py-3 rounded-lg bg-white border border-karm-sage hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2 text-karm-dark"
                 >
                   <ChevronLeft className="w-4 h-4" /> Previous
                 </button>
                 
                 {currentIndex === questions.length - 1 ? (
                   <button 
                     onClick={finishTest}
                     className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg transition-all"
                   >
                     Submit Assessment
                   </button>
                 ) : (
                   <button 
                     onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
                     className="px-6 py-3 rounded-lg bg-karm-gold hover:bg-[#d8c38b] text-karm-dark font-bold shadow-lg transition-all flex items-center gap-2"
                   >
                     Next Question <ChevronRight className="w-4 h-4" />
                   </button>
                 )}
              </div>
           </div>
        </div>

        <div className="w-72 border-l border-karm-sage bg-white p-6 hidden lg:block overflow-y-auto">
           <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Question Map</h4>
           <div className="grid grid-cols-4 gap-2">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-lg text-xs font-bold border transition-all relative ${
                    i === currentIndex 
                    ? 'border-karm-gold text-karm-dark ring-2 ring-karm-gold ring-offset-2' 
                    : q.userAnswer !== undefined 
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : q.isMarked 
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                        : 'bg-white border-karm-sage text-gray-400 hover:bg-gray-50'
                  }`}
                >
                   {i + 1}
                   {q.isMarked && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-yellow-500"></div>}
                </button>
              ))}
           </div>
           
           <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div> Answered
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200"></div> Marked for Review
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded bg-white border border-gray-300"></div> Not Visited
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TestSession;