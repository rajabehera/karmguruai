
import React, { useState, useEffect } from 'react';
import { User, LeaderboardEntry, Badge, Quest, View } from '../types';
import { api } from '../services/api';
import { 
  Trophy, Globe, MapPin, Calendar, TrendingUp, TrendingDown, Minus, 
  Lock, CheckCircle, Flame, Star, Shield, Award, Zap, Crown, Target, ArrowRight, Hexagon
} from 'lucide-react';

interface LeaderboardProps {
  user: User;
  onNavigate: (view: View) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ user, onNavigate }) => {
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [scope, setScope] = useState<'GLOBAL' | 'COUNTRY'>('GLOBAL');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);

  // Level Logic (Dynamic based on user.stats)
  const totalXp = user.stats.totalXp;
  const currentLevel = Math.floor(totalXp / 1000) + 1;
  const nextLevelXp = currentLevel * 1000;
  const progressPercent = (totalXp % 1000) / 10;

  useEffect(() => {
    fetchData();
  }, [period, scope, user.stats]);

  const fetchData = async () => {
    setLoading(true);
    const lb = await api.leaderboard.getLeaderboard(period, scope, user.country || 'IN');
    const bd = await api.leaderboard.getBadges(user);
    const qs = await api.leaderboard.getDailyQuests();
    
    setLeaderboardData(lb);
    setBadges(bd);
    setQuests(qs);
    setLoading(false);
  };

  const TopThree = leaderboardData.slice(0, 3);
  const RestList = leaderboardData.slice(3);

  const getBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50', ring: 'ring-orange-100' };
      case 'SILVER': return { bg: 'bg-slate-400', text: 'text-slate-600', border: 'border-slate-200', light: 'bg-slate-50', ring: 'ring-slate-100' };
      case 'GOLD': return { bg: 'bg-yellow-400', text: 'text-yellow-600', border: 'border-yellow-200', light: 'bg-yellow-50', ring: 'ring-yellow-100' };
      case 'PLATINUM': return { bg: 'bg-cyan-400', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-50', ring: 'ring-cyan-100' };
      case 'DIAMOND': return { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50', ring: 'ring-purple-100' };
      default: return { bg: 'bg-gray-400', text: 'text-gray-600', border: 'border-gray-200', light: 'bg-gray-50', ring: 'ring-gray-100' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Leaderboard <span className="text-karm-gold">& Quests</span></h1>
            <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
            <p className="text-xs text-karm-muted font-mono hidden md:block">COMPETE & EARN</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: Leaderboard Table */}
              <div className="lg:col-span-8 space-y-6">
                  
                  {/* Filters */}
                  <div className="glass-panel p-2 rounded-xl bg-white border border-karm-sage flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['DAILY', 'WEEKLY', 'MONTHLY'].map((p) => (
                          <button
                            key={p}
                            onClick={() => setPeriod(p as any)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${period === p ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                              {p}
                          </button>
                        ))}
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setScope('GLOBAL')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${scope === 'GLOBAL' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}>
                          <Globe className="w-3 h-3"/> Global
                        </button>
                        <button onClick={() => setScope('COUNTRY')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${scope === 'COUNTRY' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}>
                          <MapPin className="w-3 h-3"/> {user.country || 'Country'}
                        </button>
                    </div>
                  </div>

                  {/* Top 3 Podium (Visual) */}
                  <div className="grid grid-cols-3 gap-4 h-48 items-end mb-8 px-4">
                    {[1, 0, 2].map((idx) => { // Order: 2nd, 1st, 3rd
                        const entry = TopThree[idx];
                        if (!entry) return null;
                        const height = idx === 1 ? 'h-full' : idx === 0 ? 'h-40' : 'h-32';
                        const color = idx === 1 ? 'bg-yellow-100 border-yellow-300' : idx === 0 ? 'bg-gray-100 border-gray-300' : 'bg-orange-100 border-orange-300';
                        
                        return (
                          <div key={entry.rank} className={`glass-panel rounded-t-2xl border-x border-t ${color} flex flex-col items-center justify-end pb-4 relative ${height} transition-all hover:-translate-y-1`}>
                              <div className="absolute -top-6">
                                <div className={`w-12 h-12 rounded-full border-4 border-white shadow-md overflow-hidden bg-white`}>
                                    <img src={entry.avatar} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className={`absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-xs shadow-sm border ${color}`}>
                                    {entry.rank}
                                </div>
                              </div>
                              <div className="font-bold text-karm-dark mt-8">{entry.name.split(' ')[0]}</div>
                              <div className="text-xs font-mono text-gray-600 font-bold">{entry.xp} XP</div>
                              {idx === 1 && <Crown className="absolute -top-10 w-8 h-8 text-yellow-500 animate-bounce" />}
                          </div>
                        )
                    })}
                  </div>

                  {/* List */}
                  <div className="glass-panel rounded-2xl bg-white border border-karm-sage overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                          <tr>
                              <th className="py-3 px-6 text-left w-16">Rank</th>
                              <th className="py-3 px-6 text-left">User</th>
                              <th className="py-3 px-6 text-right">XP</th>
                              <th className="py-3 px-6 text-center w-20">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RestList.map((entry) => (
                              <tr key={entry.userId} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${entry.isCurrentUser ? 'bg-karm-gold/10' : ''}`}>
                                <td className="py-3 px-6 font-bold text-gray-500">#{entry.rank}</td>
                                <td className="py-3 px-6">
                                    <div className="flex items-center gap-3">
                                      <img src={`https://flagsapi.com/${entry.country}/flat/24.png`} alt={entry.country} className="w-6 h-6 rounded-sm opacity-80" />
                                      <span className={`font-medium ${entry.isCurrentUser ? 'text-karm-dark font-bold' : 'text-gray-700'}`}>
                                          {entry.name} {entry.isCurrentUser && '(You)'}
                                      </span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-right font-mono font-bold text-karm-dark">{entry.xp.toLocaleString()}</td>
                                <td className="py-3 px-6 flex justify-center">
                                    {entry.trend === 'UP' ? <TrendingUp className="w-4 h-4 text-green-500" /> : 
                                    entry.trend === 'DOWN' ? <TrendingDown className="w-4 h-4 text-red-500" /> : 
                                    <Minus className="w-4 h-4 text-gray-300" />}
                                </td>
                              </tr>
                          ))}
                        </tbody>
                    </table>
                    {loading && <div className="p-8 text-center text-gray-400">Loading Leaderboard...</div>}
                  </div>
              </div>

              {/* RIGHT: Gamification & Stats */}
              <div className="lg:col-span-4 space-y-8">
                  
                  {/* Season Progress */}
                  <div className="glass-panel p-6 rounded-2xl bg-karm-dark text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                          <h3 className="text-lg font-bold">Monthly Season</h3>
                          <p className="text-xs text-gray-400">Ends in 28 Days</p>
                        </div>
                        <Calendar className="w-6 h-6 text-karm-gold" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between text-xs mb-1 font-bold">
                          <span>Level {currentLevel}</span>
                          <span>Level {currentLevel + 1}</span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-karm-gold to-purple-500 transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="mt-2 text-right text-xs text-karm-gold font-mono">{totalXp} / {nextLevelXp} XP</div>
                    </div>
                  </div>

                  {/* Daily Quests */}
                  <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                    <h3 className="font-bold text-karm-dark mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-500" /> Daily Quests
                    </h3>
                    <div className="space-y-3">
                        {quests.map((q) => (
                          <div key={q.id} className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${q.isCompleted ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-karm-sage hover:border-karm-gold'}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${q.isCompleted ? 'bg-green-500 text-white' : 'border-2 border-gray-300'}`}>
                                    {q.isCompleted && <CheckCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className={`text-sm font-bold ${q.isCompleted ? 'text-gray-500 line-through' : 'text-karm-dark'}`}>{q.title}</div>
                                </div>
                                <div className="text-xs font-bold text-karm-gold bg-karm-gold/10 px-2 py-1 rounded">+{q.xp} XP</div>
                              </div>
                              
                              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${(q.progress / q.total) * 100}%` }}></div>
                              </div>
                              
                              {!q.isCompleted && q.redirectView && (
                                <button 
                                    onClick={() => onNavigate(q.redirectView!)}
                                    className="self-end text-[10px] font-bold text-karm-dark hover:text-karm-gold flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                >
                                    Start Quest <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
              </div>
           </div>

           {/* FULL WIDTH BADGE VAULT */}
           <div className="glass-panel p-8 rounded-3xl bg-white border border-karm-sage shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-2xl font-bold text-karm-dark flex items-center gap-3">
                       <Award className="w-7 h-7 text-purple-500" /> Badge Vault
                    </h3>
                    <p className="text-sm text-gray-500">Collect badges by completing milestones. Unlock rewards and XP.</p>
                 </div>
                 <div className="text-sm font-bold bg-gray-100 px-4 py-2 rounded-lg text-gray-600">
                    {badges.filter(b => b.isUnlocked).length} / {badges.length} Unlocked
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {badges.map((badge) => {
                    const style = getBadgeStyle(badge.tier);
                    return (
                       <div key={badge.id} className={`bg-white border rounded-2xl p-6 flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${badge.isUnlocked ? 'border-gray-200' : 'border-gray-100 opacity-80'}`}>
                          
                          {/* XP Pill */}
                          <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full ${style.light} ${style.text}`}>
                             + {badge.xpReward} XP
                          </div>

                          {/* Hexagon Icon Container */}
                          <div className="w-20 h-20 flex items-center justify-center mb-4 relative mt-2">
                             {/* Hexagon Shape Background */}
                             <div 
                                className={`absolute inset-0 opacity-10 ${style.bg}`} 
                                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                             ></div>
                             {/* Hexagon Border Effect (simulated via slightly larger/opacity) */}
                             <div 
                                className={`absolute inset-0 border-2 ${style.text} opacity-20`}
                                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                             ></div>
                             
                             <badge.icon className={`w-8 h-8 relative z-10 ${badge.isUnlocked ? style.text : 'text-gray-300'}`} />
                          </div>

                          <h4 className="font-bold text-karm-dark mb-2 text-sm">{badge.name}</h4>
                          <p className="text-xs text-gray-500 mb-6 leading-relaxed min-h-[32px] line-clamp-2">{badge.description}</p>

                          <div className="w-full mt-auto">
                             <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                                <div 
                                   className={`h-full rounded-full transition-all duration-1000 ${badge.isUnlocked ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gray-300'}`} 
                                   style={{ width: `${Math.min(100, badge.progress)}%` }}
                                ></div>
                             </div>
                             
                             <div className="flex justify-between items-center w-full min-h-[24px]">
                                <span className={`text-[10px] font-bold uppercase ${badge.isUnlocked ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded' : 'text-gray-400'}`}>
                                   {badge.isUnlocked ? 'UNLOCKED' : `${Math.round(badge.progress)}%`}
                                </span>
                                {!badge.isUnlocked && badge.redirectView && (
                                   <button 
                                      onClick={() => onNavigate(badge.redirectView!)}
                                      className="text-[10px] font-bold text-white bg-karm-dark hover:bg-[#1F2130] px-3 py-1 rounded transition-colors"
                                   >
                                      Unlock Now
                                   </button>
                                )}
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
