
import React from 'react';
import { Award, RefreshCw, Home, FileText, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { InterviewReport } from '../../types';

interface InterviewCompletionProps {
  report: InterviewReport;
  onRetake: () => void;
  onHome: () => void;
}

const InterviewCompletion: React.FC<InterviewCompletionProps> = ({ report, onRetake, onHome }) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-6 md:p-12 animate-fade-in bg-karm-light">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="text-center space-y-4">
           <div className="w-20 h-20 mx-auto bg-gradient-to-br from-karm-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-10 h-10 text-white" />
           </div>
           <h2 className="text-4xl font-bold text-karm-dark">Interview Analysis Complete</h2>
           <p className="text-karm-muted">Here is your comprehensive performance breakdown.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-karm-gold relative overflow-hidden flex flex-col items-center justify-center text-center bg-white shadow-sm">
              <div className="absolute inset-0 bg-karm-gold/5"></div>
              <h3 className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-4">Overall Score</h3>
              <div className="relative mb-4">
                 <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="rgba(0,0,0,0.05)" strokeWidth="10" fill="transparent" />
                    <circle 
                      cx="80" cy="80" r="70" 
                      stroke="#CBB57B" strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={440} 
                      strokeDashoffset={440 - (440 * report.overallScore) / 100} 
                      className="transition-all duration-1000 ease-out"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-karm-dark">
                    {report.overallScore}
                 </div>
              </div>
              <div className="text-karm-gold font-bold">{report.overallScore >= 80 ? "Excellent" : report.overallScore >= 60 ? "Good" : "Needs Practice"}</div>
           </div>

           <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-karm-sage flex flex-col justify-center space-y-6 bg-white shadow-sm">
              <h3 className="text-karm-dark font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-500"/> Key Metrics</h3>
              
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="text-gray-500">Confidence & Flow</span>
                       <span className="text-karm-dark font-bold">{report.metrics.confidence}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500" style={{ width: `${report.metrics.confidence}%` }}></div>
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="text-gray-500">Clarity of Speech</span>
                       <span className="text-karm-dark font-bold">{report.metrics.clarity}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: `${report.metrics.clarity}%` }}></div>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="text-gray-500">Technical Accuracy</span>
                       <span className="text-karm-dark font-bold">{report.metrics.technicalAccuracy}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500" style={{ width: `${report.metrics.technicalAccuracy}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="glass-panel p-8 rounded-3xl border border-karm-sage bg-white shadow-sm">
              <h3 className="text-lg font-bold text-karm-dark mb-4">AI Feedback</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                 {report.feedback}
              </p>
           </div>

           <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 bg-white shadow-sm">
                 <h4 className="text-green-600 font-bold text-sm uppercase mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Strengths
                 </h4>
                 <ul className="space-y-2">
                    {report.strengths.map((s, i) => (
                       <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span> {s}
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-yellow-500 bg-white shadow-sm">
                 <h4 className="text-yellow-600 font-bold text-sm uppercase mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                 </h4>
                 <ul className="space-y-2">
                    {report.improvements.map((s, i) => (
                       <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></span> {s}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        {report.transcript && (
           <div className="glass-panel p-8 rounded-3xl border border-karm-sage bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-karm-dark flex items-center gap-2"><FileText className="w-5 h-5 text-karm-gold"/> Transcript Highlights</h3>
                 <span className="text-xs text-gray-400">Duration: {report.duration}</span>
              </div>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {report.transcript.map((t, i) => (
                    <div key={i} className="flex gap-4">
                       <span className="text-xs font-mono text-gray-400 w-12 pt-1">{t.timestamp}</span>
                       <div className="flex-1">
                          <p className={`text-sm font-bold mb-1 ${t.speaker === 'You' ? 'text-purple-600' : 'text-karm-gold'}`}>{t.speaker}</p>
                          <p className="text-sm text-gray-700">{t.text}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 pt-4">
           <button 
             onClick={onRetake}
             className="flex-1 py-4 bg-white border border-karm-sage rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-karm-dark"
           >
              <RefreshCw className="w-5 h-5" /> Retake Session
           </button>
           <button 
             onClick={onHome}
             className="flex-1 py-4 bg-karm-gold text-karm-dark rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
           >
              <Home className="w-5 h-5" /> Return to Dashboard
           </button>
        </div>

      </div>
    </div>
  );
};

export default InterviewCompletion;
