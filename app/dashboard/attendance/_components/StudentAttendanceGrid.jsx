"use client";
import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import AttendanceCheckbox from "./AttendanceCheckbox";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_services/GlobalApi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
              record.attendance.present;
          }
        }
      });
    }
    setStudentAttendance(newStudentAttendance);
    console.log("newStudentAttendance (after set):", newStudentAttendance); // Debug log
  }, [attendanceList, selectedMonth, allStudents]);

  const onAttendanceChange = (studentId, day, isPresent) => {
    setAttendance((prev) => {
      const newAttendance = { ...prev };
      if (!newAttendance[studentId]) {
        newAttendance[studentId] = {};
      }
      newAttendance[studentId][day] = isPresent;
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
          const isPresent = attendance[studentId][day];
          // Only push if there's a defined attendance state (true/false)
          if (isPresent !== undefined) {
            const date = currentDayMoment.format("YYYY-MM-DD");
            attendanceData.push({
              studentId: parseInt(studentId),
              present: isPresent,
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

  const exportToCSV = () => {
    const headers = ["Student Name", ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)];
    const csvContent = [
      headers.join(","),
      ...paginatedStudents.map(student => {
        const row = [student.name];
        for (let day = 1; day <= daysInMonth; day++) {
          const recordedAttendance = studentAttendance[student.id]?.attendance[day];
          const pendingAttendance = attendance[student.id]?.[day];
          const displayAttendance = pendingAttendance !== undefined ? pendingAttendance : recordedAttendance;
          let status = "";
          if (displayAttendance === true) status = "Present";
          else if (displayAttendance === false) status = "Absent";
          else status = "Not Marked";
          row.push(status);
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

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  if (!allStudents || allStudents.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No students data available. Please search with filters first.</p>
      </div>
    );
  }
  return (
    <div>
      {/* Filter Input */}
      <div className="p-4 border-t border-x rounded-t-lg shadow-sm">
        <Input
          id="student-filter"
          name="student-filter"
          type="text"
          placeholder="Filter students by name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full sm:max-w-xs"
        />
      </div>

      {/* Table Container with Force-Hidden Scrollbars */}
      <div className="overflow-hidden h-[500px] border-b border-x rounded-b-lg shadow-sm">
        <div
          className="overflow-auto h-full"
          style={{
            width: "calc(100% + 20px)",
            height: "calc(100% + 20px)",
          }}
        >
          <table className="min-w-full bg-background">
            {/* Table Header */}
            <thead className="sticky top-0 z-20 bg-background border-border">
              <tr>
                {/* Sticky Corner Cell */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 z-30 bg-background border-border">
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
                    let headerClass = "text-gray-500";
                    if (isPastDayHeader || isFutureDayHeader) {
                      headerClass = "text-gray-400 dark:text-gray-500";
                    } else if (isCurrentDayHeader) {
                      headerClass = "font-bold text-blue-600 dark:text-blue-400";
                    }
                    return (
                      <th
                        key={day}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerClass}`}
                      >
                        {day}
                      </th>
                    );
                  },
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(paginatedStudents) &&
              paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="group hover:bg-secondary">
                    {/* Sticky Student Name Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground sticky left-0 z-10 bg-background group-hover:bg-primary border-r">
                      {student.name}
                    </td>
                    {/* Attendance Cells */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                      (day) => {
                        const recordedAttendance =
                          studentAttendance[student.id]?.attendance[day];
                        console.log(`Student ${student.id}, Day ${day}: recordedAttendance = ${recordedAttendance}`); // Debug log
                        const pendingAttendance =
                          attendance[student.id]?.[day];
                        const displayAttendance =
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
                            <AttendanceCheckbox
                              studentId={student.id}
                              day={day}
                              onAttendanceChange={onAttendanceChange}
                              initialPresent={displayAttendance}
                            />
                          );
                        } else {
                          if (displayAttendance === true) {
                            renderContent = (
                              <span className="font-bold text-green-700 dark:text-green-400">
                                P
                              </span>
                            );
                          } else if (displayAttendance === false) {
                            renderContent = (
                              <span className="font-bold text-red-400 dark:text-red-300">
                                A
                              </span>
                            );
                          } else {
                            renderContent = "-";
                          }
                        }
                        return (
                          <td
                            key={day}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center border-r"
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
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No students found
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
          <Button onClick={() => setIsEditing(true)}>Edit Attendance</Button>
        )}
        {isEditing && (
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save Attendance"}
          </Button>
        )}
        <Button onClick={exportToCSV} variant="outline">
          Export to CSV
        </Button>
      </div>
    </div>
  );
}

export default StudentAttendanceGrid;
