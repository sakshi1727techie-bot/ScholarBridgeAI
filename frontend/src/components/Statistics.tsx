import React from 'react';
import { GraduationCap, Users, ShieldCheck, Percent } from 'lucide-react';
import { STATS } from '../data';

export const Statistics: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Percent':
      default:
        return <Percent className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="statistics-section" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {STATS.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 sm:gap-4 ${
                  index !== 0 ? 'pt-4 lg:pt-0 lg:pl-8' : ''
                }`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                  {getIcon(item.iconName)}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
