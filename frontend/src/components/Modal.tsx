import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, Search, ShieldCheck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'auth' | 'explore' | 'feature';
  featureTitle?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'auth',
  featureTitle = '',
}) => {
  const [email, setEmail] = useState('');
  const [degreeLevel, setDegreeLevel] = useState('Undergraduate');
  const [major, setMajor] = useState('Computer Science & Engineering');
  const [simulatedMatch, setSimulatedMatch] = useState(false);

  if (!isOpen) return null;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulatedMatch(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {simulatedMatch ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                14 Scholarships Matched!
              </h3>
              <p className="text-sm text-slate-600">
                Based on your profile in <strong>{major}</strong> ({degreeLevel}
                ), our AI identified up to <strong>$68,000</strong> in eligible
                endowments with 99.4% alignment.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    Global STEM Leaders Endowment
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    $25,000
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    International Tech Scholars Grant
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    $18,500
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors cursor-pointer shadow-md shadow-blue-500/25"
              >
                Access Full Application Dossier
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>
                  {featureTitle ? featureTitle : 'ScholarBridge Match Engine'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                {initialMode === 'explore'
                  ? 'Explore Verified Scholarships'
                  : 'Start Your Free AI Evaluation'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Connect your academic parameters to simulate immediate endowment
                eligibility with zero risk.
              </p>

              <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Institution or Personal Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Degree Level
                    </label>
                    <select
                      value={degreeLevel}
                      onChange={(e) => setDegreeLevel(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>Undergraduate</option>
                      <option>Postgraduate / Masters</option>
                      <option>PhD / Doctoral</option>
                      <option>High School Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Target Discipline
                    </label>
                    <select
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>Computer Science & Engineering</option>
                      <option>Medicine & Health Sciences</option>
                      <option>Business & Economics</option>
                      <option>Environmental Sciences</option>
                      <option>Humanities & Social Arts</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Run Autonomous AI Matching</span>
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Free & FERPA-Compliant Encryption
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
