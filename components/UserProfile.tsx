
import React, { useState } from 'react';
import { User, Resume } from '../types';
import { api } from '../services/api';
import { 
  User as UserIcon, Mail, Calendar, Shield, Zap, TrendingUp, LogOut, 
  Upload, FileText, Trash2, CheckCircle, Loader2, Settings, Edit, 
  Download, MoreHorizontal, CreditCard, Activity, Camera, Image, Lock, Crown
} from 'lucide-react';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'RESUMES' | 'STATS' | 'SETTINGS'>('RESUMES');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);
  const stats = user.stats || { streak: 0, totalXp: 0, recentActivity: [] };

  // Level Calculation
  const level = Math.floor(stats.totalXp / 1000) + 1;

  const extractTextFromPdf = async (arrayBuffer: ArrayBuffer) => {
    // @ts-ignore
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) return "";
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const extractTextFromDocx = async (arrayBuffer: ArrayBuffer) => {
    // @ts-ignore
    const mammoth = window.mammoth;
    if (!mammoth) return "";
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let textContent = "";
      if (file.type === 'application/pdf') {
        textContent = await extractTextFromPdf(await file.arrayBuffer());
      } else if (file.type.includes('word')) {
        textContent = await extractTextFromDocx(await file.arrayBuffer());
      } else {
        textContent = await file.text();
      }

      if (!textContent) throw new Error("Could not extract text");

      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        textContent: textContent,
        uploadedAt: new Date().toLocaleDateString(),
        isActive: false
      };

      await api.user.uploadResume(user.email, newResume);
      alert("Resume Uploaded Successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'AVATAR' | 'COVER') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Max 2MB.");
        return;
    }

    setIsUploadingImage(true);
    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            if (type === 'AVATAR') {
                await api.user.updateProfileImage(user.email, base64);
            } else {
                await api.user.updateCoverImage(user.email, base64);
            }
            setIsUploadingImage(false);
        };
        reader.readAsDataURL(file);
    } catch (e) {
        console.error(e);
        setIsUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
       await api.user.deleteResume(user.email, id);
    }
  };

  const handleSetActive = async (id: string) => {
    await api.user.setActiveResume(user.email, id);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        alert("New passwords do not match");
        return;
    }
    setPassLoading(true);
    try {
        await api.user.changePassword(user.email, passwords.current, passwords.new);
        alert("Password changed successfully");
        setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
        alert(err.message);
    } finally {
        setPassLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-karm-light overflow-hidden">
      {/* Banner */}
      <div className="h-48 relative flex-shrink-0 group">
         {user.coverImage ? (
             <img src={user.coverImage} className="w-full h-full object-cover" alt="cover" />
         ) : (
             <div className="w-full h-full bg-gradient-to-r from-karm-dark to-[#3a4537]"></div>
         )}
         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all"></div>
         <label className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg cursor-pointer backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Image className="w-5 h-5" />
            <span className="sr-only">Change Cover</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'COVER')} />
         </label>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 md:px-12 -mt-16 pb-12 relative z-10">
         <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Column */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
               <div className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage shadow-md text-center">
                  <div className="relative w-28 h-28 mx-auto mb-4 group">
                     <div className="w-full h-full rounded-full bg-white p-1 shadow-lg overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                     </div>
                     <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white">
                        <Camera className="w-6 h-6" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'AVATAR')} />
                     </label>
                     {/* Level Badge */}
                     <div className="absolute -bottom-2 -right-2 bg-karm-dark text-karm-gold text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white flex items-center gap-1 shadow-sm">
                        <Crown className="w-3 h-3 fill-current" /> Lvl {level}
                     </div>
                  </div>

                  <h2 className="text-2xl font-bold text-karm-dark mb-1">{user.name}</h2>
                  <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-1">
                     <Mail className="w-3 h-3"/> {user.email}
                  </p>
                  
                  <div className="flex justify-center gap-3 mb-6">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${user.plan === 'ELITE' ? 'bg-karm-dark text-white border-karm-dark' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        <Shield className="w-3 h-3"/> {user.plan}
                     </span>
                     <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                        <Calendar className="w-3 h-3"/> Member
                     </span>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                     <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                           <div className="text-xl font-bold text-karm-dark">{stats.totalXp}</div>
                           <div className="text-xs text-gray-400 uppercase">Total XP</div>
                        </div>
                        <div>
                           <div className="text-xl font-bold text-karm-dark">{stats.streak}</div>
                           <div className="text-xs text-gray-400 uppercase">Streak</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-panel rounded-2xl bg-white border border-karm-sage shadow-sm overflow-hidden">
                  <button onClick={() => setActiveTab('RESUMES')} className={`w-full p-4 text-left text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'RESUMES' ? 'bg-karm-gold/10 text-karm-dark border-l-4 border-l-karm-gold' : 'hover:bg-gray-50 text-gray-500'}`}>
                     <FileText className="w-4 h-4"/> Resume Vault
                  </button>
                  <button onClick={() => setActiveTab('STATS')} className={`w-full p-4 text-left text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'STATS' ? 'bg-karm-gold/10 text-karm-dark border-l-4 border-l-karm-gold' : 'hover:bg-gray-50 text-gray-500'}`}>
                     <TrendingUp className="w-4 h-4"/> Usage Analytics
                  </button>
                  <button onClick={() => setActiveTab('SETTINGS')} className={`w-full p-4 text-left text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'SETTINGS' ? 'bg-karm-gold/10 text-karm-dark border-l-4 border-l-karm-gold' : 'hover:bg-gray-50 text-gray-500'}`}>
                     <Settings className="w-4 h-4"/> Account Settings
                  </button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={onLogout} className="w-full p-4 text-left text-sm font-bold flex items-center gap-3 text-red-600 hover:bg-red-50 transition-all">
                     <LogOut className="w-4 h-4"/> Sign Out
                  </button>
               </div>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
               
               {activeTab === 'RESUMES' && (
                  <div className="glass-panel p-8 rounded-2xl bg-white border border-karm-sage shadow-sm min-h-[500px]">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-2xl font-bold text-karm-dark">Resume Vault</h3>
                           <p className="text-sm text-gray-500">Manage your resumes for tailored job matching.</p>
                        </div>
                        <label className={`flex items-center gap-2 px-6 py-3 bg-karm-dark text-white rounded-xl cursor-pointer hover:bg-[#1F2130] transition-all shadow-lg hover:shadow-xl ${isUploading ? 'opacity-50' : ''}`}>
                           {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>}
                           <span className="font-bold">Upload Resume</span>
                           <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {user.resumes.length === 0 && (
                           <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
                              <p className="text-gray-500 font-medium">No resumes found.</p>
                              <p className="text-xs text-gray-400">Upload a PDF or DOCX to get started.</p>
                           </div>
                        )}
                        {user.resumes.map(resume => (
                           <div key={resume.id} className={`group relative p-6 rounded-2xl border transition-all hover:-translate-y-1 duration-300 ${resume.isActive ? 'bg-karm-dark text-white border-karm-dark shadow-xl ring-2 ring-karm-gold ring-offset-2' : 'bg-white border-karm-sage hover:shadow-lg'}`}>
                              <div className="flex items-start justify-between mb-4">
                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resume.isActive ? 'bg-white/10 text-karm-gold' : 'bg-gray-100 text-gray-500'}`}>
                                    <FileText className="w-6 h-6"/>
                                 </div>
                                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(resume.id)} className={`p-2 rounded-lg ${resume.isActive ? 'hover:bg-white/10 text-white' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}>
                                       <Trash2 className="w-4 h-4"/>
                                    </button>
                                 </div>
                              </div>
                              
                              <h4 className={`font-bold text-lg truncate mb-1 ${resume.isActive ? 'text-white' : 'text-karm-dark'}`}>{resume.name}</h4>
                              <p className={`text-xs mb-6 ${resume.isActive ? 'text-gray-400' : 'text-gray-500'}`}>Uploaded on {resume.uploadedAt}</p>
                              
                              <div className="flex items-center justify-between mt-auto">
                                 {resume.isActive ? (
                                    <span className="flex items-center gap-2 text-xs font-bold text-karm-gold bg-karm-gold/10 px-3 py-1.5 rounded-lg border border-karm-gold/20">
                                       <CheckCircle className="w-3 h-3"/> Active for Matching
                                    </span>
                                 ) : (
                                    <button onClick={() => handleSetActive(resume.id)} className="text-xs font-bold px-4 py-2 bg-gray-100 hover:bg-gray-200 text-karm-dark rounded-lg transition-colors">
                                       Set as Active
                                    </button>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'STATS' && (
                  <div className="glass-panel p-8 rounded-2xl bg-white border border-karm-sage shadow-sm min-h-[500px]">
                     <h3 className="text-2xl font-bold text-karm-dark mb-8">Usage Analytics</h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                           <div className="flex items-center gap-3 mb-2 text-blue-600 font-bold">
                              <Zap className="w-5 h-5"/> Interview Credits
                           </div>
                           <div className="text-3xl font-bold text-karm-dark">{user.credits.interviews === -1 ? '∞' : user.credits.interviews}</div>
                           <p className="text-xs text-gray-500 mt-1">Refreshes monthly</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                           <div className="flex items-center gap-3 mb-2 text-purple-600 font-bold">
                              <Shield className="w-5 h-5"/> AI Analyses
                           </div>
                           <div className="text-3xl font-bold text-karm-dark">{user.credits.aiAnalysis}</div>
                           <p className="text-xs text-gray-500 mt-1">Detailed reports available</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100">
                           <div className="flex items-center gap-3 mb-2 text-orange-600 font-bold">
                              <Calendar className="w-5 h-5"/> Joined
                           </div>
                           <div className="text-xl font-bold text-karm-dark">{user.joinedDate}</div>
                           <p className="text-xs text-gray-500 mt-1">Loyal Member</p>
                        </div>
                     </div>

                     <h4 className="text-lg font-bold text-karm-dark mb-4">Activity Log</h4>
                     <div className="border rounded-xl overflow-hidden">
                        {stats.recentActivity.map((activity, i) => (
                           <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Activity className="w-4 h-4"/>
                                 </div>
                                 <div>
                                    <div className="font-bold text-sm text-karm-dark">{activity.title}</div>
                                    <div className="text-xs text-gray-500">{activity.desc}</div>
                                 </div>
                              </div>
                              <div className="text-xs text-gray-400">{activity.date}</div>
                           </div>
                        ))}
                        {stats.recentActivity.length === 0 && (
                            <div className="p-6 text-center text-gray-400 text-sm">No activity recorded yet.</div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'SETTINGS' && (
                  <div className="glass-panel p-8 rounded-2xl bg-white border border-karm-sage shadow-sm min-h-[500px]">
                     <h3 className="text-2xl font-bold text-karm-dark mb-8">Account Settings</h3>
                     
                     <div className="space-y-8 max-w-2xl">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Name</label>
                           <div className="flex gap-2">
                              <input type="text" value={user.name} readOnly className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-karm-dark"/>
                              <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"><Edit className="w-4 h-4"/></button>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                           <div className="flex gap-2">
                              <input type="text" value={user.email} readOnly className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-karm-dark"/>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                           <h4 className="text-lg font-bold text-karm-dark mb-4 flex items-center gap-2"><Lock className="w-5 h-5"/> Security</h4>
                           <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Current Password</label>
                                    <input type="password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark outline-none focus:border-karm-gold"/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 uppercase font-bold">New Password</label>
                                        <input type="password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark outline-none focus:border-karm-gold"/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Confirm Password</label>
                                        <input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark outline-none focus:border-karm-gold"/>
                                    </div>
                                </div>
                                <button disabled={passLoading} className="px-6 py-2 bg-karm-dark text-white rounded-lg font-bold hover:bg-[#1F2130] disabled:opacity-50 transition-all">
                                    {passLoading ? 'Updating...' : 'Update Password'}
                                </button>
                           </form>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                           <h4 className="text-lg font-bold text-karm-dark mb-4">Subscription</h4>
                           <div className="p-4 rounded-xl border border-karm-sage bg-gray-50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-white rounded-lg border border-gray-200">
                                    <CreditCard className="w-5 h-5 text-karm-dark"/>
                                 </div>
                                 <div>
                                    <div className="font-bold text-sm text-karm-dark">{user.plan} Plan</div>
                                    <div className="text-xs text-gray-500">Next billing date: Oct 24, 2024</div>
                                 </div>
                              </div>
                              <button className="text-xs font-bold text-karm-gold hover:underline">Manage</button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
    </div>
  );
};

export default UserProfile;
