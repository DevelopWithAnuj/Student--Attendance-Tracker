import React, { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import EmptyState from './EmptyState';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#4ade80', '#ef4444']; // Green for Present, Red for Absent

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#ffffff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function PieChartComponent({ attendance }) {
  const [data, setData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (attendance && attendance.length > 0) {
      const counts = {
        'Present': 0,
        'Absent': 0,
        'Late': 0,
        'On Leave': 0,
        'Holiday': 0,
      };

      attendance.forEach(record => {
        const status = record.attendance.status;
        if (counts[status] !== undefined) {
          counts[status]++;
        }
      });

      const chartData = [
        { name: 'Present', value: counts['Present'], fill: '#4ade80' },
        { name: 'Absent', value: counts['Absent'], fill: '#ef4444' },
        { name: 'Late', value: counts['Late'], fill: '#facc15' },
        { name: 'On Leave', value: counts['On Leave'], fill: '#60a5fa' },
        { name: 'Holiday', value: counts['Holiday'], fill: '#9ca3af' },
      ].filter(item => item.value > 0);
      
      setData(chartData);
    } else {
        setData([]);
    }
  }, [attendance]);

  if (!isMounted) return <div className="mt-4 p-5 border rounded-lg h-[300px] animate-pulse bg-muted" />;

  return (
    <div className="mt-4 p-5 border rounded-lg shadow-sm dark:shadow-dark-sm bg-background">
      <h3 className="text-xl my-2 font-semibold mb-2">Monthly Attendance Summary</h3>
      {data && data.length > 0 && data.some(item => item.value > 0) ? (
        <div className="h-[300px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={5}
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px]">
          <EmptyState 
            icon={PieChartIcon}
            title="No summary available"
            description="No attendance data found to generate a summary for this month."
          />
        </div>
      )}
    </div>
  );
}

export default PieChartComponent;
