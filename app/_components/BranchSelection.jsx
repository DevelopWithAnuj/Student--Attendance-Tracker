"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "../_services/GlobalApi";
import { toast } from "sonner";

function BranchSelection({ selectedBranch, onBranchChange, branchList, id }) {
  return (
    <div className="relative">
      <select
        id={id}
        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
        value={selectedBranch}
        onChange={(e) => onBranchChange(e.target.value)}
      >
        <option value="">Select Branch</option>
        {Array.isArray(branchList) &&
          branchList.map((branch) => (
            <option key={branch.id} value={branch.name} className="dark:bg-slate-950">
              {branch.name}
            </option>
          ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
}

export default BranchSelection;
