import { getUniqueRecord } from "@/app/_services/service";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { GraduationCapIcon, TrendingDown, TrendingUp } from "lucide-react";

function StatusList({ attendanceList }) {
  // Fixed typo
  const [totalStudentsWithRecords, setTotalStudentsWithRecords] = useState(0);
  const [presentPercentage, setPresentPercentage] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    if (attendanceList && attendanceList.length > 0) {
      const uniqueStudents = getUniqueRecord(attendanceList);
      setTotalStudentsWithRecords(uniqueStudents.length);
      setTotalRecords(attendanceList.length);

      let totalPresentMarks = 0;
      let totalAbsentMarks = 0;
      attendanceList.forEach((record) => {
        if (record.attendance?.present === true) {
          totalPresentMarks++;
        } else if (record.attendance?.present === false) {
          totalAbsentMarks++;
        }
      });

      setTotalPresent(totalPresentMarks);
      setTotalAbsent(totalAbsentMarks);

      // Calculate overall present percentage based on records
      const calculatedPresentPerc =
        (totalPresentMarks / attendanceList.length) * 100;
      setPresentPercentage(calculatedPresentPerc.toFixed(2)); // To 2 decimal places
    } else {
      setTotalStudentsWithRecords(0);
      setPresentPercentage(0);
      setTotalPresent(0);
      setTotalAbsent(0);
      setTotalRecords(0);
    }
  }, [attendanceList]); // Depends on attendanceList

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-sm bg-card">
      <h3 className="text-xl font-semibold mb-4 text-foreground">Attendance Summary</h3>
      <div className="gap-4 my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card
          icon={<GraduationCapIcon />}
          title="Total Students"
          value={totalStudentsWithRecords}
        />
        <Card
          icon={<TrendingUp />}
          title="Total Present"
          value={`${presentPercentage}%`}
        />
        <Card
          icon={<TrendingDown />}
          title="Total Absent"
          value={`${(100 - parseFloat(presentPercentage)).toFixed(2)}%`}
        />
      </div>
    </div>
  );
}

export default StatusList;
