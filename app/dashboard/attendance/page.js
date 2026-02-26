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
import { LucideHand, SearchIcon, SquareArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "sonner";
import DailyAttendanceModal from "./_components/DailyAttendanceModal";

function Attendance() {
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceList, setAttendanceList] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [yearList, setYearList] = useState([]);

  const onSearchHandler = async () => {
    const month = moment(selectedMonth).format("MM/YYYY");
    
    if (selectedCourse === "All" || selectedBranch === "All" || selectedYear === "All") {
      toast.info("Select specific Course, Branch, and Year for full features.");
    }

    setLoading(true);

    try {
      const attendanceResponse = await GlobalApi.GetAttendanceList(
        selectedCourse === "All" ? null : selectedCourse,
        selectedBranch === "All" ? null : selectedBranch,
        selectedYear === "All" ? null : selectedYear,
        month,
      );
      setAttendanceList(attendanceResponse.data.result);

      const studentsResponse = await GlobalApi.GetAllStudents(
        selectedBranch === "All" ? null : selectedBranch,
        selectedCourse === "All" ? null : selectedCourse,
        selectedYear === "All" ? null : selectedYear,
      );
      setAllStudents(studentsResponse.data.result);
    } catch (error) {
      console.error("Error in onSearchHandler:", error);
    } finally {
      setLoading(false);
    }
  };

  const onExportCsv = () => {
    const month = moment(selectedMonth).format("MM/YYYY");
    const url = `/api/attendance/export/csv?branch=${
      selectedBranch === "All" ? "" : selectedBranch
    }&course=${selectedCourse === "All" ? "" : selectedCourse}&year=${
      selectedYear === "All" ? "" : selectedYear
    }&month=${month}`;
    window.open(url, "_blank");
  };

  const onExportPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    const month = moment(selectedMonth).format("MMMM YYYY");
    
    doc.setFontSize(18);
    doc.text(`Student Attendance Report`, 14, 15);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Month: ${month}`, 14, 25);
    doc.text(`Course: ${selectedCourse} | Branch: ${selectedBranch} | Year: ${selectedYear}`, 14, 30);

    const daysInMonth = moment(selectedMonth).daysInMonth();
    const head = [["Student Name"]];
    for (let i = 1; i <= daysInMonth; i++) { head[0].push(i.toString()); }

    const body = allStudents.map((student) => {
      const row = [student.name];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = moment(selectedMonth).date(i).format("YYYY-MM-DD");
        const attendanceRecord = attendanceList.find(
          (att) => att.students.id === student.id && att.attendance.date === date
        );
        const statusMap = { 'Present': 'P', 'Absent': 'A', 'Late': 'L', 'On Leave': 'O', 'Holiday': 'H' };
        row.push(attendanceRecord ? statusMap[attendanceRecord.attendance.status] || '?' : "-");
      }
      return row;
    });

    autoTable(doc, {
      head: head,
      body: body,
      startY: 35,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`Attendance_${selectedCourse}_${selectedBranch}_${month}.pdf`);
  };

  const handleCourseChange = (value) => setSelectedCourse(value);

  useEffect(() => {
    fetchAllDropdownData();
  }, []);

  const fetchAllDropdownData = async () => {
    setLoading(true);
    try {
      const [coursesResp, branchesResp, yearsResp] = await Promise.all([
        GlobalApi.GetAllCourses(),
        GlobalApi.GetAllBranches(),
        GlobalApi.GetAllYears()
      ]);

      const coursesData = coursesResp.data?.result;
      setCourseList(Array.isArray(coursesData) ? [{ name: "All", id: "all" }, ...coursesData] : [{ name: "All", id: "all" }]);

      const branchesData = branchesResp.data?.result;
      setBranchList(Array.isArray(branchesData) ? [{ name: "All", id: "all" }, ...branchesData] : [{ name: "All", id: "all" }]);

      const yearsData = yearsResp.data?.result;
      setYearList(Array.isArray(yearsData) ? [{ value: "All", id: "all" }, ...yearsData] : [{ value: "All", id: "all" }]);
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
    <div className="p-4 sm:p-6 lg:p-10 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-extrabold text-3xl tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LucideHand className="h-8 w-8 text-primary" />
            </div>
            Attendance Management
          </h2>
          <p className="text-muted-foreground mt-1 ml-13">Monitor and track student presence efficiently.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="shadow-sm border-slate-200" onClick={onExportCsv}>
            <SquareArrowDownIcon className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" className="shadow-sm border-slate-200" onClick={onExportPdf}>
            <SquareArrowDownIcon className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <DailyAttendanceModal 
            allStudents={allStudents}
            selectedBranch={selectedBranch}
            selectedCourse={selectedCourse}
            selectedYear={selectedYear}
            reFetchData={onSearchHandler}
          />
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Month</label>
            <MonthSelection
              selectedMonth={selectedMonth}
              onMonthChange={(value) => setSelectedMonth(value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Course</label>
            <CourseSelection
              courseList={courseList}
              selectedCourse={selectedCourse}
              onCourseChange={handleCourseChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Branch</label>
            <BranchSelection
              branchList={branchList}
              selectedBranch={selectedBranch}
              onBranchChange={(value) => setSelectedBranch(value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Year</label>
            <YearSelection
              yearList={yearList}
              selectedYear={selectedYear}
              onYearChange={(value) => setSelectedYear(value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-[500px] w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <StudentAttendanceGrid
            attendanceList={attendanceList}
            selectedMonth={selectedMonth}
            selectedBranch={selectedBranch}
            selectedCourse={selectedCourse}
            selectedYear={selectedYear}
            allStudents={allStudents}
            reFetchData={onSearchHandler}
          />
        </div>
      )}
    </div>
  );
}

export default Attendance;
