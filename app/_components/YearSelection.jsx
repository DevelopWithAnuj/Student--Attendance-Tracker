"use client"
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import GlobalApi from "../_services/GlobalApi";

function YearSelection({ selectedYear, onYearChange, yearList }) {
  return (
    <div className="">
      <select
        id="year"
        className="col-span-3 border p-2 rounded-lg"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option value="">Select Year</option>
        {Array.isArray(yearList) &&
          yearList.map((year) => (
            <option key={year.id} value={year.value}>
              {year.value}
            </option>
          ))}
      </select>
    </div>
  );
};

export default YearSelection;
