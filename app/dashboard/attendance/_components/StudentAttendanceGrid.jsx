"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import AttendanceCheckbox from "./AttendanceCheckbox";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_services/GlobalApi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";

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

  useEffect(() => {
    const newStudentAttendance = {};
    if (attendanceList) {
      attendanceList.forEach((record) => {
        if (record.students) {
          const studentId = record.students.id;
          if (!newStudentAttendance[studentId]) {
            newStudentAttendance[studentId] = {
              student: record.students,
              attendance: {},
            };
          }
          const day = getDayOfMonth(record.attendance.date);
          newStudentAttendance[studentId].attendance[day] =
            record.attendance.present;
        }
      });
    }
    setStudentAttendance(newStudentAttendance);
  }, [attendanceList, selectedMonth]);

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

  const today = moment().startOf('day'); // Get today's date, start of day for comparison

  const onSave = async () => {
    setLoading(true);
    const attendanceData = [];
    Object.keys(attendance).forEach((studentId) => {
      Object.keys(attendance[studentId]).forEach((day) => {
        const currentDayMoment = moment(selectedMonth).date(day).startOf('day');
        // Only save attendance for past or current days, NOT future days
        if (!currentDayMoment.isAfter(today, 'day')) {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const currentDayMoment = moment(selectedMonth).date(day).startOf('day');
              const isPastDayHeader = currentDayMoment.isBefore(today);
              const isFutureDayHeader = currentDayMoment.isAfter(today);
              const isCurrentDayHeader = currentDayMoment.isSame(today, 'day');

              let headerClass = "text-gray-500";
              if (isPastDayHeader) {
                headerClass = "text-gray-400"; // Lighter for past days
              } else if (isFutureDayHeader) {
                headerClass = "text-gray-400"; // Lighter for future days
              } else if (isCurrentDayHeader) {
                headerClass = "font-bold text-blue-600"; // Highlight current day
              }

              return (
                <th
                  key={day}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerClass}`}
                >
                  {day}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(allStudents) && allStudents.length > 0 ? (
            allStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                  {student.name}
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const recordedAttendance = studentAttendance[student.id]?.attendance[day];
                    const pendingAttendance = attendance[student.id]?.[day];

                    const displayAttendance = pendingAttendance !== undefined ? pendingAttendance : recordedAttendance;

                    const currentDayMoment = moment(selectedMonth).date(day).startOf('day');
                    const isFutureDay = currentDayMoment.isAfter(today); // Declare here!

                    let renderContent; // This will hold the JSX for the cell

                    // Determine if the checkbox should be interactive
                    // Allow interaction if in edit mode AND NOT a future day
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
                      // If not interactive (either not editing OR it's a future day), display P, A, or '-'
                      if (displayAttendance === true) {
                        renderContent = <span className="font-bold text-green-700">P</span>;
                      } else if (displayAttendance === false) {
                        renderContent = <span className="font-bold text-red-400">A</span>;
                      } else {
                        renderContent = "-"; // No record and not interactive
                      }
                    }

                    return (
                      <td
                        key={day}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r text-center"
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
                className="px-4 py-2 text-center text-gray-500"
              >
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Attendance</Button>
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
