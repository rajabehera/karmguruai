
import React, { useState } from 'react';
import { Cpu, Users, Zap, Globe, Shield, ArrowRight, Menu, X, Check, MapPin, Mail, Phone } from 'lucide-react';
import Footer from '../Footer';
import { View } from '../../types';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onNavigate: (view: View) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-karm-light text-karm-dark font-sans overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-karm-sage">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
                 <Cpu className="w-6 h-6 text-karm-gold" />
               </div>
               <span className="text-2xl font-bold tracking-tight text-karm-dark">KarmGuru<span className="text-karm-gold">AI</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
               <button onClick={() => scrollTo('services')} className="text-karm-muted hover:text-karm-dark transition font-medium">Services</button>
               <button onClick={() => scrollTo('about')} className="text-karm-muted hover:text-karm-dark transition font-medium">About</button>
               <button onClick={() => scrollTo('pricing')} className="text-karm-muted hover:text-karm-dark transition font-medium">Pricing</button>
               <button onClick={() => scrollTo('contact')} className="text-karm-muted hover:text-karm-dark transition font-medium">Contact</button>
            </div>

            <div className="hidden md:flex items-center gap-4">
               <button onClick={onLoginClick} className="text-karm-dark hover:text-karm-gold font-bold">Login</button>
               <button 
                 onClick={onRegisterClick}
                 className="px-6 py-2.5 bg-karm-dark text-white rounded-full font-bold hover:shadow-lg hover:bg-[#1F2130] transition-all"
               >
                 Get Started
               </button>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-karm-dark">
               {mobileMenuOpen ? <X /> : <Menu />}
            </button>
         </div>

         {/* Mobile Menu */}
         {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-karm-sage p-4 space-y-4 shadow-xl">
               <button onClick={() => scrollTo('services')} className="block w-full text-left py-2 px-4 hover:bg-gray-50 rounded text-karm-dark">Services</button>
               <button onClick={() => scrollTo('pricing')} className="block w-full text-left py-2 px-4 hover:bg-gray-50 rounded text-karm-dark">Pricing</button>
               <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 px-4 hover:bg-gray-50 rounded text-karm-dark">About</button>
               <button onClick={onLoginClick} className="block w-full text-left py-2 px-4 hover:bg-gray-50 rounded font-bold text-karm-gold">Login</button>
               <button onClick={onRegisterClick} className="block w-full text-left py-2 px-4 bg-karm-dark text-white rounded font-bold">Sign Up</button>
            </div>
         )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-karm-light flex-shrink-0">
         {/* Background Glows */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-karm-gold/20 rounded-full blur-[120px] pointer-events-none"></div>
         
         <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-karm-gold text-karm-dark text-sm font-bold mb-6 animate-fade-in shadow-sm">
               🚀 The Future of Career Acceleration
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in text-karm-dark">
               Master Your Career with <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-karm-dark to-karm-muted">AI Precision</span>
            </h1>
            <p className="text-xl text-karm-muted max-w-2xl mx-auto mb-10 animate-fade-in delay-100">
               KarmGuruAI acts as your personal career architect. From resume building to real-time mock interviews and job matching, we power your success.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
               <button 
                 onClick={onRegisterClick}
                 className="px-8 py-4 bg-karm-dark text-white rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-xl hover:bg-[#1F2130]"
               >
                 Start Free Trial <ArrowRight className="w-5 h-5"/>
               </button>
               <button onClick={() => scrollTo('services')} className="px-8 py-4 bg-white border border-karm-sage rounded-full font-bold text-lg hover:bg-gray-50 transition-all text-karm-dark shadow-sm">
                 Explore Services
               </button>
            </div>
         </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-karm-dark">Our <span className="text-karm-gold">Services</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { icon: Zap, title: "AI Mock Interviews", desc: "Practice with a voice-activated AI that mimics top companies like Google & Amazon." },
                  { icon: Globe, title: "Job Match Engine", desc: "Upload your resume and let our AI find the perfect roles tailored to your skills." },
                  { icon: Users, title: "Code Lab", desc: "Interactive coding environment with real-time AI debugging and hints." },
                  { icon: Shield, title: "Exam Prep", desc: "Targeted question banks for UPSC, JEE, and competitive exams." },
                  { icon: Cpu, title: "Career Roadmaps", desc: "Step-by-step guidance from school to your dream job designation." },
                  { icon: Globe, title: "Resume Builder", desc: "Create ATS-friendly resumes with AI-generated summaries." }
               ].map((s, i) => (
                  <div key={i} className="glass-panel p-8 rounded-2xl border border-karm-sage/50 hover:border-karm-gold transition-all group hover:shadow-xl bg-white">
                     <div className="w-12 h-12 bg-karm-light rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-karm-sage/20">
                        <s.icon className="w-6 h-6 text-karm-dark" />
                     </div>
                     <h3 className="text-xl font-bold mb-3 text-karm-dark">{s.title}</h3>
                     <p className="text-karm-muted">{s.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-karm-light">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl md:text-4xl font-bold mb-6 text-karm-dark">About <span className="text-karm-gold">KarmGuruAI</span></h2>
               <p className="text-karm-muted mb-6 leading-relaxed">
                  We believe that career guidance should be accessible, personalized, and data-driven. KarmGuruAI bridges the gap between ambition and achievement by leveraging cutting-edge Generative AI.
               </p>
               <p className="text-karm-muted mb-6 leading-relaxed">
                  Whether you are a student exploring paths, a graduate preparing for interviews, or a professional looking to switch careers, our platform adapts to your unique journey.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-karm-sage shadow-sm">
                     <div className="text-3xl font-bold text-karm-gold mb-1">50k+</div>
                     <div className="text-sm text-karm-muted">Users Empowered</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-karm-sage shadow-sm">
                     <div className="text-3xl font-bold text-karm-dark mb-1">1M+</div>
                     <div className="text-sm text-karm-muted">Questions Solved</div>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-karm-gold to-karm-sage rounded-3xl transform rotate-3 blur-sm opacity-20"></div>
               <div className="glass-panel p-8 rounded-3xl relative transform -rotate-3 border border-karm-sage/50 bg-white">
                  <div className="space-y-4">
                     <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                     <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                     <div className="h-32 bg-gray-50 rounded-xl mt-6 border border-gray-100 flex items-center justify-center">
                        <Cpu className="w-16 h-16 text-karm-gold" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-karm-dark">Simple <span className="text-karm-gold">Pricing</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="glass-panel p-8 rounded-2xl border border-karm-sage/50 bg-white shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-karm-muted mb-2">Free</h3>
                  <div className="text-4xl font-bold mb-6 text-karm-dark">$0</div>
                  <ul className="space-y-3 text-sm text-left mb-8 text-karm-muted">
                     <li className="flex gap-2"><Check className="w-4 h-4 text-karm-gold"/> 3 Mock Interviews</li>
                     <li className="flex gap-2"><Check className="w-4 h-4 text-karm-gold"/> Basic Resume Builder</li>
                  </ul>
                  <button onClick={onRegisterClick} className="w-full py-3 border border-karm-sage rounded-xl font-bold hover:bg-gray-50 text-karm-dark">Start Free</button>
               </div>
               
               <div className="glass-panel p-8 rounded-2xl border-2 border-karm-gold relative transform scale-105 shadow-2xl bg-white">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-karm-gold text-karm-dark text-xs font-bold px-3 py-1 rounded-b-lg">MOST POPULAR</div>
                  <h3 className="text-xl font-bold text-karm-dark mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-6 text-karm-dark">$19</div>
                  <ul className="space-y-3 text-sm text-left mb-8 text-karm-dark">
                     <li className="flex gap-2"><Check className="w-4 h-4 text-karm-gold"/> Unlimited Interviews</li>
                     <li className="flex gap-2"><Check className="w-4 h-4 text-karm-gold"/> AI Job Matching</li>
                     <li className="flex gap-2"><Check className="w-4 h-4 text-karm-gold"/> Full Code Lab</li>
                  </ul>
                  <button onClick={onRegisterClick} className="w-full py-3 bg-karm-gold text-karm-dark rounded-xl font-bold hover:opacity-90 hover:bg-[#8e9fa3]">Get Pro</button>
               </div>
               
               <div className="glass-panel p-8 rounded-2xl border border-karm-sage/50 bg-white shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-karm-muted mb-2">Elite</h3>
                  <div className="text-4xl font-bold mb-6 text-karm-dark">$49</div>
                  <ul className="space-y-3 text-sm text-left mb-8 text-karm-muted">
                     <li className="flex gap-2"><Check className="w-4 h-4 text-karm-gold"/> Everything in Pro</li>
                     <li className="flex gap-2"><Check className="w-4 h-4 text-karm-gold"/> Human Mentorship</li>
                  </ul>
                  <button onClick={onRegisterClick} className="w-full py-3 bg-karm-dark text-white rounded-xl font-bold hover:bg-[#1F2130] transition-all">Contact Sales</button>
               </div>
            </div>
         </div>
      </section>

      {/* Redesigned Contact Section */}
      <section id="contact" className="py-24 bg-karm-light relative overflow-hidden">
         {/* Decorative Blobs */}
         <div className="absolute -left-20 top-20 w-96 h-96 bg-karm-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute right-0 bottom-0 w-80 h-80 bg-karm-sage/20 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left Side: Info */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-karm-dark mb-4">Get in Touch</h2>
                        <p className="text-karm-muted text-lg leading-relaxed">
                            Have questions about our AI models or enterprise solutions? We're here to help you navigate your career journey.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-karm-sage flex items-center justify-center text-karm-gold shadow-sm">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-karm-dark text-lg">Chat to us</h4>
                                <p className="text-karm-muted text-sm">Our friendly team is here to help.</p>
                                <a href="mailto:support@karmguru.ai" className="text-karm-dark font-bold hover:text-karm-gold transition-colors">support@karmguru.ai</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-karm-sage flex items-center justify-center text-karm-gold shadow-sm">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-karm-dark text-lg">Visit us</h4>
                                <p className="text-karm-muted text-sm">Come say hello at our office HQ.</p>
                                <p className="text-karm-dark font-bold">100 Smith Street, Collingwood VIC 3066</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-karm-sage flex items-center justify-center text-karm-gold shadow-sm">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-karm-dark text-lg">Call us</h4>
                                <p className="text-karm-muted text-sm">Mon-Fri from 8am to 5pm.</p>
                                <p className="text-karm-dark font-bold">+1 (555) 000-0000</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="glass-panel p-8 rounded-3xl bg-white border border-karm-sage shadow-2xl">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500">First Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold focus:bg-white transition-all text-karm-dark" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Last Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold focus:bg-white transition-all text-karm-dark" placeholder="Doe" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                            <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold focus:bg-white transition-all text-karm-dark" placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Message</label>
                            <textarea className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-karm-gold focus:bg-white transition-all text-karm-dark resize-none" placeholder="Tell us how we can help..."></textarea>
                        </div>

                        <button className="w-full py-4 bg-karm-dark text-white rounded-xl font-bold text-lg hover:bg-[#1F2130] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                            Send Message <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
         </div>
      </section>

      {/* Enhanced Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
