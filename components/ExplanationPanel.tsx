import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepData } from '../types';

interface ExplanationPanelProps {
  data: StepData;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ data }) => {
  return (
    <div className="h-full bg-slate-800 border-l border-slate-700 p-6 shadow-2xl overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={data.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
          <div className="h-1 w-20 bg-blue-500 mb-6 rounded-full" />
          
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            {data.description}
          </p>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Key Details</h3>
            <ul className="space-y-3">
              {data.details.map((detail, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-start"
                >
                  <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 mr-3" />
                  <span className="text-slate-300 text-sm">{detail}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExplanationPanel;
