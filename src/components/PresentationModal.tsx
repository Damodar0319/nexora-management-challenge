import React from 'react';
import { X, Award, Users, Target, Lightbulb, ShieldCheck, Network, CheckCircle2 } from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel bg-nexora-900/95 border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono uppercase tracking-wider border border-cyan-500/40">
            <Award className="w-3.5 h-3.5" /> Essentials of Management Core Concept
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            What makes an organization ideal?
          </h2>
        </div>

        {/* Core Thesis Statement */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-teal-950/60 border border-cyan-500/40 text-cyan-100 font-medium text-base sm:text-lg leading-relaxed">
          &ldquo;An ideal organization balances <strong>people</strong>, <strong>performance</strong>, <strong>innovation</strong>, <strong>purpose</strong>, and <strong>effective teamwork</strong>.&rdquo;
        </div>

        {/* The 5 Pillars of Organizational Management */}
        <div className="space-y-2.5 text-sm">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
            Key Pillars of Organizational Success:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5">
              <Users className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">People:</strong>
                <p className="text-xs text-slate-400">Psychological safety, empowerment, motivation, and career growth.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5">
              <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Performance:</strong>
                <p className="text-xs text-slate-400">Goal clarity, objective metrics, productivity, and accountability.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Innovation:</strong>
                <p className="text-xs text-slate-400">Adaptability, experimentation, and resilience to market disruption.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Purpose & Ethics:</strong>
                <p className="text-xs text-slate-400">Moral integrity, sustainability, fairness, and long-term stakeholder value.</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5">
            <Network className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Structure & Teamwork:</strong>
              <p className="text-xs text-slate-400">Dismantling silos, open communication, and cross-functional synergy.</p>
            </div>
          </div>
        </div>

        {/* Concluding Takeaway */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-sm leading-relaxed italic border-l-4 border-l-cyan-400">
          &ldquo;An ideal organization is not one without problems, but one that manages its people, resources, and changes effectively.&rdquo;
        </div>

        {/* Modal Action */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
