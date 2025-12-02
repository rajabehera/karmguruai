
import React, { useState, useEffect } from 'react';
import { User, AdminStats, View } from '../../types';
import { api } from '../../services/api';
import { Users, DollarSign, Activity, Mic2, Shield, Search, MoreHorizontal, Award } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: View) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
        const s = await api.admin.getStats();
        const u = await api.admin.getUsers();
        setStats(s);
        setUsers(u);
    };
    loadData();
  }, []);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Admin <span className="text-karm-gold">Control</span></h1>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8">
         {stats && (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                 <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-gray-400 uppercase">Total Users</span>
                         <Users className="w-5 h-5 text-blue-500"/>
                     </div>
                     <div className="text-3xl font-bold text-karm-dark">{stats.totalUsers.toLocaleString()}</div>
                 </div>
                 <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-gray-400 uppercase">Revenue</span>
                         <DollarSign className="w-5 h-5 text-green-600"/>
                     </div>
                     <div className="text-3xl font-bold text-karm-dark">${stats.revenue.toLocaleString()}</div>
                 </div>
                 <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-gray-400 uppercase">Active Now</span>
                         <Activity className="w-5 h-5 text-green-500"/>
                     </div>
                     <div className="text-3xl font-bold text-karm-dark">{stats.activeUsers.toLocaleString()}</div>
                 </div>
                 <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-gray-400 uppercase">Interviews</span>
                         <Mic2 className="w-5 h-5 text-purple-500"/>
                     </div>
                     <div className="text-3xl font-bold text-karm-dark">{stats.interviewsConducted.toLocaleString()}</div>
                 </div>
             </div>
         )}

         <div className="glass-panel rounded-2xl bg-white border border-karm-sage shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-karm-dark">User Management</h3>
                 <div className="relative">
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                     <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-karm-gold"
                     />
                 </div>
             </div>
             
             <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500">
                     <tr>
                         <th className="p-4">Name</th>
                         <th className="p-4">Email</th>
                         <th className="p-4">Plan</th>
                         <th className="p-4">XP</th>
                         <th className="p-4">Joined</th>
                         <th className="p-4">Actions</th>
                     </tr>
                 </thead>
                 <tbody>
                     {filteredUsers.map(u => (
                         <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                             <td className="p-4 font-bold text-karm-dark">{u.name}</td>
                             <td className="p-4 text-gray-600">{u.email}</td>
                             <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.plan === 'ELITE' ? 'bg-karm-dark text-white' : u.plan === 'PRO' ? 'bg-karm-gold text-karm-dark' : 'bg-gray-200 text-gray-600'}`}>{u.plan}</span></td>
                             <td className="p-4 font-mono">{u.xp.toLocaleString()}</td>
                             <td className="p-4 text-gray-500">{u.joinedDate}</td>
                             <td className="p-4 flex gap-2">
                                 <button className="p-1 hover:bg-gray-200 rounded text-gray-500" title="Award Badge"><Award className="w-4 h-4"/></button>
                                 <button className="p-1 hover:bg-gray-200 rounded text-gray-500" title="More"><MoreHorizontal className="w-4 h-4"/></button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
