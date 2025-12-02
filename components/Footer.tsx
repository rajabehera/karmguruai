
import React from 'react';
import { Cpu, Twitter, Linkedin, Github, Globe } from 'lucide-react';
import { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-karm-dark text-white pt-16 pb-8 border-t border-white/10 mt-auto flex-shrink-0">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
               {/* Brand Column */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-karm-gold" />
                     </div>
                     <span className="text-xl font-bold tracking-tight">KarmGuru<span className="text-karm-gold">AI</span></span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Empowering careers with next-generation AI tools. Build your future with precision, confidence, and expert guidance.
                  </p>
                  <div className="flex gap-4 pt-2">
                     <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Twitter className="w-4 h-4"/></a>
                     <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Linkedin className="w-4 h-4"/></a>
                     <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Github className="w-4 h-4"/></a>
                  </div>
               </div>

               {/* Product Links */}
               <div>
                  <h4 className="font-bold text-white mb-6">Product</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                     <li><button onClick={() => onNavigate(View.LANDING)} className="hover:text-karm-gold transition-colors">Features</button></li>
                     <li><button onClick={() => onNavigate(View.PRICING)} className="hover:text-karm-gold transition-colors">Pricing</button></li>
                     <li><button onClick={() => onNavigate(View.AUTH)} className="hover:text-karm-gold transition-colors">Mock Interviews</button></li>
                     <li><button onClick={() => onNavigate(View.AUTH)} className="hover:text-karm-gold transition-colors">Resume Builder</button></li>
                  </ul>
               </div>

               {/* Company Links */}
               <div>
                  <h4 className="font-bold text-white mb-6">Company</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                     <li><button onClick={() => onNavigate(View.LANDING)} className="hover:text-karm-gold transition-colors">About Us</button></li>
                     <li><button onClick={() => onNavigate(View.CAREERS)} className="hover:text-karm-gold transition-colors">Careers</button></li>
                     <li><button onClick={() => onNavigate(View.BLOG)} className="hover:text-karm-gold transition-colors">Blog</button></li>
                     <li><button onClick={() => onNavigate(View.LANDING)} className="hover:text-karm-gold transition-colors">Contact</button></li>
                  </ul>
               </div>

               {/* Legal Links */}
               <div>
                  <h4 className="font-bold text-white mb-6">Legal</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                     <li><button onClick={() => onNavigate(View.PRIVACY)} className="hover:text-karm-gold transition-colors">Privacy Policy</button></li>
                     <li><button onClick={() => onNavigate(View.TERMS)} className="hover:text-karm-gold transition-colors">Terms & Conditions</button></li>
                     <li><button onClick={() => onNavigate(View.PRIVACY)} className="hover:text-karm-gold transition-colors">Cookie Policy</button></li>
                     <li><button onClick={() => onNavigate(View.TERMS)} className="hover:text-karm-gold transition-colors">Security</button></li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-gray-500 text-sm">© 2024 KarmGuruAI Inc. All rights reserved.</p>
               <div className="flex gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2"><Globe className="w-4 h-4"/> English (US)</span>
               </div>
            </div>
         </div>
      </footer>
  );
};

export default Footer;
