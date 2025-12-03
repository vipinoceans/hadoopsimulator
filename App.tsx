import React, { useState, useEffect, useRef } from 'react';
import { FlowStep } from './types';
import { STEPS } from './constants';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import ExplanationPanel from './components/ExplanationPanel';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>(FlowStep.INTRO);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 6000); // 6 seconds per slide for auto-play
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(FlowStep.INTRO);
    setIsPlaying(false);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-white overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm z-10 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">H</div>
            <h1 className="text-xl font-bold tracking-tight">Hadoop Ecosystem Simulator</h1>
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            React + Framer Motion
          </div>
        </header>

        {/* Canvas Area */}
        <main className="flex-1 p-6 relative overflow-hidden">
          <div className="w-full h-full relative">
             <SimulationCanvas step={currentStep} />
          </div>
        </main>

        {/* Footer / Controls */}
        <footer className="p-6 pt-0 z-10">
          <ControlPanel 
            currentStep={currentStep}
            totalSteps={STEPS.length}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
        </footer>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block w-96 h-full shadow-2xl z-20">
        <ExplanationPanel data={STEPS[currentStep]} />
      </aside>

      {/* Overlay for Mobile (simplified) */}
      <div className="lg:hidden absolute top-16 right-4 w-64 max-h-[40%] bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl overflow-y-auto z-30 pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
        <div className="p-4">
            <h3 className="font-bold text-sm text-blue-400 mb-1">{STEPS[currentStep].title}</h3>
            <p className="text-xs text-slate-300">{STEPS[currentStep].description}</p>
        </div>
      </div>

    </div>
  );
};

export default App;