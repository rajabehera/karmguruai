
import React, { useState } from 'react';
import { BookOpen, Award, Code, Globe, Shield, Activity, TrendingUp, ChevronRight, Play, ArrowLeft, Layers, GraduationCap, FileText, Zap, Clock, BarChart3, Lock, CheckCircle } from 'lucide-react';
import TestSession from './ExamPrep/TestSession';
import { generateMCQs } from '../services/gemini';
import { ExamQuestion, User } from '../types';

const exams = [
  { id: 'upsc', title: 'UPSC / IAS', icon: Globe, desc: 'Civil Services Examination', color: 'from-orange-100 to-red-100 text-orange-600', popular: true },
  { id: 'jee', title: 'JEE Mains/Adv', icon: Activity, desc: 'Engineering Entrance', color: 'from-cyan-100 to-blue-100 text-blue-600', popular: true },
  { id: 'neet', title: 'NEET', icon: Activity, desc: 'Medical Entrance', color: 'from-green-100 to-emerald-100 text-green-600' },
  { id: 'cat', title: 'CAT / MBA', icon: TrendingUp, desc: 'Management Entrance', color: 'from-purple-100 to-fuchsia-100 text-purple-600' },
  { id: 'gate', title: 'GATE', icon: BookOpen, desc: 'Graduate Aptitude Test', color: 'from-blue-100 to-indigo-100 text-indigo-600' },
  { id: 'coding', title: 'Coding Interview', icon: Code, desc: 'FAANG & Tech Giants', color: 'from-yellow-100 to-orange-100 text-orange-600', popular: true },
  { id: 'nda', title: 'NDA / Defence', icon: Shield, desc: 'National Defence Academy', color: 'from-emerald-100 to-teal-100 text-teal-600' },
  { id: 'banking', title: 'Banking / SSC', icon: Award, desc: 'Govt & Bank Jobs', color: 'from-pink-100 to-rose-100 text-rose-600' },
];

const SUBJECTS = [
  { id: '1', title: 'General Knowledge', units: 5, progress: 30 },
  { id: '2', title: 'Mathematics', units: 8, progress: 65 },
  { id: '3', title: 'Logical Reasoning', units: 4, progress: 10 },
  { id: '4', title: 'English Language', units: 6, progress: 0 }
];

const STUDY_MATERIALS = [
  { id: '1', title: 'Formula Cheat Sheet', type: 'PDF', size: '2.4 MB' },
  { id: '2', title: 'Last Year Question Paper', type: 'PDF', size: '5.1 MB' },
  { id: '3', title: 'Topper Notes: History', type: 'PDF', size: '12 MB' },
];

interface ExamPrepProps {
    user?: User;
}

const ExamPrep: React.FC<ExamPrepProps> = ({ user }) => {
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [view, setView] = useState<'GRID' | 'SUBJECTS' | 'TEST'>('GRID');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'MOCKS' | 'MATERIALS'>('MOCKS');
  
  const stats = user?.stats || { testsTaken: 0, avgTestScore: 0 };

  const handleExamClick = (exam: any) => {
    setSelectedExam(exam);
    setView('SUBJECTS');
  };

  const handleStartTest = async (subject: any) => {
    setSelectedSubject(subject);
    setLoading(true);
    
    // Generate Questions
    const mcqs = await generateMCQs(`${subject.title} for ${selectedExam.title}`, 10);
    const examQuestions: ExamQuestion[] = mcqs.map((q, i) => ({
       ...q,
       id: i.toString(),
       subject: subject.title,
       difficulty: i % 3 === 0 ? 'Hard' : i % 2 === 0 ? 'Medium' : 'Easy'
    }));
    
    setQuestions(examQuestions);
    setLoading(false);
    setView('TEST');
  };

  const handleStartDailyChallenge = async () => {
      setLoading(true);
      const mcqs = await generateMCQs("General Aptitude & Reasoning Mixed Bag", 5);
      const examQuestions: ExamQuestion[] = mcqs.map((q, i) => ({
        ...q,
        id: i.toString(),
        subject: "Daily Challenge",
        difficulty: 'Medium'
     }));
     setQuestions(examQuestions);
     setSelectedExam({ title: "Daily Challenge" });
     setSelectedSubject({ title: "Mixed Topics" });
     setLoading(false);
     setView('TEST');
  };

  if (view === 'TEST') {
    return (
      <TestSession 
        questions={questions} 
        onExit={() => setView('GRID')} 
        title={`${selectedExam.title} - ${selectedSubject.title}`}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-karm-light relative">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Exam <span className="text-karm-gold">Prep</span></h1>
            <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
            <p className="text-xs text-karm-muted font-mono hidden md:block">COMPETITIVE EXAMS</p>
         </div>
         {view === 'SUBJECTS' && (
            <button 
                onClick={() => setView('GRID')} 
                className="text-xs font-bold text-gray-500 hover:text-karm-dark flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
                <ArrowLeft className="w-4 h-4" /> Change Exam
            </button>
         )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8">
        {loading && (
            <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-karm-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-karm-dark font-mono animate-pulse font-bold">GENERATING TEST PAPERS...</p>
                <p className="text-xs text-gray-500">AI is curating questions based on latest patterns</p>
            </div>
        )}

        {view === 'SUBJECTS' ? (
            <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Exam Header */}
                <div className="glass-panel p-8 rounded-2xl border border-karm-sage bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${selectedExam.color.split(' ')[0]} ${selectedExam.color.split(' ')[1]}`}></div>
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedExam.color.replace('text-', 'text-opacity-0 ')} bg-opacity-10 flex items-center justify-center shadow-inner`}>
                            <selectedExam.icon className={`w-10 h-10 ${selectedExam.color.split(' ').pop()}`} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-karm-dark mb-1">{selectedExam.title}</h1>
                            <p className="text-karm-muted flex items-center gap-2 text-sm">
                                {selectedExam.desc}
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                <span className="text-green-600 font-bold text-xs flex items-center gap-1"><Zap className="w-3 h-3"/> High Yield</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                       <div className="text-center px-6 border-r border-gray-100">
                          <div className="text-2xl font-bold text-karm-dark">12</div>
                          <div className="text-xs text-gray-400 uppercase font-bold">Mock Tests</div>
                       </div>
                       <div className="text-center px-6">
                          <div className="text-2xl font-bold text-karm-dark">85%</div>
                          <div className="text-xs text-gray-400 uppercase font-bold">Avg Score</div>
                       </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-4 border-b border-gray-200 pb-1">
                    <button 
                        onClick={() => setActiveTab('MOCKS')}
                        className={`pb-3 px-2 text-sm font-bold transition-all relative ${activeTab === 'MOCKS' ? 'text-karm-dark' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Subject Mock Tests
                        {activeTab === 'MOCKS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-karm-dark rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('MATERIALS')}
                        className={`pb-3 px-2 text-sm font-bold transition-all relative ${activeTab === 'MATERIALS' ? 'text-karm-dark' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Study Materials
                        {activeTab === 'MATERIALS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-karm-dark rounded-t-full"></div>}
                    </button>
                </div>

                {activeTab === 'MOCKS' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {SUBJECTS.map((sub) => (
                            <div key={sub.id} className="glass-panel p-6 rounded-xl border border-karm-sage hover:border-karm-gold transition-all group bg-white shadow-sm flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-karm-dark group-hover:bg-karm-dark group-hover:text-white transition-colors">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    {sub.progress > 0 && (
                                        <div className="radial-progress text-xs font-bold text-karm-gold" style={{ "--value": sub.progress, "--size": "2rem" } as any}>
                                            {sub.progress}%
                                        </div>
                                    )}
                                </div>
                                
                                <h3 className="font-bold text-lg text-karm-dark mb-1">{sub.title}</h3>
                                <p className="text-xs text-gray-500 mb-6">{sub.units} Topics • 30 mins</p>
                                
                                <div className="mt-auto space-y-3">
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                        <div className="bg-karm-gold h-1.5 rounded-full" style={{ width: `${sub.progress}%` }}></div>
                                    </div>

                                    <button 
                                        onClick={() => handleStartTest(sub)}
                                        className="w-full py-3 bg-white border border-karm-sage rounded-lg font-bold hover:bg-karm-dark hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2 text-karm-dark shadow-sm"
                                    >
                                        <Play className="w-4 h-4 fill-current" /> Start Test
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {STUDY_MATERIALS.map(mat => (
                            <div key={mat.id} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-karm-dark text-sm">{mat.title}</h4>
                                    <p className="text-xs text-gray-500">{mat.type} • {mat.size}</p>
                                </div>
                                <button className="text-gray-400 hover:text-karm-dark">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <div className="p-4 bg-gray-50 border border-gray-200 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 text-center text-gray-400">
                            <Lock className="w-6 h-6" />
                            <span className="text-xs">Unlock Premium for More</span>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="w-full space-y-8">
                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3 glass-panel p-8 rounded-2xl bg-gradient-to-r from-karm-dark to-[#3a4537] text-white relative overflow-hidden shadow-xl">
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Daily Challenge</h2>
                                <p className="text-white/70 max-w-lg mb-6">Complete today's mixed-bag assessment to keep your streak alive and earn 50 XP.</p>
                                <div className="flex items-center gap-4">
                                    <button onClick={handleStartDailyChallenge} className="px-6 py-2 bg-white text-karm-dark rounded-lg font-bold hover:bg-karm-gold transition-colors flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-current" /> Start Challenge
                                    </button>
                                    <span className="text-sm font-mono text-karm-gold">Time: 15 mins</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage flex flex-col justify-center space-y-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
                             <span className="text-xs font-bold text-gray-400 uppercase">Your Progress</span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-karm-dark">{stats.testsTaken}</div>
                            <div className="text-xs text-gray-500">Tests Taken</div>
                        </div>
                        <div className="w-full h-px bg-gray-100"></div>
                        <div>
                            <div className="text-3xl font-bold text-karm-dark">{stats.avgTestScore}%</div>
                            <div className="text-xs text-gray-500">Avg. Accuracy</div>
                        </div>
                    </div>
                </div>

                {/* Exam Grid */}
                <div>
                    <h3 className="text-xl font-bold text-karm-dark mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-karm-gold" /> Select Exam Category
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {exams.map((exam) => (
                        <div 
                            key={exam.id}
                            onClick={() => handleExamClick(exam)}
                            className={`group relative glass-panel rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden bg-white border border-karm-sage hover:shadow-xl hover:border-karm-gold/30`}
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <exam.icon className={`w-24 h-24 ${exam.color.split(' ').pop()}`} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform shadow-sm">
                                        <exam.icon className={`w-6 h-6 ${exam.color.split(' ').pop()}`} />
                                    </div>
                                    {exam.popular && (
                                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full border border-orange-100 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> HOT
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-bold mb-1 text-karm-dark group-hover:text-karm-gold transition-colors">{exam.title}</h3>
                                <p className="text-sm text-gray-500 mb-6 line-clamp-2">{exam.desc}</p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-mono text-gray-400">50+ Tests</span>
                                    <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-karm-dark group-hover:text-white transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ExamPrep;
