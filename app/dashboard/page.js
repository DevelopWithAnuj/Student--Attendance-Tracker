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
import PieChartComponent from "./_components/PieChartComponent";
import TrendChartComponent from "./_components/TrendChartComponent";
import { LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

import { useNotifications } from "../_context/NotificationContext";

const Dashboard = () => {
  const { setTheme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Initialize with current date
  const [selectedCourse, setSelectedCourse] = useState("All"); // Initialize with "All"
  const [selectedBranch, setSelectedBranch] = useState("All"); // Initialize with "All"
  const [selectedYear, setSelectedYear] = useState("All"); // Initialize with "All"

  const [courseList, setCourseList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState({});
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchAllDropdownData(); // Fetch initial dropdown data
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (allStudents.length > 0 && attendanceList.length > 0) {
      const attendanceThreshold = 75; // 75%
      const studentAttendance = {};

      attendanceList.forEach((record) => {
        if (!studentAttendance[record.students.id]) {
          studentAttendance[record.students.id] = {
            present: 0,
            total: 0,
            name: record.students.name,
          };
        }
        studentAttendance[record.students.id].total++;
        if (record.attendance.present) {
          studentAttendance[record.students.id].present++;
        }
      });

      Object.keys(studentAttendance).forEach((studentId) => {
        const student = studentAttendance[studentId];
        const percentage = (student.present / student.total) * 100;
        if (percentage < attendanceThreshold) {
          addNotification({
            title: "Low Attendance Warning",
            message: `${student.name} has low attendance: ${percentage.toFixed(
              2,
            )}%`,
          });
        }
      });
    }
  }, [allStudents, attendanceList]);

  const fetchAllStudents = async () => {
    try {
      const studentsResponse = await GlobalApi.GetAllStudents(null, null, null);
      setAllStudents(studentsResponse.data.result);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const fetchAllDropdownData = async () => {
    setLoading(true); // Set loading true during data fetch
    try {
      const coursesResp = await GlobalApi.GetAllCourses();
      const coursesData = coursesResp.data?.result;
      if (Array.isArray(coursesData)) {
        setCourseList([{ name: "All", id: "all" }, ...coursesData]);
      } else {
        setCourseList([{ name: "All", id: "all" }]);
      }

      const branchesResp = await GlobalApi.GetAllBranches();
      const branchesData = branchesResp.data?.result;
      if (Array.isArray(branchesData)) {
        setBranchList([{ name: "All", id: "all" }, ...branchesData]);
      } else {
        setBranchList([{ name: "All", id: "all" }]);
      }

      const yearsResp = await GlobalApi.GetAllYears();
      const yearsData = yearsResp.data?.result;
      if (Array.isArray(yearsData)) {
        setYearList([{ value: "All", id: "all" }, ...yearsData]);
      } else {
        setYearList([{ value: "All", id: "all" }]);
      }
    } catch (error) {
      console.error(
        "Error fetching dropdown data for Dashboard:",
        error.response?.data?.details || error.message,
      );
    } finally {
      setLoading(false); // Set loading false after fetch
    }
  };

  const getStudentAttendance = () => {
    setLoading(true); // Set loading true before attendance fetch
    GlobalApi.GetAttendanceList(
      selectedCourse === "All" ? null : selectedCourse,
      selectedBranch === "All" ? null : selectedBranch,
      selectedYear === "All" ? null : selectedYear,
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
      selectedCourse === "All" ? null : selectedCourse,
      selectedBranch === "All" ? null : selectedBranch,
      selectedYear === "All" ? null : selectedYear,
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

  const getAttendanceTrend = () => {
    GlobalApi.GetAttendanceTrend(
      selectedCourse === "All" ? null : selectedCourse,
      selectedBranch === "All" ? null : selectedBranch,
      selectedYear === "All" ? null : selectedYear,
      moment(selectedMonth).format("MM/YYYY"),
    )
      .then((resp) => {
        console.log(resp);
        setTrendData(resp.data.result);
      })
      .catch((error) => {
        console.error("Error fetching trend data:", error);
        setTrendData([]);
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
      getAttendanceTrend();
    }
  }, [selectedMonth, selectedBranch, selectedCourse, selectedYear]);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-bold text-2xl align-middle flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
          Dashboard
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 items-center bg-background">
            <label htmlFor="month-select" className="text-foreground">
              Month:
            </label>
            <MonthSelection
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
          <div className="flex gap-2 items-center bg-background">
            <label htmlFor="course-select" className="text-foreground">
              Course:
            </label>
            <CourseSelection
              courseList={courseList}
              selectedCourse={selectedCourse}
              onCourseChange={setSelectedCourse}
            />
          </div>
          <div className="flex gap-2 items-center bg-background">
            <label htmlFor="branch-select" className="text-foreground">
              Branch:
            </label>
            <BranchSelection
              branchList={branchList}
              selectedBranch={selectedBranch}
              onBranchChange={setSelectedBranch}
            />
          </div>
          <div className="flex gap-2 items-center bg-background">
            <label htmlFor="year-select" className="text-foreground">
              Year:
            </label>
            <YearSelection
              yearList={yearList}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center p-5 text-lg text-muted-foreground">
          Loading Attendance Data...
        </div>
      ) : (
        // Render StatusList component
        <StatusList attendanceList={attendanceList} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2">
          <BarChartComponent attendance={attendanceList} />
        </div>
        <div className="md:col-span-1">
          <PieChartComponent attendance={attendanceList} />
        </div>
      </div>
      <div className="mt-4">
        <TrendChartComponent data={trendData} />
      </div>
    </div>
  );
};

export default Dashboard;
