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
        dailySummary[dayOfMonth] = { 
          presentCount: 0, 
          absentCount: 0,
          lateCount: 0,
          onLeaveCount: 0,
          holidayCount: 0
        };
      }

      const status = record.attendance.status;
      if (status === 'Present') dailySummary[dayOfMonth].presentCount++;
      else if (status === 'Absent') dailySummary[dayOfMonth].absentCount++;
      else if (status === 'Late') dailySummary[dayOfMonth].lateCount++;
      else if (status === 'On Leave') dailySummary[dayOfMonth].onLeaveCount++;
      else if (status === 'Holiday') dailySummary[dayOfMonth].holidayCount++;
    });

    // Convert dailySummary object to an array suitable for BarChart
    const chartData = Object.keys(dailySummary).sort((a, b) => Number(a) - Number(b)).map(day => ({
      day: day,
      Present: dailySummary[day].presentCount,
      Absent: dailySummary[day].absentCount,
      Late: dailySummary[day].lateCount,
      "On Leave": dailySummary[day].onLeaveCount,
      Holiday: dailySummary[day].holidayCount,
    }));

    setData(chartData);
  };

  if (!isMounted) return <div className="mt-4 p-5 border rounded-lg h-[300px] animate-pulse bg-muted" />;

  return (
    <div className="mt-4 p-5 border rounded-lg shadow-sm dark:shadow-dark-sm bg-background">
      <h3 className="text-xl my-2 font-semibold mb-2">Daily Attendance Chart</h3>
      {data.length > 0 ? (
        <div className="h-[350px] sm:h-[450px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar dataKey="Present" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="Late" fill="#facc15" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="On Leave" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="Holiday" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
