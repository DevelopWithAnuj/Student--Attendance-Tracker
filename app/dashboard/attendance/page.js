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

function Attendance() {
  const [loading, setLoading] = useState(false);
  const onSearchHandler = async () => {
    console.log(selectedMonth, selectedBranch, selectedCourse, selectedYear);
    const month = moment(selectedMonth).format("MM/YYYY");
    console.log(month);
    setLoading(true);

    try {
      const attendanceResponse = await GlobalApi.GetAttendanceList(
        selectedCourse === "All" ? null : selectedCourse,
        selectedBranch === "All" ? null : selectedBranch,
        selectedYear === "All" ? null : selectedYear,
        month,
      );
      console.log(attendanceResponse.data);
      setAttendanceList(attendanceResponse.data.result);

      const studentsResponse = await GlobalApi.GetAllStudents(
        selectedBranch === "All" ? null : selectedBranch,
        selectedCourse === "All" ? null : selectedCourse,
        selectedYear === "All" ? null : selectedYear,
      );
      setAllStudents(studentsResponse.data.result);
    } catch (error) {
      console.error("Error in onSearchHandler:", error);
      // Optionally show a toast notification for error
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
    const doc = new jsPDF();
    const month = moment(selectedMonth).format("MMMM YYYY");
    doc.text(`Attendance for ${month}`, 14, 10);
    doc.text(`Branch: ${selectedBranch}`, 14, 16);
    doc.text(`Course: ${selectedCourse}`, 14, 22);
    doc.text(`Year: ${selectedYear}`, 14, 28);

    const daysInMonth = moment(selectedMonth).daysInMonth();
    const head = [["Student Name"]];
    for (let i = 1; i <= daysInMonth; i++) {
      head[0].push(i.toString());
    }

    const body = allStudents.map((student) => {
      const row = [student.name];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = moment(selectedMonth).date(i).format("YYYY-MM-DD");
        const attendanceRecord = attendanceList.find(
          (att) =>
            att.students.id === student.id && att.attendance.date === date,
        );
        row.push(
          attendanceRecord
            ? attendanceRecord.attendance.present
              ? "P"
              : "A"
            : "-",
        );
      }
      return row;
    });

    autoTable(doc, {
      head: head,
      body: body,
      startY: 35,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save("attendance.pdf");
  };

  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
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
    <div className="p-4 sm:p-6 md:p-10">
      <h2 className="font-bold text-2xl align-middle flex items-center gap-2">
        <LucideHand className="h-8 w-8 text-muted-foreground" />
        Attendance
      </h2>
      {/* {Search Option} */}

      <div className="flex flex-wrap gap-4 my-4 p-4 border rounded-lg shadow-sm">
        <div className="flex gap-2 items-center ">
          <label htmlFor="month-select" className="text-foreground">
            Select Month:
          </label>
          <MonthSelection
            id="month-select"
            selectedMonth={selectedMonth}
            onMonthChange={(value) => setSelectedMonth(value)} // Pass callback
          />
        </div>
        <div className="flex gap-2 items-center bg-background">
          <label htmlFor="course-select" className="text-foreground">
            Select Course:
          </label>
          <CourseSelection
            id="course-select"
            courseList={courseList}
            selectedCourse={selectedCourse}
            onCourseChange={handleCourseChange}
          />
        </div>
        <div className="flex gap-2 items-center bg-background">
          <label htmlFor="branch-select" className="text-foreground">
            Select Branch:
          </label>
          <BranchSelection
            id="branch-select"
            branchList={branchList}
            selectedBranch={selectedBranch}
            onBranchChange={(value) => setSelectedBranch(value)}
          />
        </div>
        <div className="flex gap-2 items-center bg-background">
          <label htmlFor="year-select" className="text-foreground">
            Select Year:
          </label>
          <YearSelection
            id="year-select"
            yearList={yearList}
            selectedYear={selectedYear}
            onYearChange={(value) => setSelectedYear(value)}
          />
        </div>
        <Button className="self-end" onClick={() => onSearchHandler()}>
        <SearchIcon className="h-4 w-4 mr-1" />
          Search
        </Button>
        <Button className="self-end" onClick={() => onExportCsv()}>
          <SquareArrowDownIcon className="h-4 w-4 mr-1" />
          Export to CSV
        </Button>
        <Button className="self-end" onClick={() => onExportPdf()}>
          <SquareArrowDownIcon className="h-4 w-4 mr-1" />
          Export to PDF
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-5 text-lg">
          Loading Attendance Data...
        </div>
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
