"use client";
import BranchSelection from "@/app/_components/BranchSelection";
import CourseSelection from "@/app/_components/CourseSelection";
import MonthSelection from "@/app/_components/MonthSelection";
import YearSelection from "@/app/_components/YearSelection";
import GlobalApi from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useState, useEffect } from "react";
import StudentAttendanceGrid from "./_components/StudentAttendanceGrid";

function Attendance() {
  const [loading, setLoading] = useState(false);
  const onSearchHandler = async () => {
    console.log(selectedMonth, selectedBranch, selectedCourse, selectedYear);
    const month = moment(selectedMonth).format("MM/YYYY");
    console.log(month);
    setLoading(true);

    try {
      const attendanceResponse = await GlobalApi.GetAttendanceList(
        selectedCourse, // Changed from selectedBranch
        selectedBranch, // Changed from selectedCourse
        selectedYear,
        month
      );
      console.log(attendanceResponse.data);
      setAttendanceList(attendanceResponse.data.result);

      const studentsResponse = await GlobalApi.GetAllStudents(
        selectedBranch,
        selectedCourse,
        selectedYear
      );
      setAllStudents(studentsResponse.data.result);
    } catch (error) {
      console.error("Error in onSearchHandler:", error);
      // Optionally show a toast notification for error
    } finally {
      setLoading(false);
    }
  };
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceList, setAttendanceList] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [yearList, setYearList] = useState([]);

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  useEffect(() => {
    fetchAllDropdownData();
  }, []);

  const fetchAllDropdownData = async () => {
    setLoading(true);
    try {
      const coursesResp = await GlobalApi.GetAllCourses();
      const coursesData = coursesResp.data?.result;
      if (Array.isArray(coursesData) && coursesData.length > 0) {
        setCourseList(coursesData);
        setSelectedCourse(coursesData[0].name);
      } else {
        setCourseList([]);
        setSelectedCourse(undefined);
      }

      const branchesResp = await GlobalApi.GetAllBranches();
      const branchesData = branchesResp.data?.result;
      if (Array.isArray(branchesData) && branchesData.length > 0) {
        setBranchList(branchesData);
        setSelectedBranch(branchesData[0].name);
      } else {
        setBranchList([]);
        setSelectedBranch(undefined);
      }

      const yearsResp = await GlobalApi.GetAllYears();
      const yearsData = yearsResp.data?.result;
      if (Array.isArray(yearsData) && yearsData.length > 0) {
        setYearList(yearsData);
        setSelectedYear(yearsData[0].value);
      } else {
        setYearList([]);
        setSelectedYear(undefined);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBranch && selectedCourse && selectedYear) {
      onSearchHandler();
    }
  }, [selectedMonth, selectedBranch, selectedCourse, selectedYear]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Attendance</h2>
      {/* {Search Option} */}

      <div className="flex gap-2 my-4 p-2 border rounded-lg shadow-sm">
        <div className="flex gap-2 items-center ">
          <label>Select Month:</label>
          <MonthSelection
            selectedMonth={selectedMonth}
            onMonthChange={(value) => setSelectedMonth(value)} // Pass callback
          />
        </div>
        <div className="flex gap-2 items-center ">
          <label>Select Course:</label>
          <CourseSelection
            courseList={courseList}
            selectedCourse={selectedCourse}
            onCourseChange={handleCourseChange}
          />
        </div>
        <div className="flex gap-2 items-center ">
          <label>Select Branch:</label>
          <BranchSelection
            branchList={branchList}
            selectedBranch={selectedBranch}
            onBranchChange={(value) => setSelectedBranch(value)}
          />
        </div>
        <div className="flex gap-2 items-center ">
          <label>Select Year:</label>
          <YearSelection
            yearList={yearList}
            selectedYear={selectedYear}
            onYearChange={(value) => setSelectedYear(value)}
          />
        </div>
        <Button onClick={() => onSearchHandler()}>Search</Button>
      </div>

      {loading ? (
        <div className="text-center p-5 text-lg">Loading Attendance Data...</div>
      ) : (
        <StudentAttendanceGrid
          attendanceList={attendanceList}
          selectedMonth={selectedMonth}
          selectedBranch={selectedBranch}
          selectedCourse={selectedCourse}
          selectedYear={selectedYear}
          allStudents={allStudents}
          reFetchData={onSearchHandler}
        />
      )}
    </div>
  );
}

export default Attendance;
