
import React, { useState } from 'react';
import { ResumeData } from '../types';
import { generateResumeSummary, enhanceResumeDescription } from '../services/gemini';
import { FileText, Wand2, Plus, Trash2, Download, Eye, Briefcase, GraduationCap, Sparkles, Layout } from 'lucide-react';

const ResumeBuilder: React.FC = () => {
  const [resume, setResume] = useState<ResumeData>({
    fullName: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 000-0000',
    role: 'Frontend Developer',
    summary: '',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    experience: [
      {
        id: '1',
        company: 'Tech Solutions Inc.',
        position: 'Junior Developer',
        duration: '2021 - Present',
        description: 'Built user interfaces using React. Fixed bugs and improved performance.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of Technology',
        degree: 'B.S. Computer Science',
        year: '2021'
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');
  const [exporting, setExporting] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    const summary = await generateResumeSummary(resume.role, resume.skills);
    setResume(prev => ({ ...prev, summary }));
    setLoading(false);
  };

  const handleEnhanceDescription = async (id: string, text: string) => {
    setLoading(true);
    const enhanced = await enhanceResumeDescription(text);
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, description: enhanced } : exp
      )
    }));
    setLoading(false);
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(),
        company: 'Company Name',
        position: 'Position',
        duration: 'Year - Year',
        description: 'Describe your responsibilities...'
      }]
    }));
  };

  const removeExperience = (id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        school: 'University Name',
        degree: 'Degree',
        year: 'Year'
      }]
    }));
  };

  const removeEducation = (id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const handleExportPDF = () => {
    // @ts-ignore
    if (typeof window === 'undefined' || !window.html2pdf) {
        alert("PDF generation library not loaded. Please refresh or check connection.");
        return;
    }

    setExporting(true);
    const element = document.getElementById('resume-preview');
    if (!element) return;
    
    const opt = {
      margin: 0,
      filename: `${resume.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(element).save().then(() => {
      setExporting(false);
    });
  };

  return (
    <div className="h-full flex flex-col bg-karm-light overflow-hidden">
      <div className="h-16 border-b border-karm-sage bg-white flex items-center justify-between px-6 z-10 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
               <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-karm-dark">AI Resume Builder</h1>
         </div>
         
         <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setActiveTab('EDITOR')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'EDITOR' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}
            >
              <Layout className="w-3 h-3" /> EDITOR
            </button>
            <button 
              onClick={() => setActiveTab('PREVIEW')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'PREVIEW' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-500'}`}
            >
              <Eye className="w-3 h-3" /> PREVIEW
            </button>
         </div>

         <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="p-2 px-4 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-900/20 disabled:opacity-50"
         >
            {exporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? 'Exporting...' : 'Export PDF'}
         </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
         <div className={`${activeTab === 'PREVIEW' ? 'hidden' : 'flex-1'} overflow-y-auto p-6 scrollbar-hide border-r border-karm-sage bg-gray-50`}>
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
               
               <section className="glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm">
                  <h3 className="text-lg font-bold text-karm-dark mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-500"/> Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase">Full Name</label>
                        <input type="text" value={resume.fullName} onChange={e => setResume({...resume, fullName: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark focus:border-pink-500 outline-none"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase">Target Role</label>
                        <input type="text" value={resume.role} onChange={e => setResume({...resume, role: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark focus:border-pink-500 outline-none"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase">Email</label>
                        <input type="text" value={resume.email} onChange={e => setResume({...resume, email: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark focus:border-pink-500 outline-none"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase">Phone</label>
                        <input type="text" value={resume.phone} onChange={e => setResume({...resume, phone: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark focus:border-pink-500 outline-none"/>
                     </div>
                  </div>
               </section>

               <section className="glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm relative group">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-karm-dark">Professional Summary</h3>
                     <button 
                       onClick={handleGenerateSummary}
                       disabled={loading}
                       className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:shadow-lg transition-all"
                     >
                       <Wand2 className="w-3 h-3" /> {loading ? 'Generating...' : 'AI Generate'}
                     </button>
                  </div>
                  <textarea 
                    value={resume.summary}
                    onChange={e => setResume({...resume, summary: e.target.value})}
                    placeholder="Briefly describe your professional background..."
                    className="w-full h-24 bg-white border border-gray-300 rounded-lg p-3 text-karm-dark focus:border-pink-500 outline-none resize-none"
                  />
               </section>

               <section className="space-y-4">
                  <div className="flex justify-between items-center">
                     <h3 className="text-lg font-bold text-karm-dark flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-500"/> Experience</h3>
                     <button onClick={addExperience} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-500 border border-gray-200"><Plus className="w-4 h-4"/></button>
                  </div>
                  
                  {resume.experience.map((exp) => (
                     <div key={exp.id} className="glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm relative">
                        <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <input type="text" value={exp.company} onChange={e => {
                              const newExp = resume.experience.map(x => x.id === exp.id ? {...x, company: e.target.value} : x);
                              setResume({...resume, experience: newExp});
                           }} className="bg-white border-b border-gray-300 p-2 text-karm-dark outline-none focus:border-blue-500" placeholder="Company"/>
                           <input type="text" value={exp.position} onChange={e => {
                              const newExp = resume.experience.map(x => x.id === exp.id ? {...x, position: e.target.value} : x);
                              setResume({...resume, experience: newExp});
                           }} className="bg-white border-b border-gray-300 p-2 text-karm-dark outline-none focus:border-blue-500" placeholder="Position"/>
                           <input type="text" value={exp.duration} onChange={e => {
                              const newExp = resume.experience.map(x => x.id === exp.id ? {...x, duration: e.target.value} : x);
                              setResume({...resume, experience: newExp});
                           }} className="bg-white border-b border-gray-300 p-2 text-karm-dark outline-none focus:border-blue-500 col-span-2" placeholder="Duration (e.g. 2021 - Present)"/>
                        </div>
                        <div className="relative">
                           <textarea 
                              value={exp.description}
                              onChange={e => {
                                 const newExp = resume.experience.map(x => x.id === exp.id ? {...x, description: e.target.value} : x);
                                 setResume({...resume, experience: newExp});
                              }}
                              className="w-full h-24 bg-white border border-gray-300 rounded-lg p-3 text-gray-600 focus:border-blue-500 outline-none resize-none text-sm"
                              placeholder="Job description..."
                           />
                           <button 
                             onClick={() => handleEnhanceDescription(exp.id, exp.description)}
                             className="absolute bottom-2 right-2 text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
                           >
                              <Wand2 className="w-3 h-3" /> AI Enhance
                           </button>
                        </div>
                     </div>
                  ))}
               </section>

               <section className="space-y-4">
                  <div className="flex justify-between items-center">
                     <h3 className="text-lg font-bold text-karm-dark flex items-center gap-2"><GraduationCap className="w-4 h-4 text-green-500"/> Education</h3>
                     <button onClick={addEducation} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-500 border border-gray-200"><Plus className="w-4 h-4"/></button>
                  </div>
                  
                  {resume.education.map((edu) => (
                     <div key={edu.id} className="glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm relative">
                        <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        <div className="grid grid-cols-2 gap-4">
                           <input type="text" value={edu.school} onChange={e => {
                              const newEdu = resume.education.map(x => x.id === edu.id ? {...x, school: e.target.value} : x);
                              setResume({...resume, education: newEdu});
                           }} className="bg-white border-b border-gray-300 p-2 text-karm-dark outline-none focus:border-green-500" placeholder="School / University"/>
                           
                           <input type="text" value={edu.degree} onChange={e => {
                              const newEdu = resume.education.map(x => x.id === edu.id ? {...x, degree: e.target.value} : x);
                              setResume({...resume, education: newEdu});
                           }} className="bg-white border-b border-gray-300 p-2 text-karm-dark outline-none focus:border-green-500" placeholder="Degree"/>
                           
                           <input type="text" value={edu.year} onChange={e => {
                              const newEdu = resume.education.map(x => x.id === edu.id ? {...x, year: e.target.value} : x);
                              setResume({...resume, education: newEdu});
                           }} className="bg-white border-b border-gray-300 p-2 text-karm-dark outline-none focus:border-green-500 col-span-2" placeholder="Year (e.g. 2021)"/>
                        </div>
                     </div>
                  ))}
               </section>

               <section className="glass-panel p-6 rounded-xl border border-karm-sage bg-white shadow-sm">
                  <h3 className="text-lg font-bold text-karm-dark mb-4">Skills</h3>
                  <textarea 
                     value={resume.skills.join(', ')}
                     onChange={e => setResume({...resume, skills: e.target.value.split(', ')})}
                     className="w-full bg-white border border-gray-300 rounded-lg p-3 text-karm-dark focus:border-pink-500 outline-none"
                     placeholder="Comma separated skills..."
                  />
               </section>

            </div>
         </div>

         <div className={`flex-1 bg-gray-200 p-8 overflow-y-auto ${activeTab === 'EDITOR' ? 'hidden md:block' : 'block'}`}>
            <div className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white text-black shadow-2xl p-12 relative" id="resume-preview">
               <header className="border-b-2 border-gray-800 pb-4 mb-6">
                  <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">{resume.fullName}</h1>
                  <p className="text-lg text-gray-600 font-medium mb-2">{resume.role}</p>
                  <div className="text-sm text-gray-500 flex gap-4">
                     <span>{resume.email}</span>
                     <span>|</span>
                     <span>{resume.phone}</span>
                  </div>
               </header>

               {resume.summary && (
                  <section className="mb-6">
                     <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 border-b pb-1">Professional Summary</h2>
                     <p className="text-sm leading-relaxed text-gray-700">{resume.summary}</p>
                  </section>
               )}

               <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b pb-1">Experience</h2>
                  <div className="space-y-4">
                     {resume.experience.map(exp => (
                        <div key={exp.id}>
                           <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold text-gray-900">{exp.position}</h3>
                              <span className="text-xs text-gray-500 font-medium">{exp.duration}</span>
                           </div>
                           <p className="text-sm text-gray-600 italic mb-1">{exp.company}</p>
                           <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b pb-1">Education</h2>
                  {resume.education.map(edu => (
                     <div key={edu.id} className="mb-2">
                        <div className="flex justify-between">
                           <h3 className="font-bold text-gray-900">{edu.school}</h3>
                           <span className="text-xs text-gray-500">{edu.year}</span>
                        </div>
                        <p className="text-sm text-gray-700">{edu.degree}</p>
                     </div>
                  ))}
               </section>

               <section>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b pb-1">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                     {resume.skills.map((skill, i) => (
                        <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold">{skill}</span>
                     ))}
                  </div>
               </section>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
