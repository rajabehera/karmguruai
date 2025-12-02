
import React, { useState, useEffect } from 'react';
import { User, AnalyticsData } from '../../types';
import { api } from '../../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  BarChart, Bar
} from 'recharts';
import { TrendingUp, Activity, Award, Target, Brain } from 'lucide-react';

interface AdvancedAnalyticsProps {
  user: User;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ user }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const loadData = async () => {
        const analytics = await api.user.getAnalytics(user.email);
        setData(analytics);
    };
    loadData();
  }, [user]);

  if (!data) return <div className="p-8 text-center text-karm-dark">Loading Analytics...</div>;

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Advanced <span className="text-karm-gold">Analytics</span></h1>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8">
         <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Growth Rate</p>
                            <h3 className="text-2xl font-bold text-karm-dark">+125 XP<span className="text-sm font-normal text-gray-400">/day</span></h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600"/></div>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="w-[70%] h-full bg-green-500"></div></div>
                </div>
                <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Avg Interview</p>
                            <h3 className="text-2xl font-bold text-karm-dark">{user.stats.avgTestScore}%</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg"><Award className="w-5 h-5 text-purple-600"/></div>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-purple-500"></div></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                    <h3 className="text-lg font-bold text-karm-dark mb-6">XP Growth Trajectory</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.xpGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                                <Line type="monotone" dataKey="xp" stroke="#A4B5B9" strokeWidth={3} dot={{r: 4, fill: '#2C2F44', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                    <h3 className="text-lg font-bold text-karm-dark mb-6">Skill Gap Analysis</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.skillRadar}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: '#6B7280', fontSize: 11, fontWeight: 'bold'}} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="My Skills" dataKey="A" stroke="#2C2F44" fill="#A4B5B9" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
