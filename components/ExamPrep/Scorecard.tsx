
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, RotateCcw, Award } from 'lucide-react';
import { ExamQuestion } from '../../types';

interface ScorecardProps {
  questions: ExamQuestion[];
  timeSpent: number;
  onRetest: () => void;
  onExit: () => void;
}

const Scorecard: React.FC<ScorecardProps> = ({ questions, timeSpent, onRetest, onExit }) => {
  const correct = questions.filter(q => q.userAnswer === q.correctAnswer).length;
  const incorrect = questions.filter(q => q.userAnswer !== undefined && q.userAnswer !== q.correctAnswer).length;
  const skipped = questions.length - correct - incorrect;
  const score = Math.round((correct / questions.length) * 100);

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto scrollbar-hide animate-fade-in bg-karm-light">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-karm-dark">Assessment Complete</h2>
        <div className="flex items-center justify-center gap-2 text-karm-gold">
          <Award className="w-5 h-5" />
          <span className="font-mono">Performance Report Generated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-t-karm-gold relative overflow-hidden bg-white shadow-sm">
          <div className="absolute inset-0 bg-karm-gold/5"></div>
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-2">Total Score</span>
          <div className="text-6xl font-bold text-karm-dark mb-2">{score}%</div>
          <div className="text-sm text-karm-muted">
            {score > 80 ? 'Excellent' : score > 50 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-l-green-500 bg-white">
             <div>
               <div className="text-xs text-gray-400 uppercase">Correct</div>
               <div className="text-2xl font-bold text-karm-dark">{correct}</div>
             </div>
             <CheckCircle className="w-8 h-8 text-green-500/50" />
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-l-red-500 bg-white">
             <div>
               <div className="text-xs text-gray-400 uppercase">Incorrect</div>
               <div className="text-2xl font-bold text-karm-dark">{incorrect}</div>
             </div>
             <XCircle className="w-8 h-8 text-red-500/50" />
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-l-yellow-500 bg-white">
             <div>
               <div className="text-xs text-gray-400 uppercase">Skipped</div>
               <div className="text-2xl font-bold text-karm-dark">{skipped}</div>
             </div>
             <AlertTriangle className="w-8 h-8 text-yellow-500/50" />
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-l-blue-500 bg-white">
             <div>
               <div className="text-xs text-gray-400 uppercase">Time Spent</div>
               <div className="text-2xl font-bold text-karm-dark">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
             </div>
             <Clock className="w-8 h-8 text-blue-500/50" />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-karm-sage bg-white">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-karm-dark">
           <TrendingUp className="w-5 h-5 text-purple-500" /> AI Insights
        </h3>
        <div className="space-y-3">
           {score < 60 && (
             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                You seem to be struggling with <strong>Hard</strong> difficulty questions. We recommend revising Unit 1.
             </div>
           )}
           <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              Your average time per question is <strong>{Math.round(timeSpent / questions.length)}s</strong>. Try to improve speed on theory questions.
           </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onRetest}
          className="flex-1 py-4 bg-karm-gold text-karm-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <RotateCcw className="w-5 h-5" /> Smart Retest (Adaptive)
        </button>
        <button 
          onClick={onExit}
          className="flex-1 py-4 bg-white border border-karm-sage rounded-xl font-bold hover:bg-gray-50 transition-all text-karm-muted"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Scorecard;