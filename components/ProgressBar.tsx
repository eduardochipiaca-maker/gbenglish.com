import React from 'react';

interface Props {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<Props> = ({ completed, total }) => {
  const percentage = Math.min(100, Math.round((completed / total) * 100));

  return (
    <div className="w-full bg-slate-800 rounded-full h-4 mb-6 relative overflow-hidden">
      <div 
        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
        {percentage}% FLUENT
      </span>
    </div>
  );
};