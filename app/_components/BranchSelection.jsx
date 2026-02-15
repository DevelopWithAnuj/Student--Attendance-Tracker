"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "../_services/GlobalApi";
import { toast } from "sonner";

function BranchSelection({ selectedBranch, onBranchChange, branchList, id }) {
  return (
    <div className="">
      <select
        id={id}
        className="col-span-3 border border-input p-2 rounded-lg bg-background text-foreground"
        value={selectedBranch}
        onChange={(e) => onBranchChange(e.target.value)}
      >
        <option value="">Select Branch</option>
        {Array.isArray(branchList) &&
          branchList.map((branch) => (
            <option key={branch.id} value={branch.name}>
              {branch.name}
            </option>
          ))}
      </select>
    </div>
  );
}

export default BranchSelection;
