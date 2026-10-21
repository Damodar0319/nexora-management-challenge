import React from 'react';
import { X, Trophy, Sparkles, Activity, Layers, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Game Guide & Principles
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
              How To Play & Finish The Game
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Objective */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <h3 className="font-extrabold text-sm text-blue-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blue-600" />
              The Mission: Finish The Block Structure
            </h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              Build a resilient, high-performing organization by placing colorful 3D blocks into the architectural structure blueprint. When you fill the structure, you trigger the victory celebration and detailed organizational evaluation!
            </p>
          </div>

          {/* The 4 Colors Explained */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              The 4 Core Color Pillars
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-black text-xs text-red-950 uppercase">🔴 Red: Leadership & Action</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  Focuses on executive vision, rapid execution sprints, crisis command, and goal alignment (Peter Drucker OKRs, Transformational Leadership).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="font-black text-xs text-amber-950 uppercase">🟡 Yellow: Innovation & Agility</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Drives disruptive ideation, agile squads, rapid prototyping, and AI adoption (Design Thinking, Lean Startup, Holacracy).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-black text-xs text-blue-950 uppercase">🔵 Blue: Operations & Systems</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Establishes lean operations, data intelligence, scalable architecture, and quality assurance (TQM, Six Sigma, Systems Theory).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-black text-xs text-emerald-950 uppercase">🟢 Green: People & Culture</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Nurtures psychological safety, continuous upskilling, holistic well-being, and ESG ethics (Amy Edmondson, McGregor Theory Y).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Quick Controls
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Drag & Drop</strong>: Drag any block from the inventory palette directly into an empty slot.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Click-to-Place</strong>: Click a block in the inventory, then click any empty slot to snap it in.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Auto-Fill Demo</strong>: Click "Auto-Fill Demo" to instantly populate a balanced structure for rapid classroom presentation.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Got It, Let's Build!
          </button>
        </div>
      </div>
    </div>
  );
};
