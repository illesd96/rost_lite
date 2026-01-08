import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'Kosár' },
  { id: 2, label: 'Számlázás' },
  { id: 3, label: 'Ütemezés' }
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  // Calculate width for the colored line
  // If step 2, we need 50%. If step 3, we need 100%.
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-5 animate-fade-in">
      <div className="relative flex justify-between items-center">
        
        {/* Background Line (Gray) */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />

        {/* Active Line (Green) */}
        <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
        />

        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-[3px]
                  ${isActive 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-110 shadow-emerald-200' 
                    : isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-gray-100 text-gray-300'
                  }
                `}
              >
                {isCompleted ? <Check size={14} strokeWidth={4} /> : step.id}
              </div>
              
              <div className={`absolute top-10 text-[9px] font-black uppercase tracking-widest transition-colors duration-500 whitespace-nowrap
                ${isActive ? 'text-emerald-800' : isCompleted ? 'text-emerald-600' : 'text-gray-300'}
              `}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
