import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Modern Startup Mark: Interconnected Bridge + Neural Nexus */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 p-0.5 shadow-md shadow-blue-500/25 flex items-center justify-center transition-transform hover:scale-105 duration-200">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white"
          >
            {/* Hexagon/Shield frame */}
            <path
              d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
              stroke="white"
              strokeWidth="2.5"
              strokeLinejoin="round"
              fill="rgba(255, 255, 255, 0.08)"
            />
            {/* Bridge Arch & Cap Nexus */}
            <path
              d="M12 24C15 19 25 19 28 24"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M20 12V24"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="12" r="2.5" fill="white" />
            <circle cx="12" cy="24" r="1.5" fill="white" />
            <circle cx="28" cy="24" r="1.5" fill="white" />
          </svg>
        </div>
        {/* Subtle accent glow */}
        <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur-sm -z-10" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            ScholarBridge
          </span>
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI
          </span>
        </div>
        <span
          className={`text-[9.5px] sm:text-[10.5px] tracking-[0.2em] font-semibold uppercase ${
            isDark ? 'text-slate-400' : 'text-blue-600'
          }`}
        >
          AI Platform
        </span>
      </div>
    </div>
  );
};
