"use client";
import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import AttendanceStatusSelect from "./AttendanceStatusSelect";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_services/GlobalApi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Edit3Icon, UserSearch } from "lucide-react";
import EmptyState from "../../_components/EmptyState";

function StudentAttendanceGrid({
  attendanceList,
  selectedMonth,
  allStudents,
  selectedCourse,
  selectedBranch,
  selectedYear,
  reFetchData,
}) {
  console.log("attendanceList:", attendanceList);
  console.log("allStudents:", allStudents);
  const [attendance, setAttendance] = useState({});
  const { user } = useKindeBrowserClient();
  const getDaysInMonth = (date) => {
    return moment(date).daysInMonth();
  };

  const getDayOfMonth = (date) => {
    return parseInt(moment(date).format("D")); // Returns 1, 2, ..., 31
  };

  const daysInMonth = getDaysInMonth(selectedMonth);

  const [studentAttendance, setStudentAttendance] = useState({});
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Students per page

  useEffect(() => {
    console.log("attendanceList updated, processing:", attendanceList); // Debug log
    const newStudentAttendance = {};

    // Initialize with all students
    if (allStudents) {
      allStudents.forEach(student => {
        newStudentAttendance[student.id] = {
          student: student,
          attendance: {},
        };
      });
    }

    if (attendanceList) {
      console.log("attendanceList:", attendanceList); // Debug log

      attendanceList.forEach((record) => {
        if (record.students) {
          const studentId = record.students.id;
          if (newStudentAttendance[studentId]) { // Check if student exists in the new list
            const day = getDayOfMonth(record.attendance.date);
            newStudentAttendance[studentId].attendance[day] =
              record.attendance.status;
          }
        }
      });
    }
    setStudentAttendance(newStudentAttendance);
    console.log("newStudentAttendance (after set):", newStudentAttendance); // Debug log
  }, [attendanceList, selectedMonth, allStudents]);

  const onAttendanceChange = (studentId, day, status) => {
    setAttendance((prev) => {
      const newAttendance = { ...prev };
      if (!newAttendance[studentId]) {
        newAttendance[studentId] = {};
      }
      newAttendance[studentId][day] = status;
      return newAttendance;
    });
  };

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const today = moment().startOf("day"); // Get today's date, start of day for comparison

  const onSave = async () => {
    setLoading(true);
    const attendanceData = [];
    Object.keys(attendance).forEach((studentId) => {
      Object.keys(attendance[studentId]).forEach((day) => {
        const currentDayMoment = moment(selectedMonth).date(day).startOf("day");
        // Only save attendance for past or current days, NOT future days
        if (!currentDayMoment.isAfter(today, "day")) {
          const status = attendance[studentId][day];
          // Only push if there's a defined attendance state
          if (status !== undefined) {
            const date = currentDayMoment.format("YYYY-MM-DD");
            attendanceData.push({
              studentId: parseInt(studentId),
              status: status,
              day: parseInt(day),
              date: date,
            });
          }
        }
      });
    });

    if (attendanceData.length > 0) {
      GlobalApi.takeBulkAttendance(attendanceData)
        .then((resp) => {
          toast.success("Attendance saved successfully");
          console.log(resp);
          setAttendance({}); // Clear pending changes
          setIsEditing(false); // Exit edit mode
          reFetchData(); // Re-fetch to show saved data
        })
        .catch((err) => {
          toast.error("Error while saving attendance");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.info("No attendance changes for past/current days to save.");
      setLoading(false);
      setIsEditing(false);
    }
  };

  // Filter students based on filterText
  const filteredStudents = useMemo(() => {
    if (!filterText) {
      return allStudents;
    }
    return allStudents.filter((student) =>
      student.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [allStudents, filterText]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  const exportToCSV = () => {
    const headers = ["Student Name", ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)];
    const csvContent = [
      headers.join(","),
      ...paginatedStudents.map(student => {
        const row = [student.name];
        for (let day = 1; day <= daysInMonth; day++) {
          const recordedAttendance = studentAttendance[student.id]?.attendance[day];
          const pendingAttendance = attendance[student.id]?.[day];
          const displayStatus = pendingAttendance !== undefined ? pendingAttendance : recordedAttendance;
          row.push(displayStatus || "-");
        }
        return row.join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${moment(selectedMonth).format("YYYY_MM")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusDisplay = (status) => {
    if (!status) return <span className="text-muted-foreground/30">-</span>;
    
    const statusMap = {
      'Present': { label: 'P', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
      'Absent': { label: 'A', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
      'Late': { label: 'L', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
      'On Leave': { label: 'O', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
      'Holiday': { label: 'H', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400' },
    };

    const config = statusMap[status] || { label: '?', color: 'bg-gray-100 text-gray-700' };

    return (
      <div className={`w-6 h-6 rounded-full ${config.color} flex items-center justify-center mx-auto`}>
        <span className="text-xs font-bold">{config.label}</span>
      </div>
    );
  };

  return (
    <div>
      {/* Filter Input & Legend */}
      <div className="p-4 border-t border-x rounded-t-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Input
          id="student-filter"
          name="student-filter"
          type="text"
          placeholder="Filter students by name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        
        <div className="flex flex-wrap gap-3 items-center text-xs">
          <span className="font-bold text-muted-foreground mr-1 uppercase">Legend:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center font-bold">P</div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">A</div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center font-bold">L</div>
            <span>Late</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">O</div>
            <span>On Leave</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 flex items-center justify-center font-bold">H</div>
            <span>Holiday</span>
          </div>
        </div>
      </div>

      {/* Table Container with Force-Hidden Scrollbars */}
      <div className="overflow-hidden h-[500px] border rounded-lg shadow-sm bg-background">
        <div className="overflow-auto h-full w-full custom-scrollbar">
          <table className="min-w-full border-collapse">
            {/* Table Header */}
            <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur-sm border-b">
              <tr>
                {/* Sticky Corner Cell */}
                <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider sticky left-0 z-30 bg-muted/90 border-r min-w-[120px] sm:min-w-[200px]">
                  Student
                </th>
                {/* Date Cells */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const currentDayMoment = moment(selectedMonth)
                      .date(day)
                      .startOf("day");
                    const isPastDayHeader = currentDayMoment.isBefore(today);
                    const isFutureDayHeader = currentDayMoment.isAfter(today);
                    const isCurrentDayHeader = currentDayMoment.isSame(
                      today,
                      "day",
                    );
                    let headerClass = "text-muted-foreground";
                    if (isPastDayHeader || isFutureDayHeader) {
                      headerClass = "text-muted-foreground/60";
                    } else if (isCurrentDayHeader) {
                      headerClass = "font-extrabold text-blue-600 dark:text-blue-400";
                    }
                    return (
                      <th
                        key={day}
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider border-r ${headerClass} min-w-[45px]`}
                      >
                        {day}
                      </th>
                    );
                  },
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-border">
              {Array.isArray(paginatedStudents) &&
              paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="group hover:bg-muted/50 transition-colors">
                    {/* Sticky Student Name Cell */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-foreground sticky left-0 z-40 bg-background group-hover:bg-muted/80 border-r min-w-[120px] sm:min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group/name">
                      <div className="truncate">
                        {student.name}
                      </div>
                      
                      {/* Hover Info Card */}
                      <div className="hidden group-hover/name:block absolute left-[80%] top-1/2 -translate-y-1/2 z-[100] p-3 bg-card border rounded-lg shadow-xl w-48 font-normal whitespace-normal animate-in fade-in zoom-in duration-200 pointer-events-none">
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-1 mb-1">Student Info</p>
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">Course:</span>
                              <span className="font-medium text-right ml-2">{student.course}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">Branch:</span>
                              <span className="font-medium text-right ml-2">{student.branch}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">Year:</span>
                              <span className="font-medium text-right ml-2">{student.year}</span>
                            </div>
                          </div>
                        </div>
                        {/* Little triangle arrow */}
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-card border-l border-b rotate-45 border-border"></div>
                      </div>
                    </td>
                    {/* Attendance Cells */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                      (day) => {
                        const recordedAttendance =
                          studentAttendance[student.id]?.attendance[day];
                        const pendingAttendance =
                          attendance[student.id]?.[day];
                        const displayStatus =
                          pendingAttendance !== undefined
                            ? pendingAttendance
                            : recordedAttendance;
                        const currentDayMoment = moment(selectedMonth)
                          .date(day)
                          .startOf("day");
                        const isFutureDay = currentDayMoment.isAfter(today);
                        let renderContent;
                        const canInteractWithDay = isEditing && !isFutureDay;
                        if (canInteractWithDay) {
                          renderContent = (
                            <AttendanceStatusSelect
                              studentId={student.id}
                              day={day}
                              onAttendanceChange={onAttendanceChange}
                              initialStatus={displayStatus}
                            />
                          );
                        } else {
                          renderContent = getStatusDisplay(displayStatus);
                        }
                        return (
                          <td
                            key={day}
                            className="px-2 py-3 whitespace-nowrap text-sm text-center border-r min-w-[45px]"
                          >
                            {renderContent}
                          </td>
                        );
                      },
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={daysInMonth + 1}
                    className="px-4 py-20 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-3 rounded-full bg-muted">
                        <UserSearch className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-semibold text-foreground">No students found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
        <span className="text-sm text-gray-700">
          Showing{" "}
          <strong>
            {filteredStudents.length > 0
              ? (currentPage - 1) * pageSize + 1
              : 0}
          </strong>{" "}
          to{" "}
          <strong>
            {Math.min(currentPage * pageSize, filteredStudents.length)}
          </strong>{" "}
          of <strong>{filteredStudents.length}</strong> students
        </span>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {!isEditing && (
          <Button onClick={() => {
            if (selectedCourse === "All" || selectedBranch === "All" || selectedYear === "All") {
              toast.error("Please select a specific Course, Branch, and Year before marking attendance.");
              return;
            }
            setIsEditing(true);
          }}>
            <Edit3Icon className="h-4 w-4 mr-1" />
            Edit Attendance</Button>
        )}
        {isEditing && (
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save Attendance"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default StudentAttendanceGrid;
