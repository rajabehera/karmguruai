
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Star, Sparkles, Building2, ExternalLink, Filter, DollarSign, Clock, Globe } from 'lucide-react';
import { User, Job } from '../types';
import { findJobs } from '../services/gemini';

interface JobSearchProps {
  user: User;
}

const JobSearch: React.FC<JobSearchProps> = ({ user }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('Any');
  const [jobType, setJobType] = useState('Any');
  const [salary, setSalary] = useState('Any');
  const [workMode, setWorkMode] = useState('Any');
  const [useAI, setUseAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const activeResume = user.resumes.find(r => r.isActive);

  const handleSearch = async () => {
    if (!activeResume && useAI) {
       alert("Please upload and select an active resume in your Profile to use AI Matching.");
       return;
    }

    setLoading(true);
    setJobs([]);

    if (useAI) {
       const preferences = `Role: ${query || 'Any'}; Location: ${location || 'Any'}; Experience: ${experience}; Type: ${jobType}; Salary: ${salary}; Mode: ${workMode}`;
       const results = await findJobs(activeResume!.textContent, preferences);
       setJobs(results);
    } else {
       setTimeout(() => {
          setJobs([
             { id: '1', title: query || 'Software Engineer', company: 'Tech Corp', location: location || 'Remote', type: jobType !== 'Any' ? jobType : 'Full-time', matchScore: 0, matchReason: '', skills: ['React', 'Node'] },
             { id: '2', title: 'Senior ' + (query || 'Developer'), company: 'Innovate Ltd', location: location || 'New York', type: 'Contract', matchScore: 0, matchReason: '', skills: ['AWS', 'Python'] }
          ]);
       }, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Job <span className="text-karm-gold">Match</span></h1>
            <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
            <p className="text-xs text-karm-muted font-mono hidden md:block">AI-POWERED SEARCH</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
        <div className="w-full space-y-8">
           <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
              {/* Primary Search Row */}
              <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                 <div className="flex-1 w-full relative">
                    <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Job Title, Keywords, or Company"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-karm-dark focus:outline-none focus:border-karm-gold"
                    />
                 </div>
                 <div className="flex-1 w-full relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Location (e.g. Remote, Bangalore)"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-karm-dark focus:outline-none focus:border-karm-gold"
                    />
                 </div>
                 <button 
                   onClick={handleSearch}
                   disabled={loading}
                   className="w-full md:w-auto px-8 py-3 bg-karm-dark text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#1F2130] transition-all flex items-center justify-center gap-2"
                 >
                    {loading ? <span className="animate-spin">⟳</span> : <Search className="w-5 h-5" />} Search
                 </button>
              </div>

              {/* Advanced Filters Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                  <div className="space-y-1">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Star className="w-3 h-3" /> Experience</label>
                      <select 
                        value={experience} 
                        onChange={e => setExperience(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-karm-dark focus:border-karm-gold outline-none"
                      >
                          <option value="Any">Any Experience</option>
                          <option value="Internship">Internship</option>
                          <option value="Entry Level">Entry Level (0-2y)</option>
                          <option value="Mid Level">Mid Level (3-5y)</option>
                          <option value="Senior Level">Senior Level (5y+)</option>
                          <option value="Executive">Executive</option>
                      </select>
                  </div>

                  <div className="space-y-1">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Clock className="w-3 h-3" /> Job Type</label>
                      <select 
                        value={jobType} 
                        onChange={e => setJobType(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-karm-dark focus:border-karm-gold outline-none"
                      >
                          <option value="Any">Any Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Freelance">Freelance</option>
                      </select>
                  </div>

                  <div className="space-y-1">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><DollarSign className="w-3 h-3" /> Salary Range</label>
                      <select 
                        value={salary} 
                        onChange={e => setSalary(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-karm-dark focus:border-karm-gold outline-none"
                      >
                          <option value="Any">Any Salary</option>
                          <option value="$50k+">$50k+</option>
                          <option value="$100k+">$100k+</option>
                          <option value="$150k+">$150k+</option>
                          <option value="$200k+">$200k+</option>
                      </select>
                  </div>

                  <div className="space-y-1">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Globe className="w-3 h-3" /> Work Mode</label>
                      <select 
                        value={workMode} 
                        onChange={e => setWorkMode(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-karm-dark focus:border-karm-gold outline-none"
                      >
                          <option value="Any">Any Mode</option>
                          <option value="Remote">Remote Only</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site</option>
                      </select>
                  </div>
              </div>
           </div>

           <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-center gap-3">
                 <Sparkles className={`w-5 h-5 ${useAI ? 'text-purple-600' : 'text-gray-400'}`} />
                 <span className="text-sm text-gray-600">
                    {useAI ? "AI Matching Active: Using your active resume + filters for precise targeting." : "Standard keyword search."}
                 </span>
              </div>
              <button 
                onClick={() => setUseAI(!useAI)}
                className={`w-12 h-6 rounded-full transition-colors relative ${useAI ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${useAI ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>

           {!activeResume && useAI && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 text-sm">
                 ⚠️ No active resume found. Please go to Profile and upload a resume to use AI matching.
              </div>
           )}

           <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                 <div key={job.id} className="glass-panel p-6 rounded-xl border border-karm-sage hover:border-karm-gold transition-all group flex flex-col md:flex-row gap-6 bg-white shadow-sm">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500 uppercase shrink-0">
                       {job.company[0]}
                    </div>
                    
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h3 className="text-xl font-bold text-karm-dark group-hover:text-karm-gold transition-colors">{job.title}</h3>
                             <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Building2 className="w-4 h-4" /> {job.company} 
                                <span className="text-gray-300">|</span> 
                                <MapPin className="w-4 h-4" /> {job.location} 
                                <span className="text-gray-300">|</span> 
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold">{job.type}</span>
                             </div>
                          </div>
                          {useAI && (
                             <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 font-bold text-sm">
                                   <Star className="w-4 h-4 fill-current" /> {job.matchScore}% Match
                                </div>
                             </div>
                          )}
                       </div>
                       
                       {useAI && job.matchReason && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic border-l-2 border-purple-400">
                             "{job.matchReason}"
                          </div>
                       )}

                       <div className="flex flex-wrap gap-2 mt-4">
                          {job.skills.map(s => (
                             <span key={s} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600">{s}</span>
                          ))}
                       </div>
                    </div>

                    <div className="flex flex-col justify-center">
                       <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-karm-dark transition-all flex items-center gap-2 whitespace-nowrap">
                          Apply Now <ExternalLink className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              ))}
              
              {jobs.length === 0 && !loading && (
                 <div className="text-center py-24 bg-white border border-dashed border-gray-300 rounded-2xl">
                    <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-400">No Jobs Found</h3>
                    <p className="text-gray-400">Adjust filters or search to see AI recommendations.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
