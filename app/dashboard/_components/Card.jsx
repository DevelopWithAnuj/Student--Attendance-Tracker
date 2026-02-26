import React from "react";

function Card({ icon, title, value, colorClass = "text-primary bg-primary/10" }) {
  return (
    <div className="group flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 duration-300">
      <div className={`flex items-center justify-center h-14 w-14 rounded-xl shadow-inner transition-transform group-hover:scale-110 duration-300 ${colorClass}`}>
        {React.cloneElement(icon, { className: "h-7 w-7" })}
      </div>
      <div className="space-y-1">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h2>
      </div>
    </div>
  );
}

export default Card;
