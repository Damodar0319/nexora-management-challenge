import React, { useState } from 'react';
import { GameBlock, BlockColor } from '../types/game';
import { DynamicIcon } from './DynamicIcon';
import { X, Sparkles, Plus } from 'lucide-react';
import { playClickSound, playSnapSound } from '../utils/sound';

interface CustomBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (block: GameBlock) => void;
}

export const CustomBlockModal: React.FC<CustomBlockModalProps> = ({
  isOpen,
  onClose,
  onAddBlock,
}) => {
  const [color, setColor] = useState<BlockColor>('red');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [principle, setPrinciple] = useState('');
  const [icon, setIcon] = useState('Sparkles');

  if (!isOpen) return null;

  const iconOptions = [
    'Crown', 'Zap', 'Flame', 'Target', 'Lightbulb', 'Sparkles', 
    'Rocket', 'Compass', 'Layers', 'Database', 'Shield', 'BarChart3',
    'HeartHandshake', 'GraduationCap', 'Leaf', 'Users', 'Trophy', 'Cpu'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBlock: GameBlock = {
      id: `custom-${Date.now()}`,
      color,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Custom Management Concept',
      description: 'Custom block defined for organizational building presentation.',
      icon,
      power: 20,
      principle: principle.trim() || 'Custom Strategic Principle',
      isCustom: true,
    };

    playSnapSound();
    onAddBlock(newBlock);
    onClose();
    setTitle('');
    setSubtitle('');
    setPrinciple('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-display">
                Create Custom Block
              </h3>
              <p className="text-xs text-slate-500">
                Design your own Red, Yellow, Blue, or Green block.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-2">
              Select Block Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => { playClickSound(); setColor('red'); }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all border-2 ${
                  color === 'red'
                    ? 'bg-red-500 text-white border-red-700 shadow-md scale-105'
                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                }`}
              >
                🔴 Red
              </button>

              <button
                type="button"
                onClick={() => { playClickSound(); setColor('yellow'); }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all border-2 ${
                  color === 'yellow'
                    ? 'bg-amber-400 text-slate-950 border-amber-600 shadow-md scale-105'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                🟡 Yellow
              </button>

              <button
                type="button"
                onClick={() => { playClickSound(); setColor('blue'); }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all border-2 ${
                  color === 'blue'
                    ? 'bg-blue-600 text-white border-blue-800 shadow-md scale-105'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
              >
                🔵 Blue
              </button>

              <button
                type="button"
                onClick={() => { playClickSound(); setColor('green'); }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all border-2 ${
                  color === 'green'
                    ? 'bg-emerald-600 text-white border-emerald-800 shadow-md scale-105'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                🟢 Green
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Block Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI-Assisted Operations"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Subtitle / Function
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Intelligent Workflow Automation"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Management Principle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Management Principle (EOM)
            </label>
            <input
              type="text"
              value={principle}
              onChange={(e) => setPrinciple(e.target.value)}
              placeholder="e.g. Socio-Technical Systems Design"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1.5">
              Select Icon
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-28 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
              {iconOptions.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                    icon === ic
                      ? 'bg-blue-600 text-white shadow-sm scale-110'
                      : 'hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <DynamicIcon name={ic} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Block To Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
