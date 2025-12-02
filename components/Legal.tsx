
import React from 'react';
import { ChevronLeft, Shield, FileText, Lock } from 'lucide-react';
import Footer from './Footer';
import { View } from '../types';

interface LegalProps {
  type: 'PRIVACY' | 'TERMS';
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const Legal: React.FC<LegalProps> = ({ type, onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-karm-light flex flex-col">
      <nav className="h-20 border-b border-karm-sage bg-white flex items-center px-6 md:px-12 sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-karm-dark hover:text-karm-gold font-bold transition-colors">
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
        <div className="max-w-4xl mx-auto py-16 px-6 flex-grow">
          <div className="glass-panel p-8 md:p-12 rounded-3xl bg-white border border-karm-sage shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-karm-gold to-karm-dark"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-karm-dark border border-gray-200">
                {type === 'PRIVACY' ? <Lock className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-karm-dark">
                  {type === 'PRIVACY' ? 'Privacy Policy' : 'Terms & Conditions'}
                </h1>
                <p className="text-karm-muted">Last Updated: October 24, 2024</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-karm-dark prose-headings:text-karm-dark prose-a:text-karm-gold hover:prose-a:text-karm-dark">
              {type === 'PRIVACY' ? (
                <>
                  <p>
                    At KarmGuruAI, we prioritize your privacy. This policy outlines how we collect, use, and protect your personal information when you use our AI-powered career platform.
                  </p>
                  <h3>1. Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, upload a resume, or interact with our AI services (Mock Interviews, Code Lab). This may include:
                  </p>
                  <ul>
                    <li>Contact information (Name, Email).</li>
                    <li>Professional details (Resume data, Skills, Experience).</li>
                    <li>Usage data (Interview transcripts, Code submissions).</li>
                  </ul>

                  <h3>2. How We Use Your Information</h3>
                  <p>
                    We use your data to provide and improve our services, including:
                  </p>
                  <ul>
                    <li>Generating personalized interview questions and feedback.</li>
                    <li>Matching you with relevant job opportunities.</li>
                    <li>Analyzing platform usage to enhance AI models.</li>
                  </ul>

                  <h3>3. Data Security</h3>
                  <p>
                    We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
                  </p>

                  <h3>4. Third-Party Services</h3>
                  <p>
                    We may use third-party services (e.g., Google Gemini API) to process data. These providers adhere to strict data protection standards.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Welcome to KarmGuruAI. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
                  </p>
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By creating an account, you confirm that you are at least 18 years old and legally capable of entering into binding contracts.
                  </p>

                  <h3>2. Use of Services</h3>
                  <p>
                    You agree to use KarmGuruAI only for lawful purposes. You must not:
                  </p>
                  <ul>
                    <li>Misuse our AI services to generate harmful content.</li>
                    <li>Attempt to reverse engineer our platform.</li>
                    <li>Share your account credentials with others.</li>
                  </ul>

                  <h3>3. AI Limitations</h3>
                  <p>
                    Our services leverage Generative AI. While we strive for accuracy, AI responses may occasionally be incorrect or misleading. You should verify critical information independently.
                  </p>

                  <h3>4. Subscription & Billing</h3>
                  <p>
                    Certain features require a paid subscription. You agree to pay all fees associated with your chosen plan. Refunds are subject to our Refund Policy.
                  </p>

                  <h3>5. Termination</h3>
                  <p>
                    We reserve the right to suspend or terminate your account if you violate these terms.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default Legal;
