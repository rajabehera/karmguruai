
import React, { useState } from 'react';
import { generateRoadmap } from '../services/gemini';
import { RoadmapStep } from '../types';
import { Briefcase, Map, Rocket, Star } from 'lucide-react';

const CareerRoadmap: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal || !status) return;
    setLoading(true);
    const steps = await generateRoadmap(goal, status);
    setRoadmap(steps);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Map className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Career <span className="text-karm-gold">Roadmap</span></h1>
            <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
            <p className="text-xs text-karm-muted font-mono hidden md:block">PATH GENERATOR</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-end border border-karm-sage bg-white shadow-sm">
             <div className="flex-1 space-y-2 w-full">
               <label className="text-xs font-mono text-karm-muted uppercase">Current Status</label>
               <input 
                 type="text" 
                 value={status} 
                 onChange={(e) => setStatus(e.target.value)}
                 placeholder="e.g. Grade 10 Student, Fresh Graduate"
                 className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-karm-gold outline-none text-karm-dark"
               />
             </div>
             <div className="flex-1 space-y-2 w-full">
               <label className="text-xs font-mono text-karm-muted uppercase">Dream Career</label>
               <input 
                 type="text" 
                 value={goal} 
                 onChange={(e) => setGoal(e.target.value)}
                 placeholder="e.g. Data Scientist, IAS Officer"
                 className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:border-karm-gold outline-none text-karm-dark"
               />
             </div>
             <button 
               onClick={handleGenerate} 
               disabled={loading}
               className="w-full md:w-auto px-8 py-3 bg-karm-dark text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-[#1F2130]"
             >
               {loading ? 'Processing...' : <><Rocket className="w-4 h-4" /> Generate Path</>}
             </button>
          </div>

          {roadmap.length > 0 && (
            <div className="relative space-y-8 pl-8 md:pl-0">
              {/* Central Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-karm-sage transform -translate-x-1/2 opacity-50"></div>

              {roadmap.map((step, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div key={index} className={`relative flex items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'} group`}>
                    {/* Node */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-white rounded-full border-4 border-karm-gold transform -translate-x-1/2 z-10 shadow-sm"></div>
                    
                    {/* Content Card */}
                    <div className={`w-full md:w-5/12 ml-10 md:ml-0 glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${isLeft ? 'md:mr-10 border-l-4 border-l-karm-gold' : 'md:ml-10 border-r-4 border-r-karm-dark'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-lg font-bold text-karm-dark">{step.title}</h3>
                         <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{step.duration}</span>
                      </div>
                      <p className="text-karm-muted text-sm mb-4">{step.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 flex items-center gap-1">
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
      </div>
    </div>
  );
};

export default CareerRoadmap;
