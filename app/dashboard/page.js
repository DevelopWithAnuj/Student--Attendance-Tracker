"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import MonthSelection from "../_components/MonthSelection";
import CourseSelection from "../_components/CourseSelection";
import BranchSelection from "../_components/BranchSelection";
import YearSelection from "../_components/YearSelection";
import GlobalApi from "../_services/GlobalApi";
import moment from "moment";
import StatusList from "./_components/StatusList";
import BarChartComponent from "./_components/BarChartComponent";

const Dashboard = () => {
  const { setTheme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Initialize with current date
  const [selectedCourse, setSelectedCourse] = useState(""); // Initialize with empty string
  const [selectedBranch, setSelectedBranch] = useState(""); // Initialize with empty string
  const [selectedYear, setSelectedYear] = useState(""); // Initialize with empty string

  const [courseList, setCourseList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState({});

  useEffect(() => {
    setTheme("light");
    fetchAllDropdownData(); // Fetch initial dropdown data
  }, []);

  const fetchAllDropdownData = async () => {
    setLoading(true); // Set loading true during data fetch
    try {
      const coursesResp = await GlobalApi.GetAllCourses();
      const coursesData = coursesResp.data?.result;
      if (Array.isArray(coursesData) && coursesData.length > 0) {
        setCourseList(coursesData);
        setSelectedCourse(coursesData[0].name);
      } else {
        setCourseList([]);
        setSelectedCourse("");
      }

      const branchesResp = await GlobalApi.GetAllBranches();
      const branchesData = branchesResp.data?.result;
      if (Array.isArray(branchesData) && branchesData.length > 0) {
        setBranchList(branchesData);
        setSelectedBranch(branchesData[0].name);
      } else {
        setBranchList([]);
        setSelectedBranch("");
      }

      const yearsResp = await GlobalApi.GetAllYears();
      const yearsData = yearsResp.data?.result;
      if (Array.isArray(yearsData) && yearsData.length > 0) {
        setYearList(yearsData);
        setSelectedYear(yearsData[0].value);
      } else {
        setYearList([]);
        setSelectedYear("");
      }
    } catch (error) {
      console.error("Error fetching dropdown data for Dashboard:", error);
    } finally {
      setLoading(false); // Set loading false after fetch
    }
  };

  const getStudentAttendance = () => {
    setLoading(true); // Set loading true before attendance fetch
    GlobalApi.GetAttendanceList(
      selectedCourse,
      selectedBranch,
      selectedYear,
      moment(selectedMonth).format("MM/YYYY"),
    )
      .then((resp) => {
        console.log(resp);
        setAttendanceList(resp.data.result);
      })
      .catch((error) => {
        console.error("Error fetching attendance data for Dashboard:", error);
        setAttendanceList([]); // Clear attendance on error
      })
      .finally(() => {
        setLoading(false); // Set loading false after fetch
      });
  };

  const GetDashboardSummary = () => {
    GlobalApi.GetDashboardSummary(
      selectedCourse,
      selectedBranch,
      selectedYear,
      moment(selectedMonth).format("MM/YYYY"),
    )
      .then((resp) => {
        console.log(resp);
        setDashboardSummary(resp.data.result);
      })
      .catch((error) => {
        console.error("Error fetching dashboard summary data:", error);
        setDashboardSummary({});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (
      selectedBranch !== "" &&
      selectedCourse !== "" &&
      selectedYear !== "" &&
      selectedMonth
    ) {
      getStudentAttendance();
      GetDashboardSummary();
    }
  }, [selectedMonth, selectedBranch, selectedCourse, selectedYear]);

  return (
    <div className="p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-bold text-2xl">Dashboard</h2>

        <div className="flex flex-wrap items-center gap-4">
          <MonthSelection
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <CourseSelection
            courseList={courseList}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
          />
          <BranchSelection
            branchList={branchList}
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
          />
          <YearSelection
            yearList={yearList}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center p-5 text-lg">
          Loading Attendance Data...
        </div>
      ) : (
        // Render StatusList component
        <StatusList attendanceList={attendanceList} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2">
          <BarChartComponent attendance={attendanceList} />
        </div>
        <div>
          {/* This div is empty, can be removed if not used for other content */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
