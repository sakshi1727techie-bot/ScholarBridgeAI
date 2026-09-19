import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { CAROUSEL_IMAGES } from '../data';

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      id="hero-carousel-container"
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/12] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 border border-slate-200/90 bg-slate-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Lighting & Ambient Edge Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-slate-950/30 z-10 pointer-events-none" />

      {/* Cross-fading Image Layers (No Layout Shift) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={CAROUSEL_IMAGES[currentIndex].id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={CAROUSEL_IMAGES[currentIndex].url}
            alt={CAROUSEL_IMAGES[currentIndex].title}
            className="w-full h-full object-cover object-center"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Image Context Pill - Bottom Left */}
      <div className="absolute bottom-3 sm:bottom-4 left-4 z-20 hidden sm:block max-w-[55%] pointer-events-none">
        <div className="bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white shadow-lg">
          <p className="text-xs font-semibold truncate">
            {CAROUSEL_IMAGES[currentIndex].title}
          </p>
          <p className="text-[10px] text-slate-300 truncate">
            {CAROUSEL_IMAGES[currentIndex].subtitle}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FLOATING INFORMATION CARDS (ALL STRICTLY INSIDE THE IMAGE)   */}
      {/* ============================================================ */}

      {/* Card 1: 99.4% Match Accuracy (Moved completely INSIDE top-left) */}
      <motion.div
        id="match-accuracy-card"
        animate={{
          y: [-4, 5, -4],
          x: [-2, 3, -2],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xl shadow-slate-950/20 border border-white/90 flex items-center gap-2.5 sm:gap-3 cursor-default"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
          <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-blue-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-600"
              strokeDasharray="99.4, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
        <div>
          <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            99.4%
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
            Match Accuracy
          </div>
        </div>
      </motion.div>

      {/* Card 2: Top Right Live Status Tag (INSIDE top-right) */}
      <motion.div
        id="status-tag-card"
        animate={{
          y: [4, -4, 4],
          x: [2, -2, 2],
        }}
        transition={{
          duration: 5.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.8,
        }}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[11px] font-semibold flex items-center gap-2 border border-white/20 shadow-lg cursor-default"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="tracking-wide">AI Neural Search Active</span>
      </motion.div>

      {/* Card 3: Grant Approved (INSIDE bottom-right) */}
      <motion.div
        id="grant-approved-card"
        animate={{
          y: [5, -5, 5],
          x: [3, -2, 3],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
        className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-2xl shadow-slate-950/25 border border-white/90 max-w-[240px] sm:max-w-[270px] cursor-default"
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700">
            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Global STEM Endowment</span>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
            Instant
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 mb-0.5">
          <span>🎉</span>
          <span>
            Grant Approved: <span className="text-blue-600">$24,500</span>
          </span>
        </div>
        <p className="text-[10.5px] text-slate-500 line-clamp-1">
          Direct wire transfer verified to student bursar...
        </p>
      </motion.div>

      {/* Carousel Dots & Controls (Inside at bottom-center) */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
        {CAROUSEL_IMAGES.map((img, idx) => (
          <button
            key={img.id}
            id={`carousel-dot-${idx}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              idx === currentIndex
                ? 'w-6 bg-blue-500 shadow-sm shadow-blue-400'
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
