import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = FolderOpen, 
  title = "No data found", 
  description = "There are no records to display at the moment.",
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed rounded-[32px] bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner mt-6 animate-in fade-in zoom-in duration-500">
      <div className="relative group mb-8">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
        <div className="relative bg-slate-50 dark:bg-slate-900 p-8 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-12 w-12 text-primary" />
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-[280px] font-medium leading-relaxed mb-10">
        {description}
      </p>
      
      {action && (
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
