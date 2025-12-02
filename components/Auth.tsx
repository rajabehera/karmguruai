
import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Mail, User as UserIcon, ArrowRight, Cpu, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let user: User;
      if (isLogin) {
        user = await api.auth.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        user = await api.auth.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-karm-light">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-karm-gold/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-karm-sage/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="glass-panel p-8 rounded-2xl border border-karm-sage/50 shadow-2xl relative overflow-hidden bg-white/90">
          {/* Top Glow Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-karm-gold via-karm-sage to-karm-gold"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-karm-dark rounded-xl mx-auto flex items-center justify-center mb-4 shadow-xl">
              <Cpu className="w-8 h-8 text-karm-gold" />
            </div>
            <h2 className="text-3xl font-bold text-karm-dark mb-2">Nexus<span className="text-karm-gold">AI</span></h2>
            <p className="text-karm-muted text-sm">
              {isLogin ? 'Authenticate to access the neural core.' : 'Initialize new candidate profile.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {!isLogin && (
              <div className="group">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-karm-gold transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-karm-sage/30 rounded-xl py-3 pl-10 pr-4 text-karm-dark focus:outline-none focus:border-karm-gold focus:ring-1 focus:ring-karm-gold/50 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}
            
            <div className="group">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-karm-gold transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Identity"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-karm-sage/30 rounded-xl py-3 pl-10 pr-4 text-karm-dark focus:outline-none focus:border-karm-gold focus:ring-1 focus:ring-karm-gold/50 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-karm-gold transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Access Key (Password)"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-50 border border-karm-sage/30 rounded-xl py-3 pl-10 pr-12 text-karm-dark focus:outline-none focus:border-karm-gold focus:ring-1 focus:ring-karm-gold/50 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-karm-dark transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-2 bg-karm-dark text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 hover:bg-[#1F2130]"
            >
              {loading ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                <>
                  {isLogin ? 'Secure Login' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-karm-muted hover:text-karm-gold transition-colors underline"
            >
              {isLogin ? "New user? Initialize registration." : "Already have ID? Login."}
            </button>
          </div>

          {!isLogin && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-karm-sage/30">
              <div className="flex items-center gap-2 text-xs text-karm-dark font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-karm-gold" /> <span>Free Tier Includes:</span>
              </div>
              <ul className="text-xs text-gray-500 space-y-1 ml-6 list-disc">
                <li>3 AI Mock Interviews / Month</li>
                <li>Basic Exam Prep Questions</li>
                <li>Career Roadmap Generator</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
