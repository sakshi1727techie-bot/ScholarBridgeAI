import React from 'react';
import { Sparkles, Compass, Cpu, ShieldCheck, BadgeCheck, Star } from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';

interface HeroProps {
  onOpenGetStarted: () => void;
  onOpenExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenGetStarted, onOpenExplore }) => {
  return (
    <section
      id="hero-section"
      className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 overflow-hidden"
    >
      {/* Premium Background Lighting & Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-400/12 rounded-full blur-3xl" />
        <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-sky-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Live Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 shadow-sm transition-all hover:bg-blue-100/80">
              <span className="flex items-center gap-0.5 text-blue-600">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold tracking-wide">
                  NEXT-GEN AI MATCHING ENGINE 3.0 • NOW LIVE
                </span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Unlock Your Future with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                AI-Powered
              </span>{' '}
              Scholarships
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Find verified scholarships, check eligibility instantly, upload
              documents securely, track applications, and receive personalized
              recommendations — all in one intelligent platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1 w-full sm:w-auto">
              <button
                id="hero-get-started-btn"
                onClick={onOpenGetStarted}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>Get Started</span>
              </button>

              <button
                id="hero-explore-btn"
                onClick={onOpenExplore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Explore Scholarships</span>
              </button>
            </div>

            {/* Feature Pills Row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-medium">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Powered</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secure</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-medium">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Providers</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Free Forever</span>
              </div>
            </div>

            {/* Social Proof Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Overlapping Avatars */}
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm">
                  E
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm">
                  M
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm">
                  A
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-[10px] flex items-center justify-center ring-2 ring-white shadow-sm">
                  +14k
                </div>
              </div>

              {/* Star Rating & Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Over <span className="font-bold text-slate-900">$42M+</span> in
                  scholarships unlocked for{' '}
                  <span className="font-bold text-slate-900">150k+</span>{' '}
                  students.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual / Carousel with Interior Floating Cards */}
          <div className="lg:col-span-5 w-full">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};
