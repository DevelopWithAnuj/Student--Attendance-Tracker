"use client"
import React, { useEffect, useState } from "react";
import GlobalApi from "../_services/GlobalApi";
import { toast } from "sonner";

function CourseSelection({ selectedCourse, onCourseChange, courseList }) {
  return (
    <div className="">
      <select
        id="course"
        className="col-span-3 border p-2 rounded-lg"
        value={selectedCourse}
        onChange={(e) => onCourseChange(e.target.value)}
      >
        <option value="">Select Course</option>
        {Array.isArray(courseList) &&
          courseList.map((course) => (
            <option key={course.id} value={course.name}>
              {course.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default CourseSelection;
