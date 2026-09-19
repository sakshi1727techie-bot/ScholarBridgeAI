import React from 'react';
import { Brain, ShieldCheck, FileCheck, Hourglass } from 'lucide-react';
import { FEATURES } from '../data';

interface FeaturesProps {
  onFeatureSelect?: (title: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onFeatureSelect }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-5 h-5 text-indigo-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-purple-600" />;
      case 'Hourglass':
      default:
        return <Hourglass className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return 'bg-indigo-50 border-indigo-100';
      case 'ShieldCheck':
        return 'bg-blue-50 border-blue-100';
      case 'FileCheck':
        return 'bg-purple-50 border-purple-100';
      case 'Hourglass':
      default:
        return 'bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <section id="features" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-100">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              AUTONOMOUS INTELLIGENCE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Engineered for Precision Matching
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
            Replace tedious manual searches with automated vector search, dynamic
            eligibility filters, and cryptographic transcript validation.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              id={`feature-card-${idx}`}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl ${getIconBg(
                    feat.iconName
                  )} border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}
                >
                  {getIcon(feat.iconName)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onFeatureSelect?.(feat.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group-hover:underline"
                >
                  <span>{feat.linkText}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
