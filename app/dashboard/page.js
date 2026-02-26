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
import { Skeleton } from "@/components/ui/skeleton";

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
  const [dashboardSummary, setDashboardSummary] = useState({});
  const { setBulkNotifications, clearNotifications } = useNotifications();

  // Loading states for each data fetch
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);

  // Overall loading state
  const overallLoading = dropdownLoading || studentsLoading || attendanceLoading || summaryLoading || trendLoading;

  useEffect(() => {
    fetchAllDropdownData(); // Fetch initial dropdown data
  }, []);

  useEffect(() => {
    
    if (
      !dropdownLoading &&
      selectedBranch !== "" &&
      selectedCourse !== "" &&
      selectedYear !== "" &&
      selectedMonth
    ) {
      clearNotifications(); // Clear bubbles immediately when options change
      fetchAllStudents();
      getStudentAttendance();
      GetDashboardSummary();
      getAttendanceTrend();
    }
  }, [selectedMonth, selectedBranch, selectedCourse, selectedYear, dropdownLoading]);

  useEffect(() => {
    // If we are still loading, don't calculate yet
    if (overallLoading) return;

    // If we have no students for the selected options, clear notifications
    if (allStudents.length === 0) {
      clearNotifications();
      return;
    }

    const attendanceThreshold = 75; // 75%
    const studentAttendance = {};
    const newAlerts = [];

    // Initialize all students
    allStudents.forEach(student => {
      studentAttendance[student.id] = {
        present: 0,
        late: 0,
        holiday: 0,
        total: 0,
        name: student.name,
      };
    });

    // Populate attendance data
    attendanceList.forEach((record) => {
      const studentId = record.students.id;
      if (studentAttendance[studentId]) {
        studentAttendance[studentId].total++;
        const status = record.attendance.status;
        if (status === 'Present') studentAttendance[studentId].present++;
        else if (status === 'Late') studentAttendance[studentId].late++;
        else if (status === 'Holiday') studentAttendance[studentId].holiday++;
      }
    });

    Object.keys(studentAttendance).forEach((studentId) => {
      const student = studentAttendance[studentId];
      const effectiveTotal = student.total - student.holiday;
      
      if (student.total === 0) {
        newAlerts.push({
          title: `No Attendance: ${student.name}`,
          message: "No attendance has been marked for this student this month.",
        });
      } else if (effectiveTotal > 0) {
        const percentage = ((student.present + student.late) / effectiveTotal) * 100;
        if (percentage < attendanceThreshold) {
          newAlerts.push({
            title: `Low Attendance: ${student.name}`,
            message: `${percentage.toFixed(1)}% attendance. (P:${student.present}, L:${student.late}, Total:${effectiveTotal})`,
          });
        }
      }
    });

    if (newAlerts.length > 0) {
      setBulkNotifications(newAlerts);
    } else {
      clearNotifications();
    }
  }, [allStudents, attendanceList, overallLoading]);

  const fetchAllStudents = async () => {
    setStudentsLoading(true);
    try {
      const studentsResponse = await GlobalApi.GetAllStudents(
        selectedBranch === "All" ? null : selectedBranch,
        selectedCourse === "All" ? null : selectedCourse,
        selectedYear === "All" ? null : selectedYear,
      );
      setAllStudents(studentsResponse.data.result);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch student list.");
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchAllDropdownData = async () => {
    setDropdownLoading(true);
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
      toast.error("Failed to fetch dropdown data.");
    } finally {
      setDropdownLoading(false);
    }
  };

  const getStudentAttendance = () => {
    setAttendanceLoading(true);
    GlobalApi.GetAttendanceList(
      selectedCourse === "All" ? null : selectedCourse,
      selectedBranch === "All" ? null : selectedBranch,
      selectedYear === "All" ? null : selectedYear,
      moment(selectedMonth).format("MM/YYYY"),
    )
      .then((resp) => {
        setAttendanceList(resp.data.result);
      })
      .catch((error) => {
        console.error("Error fetching attendance data for Dashboard:", error);
        toast.error("Failed to fetch attendance data.");
        setAttendanceList([]); // Clear attendance on error
      })
      .finally(() => {
        setAttendanceLoading(false);
      });
  };

  const GetDashboardSummary = () => {
    setSummaryLoading(true);
    GlobalApi.GetDashboardSummary(
      selectedCourse === "All" ? null : selectedCourse,
      selectedBranch === "All" ? null : selectedBranch,
      selectedYear === "All" ? null : selectedYear,
      moment(selectedMonth).format("MM/YYYY"),
    )
      .then((resp) => {
        setDashboardSummary(resp.data.result);
      })
      .catch((error) => {
        console.error("Error fetching dashboard summary data:", error);
        toast.error("Failed to fetch dashboard summary.");
        setDashboardSummary({});
      })
      .finally(() => {
        setSummaryLoading(false);
      });
  };

  const getAttendanceTrend = () => {
    setTrendLoading(true);
    GlobalApi.GetAttendanceTrend(
      selectedCourse === "All" ? null : selectedCourse,
      selectedBranch === "All" ? null : selectedBranch,
      selectedYear === "All" ? null : selectedYear,
      moment(selectedMonth).format("MM/YYYY"),
    )
      .then((resp) => {
        setTrendData(resp.data.result);
      })
      .catch((error) => {
        console.error("Error fetching trend data:", error);
        toast.error("Failed to fetch attendance trend.");
        setTrendData([]);
      })
      .finally(() => {
        setTrendLoading(false);
      });
  };

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
      {overallLoading ? (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="md:col-span-1">
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      ) : (
        <>
          <StatusList attendanceList={attendanceList} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
            <div className="md:col-span-2">
              <BarChartComponent attendance={attendanceList} />
            </div>
            <div className="md:col-span-1">
              <PieChartComponent attendance={attendanceList} />
            </div>
          </div>
          <div className="mt-4 md:col-span-1">
            <TrendChartComponent data={trendData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
