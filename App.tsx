
import React, { useState, useEffect } from 'react';
import { View, InterviewConfig, User, PlanType } from './types';
import { api } from './services/api';
import LandingPage from './components/Landing/LandingPage';
import Onboarding from './components/Onboarding';
import JobSearch from './components/JobSearch';
import VoiceInterview from './components/MockInterview/VoiceInterview';
import TextInterview from './components/MockInterview/TextInterview';
import InterviewSetup from './components/MockInterview/InterviewSetup';
import ReverseInterview from './components/ReverseInterview';
import ExamPrep from './components/ExamPrep';
import CodeLab from './components/CodeLab/CodeLab';
import CareerGuidance from './components/Aptitude/CareerGuidance';
import EnglishCoach from './components/English/EnglishCoach';
import ResumeBuilder from './components/ResumeBuilder';
import Pricing from './components/Pricing';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Legal from './components/Legal';
import Blog from './components/Blog';
import Careers from './components/Careers';
import CookieConsent from './components/CookieConsent';
import NotificationCenter from './components/NotificationCenter';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdvancedAnalytics from './components/Analytics/AdvancedAnalytics';
import CommunityForum from './components/Forum/CommunityForum';
import { 
  LayoutDashboard, Mic2, GraduationCap, Cpu, Menu, X, Zap, ChevronLeft, 
  Code, Compass, Globe, User as UserIcon, Crown, Users, FileText, Briefcase, Trophy,
  Shield, MessageSquare, Activity, Bell
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [currentView]);

  useEffect(() => {
    const token = localStorage.getItem('nexus_token');
    const storedUsers = localStorage.getItem('nexus_mock_users');
    if (token && storedUsers) {
      const userId = token.replace('mock-jwt-token-', '');
      const users = JSON.parse(storedUsers);
      const found = users.find((u: any) => u.id === userId);
      if (found) {
        if (!found.notifications) found.notifications = [];
        setUser(found);
        setCurrentView(View.DASHBOARD);
      }
    }
  }, []);

  const refreshUser = () => {
    if (!user) return;
    const storedUsers = localStorage.getItem('nexus_mock_users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const found = users.find((u: any) => u.email === user.email);
      if (found && JSON.stringify(found) !== JSON.stringify(user)) {
         if (!found.notifications) found.notifications = [];
         setUser(found);
      }
    }
  };
  
  useEffect(() => {
    if (user) {
      const interval = setInterval(refreshUser, 2000);
      return () => clearInterval(interval);
    }
  }, [user?.email]);

  const handleLogin = (u: User) => {
    if (!u.notifications) u.notifications = [];
    setUser(u);
    if (!u.onboarded) setCurrentView(View.ONBOARDING);
    else setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.LANDING);
    localStorage.removeItem('nexus_token');
  };

  const handleOnboardingComplete = () => { refreshUser(); setCurrentView(View.DASHBOARD); };

  const handleUpgrade = async (plan: PlanType) => {
    if (!user) return;
    try {
      const updatedUser = await api.user.upgrade(user.email, plan);
      setUser(updatedUser);
      alert(`Successfully upgraded to ${plan} plan!`);
      setCurrentView(View.DASHBOARD);
    } catch (e) { alert("Upgrade failed."); }
  };

  const checkAccess = (feature: string): boolean => {
    if (!user) return false;
    if (user.plan === 'ELITE' || user.plan === 'PRO') return true;
    if (feature === 'VOICE_INTERVIEW') return user.credits.interviews > 0;
    return true;
  };

  const startInterview = (config: InterviewConfig) => {
    if (config.mode === 'VOICE' && !checkAccess('VOICE_INTERVIEW')) {
      alert("Upgrade for more interviews.");
      setCurrentView(View.PRICING);
      return;
    }
    if (config.mode === 'VOICE' && user && user.plan === 'FREE') {
      setUser({ ...user, credits: { ...user.credits, interviews: user.credits.interviews - 1 } });
      api.user.addXp(user.email, 10);
    }
    setInterviewConfig(config);
    setIsInterviewActive(true);
  };

  const endInterview = () => { setIsInterviewActive(false); setInterviewConfig(null); };

  const NavItem = ({ view, icon: Icon, label, highlight = false }: { view: View, icon: any, label: string, highlight?: boolean }) => (
    <button
      onClick={() => { setCurrentView(view); setSidebarOpen(false); setIsInterviewActive(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-karm-dark text-white shadow-lg' 
          : highlight 
            ? 'text-karm-dark bg-karm-gold/20 border border-karm-gold/40 hover:bg-karm-gold/30'
            : 'text-karm-muted hover:bg-white hover:text-karm-dark hover:shadow-sm'
      }`}
    >
      <Icon className={`w-5 h-5 ${currentView === view ? 'text-karm-gold' : highlight ? 'text-karm-dark' : ''}`} />
      <span className="font-medium tracking-wide">{label}</span>
      {currentView === view && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-karm-gold opacity-100 animate-pulse"></div>}
    </button>
  );

  // --- PUBLIC ROUTES ---
  if (currentView === View.LANDING) return <><LandingPage onLoginClick={() => setCurrentView(View.AUTH)} onRegisterClick={() => setCurrentView(View.AUTH)} onNavigate={setCurrentView} /><CookieConsent /></>;
  if (currentView === View.AUTH) return <div className="relative h-screen bg-karm-light"><button onClick={() => setCurrentView(View.LANDING)} className="absolute top-4 left-4 z-50 text-karm-dark flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 border border-karm-sage shadow-sm"><ChevronLeft className="w-4 h-4" /> Back to Home</button><Auth onLogin={handleLogin} /><CookieConsent /></div>;
  if (currentView === View.BLOG) return <><Blog onBack={() => setCurrentView(View.LANDING)} onNavigate={setCurrentView} /><CookieConsent /></>;
  if (currentView === View.CAREERS) return <><Careers onBack={() => setCurrentView(View.LANDING)} onNavigate={setCurrentView} /><CookieConsent /></>;
  if (currentView === View.PRIVACY) return <><Legal type="PRIVACY" onBack={() => setCurrentView(View.LANDING)} onNavigate={setCurrentView} /><CookieConsent /></>;
  if (currentView === View.TERMS) return <><Legal type="TERMS" onBack={() => setCurrentView(View.LANDING)} onNavigate={setCurrentView} /><CookieConsent /></>;

  // --- PROTECTED ROUTES ---
  if (currentView === View.ONBOARDING && user) return <Onboarding userEmail={user.email} onComplete={handleOnboardingComplete} />;
  if (!user) return null;

  const renderContent = () => {
    switch (currentView) {
      case View.PRICING: return <Pricing currentPlan={user.plan} onUpgrade={handleUpgrade} />;
      case View.PROFILE: return <UserProfile user={user} onLogout={handleLogout} />;
      case View.JOB_SEARCH: return <JobSearch user={user} />;
      case View.MOCK_INTERVIEW:
        if (!isInterviewActive) return <InterviewSetup onStart={startInterview} />;
        return (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-karm-sage flex items-center gap-4 bg-white/50 backdrop-blur-sm z-10">
              <button onClick={endInterview} className="p-2 hover:bg-black/5 rounded-lg transition text-karm-dark"><ChevronLeft className="w-6 h-6" /></button>
              <div>
                <h3 className="font-bold text-karm-dark">{interviewConfig?.subRole} Interview</h3>
                <p className="text-xs text-karm-muted font-mono">{interviewConfig?.company} • {interviewConfig?.experience} Yrs • {interviewConfig?.mode} Mode</p>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-karm-light">
              {interviewConfig?.mode === 'VOICE' ? <VoiceInterview config={interviewConfig!} /> : <TextInterview config={interviewConfig!} />}
            </div>
          </div>
        );
      case View.REVERSE_INTERVIEW: return <ReverseInterview />;
      case View.EXAM_PREP: return <ExamPrep user={user} />;
      case View.CODE_LAB: return <CodeLab />;
      case View.APTITUDE: return <CareerGuidance />;
      case View.ENGLISH_COACH: return <EnglishCoach />;
      case View.RESUME_BUILDER: return <ResumeBuilder />;
      case View.LEADERBOARD: return <Leaderboard user={user} onNavigate={setCurrentView} />;
      case View.ADMIN: return <AdminDashboard onNavigate={setCurrentView} />;
      case View.FORUM: return <CommunityForum user={user} />;
      case View.ANALYTICS: return <AdvancedAnalytics user={user} />;
      case View.NOTIFICATIONS: return <NotificationCenter user={user} onNavigate={setCurrentView} mode="embedded" />;
      default: return <Dashboard user={user} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-karm-light text-karm-dark font-sans overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex fixed md:relative inset-y-0 left-0 z-40 w-72 glass-panel border-r border-karm-sage flex-col bg-white/80 overflow-visible`}>
        <div className="p-8 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg"><Cpu className="w-5 h-5 text-karm-gold" /></div>
             <span className="text-xl font-bold tracking-tight text-karm-dark">KarmGuru<span className="text-karm-gold">AI</span></span>
           </div>
           {/* Notification Center Dropdown (Desktop) */}
           <NotificationCenter user={user} onNavigate={setCurrentView} mode="dropdown" />
        </div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide pb-20">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={View.ANALYTICS} icon={Activity} label="Analytics" />
          <NavItem view={View.LEADERBOARD} icon={Trophy} label="Leaderboard" />
          <NavItem view={View.FORUM} icon={MessageSquare} label="Forum" />
          <NavItem view={View.MOCK_INTERVIEW} icon={Mic2} label="Mock Interview" />
          <NavItem view={View.JOB_SEARCH} icon={Briefcase} label="Job Search" />
          <NavItem view={View.REVERSE_INTERVIEW} icon={Users} label="Reverse Interview" />
          <NavItem view={View.CODE_LAB} icon={Code} label="Code Lab" />
          {/* <NavItem view={View.EXAM_PREP} icon={GraduationCap} label="Exam Prep" />
          <NavItem view={View.APTITUDE} icon={Compass} label="Career Architect" />
          <NavItem view={View.ENGLISH_COACH} icon={Globe} label="English Coach" />
          <NavItem view={View.RESUME_BUILDER} icon={FileText} label="Resume Builder" /> */}
          {user.role === 'ADMIN' && <div className="mt-4 pt-4 border-t border-karm-sage"><NavItem view={View.ADMIN} icon={Shield} label="Admin Panel" /></div>}
          <div className="my-4 h-px bg-karm-sage"></div>
          <NavItem view={View.PRICING} icon={Crown} label="Upgrade Plan" highlight />
          <NavItem view={View.PROFILE} icon={UserIcon} label="Profile" />
        </nav>
      </aside>

      <main className="flex-1 relative overflow-hidden flex flex-col bg-karm-light pb-20 md:pb-0">
        {/* Fixed: Notification center float removed */}
        {renderContent()}
        <CookieConsent />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-karm-sage z-50 flex justify-around items-center px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <button onClick={() => setCurrentView(View.DASHBOARD)} className={`p-2 flex flex-col items-center ${currentView === View.DASHBOARD ? 'text-karm-dark' : 'text-gray-400'}`}><LayoutDashboard className="w-5 h-5"/><span className="text-[10px] font-bold">Home</span></button>
         <button onClick={() => setCurrentView(View.MOCK_INTERVIEW)} className={`p-2 flex flex-col items-center ${currentView === View.MOCK_INTERVIEW ? 'text-karm-dark' : 'text-gray-400'}`}><Mic2 className="w-5 h-5"/><span className="text-[10px] font-bold">Interview</span></button>
         <button onClick={() => setCurrentView(View.JOB_SEARCH)} className={`p-2 flex flex-col items-center ${currentView === View.JOB_SEARCH ? 'text-karm-dark' : 'text-gray-400'}`}><Briefcase className="w-5 h-5"/><span className="text-[10px] font-bold">Jobs</span></button>
         {/* Alerts Tab for Mobile Notifications */}
         <button onClick={() => setCurrentView(View.NOTIFICATIONS)} className={`p-2 flex flex-col items-center ${currentView === View.NOTIFICATIONS ? 'text-karm-dark' : 'text-gray-400'} relative`}>
             <Bell className="w-5 h-5"/>
             {user.notifications.some(n => !n.read) && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>}
             <span className="text-[10px] font-bold">Alerts</span>
         </button>
         <button onClick={() => setCurrentView(View.PROFILE)} className={`p-2 flex flex-col items-center ${currentView === View.PROFILE ? 'text-karm-dark' : 'text-gray-400'}`}><UserIcon className="w-5 h-5"/><span className="text-[10px] font-bold">Profile</span></button>
      </div>
    </div>
  );
};

export default App;
