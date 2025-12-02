
import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Shield, Tag } from 'lucide-react';
import { PlanType } from '../types';

interface PricingProps {
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
}

const Pricing: React.FC<PricingProps> = ({ currentPlan, onUpgrade }) => {
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    const checkCookies = () => {
        try {
            const stored = localStorage.getItem('karmguru_cookie_consent');
            if (stored) {
                setMarketingEnabled(JSON.parse(stored).marketing);
            }
        } catch { setMarketingEnabled(false); }
    };
    checkCookies();
    window.addEventListener('cookie_consent_updated', checkCookies);
    return () => window.removeEventListener('cookie_consent_updated', checkCookies);
  }, []);

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Upgrade <span className="text-karm-gold">Plan</span></h1>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
        <div className="max-w-6xl mx-auto text-center space-y-12">
            
            {marketingEnabled && (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in shadow-lg">
                    <div className="flex items-center gap-2 font-bold text-lg"><Tag className="w-5 h-5 fill-current" /> SPECIAL OFFER: 50% OFF ELITE PLAN</div>
                    <div className="text-sm bg-white/20 px-3 py-1 rounded-lg">Use Code: KARM50</div>
                </div>
            )}

            <div className="space-y-4">
            <h2 className="text-4xl font-bold text-karm-dark">Unlock Your <span className="text-karm-gold">Full Potential</span></h2>
            <p className="text-karm-muted max-w-xl mx-auto">Choose a plan that fits your career goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FREE PLAN */}
            <div className="glass-panel p-8 rounded-3xl border border-karm-sage/50 flex flex-col relative overflow-hidden hover:border-karm-gold/50 transition-all bg-white hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>
                <h3 className="text-xl font-bold text-gray-500 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-karm-dark mb-6">$0<span className="text-lg text-gray-400 font-normal">/mo</span></div>
                <div className="space-y-4 mb-8 text-left flex-1">
                {["3 AI Mock Interviews / mo", "Basic Code Lab Access", "Limited Exam Questions"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600"><div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><Check className="w-3 h-3"/></div>{feat}</div>
                ))}
                </div>
                <button disabled={currentPlan === 'FREE'} className="w-full py-3 rounded-xl border border-karm-sage/50 font-bold text-karm-muted hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {currentPlan === 'FREE' ? 'Current Plan' : 'Downgrade'}
                </button>
            </div>

            {/* PRO PLAN */}
            <div className="glass-panel p-8 rounded-3xl border border-karm-gold flex flex-col relative overflow-hidden transform scale-105 shadow-2xl shadow-karm-gold/10 bg-white">
                <div className="absolute top-0 left-0 w-full h-1 bg-karm-gold"></div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-karm-gold text-karm-dark text-xs font-bold rounded-full">POPULAR</div>
                <h3 className="text-xl font-bold text-karm-dark mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-karm-gold"/> Pro</h3>
                <div className="text-4xl font-bold text-karm-dark mb-6">$19<span className="text-lg text-gray-400 font-normal">/mo</span></div>
                <div className="space-y-4 mb-8 text-left flex-1">
                {["Unlimited AI Interviews", "Full Code Lab & AI Hints", "Advanced Exam Analytics", "Career Roadmap + Skill Gap"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-karm-dark"><div className="w-5 h-5 rounded-full bg-karm-gold flex items-center justify-center text-karm-dark"><Check className="w-3 h-3 font-bold"/></div>{feat}</div>
                ))}
                </div>
                <button onClick={() => onUpgrade('PRO')} disabled={currentPlan === 'PRO' || currentPlan === 'ELITE'} className="w-full py-3 rounded-xl bg-karm-gold font-bold text-karm-dark hover:shadow-lg transition-all disabled:opacity-50 hover:bg-[#8e9fa3]">
                {currentPlan === 'PRO' ? 'Current Plan' : currentPlan === 'ELITE' ? 'Included in Elite' : 'Upgrade to Pro'}
                </button>
            </div>

            {/* ELITE PLAN */}
            <div className="glass-panel p-8 rounded-3xl border border-karm-sage flex flex-col relative overflow-hidden hover:border-karm-dark/50 transition-all bg-white hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-karm-dark"></div>
                <h3 className="text-xl font-bold text-karm-dark mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-karm-dark"/> Elite</h3>
                <div className="text-4xl font-bold text-karm-dark mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <div className="space-y-4 mb-8 text-left flex-1">
                {["Everything in Pro", "1-on-1 Human Mentorship", "Resume Review & Fix", "Placement Referrals"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600"><div className="w-5 h-5 rounded-full bg-karm-dark text-white flex items-center justify-center"><Check className="w-3 h-3"/></div>{feat}</div>
                ))}
                </div>
                <button onClick={() => onUpgrade('ELITE')} disabled={currentPlan === 'ELITE'} className="w-full py-3 rounded-xl bg-karm-dark font-bold text-white hover:shadow-lg transition-all disabled:opacity-50 hover:bg-[#1F2130]">
                {currentPlan === 'ELITE' ? 'Current Plan' : 'Get Elite Access'}
                </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
