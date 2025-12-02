
import React, { useState } from 'react';
import { Compass, Star, TrendingUp, Check, ArrowRight, User, Map, ArrowLeft, Rocket } from 'lucide-react';
import { generateCareerPaths, generateRoadmap } from '../../services/gemini';
import { CareerPathRecommendation, RoadmapStep } from '../../types';

const INTERESTS = [
  "Technology", "Design & Arts", "Medicine", "Business", "Public Service", 
  "Engineering", "Law", "Writing", "Teaching", "Sports",
  "Data Science", "Marketing", "Psychology", "Cybersecurity", "Finance",
  "Gaming", "Robotics", "Content Creation", "Social Work", 
  "Environment", "Space Science", "Music", "Culinary Arts", "Architecture"
];

const CareerGuidance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'COUNSELOR' | 'ARCHITECT'>('COUNSELOR');
  
  // Counselor State
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState("After 12th (Science)");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CareerPathRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [roadmapDetails, setRoadmapDetails] = useState<RoadmapStep[]>([]);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // Architect State
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState('');
  const [manualRoadmap, setManualRoadmap] = useState<RoadmapStep[]>([]);
  const [manualLoading, setManualLoading] = useState(false);

  // -- Counselor Logic --
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const aptitudeScore = Math.floor(Math.random() * 20) + 70;
    const paths = await generateCareerPaths(profile, selectedInterests, aptitudeScore);
    setResults(paths);
    setLoading(false);
    setStep(3);
  };

  const handleViewRoadmap = async (careerTitle: string) => {
    setSelectedCareer(careerTitle);
    setRoadmapLoading(true);
    setStep(4);
    const steps = await generateRoadmap(careerTitle, profile);
    setRoadmapDetails(steps);
    setRoadmapLoading(false);
  };

  // -- Architect Logic --
  const handleGenerateManual = async () => {
    if (!goal || !status) return;
    setManualLoading(true);
    const steps = await generateRoadmap(goal, status);
    setManualRoadmap(steps);
    setManualLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Career <span className="text-karm-gold">Architect</span></h1>
            <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
            <p className="text-xs text-karm-muted font-mono hidden md:block">GUIDANCE & ROADMAPS</p>
         </div>

         <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setActiveTab('COUNSELOR')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'COUNSELOR' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}
            >
              AI COUNSELOR
            </button>
            <button 
              onClick={() => setActiveTab('ARCHITECT')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'ARCHITECT' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}
            >
              PATH GENERATOR
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
        <div className="max-w-6xl mx-auto space-y-8">
            
            {/* --- TAB 1: AI COUNSELOR --- */}
            {activeTab === 'COUNSELOR' && (
              <>
                {step < 4 && (
                    <div className="flex justify-center gap-4 mb-8">
                        {[1, 2, 3].map(i => (
                        <div key={i} className={`w-3 h-3 rounded-full transition-all ${step >= i ? 'bg-karm-gold scale-125' : 'bg-gray-300'}`}></div>
                        ))}
                    </div>
                )}

                {step === 1 && (
                <div className="glass-panel p-8 rounded-2xl animate-fade-in border border-karm-sage bg-white shadow-sm max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-karm-dark"><User className="w-5 h-5 text-purple-500"/> Current Stage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["After 10th", "After 12th (Science)", "After 12th (Commerce)", "After 12th (Arts)", "Undergraduate", "Working Professional"].map(p => (
                        <button
                            key={p}
                            onClick={() => setProfile(p)}
                            className={`p-4 rounded-xl border text-left transition-all ${profile === p ? 'bg-karm-dark border-karm-dark text-white shadow-md' : 'bg-white border-karm-sage hover:bg-gray-50'}`}
                        >
                            {p}
                        </button>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={() => setStep(2)} className="px-8 py-3 bg-karm-dark text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 hover:bg-[#1F2130]">
                            Next Step <ArrowRight className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                )}

                {step === 2 && (
                <div className="glass-panel p-8 rounded-2xl animate-fade-in border border-karm-sage bg-white shadow-sm max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-karm-dark"><Star className="w-5 h-5 text-yellow-500"/> Select Your Interests</h3>
                    <div className="flex flex-wrap gap-3 mb-8">
                        {INTERESTS.map(interest => (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full border text-sm transition-all ${selectedInterests.includes(interest) ? 'bg-karm-dark border-karm-dark text-white shadow-md' : 'bg-white border-karm-sage hover:bg-gray-50'}`}
                        >
                            {interest} {selectedInterests.includes(interest) && <Check className="w-3 h-3 inline ml-1"/>}
                        </button>
                        ))}
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 mb-8">
                        <h4 className="font-bold text-purple-700 text-sm mb-2">AI Note</h4>
                        <p className="text-xs text-purple-600">Our system will combine these interests with a rapid aptitude assessment to suggest the best fit roles.</p>
                    </div>

                    <div className="flex justify-between">
                        <button onClick={() => setStep(1)} className="text-gray-500 hover:text-karm-dark px-4 py-2">Back</button>
                        <button 
                        onClick={handleAnalyze} 
                        disabled={selectedInterests.length === 0 || loading}
                        className="px-8 py-3 bg-karm-dark text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 hover:bg-[#1F2130]"
                        >
                            {loading ? <span className="animate-pulse">Analyzing Profile...</span> : 'Reveal Career Paths'}
                        </button>
                    </div>
                </div>
                )}

                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {results.map((path, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-2xl border border-karm-sage hover:border-karm-gold transition-all group relative overflow-hidden flex flex-col bg-white shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Compass className="w-24 h-24 text-karm-dark" />
                            </div>
                            
                            <div className="relative z-10 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-karm-dark leading-tight">{path.title}</h3>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-200">{path.matchScore}% Match</span>
                            </div>
                            
                            <p className="text-sm text-karm-muted mb-6 min-h-[60px]">{path.description}</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-mono text-purple-600 uppercase mb-2">Required Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {path.requiredSkills.slice(0, 3).map(s => (
                                        <span key={s} className="text-[10px] bg-gray-50 px-2 py-1 rounded border border-gray-200 text-gray-600">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-xs font-mono text-purple-600 uppercase mb-2">Immediate Steps</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        {path.steps.slice(0, 2).map((s, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-purple-500">•</span> {s}
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            </div>
                            
                            <button 
                                onClick={() => handleViewRoadmap(path.title)}
                                className="w-full mt-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-bold transition-all flex items-center justify-center gap-2 text-karm-dark"
                            >
                                View Full Roadmap <Map className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    
                    <div className="col-span-full flex justify-center mt-8">
                        <button onClick={() => setStep(1)} className="px-6 py-2 rounded-full border border-gray-300 text-gray-500 hover:text-karm-dark hover:border-karm-dark transition-all flex items-center gap-2">
                            <Rocket className="w-4 h-4"/> Start New Analysis
                        </button>
                    </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in space-y-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(3)} className="p-2 rounded-full hover:bg-gray-100 transition">
                                <ArrowLeft className="w-6 h-6 text-gray-500" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-karm-dark flex items-center gap-2">
                                    {selectedCareer} <span className="text-gray-400 text-lg font-normal">Roadmap</span>
                                </h2>
                                <p className="text-sm text-gray-500">Personalized path from "{profile}"</p>
                            </div>
                        </div>

                        {roadmapLoading ? (
                            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center space-y-4 bg-white border border-karm-sage">
                                <div className="w-12 h-12 border-4 border-karm-gold border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-karm-dark font-mono animate-pulse">GENERATING TRAJECTORY...</p>
                            </div>
                        ) : (
                            <div className="relative space-y-8 pl-4 md:pl-0">
                                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-karm-sage transform md:-translate-x-1/2 opacity-50"></div>

                                {roadmapDetails.map((stepItem, index) => {
                                const isLeft = index % 2 === 0;
                                return (
                                    <div key={index} className={`relative flex flex-col md:flex-row items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'} group`}>
                                        <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white rounded-full border-4 border-karm-gold transform -translate-x-1/2 z-10 shadow-sm mt-6 md:mt-0"></div>
                                        
                                        <div className={`w-full md:w-5/12 ml-12 md:ml-0 glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${isLeft ? 'md:mr-12 border-l-4 border-l-karm-gold' : 'md:ml-12 border-r-4 border-r-karm-dark'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-karm-dark">{stepItem.title}</h3>
                                                <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">{stepItem.duration}</span>
                                            </div>
                                            <p className="text-karm-muted text-sm mb-4 leading-relaxed">{stepItem.description}</p>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {stepItem.skills.map((skill, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600 flex items-center gap-1">
                                                        <Star className="w-2 h-2 text-karm-gold" /> {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                                })}
                            </div>
                        )}
                    </div>
                )}
              </>
            )}

            {/* --- TAB 2: PATH ARCHITECT --- */}
            {activeTab === 'ARCHITECT' && (
                <div className="animate-fade-in space-y-8">
                     <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-end border border-karm-sage bg-white shadow-sm max-w-4xl mx-auto">
                        <div className="flex-1 space-y-2 w-full">
                        <label className="text-xs font-mono text-karm-muted uppercase font-bold">Current Status</label>
                        <input 
                            type="text" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            placeholder="e.g. Grade 10 Student, Fresh Graduate"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-karm-gold outline-none text-karm-dark"
                        />
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                        <label className="text-xs font-mono text-karm-muted uppercase font-bold">Dream Career</label>
                        <input 
                            type="text" 
                            value={goal} 
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g. Data Scientist, IAS Officer"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-karm-gold outline-none text-karm-dark"
                        />
                        </div>
                        <button 
                        onClick={handleGenerateManual} 
                        disabled={manualLoading}
                        className="w-full md:w-auto px-8 py-3 bg-karm-dark text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-[#1F2130]"
                        >
                        {manualLoading ? 'Processing...' : <><Rocket className="w-4 h-4" /> Generate Path</>}
                        </button>
                    </div>

                    {manualRoadmap.length > 0 && (
                        <div className="relative space-y-8 pl-4 md:pl-0">
                            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-karm-sage transform md:-translate-x-1/2 opacity-50"></div>

                            {manualRoadmap.map((stepItem, index) => {
                                const isLeft = index % 2 === 0;
                                return (
                                <div key={index} className={`relative flex flex-col md:flex-row items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'} group`}>
                                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white rounded-full border-4 border-karm-gold transform -translate-x-1/2 z-10 shadow-sm mt-6 md:mt-0"></div>
                                    
                                    <div className={`w-full md:w-5/12 ml-12 md:ml-0 glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${isLeft ? 'md:mr-12 border-l-4 border-l-karm-gold' : 'md:ml-12 border-r-4 border-r-karm-dark'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-karm-dark">{stepItem.title}</h3>
                                            <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">{stepItem.duration}</span>
                                        </div>
                                        <p className="text-karm-muted text-sm mb-4 leading-relaxed">{stepItem.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {stepItem.skills.map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600 flex items-center gap-1">
                                                    <Star className="w-2 h-2 text-karm-gold" /> {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;
