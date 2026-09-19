import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface CallToActionProps {
  onSuccessSubmit?: (email: string) => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onSuccessSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
    onSuccessSubmit?.(email);
  };

  return (
    <section id="cta-section" className="py-14 sm:py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-blue-50/90 via-sky-50/60 to-white border border-blue-100 shadow-2xl shadow-blue-900/10 p-8 sm:p-12 lg:p-16 text-center">
          {/* Subtle Ambient Glow Behind Card */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wider mb-6">
            <span>ZERO OBLIGATION • 100% FREE FOR STUDENTS</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Ready to find your scholarship?
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Join over 150,000 students using ScholarBridge AI to secure financial
            freedom for their higher education.
          </p>

          {/* Email Subscription Form */}
          {isSubmitted ? (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-semibold">
                Welcome to ScholarBridge! Your AI match dossier is generating.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-2.5 bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-slate-200 shadow-md"
            >
              <input
                type="email"
                id="cta-email-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your university or personal email..."
                className="w-full px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none rounded-xl sm:rounded-full"
              />
              <button
                type="submit"
                id="cta-submit-btn"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Compliance & Security Line */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              256-Bit TLS Encryption
            </span>
            <span>•</span>
            <span>Zero Spam Policy</span>
            <span>•</span>
            <span>FERPA & GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
};
