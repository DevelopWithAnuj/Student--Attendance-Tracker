import { getUniqueRecord } from "@/app/_services/service";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { GraduationCapIcon, TrendingDown, TrendingUp } from "lucide-react";
import moment from "moment";

function StatusList({ attendanceList }) {
  // Fixed typo
  const [totalStudentsWithRecords, setTotalStudentsWithRecords] = useState(0);
  const [presentPercentage, setPresentPercentage] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    if (attendanceList && attendanceList.length > 0) {
      const today = moment().endOf("day");
      
      // Filter records to only include those up to today
      const filteredList = attendanceList.filter(record => 
        moment(record.attendance.date).isSameOrBefore(today)
      );

      const uniqueStudents = getUniqueRecord(filteredList);
      setTotalStudentsWithRecords(uniqueStudents.length);
      setTotalRecords(filteredList.length);

      let totalPresentMarks = 0;
      let totalAbsentMarks = 0;
      
      filteredList.forEach((record) => {
        if (record.attendance?.status === 'Present') {
          totalPresentMarks++;
        } else if (record.attendance?.status === 'Absent') {
          totalAbsentMarks++;
        }
      });

      setTotalPresent(totalPresentMarks);
      setTotalAbsent(totalAbsentMarks);

      // Calculate overall present percentage based on filtered records
      const calculatedPresentPerc = filteredList.length > 0 
        ? (totalPresentMarks / filteredList.length) * 100
        : 0;
        
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          icon={<GraduationCapIcon />}
          title="Students Tracked"
          value={totalStudentsWithRecords}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <Card
          icon={<TrendingUp />}
          title="Presence Rate"
          value={`${presentPercentage}%`}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <Card
          icon={<TrendingDown />}
          title="Absence Rate"
          value={`${(100 - parseFloat(presentPercentage)).toFixed(2)}%`}
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
      </div>
    </div>
  );
}

export default StatusList;
