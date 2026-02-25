import React, { useEffect, useState } from "react";
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts";
import moment from "moment";
import EmptyState from "./EmptyState";
import { BarChart3 } from "lucide-react";

function BarChartComponent({ attendance }) {
  const [data, setData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    formatAttendanceList();
  }, [attendance]);

  const formatAttendanceList = () => {
    if (!attendance || attendance.length === 0) {
      setData([]);
      return;
    }

    const dailySummary = {};

    attendance.forEach(record => {
      const dayOfMonth = moment(record.attendance.date).format("DD");
      if (!dailySummary[dayOfMonth]) {
        dailySummary[dayOfMonth] = { presentCount: 0, absentCount: 0 };
      }

      if (record.attendance.present === true) {
        dailySummary[dayOfMonth].presentCount++;
      } else if (record.attendance.present === false) {
        dailySummary[dayOfMonth].absentCount++;
      }
    });

    // Convert dailySummary object to an array suitable for BarChart
    const chartData = Object.keys(dailySummary).sort((a, b) => Number(a) - Number(b)).map(day => ({
      day: day,
      presentCount: dailySummary[day].presentCount,
      absentCount: dailySummary[day].absentCount,
    }));

    setData(chartData);
  };

  if (!isMounted) return <div className="mt-4 p-5 border rounded-lg h-[300px] animate-pulse bg-muted" />;

  return (
    <div className="mt-4 p-5 border rounded-lg shadow-sm dark:shadow-dark-sm bg-background">
      <h3 className="text-xl my-2 font-semibold mb-2">Daily Attendance Chart</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="presentCount" fill="#4ade80" name="Present" />
            <Bar dataKey="absentCount" fill="#ef4444" name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px]">
          <EmptyState 
            icon={BarChart3}
            title="No Attendance Data"
            description="No attendance records found for the selected month."
          />
        </div>
      )}
    </div>
  );
}

export default BarChartComponent;
