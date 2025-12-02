
import React, { useState } from 'react';
import { ChevronRight, Mic, Briefcase, Code, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

interface OnboardingProps {
  userEmail: string;
  onComplete: () => void;
}

const STEPS = [
  {
    icon: Mic,
    title: "AI Interviews",
    desc: "Simulate real-world interviews with voice interaction. Choose from top companies like Google, Amazon, and more."
  },
  {
    icon: Briefcase,
    title: "Smart Job Search",
    desc: "Upload your resume and let our AI find the best job matches for your skills and experience."
  },
  {
    icon: Code,
    title: "Code Lab",
    desc: "Practice coding problems with an AI tutor that helps you debug and optimize your solutions."
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ userEmail, onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await api.user.completeOnboarding(userEmail);
      onComplete();
    }
  };

  const CurrentIcon = STEPS[step].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-karm-light p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-karm-gold/10 to-karm-sage/20"></div>
      
      <div className="glass-panel max-w-lg w-full p-8 rounded-3xl relative z-10 text-center animate-fade-in bg-white border border-karm-sage shadow-xl">
        <div className="flex justify-center mb-8">
           <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
              <CurrentIcon className="w-10 h-10 text-karm-gold" />
           </div>
        </div>

        <h2 className="text-3xl font-bold text-karm-dark mb-4">{STEPS[step].title}</h2>
        <p className="text-karm-muted text-lg mb-8 leading-relaxed">
          {STEPS[step].desc}
        </p>

        <div className="flex justify-center gap-2 mb-8">
           {STEPS.map((_, i) => (
             <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'w-6 bg-karm-dark' : 'bg-gray-300'}`}></div>
           ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full py-4 bg-karm-dark text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:bg-[#1F2130]"
        >
          {step === STEPS.length - 1 ? 'Get Started' : 'Next'} <ChevronRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
