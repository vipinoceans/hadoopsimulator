import React from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Pause } from 'lucide-react';
import { FlowStep } from '../types';

interface ControlPanelProps {
  currentStep: FlowStep;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  onReset,
  isPlaying,
  togglePlay
}) => {
  return (
    <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl">
      <div className="flex space-x-2">
        <button
          onClick={onReset}
          className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`p-2 rounded-full transition-colors ${
            currentStep === 0 ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-700 text-white'
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <span className="text-slate-300 font-mono text-sm">
          Step {currentStep} / {totalSteps - 1}
        </span>

        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className={`p-2 rounded-full transition-colors ${
            currentStep === totalSteps - 1 ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-700 text-white'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <button
        onClick={togglePlay}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
          isPlaying 
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
        }`}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
      </button>
    </div>
  );
};

export default ControlPanel;
