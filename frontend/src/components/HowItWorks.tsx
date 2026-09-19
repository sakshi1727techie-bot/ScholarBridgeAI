import React from 'react';
import { STEPS } from '../data';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              STREAMLINED ONBOARDING FLOW
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              How It Works
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>8 Seamless Steps to Full Funding</span>
          </div>
        </div>

        {/* 8 Step Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {STEPS.map((step, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === STEPS.length - 1;

            return (
              <div
                key={idx}
                id={`step-card-${step.number}`}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Step Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                        isFirst
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : isLast
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
