"use client"
import React, { useEffect, useState } from "react";
import GlobalApi from "../_services/GlobalApi";
import { toast } from "sonner";

function CourseSelection({ selectedCourse, onCourseChange, courseList, id }) {
  return (
    <div className="relative">
      <select
        id={id}
        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
        value={selectedCourse}
        onChange={(e) => onCourseChange(e.target.value)}
      >
        <option value="">Select Course</option>
        {Array.isArray(courseList) &&
          courseList.map((course) => (
            <option key={course.id} value={course.name} className="dark:bg-slate-950">
              {course.name}
            </option>
          ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
};

export default CourseSelection;
