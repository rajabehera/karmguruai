
import React, { useState, useEffect } from 'react';
import { User, View } from '../types';
import { 
  Zap, TrendingUp, ArrowRight, Activity, 
  Briefcase, Code, Mic2, FileText, CheckCircle, 
  Award, Clock, Sparkles, Crown
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const stats = user.stats || {
      streak: 0,
      totalXp: 0,
      skills: { technical: 0, communication: 0, problemSolving: 0 },
      recentActivity: []
  };

  // Level Calculation: 1000 XP per level
  const level = Math.floor(stats.totalXp / 1000) + 1;
  const xpProgress = (stats.totalXp % 1000) / 10; // Percentage (0-100)

  // Dynamic Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  const greeting = getGreeting();

  // Profile Strength Logic
  const calculateProfileStrength = () => {
    let score = 0;
    if (user.onboarded) score += 20; 
    if (user.resumes && user.resumes.length > 0) score += 40; 
    if (user.avatar) score += 20;
    if (user.coverImage) score += 20; 
    return score;
  };
  const profileStrength = calculateProfileStrength();

  // Check Personalization Cookie (Reactive)
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);

  useEffect(() => {
    const checkCookies = () => {
        try {
            const stored = localStorage.getItem('karmguru_cookie_consent');
            if (stored) {
                setPersonalizationEnabled(JSON.parse(stored).personalization);
            }
        } catch { setPersonalizationEnabled(false); }
    };
    
    checkCookies();
    window.addEventListener('cookie_consent_updated', checkCookies);
    return () => window.removeEventListener('cookie_consent_updated', checkCookies);
  }, []);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide bg-karm-light p-6 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-karm-muted font-mono text-sm uppercase tracking-widest mb-1">{currentDate}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-karm-dark">
            {greeting}, <span className="text-karm-gold">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Your daily focus: <span className="font-bold text-karm-dark">Algorithm Efficiency</span> & <span className="font-bold text-karm-dark">Behavioral Answers</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Streak Widget */}
           <div className="bg-white px-4 py-2 rounded-xl border border-karm-sage shadow-sm flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                 <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                 <div className="text-xs text-gray-400 font-bold uppercase">Daily Streak</div>
                 <div className="text-lg font-bold text-karm-dark">{stats.streak} Days</div>
              </div>
           </div>

           {/* Dynamic Level & XP Widget */}
           <div className="bg-white px-4 py-2 rounded-xl border border-karm-sage shadow-sm flex items-center gap-3 min-w-[200px]">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
                 <Crown className="w-5 h-5 fill-current" />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-400 font-bold uppercase">Level {level}</div>
                    <div className="text-[10px] text-karm-gold font-bold">{Math.floor(xpProgress)}%</div>
                 </div>
                 <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-karm-gold h-full rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Upgrade Feature: Smart Personalization Widget (Uses Cookies) */}
      {personalizationEnabled && (
        <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden animate-fade-in">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Smart Recommendations Active</h3>
                        <p className="text-sm text-purple-100">Based on your browsing, we've curated a list of Top 10 React Interview questions for you.</p>
                    </div>
                </div>
                <button onClick={() => onNavigate(View.MOCK_INTERVIEW)} className="px-6 py-2 bg-white text-purple-700 font-bold rounded-lg shadow-sm hover:bg-purple-50 transition-colors">
                    Start Custom Session
                </button>
            </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Plan Status */}
         <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-karm-dark bg-white shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-karm-dark/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:bg-karm-dark/10 transition-all"></div>
            <div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Plan</div>
               <div className="text-2xl font-bold text-karm-dark">{user.plan}</div>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className="bg-karm-dark h-full rounded-full" style={{ width: user.plan === 'FREE' ? '30%' : '100%' }}></div>
            </div>
         </div>

         {/* Interview Credits */}
         <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-karm-gold bg-white shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-karm-gold/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:bg-karm-gold/20 transition-all"></div>
            <div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Interview Credits</div>
               <div className="text-2xl font-bold text-karm-dark">
                  {user.credits.interviews === -1 ? 'Unlimited' : user.credits.interviews}
                  <span className="text-xs text-gray-400 font-normal ml-1">remaining</span>
               </div>
            </div>
            {user.plan === 'FREE' && (
               <button onClick={() => onNavigate(View.PRICING)} className="text-xs text-karm-gold font-bold flex items-center gap-1 hover:underline">
                  Upgrade for more <ArrowRight className="w-3 h-3"/>
               </button>
            )}
         </div>

         {/* Profile Completion */}
         <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-green-500 bg-white shadow-sm flex flex-col justify-between h-32">
            <div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Profile Strength</div>
               <div className="text-2xl font-bold text-karm-dark">{profileStrength}%</div>
            </div>
            {profileStrength === 100 ? (
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                   <CheckCircle className="w-3 h-3" /> Profile Complete
                </div>
            ) : (
                <button onClick={() => onNavigate(View.PROFILE)} className="text-xs text-green-600 font-medium hover:underline">
                   {user.resumes.length === 0 ? '+ Upload Resume' : !user.avatar ? '+ Add Photo' : !user.coverImage ? '+ Add Cover' : 'Finish Profile'}
                </button>
            )}
         </div>

         {/* Next Goal */}
         <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-blue-500 bg-white shadow-sm flex flex-col justify-between h-32">
            <div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Next Goal</div>
               <div className="text-lg font-bold text-karm-dark leading-tight">Complete Mock #{stats.interviewsCompleted + 1}</div>
            </div>
            <div className="text-xs text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => onNavigate(View.MOCK_INTERVIEW)}>
               Start Now
            </div>
         </div>
      </div>

      {/* Main Content Grid (Quick Actions, Activity, Skills) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
         
         <div className="lg:col-span-2 space-y-8">
            <div>
               <h3 className="text-lg font-bold text-karm-dark mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-karm-gold" /> Quick Actions
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => onNavigate(View.MOCK_INTERVIEW)} className="group glass-panel p-6 rounded-2xl bg-white border border-karm-sage hover:border-karm-gold transition-all duration-300 ease-out cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300"><Mic2 className="w-24 h-24 text-karm-dark" /></div>
                     <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-karm-dark group-hover:text-white transition-colors duration-300"><Mic2 className="w-6 h-6 text-karm-dark group-hover:text-white" /></div>
                     <h4 className="text-lg font-bold text-karm-dark mb-1">Mock Interview</h4>
                     <p className="text-xs text-gray-500 mb-4">Practice voice or text interviews with AI.</p>
                     <span className="text-xs font-bold text-karm-gold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">Start Session <ArrowRight className="w-3 h-3" /></span>
                  </div>
                  <div onClick={() => onNavigate(View.JOB_SEARCH)} className="group glass-panel p-6 rounded-2xl bg-white border border-karm-sage hover:border-karm-gold transition-all duration-300 ease-out cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300"><Briefcase className="w-24 h-24 text-karm-dark" /></div>
                     <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-karm-dark group-hover:text-white transition-colors duration-300"><Briefcase className="w-6 h-6 text-karm-dark group-hover:text-white" /></div>
                     <h4 className="text-lg font-bold text-karm-dark mb-1">Job Match</h4>
                     <p className="text-xs text-gray-500 mb-4">Find roles tailored to your resume.</p>
                     <span className="text-xs font-bold text-karm-gold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">Search Jobs <ArrowRight className="w-3 h-3" /></span>
                  </div>
               </div>
            </div>

            <div className="glass-panel rounded-2xl bg-white border border-karm-sage shadow-sm">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-karm-dark flex items-center gap-2"><Clock className="w-5 h-5 text-karm-gold" /> Recent Activity</h3>
                  <button className="text-xs text-gray-400 hover:text-karm-dark">View All</button>
               </div>
               <div className="p-2">
                  {stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((item, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'INTERVIEW' ? 'bg-blue-50 text-blue-600' : item.type === 'CODE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                               {item.type === 'INTERVIEW' ? <Mic2 className="w-5 h-5" /> : item.type === 'CODE' ? <Code className="w-5 h-5" /> : <Award className="w-5 h-5"/>}
                            </div>
                            <div className="flex-1">
                               <h4 className="text-sm font-bold text-karm-dark">{item.title}</h4>
                               <p className="text-xs text-gray-400">{item.desc} • {item.date}</p>
                            </div>
                            {item.score && <span className="text-xs font-bold text-karm-dark bg-white border border-gray-200 px-3 py-1 rounded-full">{item.score}</span>}
                         </div>
                      ))
                  ) : (
                      <div className="p-8 text-center text-gray-400 text-sm">No recent activity. Start your journey!</div>
                  )}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="glass-panel p-6 rounded-2xl bg-karm-dark text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-karm-gold/20 rounded-full blur-3xl"></div>
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10"><TrendingUp className="w-5 h-5 text-karm-gold" /> Skill Profile</h3>
               <div className="space-y-5 relative z-10">
                  {[
                     { label: "Technical", val: stats.skills.technical, color: "bg-blue-500" },
                     { label: "Communication", val: stats.skills.communication, color: "bg-purple-500" },
                     { label: "Problem Solving", val: stats.skills.problemSolving, color: "bg-green-500" },
                  ].map((skill, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-xs font-bold mb-1.5 opacity-90"><span>{skill.label}</span><span>{skill.val}%</span></div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden"><div className={`h-full rounded-full ${skill.color}`} style={{ width: `${skill.val}%` }}></div></div>
                     </div>
                  ))}
               </div>
               <button onClick={() => onNavigate(View.EXAM_PREP)} className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all">View Detailed Analysis</button>
            </div>

            <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
               <h3 className="font-bold text-karm-dark mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-karm-gold" /> Achievements</h3>
               <div className="grid grid-cols-4 gap-2">
                  {[1,2,3,4,5,6,7,8].map((_, i) => (
                     <div key={i} className={`aspect-square rounded-lg border flex items-center justify-center ${i < Math.floor(stats.totalXp / 100) ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}><Award className="w-5 h-5" /></div>
                  ))}
               </div>
               <p className="text-xs text-center text-gray-400 mt-4">{Math.floor(stats.totalXp / 100)} Badges Unlocked</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
