import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { TABS } from '../data';

export const WhyScholarBridge: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <section
      id="why-scholarbridge"
      className="py-14 sm:py-20 bg-slate-50/70 border-y border-slate-200/70 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            THE SCHOLARBRIDGE STANDARD
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-3">
            Why ScholarBridge AI
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Engineered to dismantle the friction in modern tertiary funding through
            sovereign AI pipelines and strict verification protocols.
          </p>
        </div>

        {/* Tab Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {tab.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-10 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Column: Semantic Info */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{activeTab.tag}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">
                  {activeTab.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {activeTab.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified sovereign neural checkpoint active</span>
                </div>
              </div>

              {/* Right Column: Algorithmic Metric Box */}
              <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {activeTab.confidenceLabel}
                  </span>
                  <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/70">
                    {activeTab.confidenceScore}
                  </span>
                </div>

                {/* Animated Progress Gauge */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '99.4%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
                  />
                </div>

                <p className="text-xs text-slate-500 leading-normal pt-1">
                  {activeTab.guaranteeText}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
