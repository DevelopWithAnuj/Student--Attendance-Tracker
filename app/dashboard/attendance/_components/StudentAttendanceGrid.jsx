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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function StudentAttendanceGrid({
  attendanceList,
  selectedMonth,
  allStudents,
  selectedCourse,
  selectedBranch,
  selectedYear,
  reFetchData,
}) {
  const [hoveredStudentId, setHoveredStudentId] = useState(null);
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
    if (!status) return <span className="text-slate-300 dark:text-slate-700 font-bold">-</span>;
    
    const statusMap = {
      'Present': { label: 'P', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
      'Absent': { label: 'A', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-900/50' },
      'Late': { label: 'L', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
      'On Leave': { label: 'O', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-900/50' },
      'Holiday': { label: 'H', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
    };

    const config = statusMap[status] || { label: '?', color: 'bg-slate-100 text-slate-700 border-slate-200' };

    return (
      <div className={`w-7 h-7 rounded-lg border ${config.color} flex items-center justify-center mx-auto shadow-sm`}>
        <span className="text-[11px] font-black">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter & Legend Section */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="w-full lg:max-w-md relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <UserSearch className="h-5 w-5" />
            </div>
            <Input
              id="student-filter"
              name="student-filter"
              type="text"
              placeholder="Search student by name..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-11 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-primary/20 transition-all rounded-xl"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] w-full sm:w-auto">Legend</span>
            <div className="flex flex-wrap items-center gap-5">
              {[
                { label: 'P', name: 'Present', color: 'bg-emerald-500' },
                { label: 'A', name: 'Absent', color: 'bg-rose-500' },
                { label: 'L', name: 'Late', color: 'bg-amber-500' },
                { label: 'O', name: 'Leave', color: 'bg-sky-500' },
                { label: 'H', name: 'Holiday', color: 'bg-slate-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 group/legend">
                  <div className={`w-5 h-5 rounded-md ${item.color} text-white flex items-center justify-center text-[10px] font-bold shadow-sm transition-all group-hover/legend:scale-110 group-hover/legend:rotate-3`}>
                    {item.label}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="overflow-auto max-h-[600px] custom-scrollbar relative">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
              <tr>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest sticky left-0 z-40 bg-white dark:bg-slate-950 border-b border-r border-slate-200 dark:border-slate-800 min-w-[200px] sm:min-w-[260px]">
                  Student Name
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const currentDayMoment = moment(selectedMonth).date(day).startOf("day");
                  const isToday = currentDayMoment.isSame(today, "day");
                  const isFuture = currentDayMoment.isAfter(today);
                  
                  return (
                    <th
                      key={day}
                      className={`px-3 py-4 text-center text-[11px] font-bold uppercase border-b border-r border-slate-200 dark:border-slate-800 min-w-[54px] transition-colors
                        ${isToday ? "text-primary bg-primary/5" : "text-slate-400"}
                        ${isFuture ? "opacity-30" : ""}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] opacity-60 font-semibold tracking-tighter">{currentDayMoment.format('ddd').toUpperCase()}</span>
                        <span className={isToday ? "bg-primary text-white rounded-lg w-7 h-7 flex items-center justify-center shadow-lg shadow-primary/20" : ""}>{day}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="bg-transparent">
              {Array.isArray(paginatedStudents) && paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-200 sticky left-0 z-20 bg-white dark:bg-slate-950 group-hover:bg-slate-50 dark:group-hover:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 shadow-[2px_0_15px_-5px_rgba(0,0,0,0.05)] hover:z-50 transition-all duration-200">
                      <Popover open={hoveredStudentId === student.id} onOpenChange={(open) => !open && setHoveredStudentId(null)}>
                        <PopoverTrigger asChild>
                          <div 
                            className="flex items-center gap-4 cursor-help"
                            onMouseEnter={() => setHoveredStudentId(student.id)}
                            onMouseLeave={() => setHoveredStudentId(null)}
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-primary flex items-center justify-center text-xs font-black border border-slate-200 dark:border-slate-700 group-hover:border-primary/30 transition-colors">
                              {student.name.charAt(0)}
                            </div>
                            <span className="truncate max-w-[160px]">{student.name}</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent 
                          side="right" 
                          align="center" 
                          sideOffset={10}
                          className="p-0 border-none bg-transparent shadow-none w-auto z-[100]"
                          onMouseEnter={() => setHoveredStudentId(student.id)}
                          onMouseLeave={() => setHoveredStudentId(null)}
                        >
                          <div className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-64 font-normal animate-in fade-in zoom-in duration-200 ring-1 ring-black/5">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Profile</p>
                              </div>
                              <div className="space-y-3">
                                {[
                                  { label: 'Course', val: student.course },
                                  { label: 'Branch', val: student.branch },
                                  { label: 'Year', val: student.year }
                                ].map(item => (
                                  <div key={item.label} className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Arrow indicator using CSS */}
                            <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-950 border-l border-b rotate-45 border-slate-200 dark:border-slate-800 shadow-[-4px_4px_10px_rgba(0,0,0,0.02)]"></div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>

                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const recordedAttendance = studentAttendance[student.id]?.attendance[day];
                      const pendingAttendance = attendance[student.id]?.[day];
                      const displayStatus = pendingAttendance !== undefined ? pendingAttendance : recordedAttendance;
                      const currentDayMoment = moment(selectedMonth).date(day).startOf("day");
                      const isFutureDay = currentDayMoment.isAfter(today);
                      const isToday = currentDayMoment.isSame(today, "day");
                      
                      let renderContent;
                      const canInteract = isEditing && !isFutureDay;

                      if (canInteract) {
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
                          className={`px-2 py-4 whitespace-nowrap text-sm text-center border-r border-b border-slate-200 dark:border-slate-800 min-w-[54px]
                            ${isToday ? "bg-primary/[0.01]" : ""}
                            ${isFutureDay ? "bg-slate-50/50 dark:bg-slate-900/20 opacity-40" : ""}`}
                        >
                          {renderContent}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={daysInMonth + 1} className="px-4 py-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-6 max-w-sm mx-auto">
                      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
                        <UserSearch className="h-14 w-14 text-slate-300 dark:text-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black text-slate-900 dark:text-white">No students found</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms to see results.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controls Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
        <div className="flex flex-col gap-1.5 ml-1">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Showing <span className="text-primary font-black underline underline-offset-4 decoration-primary/20">{filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, filteredStudents.length)}</span> of <span className="text-slate-900 dark:text-white font-black">{filteredStudents.length}</span> students
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {totalPages > 1 && (
            <div className="flex bg-white dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-20"
              >
                Previous
              </Button>
              <div className="flex items-center px-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{currentPage} / {totalPages}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-20"
              >
                Next
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button 
                onClick={() => {
                  if (selectedCourse === "All" || selectedBranch === "All" || selectedYear === "All") {
                    toast.error("Set specific filters to start editing.");
                    return;
                  }
                  setIsEditing(true);
                }}
                className="h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold gap-3"
              >
                <Edit3Icon className="h-5 w-5" />
                Edit Attendance
              </Button>
            ) : (
              <Button 
                onClick={onSave} 
                disabled={loading}
                className="h-12 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
            
            {isEditing && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setAttendance({});
                }}
                className="h-12 px-6 rounded-2xl border-slate-200 dark:border-slate-800 font-bold"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentAttendanceGrid;
