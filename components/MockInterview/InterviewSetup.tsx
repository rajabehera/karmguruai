
import React, { useState } from 'react';
import { 
  Code, Database, Layers, Smartphone, Server, 
  Brain, Briefcase, PenTool, Cloud, ChevronRight, 
  Star, Globe, Award, Search, Building2, ShoppingCart, 
  Tv, Zap, Monitor, Cpu, DollarSign, Truck, Coffee,
  FileText, Upload, Loader2, FileCheck, CheckCircle,
  Users, Terminal, MessageCircle, Mic2, Layout
} from 'lucide-react';
import { InterviewConfig, InterviewMode, InterviewCategory } from '../../types';

interface SetupProps {
  onStart: (config: InterviewConfig) => void;
}

const ROLES_DATA: Record<string, { icon: any, subRoles: Record<string, { stack: string[], tools: string[] }> }> = {
  "Software Engineer": {
    icon: Code,
    subRoles: {
      "Frontend Engineer": {
        stack: ["React", "Next.js", "Vue", "Angular", "HTML/CSS", "TypeScript"],
        tools: ["Figma", "Chrome DevTools", "Vite", "Tailwind"]
      },
      "Backend Engineer": {
        stack: ["Node.js", "Express", "Django", "Spring Boot", "PostgreSQL", "Redis"],
        tools: ["Postman", "Docker", "Kubernetes", "Swagger"]
      },
      "Full-Stack Engineer": {
        stack: ["MERN", "Next.js", "PostgreSQL", "GraphQL", "Prisma"],
        tools: ["GitHub Actions", "Docker", "AWS", "Vercel"]
      },
      "Mobile Developer": {
        stack: ["React Native", "Flutter", "Swift", "Kotlin"],
        tools: ["Xcode", "Android Studio", "Firebase", "Fastlane"]
      },
      "Game Developer": {
        stack: ["C++", "C#", "Unity", "Unreal Engine", "OpenGL", "WebGL"],
        tools: ["Unity", "Unreal Editor", "Blender", "Visual Studio"]
      },
      "DevOps Engineer": {
        stack: ["Bash", "Python", "Go", "Groovy"],
        tools: ["Jenkins", "Terraform", "Ansible", "Prometheus", "Grafana"]
      },
      "QA Automation Engineer": {
        stack: ["Selenium", "Java", "Python", "Appium", "Cypress"],
        tools: ["Jira", "TestRail", "Jenkins", "Postman"]
      },
      "Game Engineer": {
        stack: ["C++", "C#", "DirectX", "Physics Engines", "Shaders"],
        tools: ["Unreal Engine 5", "Unity", "Visual Studio", "RenderDoc"]
      }
    }
  },
  "Data & Analytics": {
    icon: Brain,
    subRoles: {
      "Data Scientist": {
        stack: ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn"],
        tools: ["Jupyter", "Tableau", "PowerBI", "Snowflake"]
      },
      "Data Analyst": {
        stack: ["SQL", "Excel", "Python", "R", "Statistics"],
        tools: ["Tableau", "PowerBI", "Looker", "Google Analytics"]
      },
      "Data Engineer": {
        stack: ["SQL", "Python", "Scala", "Java", "Spark", "Kafka"],
        tools: ["Airflow", "Hadoop", "AWS Redshift", "BigQuery", "Databricks"]
      },
      "Business Analyst": {
        stack: ["SQL", "BPMN", "UML", "Excel", "Data Modeling"],
        tools: ["Jira", "Visio", "Tableau", "Confluence"]
      },
      "ML Engineer": {
        stack: ["TensorFlow", "PyTorch", "Keras", "OpenCV"],
        tools: ["MLflow", "Kubeflow", "AWS SageMaker", "Hugging Face"]
      }
    }
  },
  "Design & Creative": {
    icon: PenTool,
    subRoles: {
      "UI/UX Designer": {
        stack: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
        tools: ["Figma", "Adobe XD", "Sketch", "Maze"]
      },
      "UI Designer": {
        stack: ["Visual Design", "Color Theory", "Typography", "Layout"],
        tools: ["Figma", "Sketch", "Zeplin", "Principle"]
      },
      "Interaction Designer": {
        stack: ["Micro-interactions", "Motion Design", "User Flows", "Information Arch"],
        tools: ["ProtoPie", "Framer", "After Effects", "Origami Studio"]
      },
      "Graphic Designer": {
        stack: ["Branding", "Print Design", "Illustration", "Layout"],
        tools: ["Photoshop", "Illustrator", "InDesign", "Canva"]
      },
      "Game Designer": {
        stack: ["Level Design", "Game Mechanics", "Storyboarding", "Scripting"],
        tools: ["Unity", "Unreal Engine", "Maya", "Blender"]
      },
      "Product Designer": {
        stack: ["System Design", "Strategic Thinking", "Prototyping", "HTML/CSS"],
        tools: ["Figma", "Miro", "Notion", "Jira"]
      }
    }
  },
  "Product & Management": {
    icon: Briefcase,
    subRoles: {
      "Product Manager": {
        stack: ["Product Lifecycle", "Strategy", "Roadmapping", "Prioritization"],
        tools: ["Jira", "Linear", "Notion", "Mixpanel"]
      },
      "Project Manager": {
        stack: ["Agile", "Scrum", "Waterfall", "Risk Management"],
        tools: ["Asana", "Trello", "Microsoft Project", "Monday.com"]
      },
      "Scrum Master": {
        stack: ["Scrum", "Kanban", "Agile Coaching", "Conflict Resolution"],
        tools: ["Jira", "Confluence", "Miro", "Retrium"]
      }
    }
  },
  "Cloud & Security": {
    icon: Cloud,
    subRoles: {
      "Cloud Architect": {
        stack: ["AWS", "Azure", "GCP", "Hybrid Cloud"],
        tools: ["Terraform", "CloudFormation", "Visio", "Lucidchart"]
      },
      "Cyber Security Analyst": {
        stack: ["Network Security", "Cryptography", "Python", "Bash"],
        tools: ["Wireshark", "Metasploit", "Burp Suite", "Splunk"]
      },
      "SRE (Reliability)": {
        stack: ["Linux", "Networking", "Shell Scripting", "Go"],
        tools: ["Datadog", "PagerDuty", "ELK Stack", "Nagios"]
      }
    }
  }
};

const EXPERIENCE_LEVELS = [
  { label: "Fresher (0 Yrs)", id: "0" },
  { label: "Junior (1-2 Yrs)", id: "1-2" },
  { label: "Mid-Level (3-5 Yrs)", id: "3-5" },
  { label: "Senior (6-8 Yrs)", id: "6-8" },
  { label: "Lead (9-12 Yrs)", id: "9-12" },
  { label: "Expert (12+ Yrs)", id: "12+" }
];

const COMPANIES = [
  { name: "Google", tier: "MAANG", difficulty: "High", color: "text-red-500", icon: Globe },
  { name: "Amazon", tier: "MAANG", difficulty: "High", color: "text-orange-500", icon: ShoppingCart },
  { name: "Microsoft", tier: "MAANG", difficulty: "High", color: "text-blue-500", icon: Monitor },
  { name: "Meta", tier: "MAANG", difficulty: "High", color: "text-blue-600", icon: Globe },
  { name: "Apple", tier: "MAANG", difficulty: "High", color: "text-gray-600", icon: Smartphone },
  { name: "Netflix", tier: "MAANG", difficulty: "Very High", color: "text-red-600", icon: Tv },
  { name: "Tesla", tier: "Tech", difficulty: "High", color: "text-red-500", icon: Zap },
  { name: "SpaceX", tier: "Tech", difficulty: "Very High", color: "text-karm-dark", icon: Zap },
  { name: "Uber", tier: "Tech Giant", difficulty: "High", color: "text-karm-dark", icon: Truck },
  { name: "Airbnb", tier: "Tech Giant", difficulty: "High", color: "text-rose-500", icon: Building2 },
  { name: "Stripe", tier: "Fintech", difficulty: "High", color: "text-indigo-500", icon: DollarSign },
  { name: "Goldman Sachs", tier: "Finance", difficulty: "High", color: "text-yellow-600", icon: DollarSign },
  { name: "Adobe", tier: "Product", difficulty: "Medium", color: "text-red-500", icon: PenTool },
  { name: "Salesforce", tier: "Product", difficulty: "Medium", color: "text-blue-500", icon: Cloud },
  { name: "TCS", tier: "Service", difficulty: "Low", color: "text-blue-600", icon: Building2 },
  { name: "Infosys", tier: "Service", difficulty: "Low", color: "text-blue-600", icon: Building2 },
  { name: "Custom", tier: "Any", difficulty: "Varied", color: "text-karm-dark", icon: Search }
];

const INTERVIEW_CATEGORIES: { id: InterviewCategory, label: string, icon: any, desc: string }[] = [
  { id: 'Warm Up', label: 'Warm Up', icon: Coffee, desc: 'Casual intro & ice-breakers' },
  { id: 'Non Technical', label: 'Non Technical', icon: Users, desc: 'Soft skills & communication' },
  { id: 'Coding', label: 'Coding', icon: Code, desc: 'DSA, Logic & Problem Solving' },
  { id: 'Programming', label: 'Programming', icon: Terminal, desc: 'Language internals & syntax' },
  { id: 'Role Related', label: 'Role Related', icon: Briefcase, desc: 'Specific to job description' },
  { id: 'Technical', label: 'Technical', icon: Cpu, desc: 'Deep dive into tech stack' },
  { id: 'Behavioral', label: 'Behavioral', icon: Brain, desc: 'STAR method scenarios' },
  { id: 'HR', label: 'HR', icon: MessageCircle, desc: 'Culture fit & salary' },
];

const InterviewSetup: React.FC<SetupProps> = ({ onStart }) => {
  const [role, setRole] = useState("Software Engineer");
  const [subRole, setSubRole] = useState("Frontend Engineer");
  const [experience, setExperience] = useState("0");
  const [company, setCompany] = useState("Google");
  const [customCompany, setCustomCompany] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [mode, setMode] = useState<InterviewMode>(InterviewMode.VOICE);
  const [category, setCategory] = useState<InterviewCategory>('Technical');
  
  const [resumeSource, setResumeSource] = useState<'UPLOAD' | 'PROFILE'>('PROFILE');
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const storedUser = localStorage.getItem('nexus_mock_users');
  const allUsers = storedUser ? JSON.parse(storedUser) : [];
  const token = localStorage.getItem('nexus_token');
  const userId = token ? token.replace('mock-jwt-token-', '') : '';
  const currentUser = allUsers.find((u: any) => u.id === userId);
  const profileResumes = currentUser?.resumes || [];

  const currentRoleData = ROLES_DATA[role];
  const currentSubRoleData = currentRoleData?.subRoles[subRole] || { stack: [], tools: [] };

  const handleStart = () => {
    onStart({
      role,
      subRole,
      experience,
      company: company === 'Custom' ? customCompany : company,
      techStack: currentSubRoleData.stack,
      tools: currentSubRoleData.tools,
      mode,
      category,
      resumeContext: resumeText || undefined
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
          setIsProcessing(false);
        };
        reader.readAsText(file);
    } catch (err) {
      console.error("File parsing failed", err);
      alert("Failed to parse file.");
      setIsProcessing(false);
    }
  };

  const handleProfileResumeSelect = (content: string, name: string) => {
    setResumeText(content);
    setFileName(name);
  };

  const filteredCompanies = COMPANIES.filter(c => 
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-karm-light overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Mic2 className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Mock <span className="text-karm-gold">Interview</span></h1>
            <div className="h-8 w-px bg-karm-sage mx-2 hidden md:block"></div>
            <p className="text-xs text-karm-muted font-mono hidden md:block">INITIALIZE SIMULATION</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 relative">
        <div className="p-8 space-y-12">
        
          {/* 1. Role Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-karm-dark font-mono text-sm uppercase tracking-widest font-bold">
              <Layers className="w-4 h-4 text-karm-dark" /> <span>Select Class</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {Object.entries(ROLES_DATA).map(([key, data]) => {
                const Icon = data.icon;
                const isSelected = role === key;
                return (
                  <button 
                    key={key}
                    onClick={() => { setRole(key); setSubRole(Object.keys(data.subRoles)[0]); }}
                    className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                      isSelected 
                      ? 'bg-karm-dark text-white border-karm-dark shadow-lg scale-105' 
                      : 'bg-white border-karm-sage text-karm-muted hover:bg-gray-50 hover:border-karm-gold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-karm-gold' : 'text-gray-400'}`} />
                    <span className="whitespace-nowrap font-medium">{key}</span>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(currentRoleData.subRoles).map(([key, data]) => {
                  const isSelected = subRole === key;
                  return (
                    <div 
                      key={key}
                      onClick={() => setSubRole(key)}
                      className={`relative cursor-pointer group rounded-xl p-6 border transition-all duration-300 overflow-hidden shadow-sm ${
                        isSelected 
                        ? 'bg-karm-dark border-karm-dark text-white shadow-xl transform scale-[1.02]' 
                        : 'bg-white border-karm-sage hover:border-karm-gold/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4 relative z-10">
                          <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-karm-dark'}`}>{key}</h3>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-karm-gold animate-pulse"></div>}
                      </div>

                      <div className="space-y-4 relative z-10">
                        <div className="space-y-1.5">
                            <p className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>Core Stack</p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.stack.slice(0, 4).map(s => (
                                <span key={s} className={`text-xs px-2.5 py-1 rounded border ${isSelected ? 'bg-white/10 border-white/20 text-karm-gold' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>{s}</span>
                              ))}
                              {data.stack.length > 4 && <span className={`text-xs px-2 py-1 ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>+{data.stack.length - 4}</span>}
                            </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </section>

          {/* 2. Experience Level */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-karm-dark font-mono text-sm uppercase tracking-widest font-bold">
              <Star className="w-4 h-4 text-karm-dark" /> <span>Experience Level</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {EXPERIENCE_LEVELS.map((exp) => {
                const isSelected = experience === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    className={`relative p-4 rounded-xl border text-sm font-bold transition-all ${
                        isSelected 
                        ? 'bg-karm-dark text-white border-karm-dark shadow-lg transform scale-105' 
                        : 'bg-white border-karm-sage text-karm-muted hover:bg-gray-50'
                    }`}
                  >
                    <span className="relative z-10">{exp.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 3. Company Target */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-karm-dark font-mono text-sm uppercase tracking-widest font-bold">
                  <Globe className="w-4 h-4 text-karm-dark" /> <span>Target Company</span>
                </div>
            </div>
            
            <div className="relative group max-w-md">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-karm-gold transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter companies..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="w-full bg-white border border-karm-sage rounded-xl py-3 pl-10 pr-4 text-karm-dark focus:outline-none focus:border-karm-dark transition-all shadow-sm placeholder:text-gray-400"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCompanies.map((c) => {
                const isSelected = company === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setCompany(c.name)}
                    className={`group p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[120px] ${
                        isSelected 
                        ? 'bg-karm-dark border-karm-dark text-white shadow-lg transform scale-[1.02]' 
                        : 'bg-white border-karm-sage hover:border-karm-gold/50'
                    }`}
                  >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/10 text-karm-gold' : 'bg-gray-100 text-gray-500'}`}>
                            <c.icon className="w-5 h-5" />
                        </div>
                        {isSelected && <Award className="w-4 h-4 text-karm-gold" />}
                      </div>
                      
                      <div>
                        <span className={`font-bold block mb-1 text-lg ${isSelected ? 'text-white' : 'text-karm-dark'}`}>{c.name}</span>
                        {c.name !== 'Custom' && (
                          <div className="flex items-center gap-2 text-[10px] uppercase font-mono mt-1">
                              <span className={`${isSelected ? 'text-gray-300' : 'text-gray-500'} font-bold`}>{c.tier}</span>
                              <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-gray-500' : 'bg-gray-300'}`}></span>
                              <span className={`${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>{c.difficulty}</span>
                          </div>
                        )}
                      </div>
                  </button>
                )
              })}
            </div>
            
            {company === 'Custom' && (
              <div className="animate-fade-in max-w-md">
                <input 
                  type="text" 
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="Enter Custom Company Name..."
                  className="w-full bg-white border border-karm-sage rounded-lg px-4 py-3 focus:border-karm-gold outline-none text-karm-dark font-mono shadow-sm"
                />
              </div>
            )}
          </section>

          {/* 4. Interview Focus / Category */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-karm-dark font-mono text-sm uppercase tracking-widest font-bold">
              <Cpu className="w-4 h-4 text-karm-dark" /> <span>Interview Focus</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {INTERVIEW_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`group p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col min-h-[100px] ${
                        isSelected 
                        ? 'bg-karm-dark border-karm-dark text-white shadow-lg transform scale-105' 
                        : 'bg-white border-karm-sage hover:bg-gray-50'
                    }`}
                  >
                      <div className="flex justify-between items-start mb-3">
                        <cat.icon className={`w-5 h-5 ${isSelected ? 'text-karm-gold' : 'text-gray-400'}`} />
                        {isSelected && <CheckCircle className="w-4 h-4 text-karm-gold" />}
                      </div>
                      
                      <div>
                        <span className={`font-bold block text-sm ${isSelected ? 'text-white' : 'text-karm-dark'}`}>{cat.label}</span>
                        <span className={`text-[10px] mt-1 block leading-tight ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>{cat.desc}</span>
                      </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 5. Resume Context (Optional) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-karm-dark font-mono text-sm uppercase tracking-widest font-bold">
                  <FileText className="w-4 h-4 text-karm-dark" /> <span>Resume Context (Optional)</span>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button onClick={() => setResumeSource('PROFILE')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${resumeSource === 'PROFILE' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>From Profile</button>
                  <button onClick={() => setResumeSource('UPLOAD')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${resumeSource === 'UPLOAD' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Upload New</button>
                </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-karm-sage bg-white shadow-sm">
                {resumeSource === 'PROFILE' ? (
                  <div>
                    {profileResumes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {profileResumes.map((res: any) => {
                            const isSelected = fileName === res.name;
                            return (
                              <div 
                                key={res.id} 
                                onClick={() => handleProfileResumeSelect(res.textContent, res.name)}
                                className={`p-4 rounded-xl border cursor-pointer flex items-center gap-4 transition-all ${isSelected ? 'bg-karm-dark border-karm-dark shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                              >
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/10 text-karm-gold' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-karm-dark'}`}>{res.name}</div>
                                    <div className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>Uploaded {res.uploadedAt}</div>
                                  </div>
                                  {isSelected && <CheckCircle className="w-5 h-5 text-karm-gold ml-auto" />}
                              </div>
                            )
                          })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No resumes found in profile.</p>
                          <button onClick={() => setResumeSource('UPLOAD')} className="text-karm-gold underline font-bold mt-2">Upload one now</button>
                        </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <label className={`flex items-center gap-2 px-6 py-3 border rounded-xl cursor-pointer transition-colors ${isProcessing ? 'bg-gray-100 border-gray-300 cursor-wait' : 'bg-white border-karm-sage hover:bg-gray-50'}`}>
                          {isProcessing ? <Loader2 className="w-5 h-5 text-karm-gold animate-spin" /> : <Upload className="w-5 h-5 text-gray-500" />}
                          <span className="text-sm font-bold text-karm-dark">{isProcessing ? 'Processing...' : 'Upload File'}</span>
                          <input 
                            type="file" 
                            accept=".txt,.md,.pdf,.docx" 
                            onChange={handleFileChange} 
                            disabled={isProcessing}
                            className="hidden" 
                          />
                        </label>
                        {fileName && !isProcessing && (
                          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                            <FileCheck className="w-4 h-4" /> {fileName}
                          </div>
                        )}
                    </div>
                    
                    <textarea 
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Or paste your resume content here..."
                      className="w-full h-40 bg-gray-50 border border-karm-sage rounded-xl p-4 text-sm text-karm-dark focus:border-karm-dark outline-none resize-none"
                      disabled={isProcessing}
                    />
                  </div>
                )}
            </div>
          </section>

        </div>
      </div>

      {/* 6. Mode Selection & Start (Sticky Bottom) */}
      <div className="h-24 bg-white border-t border-karm-sage flex items-center justify-between px-6 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl">
              <button onClick={() => setMode(InterviewMode.VOICE)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === InterviewMode.VOICE ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-karm-dark'}`}>
                  Voice
              </button>
              <button onClick={() => setMode(InterviewMode.MCQ)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === InterviewMode.MCQ ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-karm-dark'}`}>
                  MCQ
              </button>
              <button onClick={() => setMode(InterviewMode.DESCRIPTIVE)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === InterviewMode.DESCRIPTIVE ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500 hover:text-karm-dark'}`}>
                  Descriptive
              </button>
          </div>

          <button 
            onClick={handleStart}
            className="px-12 py-4 bg-karm-dark text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#1F2130] transition-all group shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span>Launch Simulation</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
      </div>

    </div>
  );
};

export default InterviewSetup;
