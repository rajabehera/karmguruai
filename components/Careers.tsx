
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Clock, ArrowRight, Heart, Zap, Globe, Users, Upload, CheckCircle } from 'lucide-react';
import Footer from './Footer';
import { View } from '../types';

interface CareersProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const JOBS = [
  {
    id: 1,
    role: "Senior AI Engineer",
    department: "Engineering",
    location: "Remote / Bangalore",
    type: "Full-time",
    description: "We are looking for an expert in LLMs and generative AI to lead our core model development."
  },
  {
    id: 2,
    role: "Product Designer",
    department: "Design",
    location: "London, UK",
    type: "Full-time",
    description: "Shape the future of our user experience with a focus on intuitive, futuristic interfaces."
  },
  {
    id: 3,
    role: "Growth Marketing Manager",
    department: "Marketing",
    location: "New York, USA",
    type: "Full-time",
    description: "Drive user acquisition and brand awareness across global markets."
  },
  {
    id: 4,
    role: "Customer Success Lead",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Ensure our users get the most value out of KarmGuruAI's platform."
  }
];

const VALUES = [
  { icon: Heart, title: "Empathy First", desc: "We build for humans, helping them navigate stressful career moments with care." },
  { icon: Zap, title: "Move Fast", desc: "We iterate rapidly to bring the latest AI advancements to our users." },
  { icon: Globe, title: "Global Mindset", desc: "Talent is everywhere. We are building a diverse, remote-first team." },
  { icon: Users, title: "Transparency", desc: "We believe in open communication and honest feedback." }
];

const Careers: React.FC<CareersProps> = ({ onBack, onNavigate }) => {
  const [applyingJob, setApplyingJob] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [applyingJob, submitted]);

  const handleApply = (job: any) => {
    setApplyingJob(job);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-karm-light flex flex-col font-sans">
      <nav className="h-20 border-b border-karm-sage bg-white flex items-center px-6 md:px-12 sticky top-0 z-50">
        <button onClick={applyingJob ? () => setApplyingJob(null) : onBack} className="flex items-center gap-2 text-karm-dark hover:text-karm-gold font-bold transition-colors">
          <ChevronLeft className="w-5 h-5" /> {applyingJob ? 'Back to Careers' : 'Back to Home'}
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {applyingJob ? (
           <div className="max-w-3xl mx-auto py-16 px-6">
              {submitted ? (
                 <div className="text-center py-20 bg-white rounded-3xl border border-karm-sage shadow-lg">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-karm-dark mb-2">Application Received!</h2>
                    <p className="text-gray-500 mb-8">Thanks for applying to the <strong>{applyingJob.role}</strong> position.<br/>We will be in touch shortly.</p>
                    <button onClick={() => { setApplyingJob(null); setSubmitted(false); }} className="px-8 py-3 bg-karm-dark text-white rounded-full font-bold hover:bg-[#1F2130]">
                       Browse More Jobs
                    </button>
                 </div>
              ) : (
                 <div className="bg-white rounded-3xl border border-karm-sage shadow-lg p-8 md:p-12">
                    <div className="mb-8 border-b border-gray-100 pb-8">
                       <span className="text-xs font-bold text-karm-gold uppercase tracking-widest mb-2 block">{applyingJob.department}</span>
                       <h1 className="text-3xl font-bold text-karm-dark mb-2">Apply for {applyingJob.role}</h1>
                       <div className="flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {applyingJob.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {applyingJob.type}</span>
                       </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                             <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold text-karm-dark" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                             <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold text-karm-dark" />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                          <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold text-karm-dark" />
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Resume/CV</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-karm-gold transition-colors cursor-pointer bg-gray-50">
                             <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                             <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                             <p className="text-xs text-gray-400">PDF, DOCX up to 5MB</p>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Cover Letter (Optional)</label>
                          <textarea className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold text-karm-dark resize-none"></textarea>
                       </div>

                       <button type="submit" className="w-full py-4 bg-karm-dark text-white rounded-xl font-bold text-lg hover:bg-[#1F2130] transition-all shadow-lg">
                          Submit Application
                       </button>
                    </form>
                 </div>
              )}
           </div>
        ) : (
           <>
            {/* Hero */}
            <section className="py-24 px-6 text-center bg-white relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-karm-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
              <div className="max-w-4xl mx-auto relative z-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-karm-dark text-white text-xs font-bold mb-6 tracking-widest uppercase">We are Hiring</span>
                  <h1 className="text-5xl md:text-7xl font-bold text-karm-dark mb-8">Build the Future of <br/><span className="text-karm-gold">Career Development</span></h1>
                  <p className="text-xl text-karm-muted mb-10 max-w-2xl mx-auto">
                    Join a team of visionaries, engineers, and creatives passionate about democratizing career success through AI.
                  </p>
                  <button onClick={() => document.getElementById('roles')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-karm-dark text-white rounded-full font-bold hover:bg-[#1F2130] transition-all shadow-xl">
                    View Open Roles
                  </button>
              </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 bg-karm-light">
              <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-bold text-karm-dark mb-12 text-center">Our Core Values</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {VALUES.map((v, i) => (
                        <div key={i} className="glass-panel p-8 rounded-2xl bg-white border border-karm-sage text-center hover:-translate-y-1 transition-all hover:shadow-lg">
                          <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-karm-gold mb-6 border border-gray-100">
                              <v.icon className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-bold text-karm-dark mb-3">{v.title}</h3>
                          <p className="text-sm text-gray-500">{v.desc}</p>
                        </div>
                    ))}
                  </div>
              </div>
            </section>

            {/* Listings */}
            <section id="roles" className="py-24 px-6 bg-white">
              <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl font-bold text-karm-dark mb-12">Open Positions</h2>
                  <div className="space-y-4">
                    {JOBS.map(job => (
                        <div key={job.id} className="group p-6 rounded-2xl border border-karm-sage bg-white hover:border-karm-gold transition-all hover:shadow-md flex flex-col md:flex-row items-center gap-6">
                          <div className="flex-1">
                              <h3 className="text-xl font-bold text-karm-dark mb-2 group-hover:text-karm-gold transition-colors">{job.role}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {job.location}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {job.type}</span>
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold text-gray-600">{job.department}</span>
                              </div>
                              <p className="text-sm text-gray-400">{job.description}</p>
                          </div>
                          <button 
                            onClick={() => handleApply(job)}
                            className="px-6 py-2 rounded-full border border-karm-dark text-karm-dark font-bold hover:bg-karm-dark hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
                          >
                              Apply Now <ArrowRight className="w-4 h-4"/>
                          </button>
                        </div>
                    ))}
                  </div>
              </div>
            </section>
           </>
        )}
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default Careers;
