
import React, { useState, useRef } from 'react';
import { 
  Play, Code, Terminal, Mic, Cpu, Settings, 
  Share2, Save, FileCode, CheckCircle, AlertTriangle, 
  Sparkles, Layers, Wand2, Plus, X, Zap,
  BookOpen
} from 'lucide-react';
import { runCodeSimulation, analyzeCodeAction } from '../../services/gemini';
import { GeminiLiveSession } from '../../services/liveApi';
import CodeEditor from './CodeEditor';
import WebPlayground from './WebPlayground';
import { LANGUAGES, PROBLEMS, LANGUAGE_TEMPLATES, Problem } from './constants';
import { CodeRunResult } from '../../types';

const CodeLab: React.FC = () => {
  const [mode, setMode] = useState<'ALGO' | 'WEB'>('ALGO');
  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState(LANGUAGE_TEMPLATES['Python']);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'OUTPUT' | 'ANALYSIS' | 'TASK' | 'TESTS'>('TASK');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Easy' | 'Medium' | 'Hard'>('ALL');
  const [problemList, setProblemList] = useState<Problem[]>(PROBLEMS);
  const [activeProblem, setActiveProblem] = useState<Problem>(PROBLEMS[0]);
  const [analysis, setAnalysis] = useState('');
  const [testResults, setTestResults] = useState<CodeRunResult['testResults']>([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({ title: '', desc: '', difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard' });

  const sessionRef = useRef<GeminiLiveSession | null>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang] || '// Code here');
  };

  const handleProblemSelect = (p: Problem) => {
    setActiveProblem(p);
    setCode(LANGUAGE_TEMPLATES[language] || '// Code here');
    setActiveTab('TASK');
    setTestResults([]);
    setOutput('');
  };

  const handleAddCustomProblem = () => {
    const newProblem: Problem = {
      id: `custom-${Date.now()}`,
      title: customForm.title || 'Untitled Problem',
      description: customForm.desc || 'No description provided.',
      difficulty: customForm.difficulty,
      tag: 'Custom',
      testCasesList: [
        { input: "Custom Test 1", expectedOutput: "Result 1" },
        { input: "Custom Test 2", expectedOutput: "Result 2" },
        { input: "Custom Test 3", expectedOutput: "Result 3" }
      ]
    };
    
    const updatedList = [newProblem, ...problemList];
    setProblemList(updatedList);
    setActiveProblem(newProblem);
    setShowCustomModal(false);
    setCustomForm({ title: '', desc: '', difficulty: 'Easy' });
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('TESTS');
    setOutput('Compiling via Quantum Core...');
    const tests = activeProblem.testCasesList || [
      { input: "Input A", expectedOutput: "Output A" },
      { input: "Input B", expectedOutput: "Output B" },
      { input: "Input C", expectedOutput: "Output C" }
    ];

    const result = await runCodeSimulation(code, language, activeProblem.description, tests);
    setOutput(result.output || result.error || "No Output");
    setAnalysis(result.analysis || "Analysis complete.");
    setTestResults(result.testResults || []);
    setIsRunning(false);
  };

  const handleAIAction = async (action: 'FIX' | 'OPTIMIZE' | 'EXPLAIN') => {
    setActiveTab('ANALYSIS');
    setAnalysis("AI Neural Net Processing...");
    const res = await analyzeCodeAction(code, action);
    setAnalysis(res);
  };

  const toggleVoice = async () => {
    if (voiceActive) {
      sessionRef.current?.disconnect();
      setVoiceActive(false);
    } else {
      setVoiceActive(true);
      sessionRef.current = new GeminiLiveSession({
        role: 'Coding Tutor',
        config: { 
           role: 'Coding Tutor', 
           subRole: 'Mentor', 
           company: 'Nexus Academy', 
           experience: 'Expert', 
           mode: 'VOICE' as any,
           techStack: [language],
           tools: ['VS Code'],
           category: 'Coding'
        },
        onAudioData: () => {}, 
        onClose: () => setVoiceActive(false),
        onError: () => setVoiceActive(false)
      });
      await sessionRef.current.connect();
    }
  };

  const filteredProblems = problemList.filter(p => difficultyFilter === 'ALL' || p.difficulty === difficultyFilter);

  return (
    <div className="h-full flex flex-col bg-karm-light text-karm-dark overflow-hidden relative">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Nexus <span className="text-karm-gold">Code Lab</span></h1>
            
            <div className="h-8 w-px bg-karm-sage mx-2"></div>

            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
               <button 
                 onClick={() => setMode('ALGO')}
                 className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'ALGO' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
               >
                 ALGORITHMS
               </button>
               <button 
                 onClick={() => setMode('WEB')}
                 className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'WEB' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
               >
                 WEB PLAYGROUND
               </button>
            </div>
         </div>

         <div className="flex items-center gap-3">
             <button 
               onClick={toggleVoice}
               className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${voiceActive ? 'bg-red-50 border-red-500 text-red-500 animate-pulse' : 'bg-white border-karm-sage text-gray-500 hover:text-karm-gold hover:border-karm-gold'}`}
             >
                <Mic className="w-5 h-5" />
             </button>
             <button className="w-10 h-10 rounded-full bg-white border border-karm-sage flex items-center justify-center text-gray-500 hover:text-karm-dark">
                <Settings className="w-5 h-5" />
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 relative">
        {mode === 'WEB' ? (
          <WebPlayground />
        ) : (
          <div className="grid grid-cols-12 gap-4 h-full">
            
            {/* Left Panel */}
            <div className="col-span-12 lg:col-span-3 glass-panel rounded-xl flex flex-col overflow-hidden border border-karm-sage bg-white">
                <div className="p-4 border-b border-karm-sage bg-gray-50">
                   <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-karm-dark flex items-center gap-2"><Layers className="w-4 h-4 text-purple-500"/> Problem Set</h3>
                      <button onClick={() => setShowCustomModal(true)} className="text-[10px] bg-karm-dark px-2 py-1 rounded text-white hover:bg-[#1F2130] flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Custom
                      </button>
                   </div>
                   
                   <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
                      {(['ALL', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                          <button
                            key={d}
                            onClick={() => setDifficultyFilter(d)}
                            className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${difficultyFilter === d ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            {d}
                          </button>
                      ))}
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                   {filteredProblems.map(p => (
                     <div 
                        key={p.id} 
                        onClick={() => handleProblemSelect(p)}
                        className={`p-3 rounded-lg cursor-pointer border group transition-all ${activeProblem.id === p.id ? 'bg-karm-dark text-white border-karm-dark shadow-md' : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
                     >
                        <div className="flex justify-between items-center mb-1">
                           <span className={`font-medium text-sm transition-colors truncate pr-2 ${activeProblem.id === p.id ? 'text-white' : 'text-gray-600 group-hover:text-karm-dark'}`}>{p.title}</span>
                           <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : p.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.difficulty}</span>
                        </div>
                        <div className="flex gap-2 text-[10px] font-mono">
                           <span className={`${activeProblem.id === p.id ? 'bg-white/20 text-gray-200' : 'bg-gray-100 text-gray-400'} px-1 rounded`}>{p.tag}</span>
                        </div>
                     </div>
                   ))}
                </div>
            </div>

            {/* Center Panel: Code Editor */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden border border-karm-sage relative group bg-white shadow-sm">
                    <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <FileCode className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-mono text-gray-500">{activeProblem.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <select 
                               value={language} 
                               onChange={handleLanguageChange}
                               className="bg-white text-xs text-karm-dark border border-gray-300 rounded px-2 py-1 outline-none focus:border-karm-gold"
                            >
                               {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                       <CodeEditor code={code} language={language} onChange={setCode} />
                    </div>

                    <div className="absolute bottom-6 right-6 z-20">
                       <button 
                         onClick={handleRun}
                         disabled={isRunning}
                         className="flex items-center gap-2 px-6 py-3 bg-karm-dark hover:bg-[#1F2130] text-white font-bold rounded-full shadow-lg transition-all hover:scale-105"
                       >
                         {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                         RUN TESTS
                       </button>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden border border-karm-sage bg-white">
                    <div className="flex items-center border-b border-gray-200 bg-gray-50">
                        <button 
                          onClick={() => setActiveTab('TASK')}
                          className={`flex-1 py-3 text-[10px] font-bold font-mono transition-colors ${activeTab === 'TASK' ? 'text-karm-dark border-b-2 border-green-500 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                           TASK
                        </button>
                        <button 
                          onClick={() => setActiveTab('TESTS')}
                          className={`flex-1 py-3 text-[10px] font-bold font-mono transition-colors ${activeTab === 'TESTS' ? 'text-karm-dark border-b-2 border-cyan-500 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                           TEST RESULTS
                        </button>
                        <button 
                           onClick={() => setActiveTab('ANALYSIS')}
                           className={`flex-1 py-3 text-[10px] font-bold font-mono transition-colors ${activeTab === 'ANALYSIS' ? 'text-karm-dark border-b-2 border-purple-500 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                           AI HINTS
                        </button>
                    </div>
                    
                    <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                        {activeTab === 'TASK' && (
                           <div className="space-y-4 animate-fade-in">
                              <h3 className="text-karm-dark font-bold text-lg flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-green-600"/> {activeProblem.title}
                              </h3>
                              <div className="flex gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${activeProblem.difficulty === 'Easy' ? 'border-green-200 bg-green-50 text-green-700' : activeProblem.difficulty === 'Medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                  {activeProblem.difficulty}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-500">
                                  {activeProblem.tag}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {activeProblem.description}
                              </p>
                           </div>
                        )}

                        {activeTab === 'TESTS' && (
                           <div className="space-y-3">
                             <div className="text-gray-400 text-xs mb-2">$ running 3 test cases...</div>
                             {testResults.length > 0 ? (
                                testResults.map((res, idx) => (
                                  <div key={idx} className={`p-3 rounded border text-xs ${res.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                      <div className="flex items-center gap-2 font-bold mb-1">
                                         {res.passed ? <CheckCircle className="w-3 h-3 text-green-600"/> : <AlertTriangle className="w-3 h-3 text-red-600"/>}
                                         <span className={res.passed ? 'text-green-700' : 'text-red-700'}>Test Case {idx + 1}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 mt-2">
                                         <div>
                                            <span className="text-[10px] text-gray-500 block">Input</span>
                                            <span className="text-gray-700 font-mono">{res.input}</span>
                                         </div>
                                         <div>
                                            <span className="text-[10px] text-gray-500 block">Expected</span>
                                            <span className="text-gray-700 font-mono">{res.expected}</span>
                                         </div>
                                         <div className="col-span-2">
                                            <span className="text-[10px] text-gray-500 block">Actual Output</span>
                                            <span className={`font-mono ${res.passed ? 'text-green-600' : 'text-red-600'}`}>{res.actual}</span>
                                         </div>
                                      </div>
                                  </div>
                                ))
                             ) : output ? (
                               <div className="text-gray-700 whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">{output}</div>
                             ) : (
                               <div className="text-gray-400 italic text-xs">Run code to see test results.</div>
                             )}
                           </div>
                        )}

                        {activeTab === 'ANALYSIS' && (
                           <div className="space-y-4">
                              {analysis ? (
                                <div className="text-purple-700 leading-relaxed text-xs bg-purple-50 p-3 rounded border border-purple-100">
                                   <Sparkles className="w-4 h-4 inline mr-2 text-purple-500" />
                                   {analysis}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-center mt-10">
                                   <Cpu className="w-8 h-8 mx-auto mb-2 opacity-30"/>
                                   Ask AI to analyze your code
                                </div>
                              )}
                           </div>
                        )}
                    </div>
                </div>

                <div className="h-auto glass-panel rounded-xl p-4 border border-karm-sage bg-white flex flex-col gap-3">
                   <h4 className="text-xs font-mono text-gray-500 uppercase">Quick Actions</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleAIAction('FIX')} className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-all group">
                         <AlertTriangle className="w-5 h-5 text-red-500 mb-1 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] text-red-600">Fix Bugs</span>
                      </button>
                      <button onClick={() => handleAIAction('OPTIMIZE')} className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all group">
                         <Zap className="w-5 h-5 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] text-blue-600">Optimize</span>
                      </button>
                      <button onClick={() => handleAIAction('EXPLAIN')} className="flex flex-col items-center justify-center p-3 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-all group">
                         <Wand2 className="w-5 h-5 text-yellow-600 mb-1 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] text-yellow-700">Explain</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all group">
                         <Share2 className="w-5 h-5 text-gray-500 mb-1 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] text-gray-600">Share</span>
                      </button>
                   </div>
                </div>
            </div>

          </div>
        )}
      </div>

      {showCustomModal && (
        <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
           <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-karm-dark">New Custom Problem</h3>
                 <button onClick={() => setShowCustomModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-karm-dark"/></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-gray-500 uppercase font-mono mb-1 block">Problem Title</label>
                    <input 
                      type="text" 
                      value={customForm.title} 
                      onChange={e => setCustomForm({...customForm, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-karm-dark focus:border-karm-gold outline-none" 
                      placeholder="e.g. Find Max Element"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 uppercase font-mono mb-1 block">Description</label>
                    <textarea 
                      value={customForm.desc} 
                      onChange={e => setCustomForm({...customForm, desc: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-karm-dark focus:border-karm-gold outline-none h-24 resize-none" 
                      placeholder="Describe the problem..."
                    />
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 uppercase font-mono mb-1 block">Difficulty</label>
                    <div className="flex gap-2">
                       {['Easy', 'Medium', 'Hard'].map(d => (
                          <button 
                            key={d}
                            onClick={() => setCustomForm({...customForm, difficulty: d as any})}
                            className={`flex-1 py-2 rounded text-xs font-bold border transition-all ${customForm.difficulty === d ? 'bg-karm-dark text-white border-karm-dark' : 'bg-gray-50 border-gray-200'}`}
                          >
                             {d}
                          </button>
                       ))}
                    </div>
                 </div>
                 <button 
                   onClick={handleAddCustomProblem}
                   className="w-full py-3 bg-karm-dark text-white rounded-lg font-bold mt-4 hover:shadow-lg transition-all"
                 >
                    Create & Solve
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CodeLab;
