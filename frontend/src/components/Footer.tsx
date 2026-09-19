import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer id="footer-section" className="bg-[#080D1A] text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#" className="inline-block">
              <Logo variant="dark" />
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Autonomous scholarship discovery and matching intelligence.
              Connecting deserving students with global endowments and grants
              transparently.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>System Operational</span>
              </div>
            </div>
          </div>

          {/* Product Col */}
          <div className="lg:col-span-2 sm:col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  AI Match Engine
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Eligibility Checker
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Document Vault
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Real-time Webhooks
                </a>
              </li>
            </ul>
          </div>

          {/* Institutions Col */}
          <div className="lg:col-span-3 sm:col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Institutions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#why-scholarbridge" className="hover:text-white transition-colors">
                  Endowment Registry
                </a>
              </li>
              <li>
                <a href="#why-scholarbridge" className="hover:text-white transition-colors">
                  University Partners
                </a>
              </li>
              <li>
                <a href="#why-scholarbridge" className="hover:text-white transition-colors">
                  Grant Verification
                </a>
              </li>
              <li>
                <a href="#why-scholarbridge" className="hover:text-white transition-colors">
                  FERPA Attestation
                </a>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div className="lg:col-span-2 sm:col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ScholarBridge AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Security
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Accessibility
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
