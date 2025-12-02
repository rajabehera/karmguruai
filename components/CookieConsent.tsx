
import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, ChevronDown, ChevronUp, Info, Lock, Activity, User, Zap } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    personalization: true,
    marketing: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('karmguru_cookie_consent');
    if (!consent) {
      // Small delay for animation effect
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const savePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem('karmguru_cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
    // Trigger event for immediate UI update in other components
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      personalization: true,
      marketing: true
    });
  };

  const handleDecline = () => {
    savePreferences({
      essential: true,
      analytics: false,
      personalization: false,
      marketing: false
    });
  };

  const handleSaveCustom = () => {
    savePreferences(prefs);
  };

  const togglePref = (key: keyof CookiePreferences) => {
    if (key === 'essential') return;
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto glass-panel p-6 rounded-2xl bg-white/95 border border-karm-sage shadow-2xl backdrop-blur-xl">
        
        {!showCustom ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-karm-gold" />
                <h3 className="text-lg font-bold text-karm-dark">We value your privacy</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                KarmGuruAI uses cookies to enhance your experience, personalize content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowCustom(true)}
                className="px-6 py-2.5 rounded-xl border border-karm-sage text-karm-dark font-bold text-sm hover:bg-gray-50 transition-all"
              >
                Customize
              </button>
              <button 
                onClick={handleDecline}
                className="px-6 py-2.5 rounded-xl border border-karm-sage text-karm-muted font-bold text-sm hover:bg-gray-50 transition-all"
              >
                Decline
              </button>
              <button 
                onClick={handleAcceptAll}
                className="px-8 py-2.5 rounded-xl bg-karm-dark text-white font-bold text-sm hover:bg-[#1F2130] shadow-lg transition-all"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-karm-dark flex items-center gap-2">
                <Shield className="w-5 h-5 text-karm-gold"/> Cookie Preferences
              </h3>
              <button onClick={() => setShowCustom(false)} className="text-gray-400 hover:text-karm-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Essential */}
              <div className="p-4 rounded-xl border border-karm-sage bg-gray-50 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg"><Lock className="w-4 h-4 text-gray-500"/></div>
                  <div>
                    <div className="font-bold text-sm text-karm-dark">Essential</div>
                    <div className="text-xs text-gray-500">Required for basic functionality</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-1 rounded">ALWAYS ON</div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-xl border border-karm-sage bg-white flex items-center justify-between hover:border-karm-gold transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${prefs.analytics ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Activity className="w-4 h-4"/>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-karm-dark">Analytics</div>
                    <div className="text-xs text-gray-500">Helps us improve our features</div>
                  </div>
                </div>
                <button 
                  onClick={() => togglePref('analytics')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${prefs.analytics ? 'bg-karm-dark' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${prefs.analytics ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Personalization */}
              <div className="p-4 rounded-xl border border-karm-sage bg-white flex items-center justify-between hover:border-karm-gold transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${prefs.personalization ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                    <User className="w-4 h-4"/>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-karm-dark">Personalization</div>
                    <div className="text-xs text-gray-500">Tailored job & roadmap suggestions</div>
                  </div>
                </div>
                <button 
                  onClick={() => togglePref('personalization')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${prefs.personalization ? 'bg-karm-dark' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${prefs.personalization ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Marketing */}
              <div className="p-4 rounded-xl border border-karm-sage bg-white flex items-center justify-between hover:border-karm-gold transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${prefs.marketing ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Zap className="w-4 h-4"/>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-karm-dark">Marketing</div>
                    <div className="text-xs text-gray-500">Exclusive offers & promotions</div>
                  </div>
                </div>
                <button 
                  onClick={() => togglePref('marketing')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${prefs.marketing ? 'bg-karm-dark' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${prefs.marketing ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={handleDecline}
                className="px-6 py-2.5 rounded-xl border border-karm-sage text-karm-muted font-bold text-sm hover:bg-gray-50"
              >
                Reject All
              </button>
              <button 
                onClick={handleSaveCustom}
                className="px-8 py-2.5 rounded-xl bg-karm-dark text-white font-bold text-sm hover:bg-[#1F2130] shadow-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
