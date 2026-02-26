import React from 'react';

function AttendanceStatusSelect({ studentId, day, onAttendanceChange, initialStatus }) {
  const statusStyles = {
    'Present': 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 shadow-sm shadow-emerald-500/5',
    'Absent': 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 shadow-sm shadow-rose-500/5',
    'Late': 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 shadow-sm shadow-amber-500/5',
    'On Leave': 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 shadow-sm shadow-sky-500/5',
    'Holiday': 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 shadow-sm',
    '': 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-600 hover:border-primary/30'
  };

  const currentStyle = statusStyles[initialStatus] || statusStyles[''];

  const handleChange = (e) => {
    const value = e.target.value;
    onAttendanceChange(studentId, day, value === "" ? undefined : value);
  };

  return (
    <div className="flex items-center justify-center">
      <select
        value={initialStatus || ""}
        onChange={handleChange}
        className={`text-[11px] font-black border rounded-lg px-2.5 py-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none text-center min-w-[38px] ${currentStyle}`}
      >
        <option value="" className="bg-white dark:bg-slate-950 text-slate-400">-</option>
        <option value="Present" className="bg-emerald-50 text-emerald-700 dark:bg-slate-900 dark:text-emerald-400 font-bold">P</option>
        <option value="Absent" className="bg-rose-50 text-rose-700 dark:bg-slate-900 dark:text-rose-400 font-bold">A</option>
        <option value="Late" className="bg-amber-50 text-amber-700 dark:bg-slate-900 dark:text-amber-400 font-bold">L</option>
        <option value="On Leave" className="bg-sky-50 text-sky-700 dark:bg-slate-900 dark:text-sky-400 font-bold">O</option>
        <option value="Holiday" className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 font-bold">H</option>
      </select>
    </div>
  );
}

export default AttendanceStatusSelect;
