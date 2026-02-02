import React, { useEffect, useState } from "react";
import {
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import moment from "moment";

function BarChartComponent({ attendance }) {
  const [data, setData] = useState([]);

  useEffect(() => {
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
  return (
    <div className="mt-4 p-5 border rounded-lg shadow-sm">
      <h3 className="text-xl my-2 font-semibold mb-2">Daily Attendance Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="presentCount" fill="var(--color-chart-1)" name="Present" />
          <Bar dataKey="absentCount" fill="var(--color-chart-2)" name="Absent" />
          {data.length === 0 && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="var(--color-muted-foreground)">
              No data available
            </text>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;
