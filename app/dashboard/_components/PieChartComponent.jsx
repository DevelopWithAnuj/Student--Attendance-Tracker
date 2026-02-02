import React, { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['var(--color-chart-3)', 'var(--color-chart-4)'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="var(--color-foreground)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function PieChartComponent({ attendance }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (attendance && attendance.length > 0) {
      let totalPresent = 0;
      let totalAbsent = 0;

      attendance.forEach(record => {
        if (record.attendance.present) {
          totalPresent++;
        } else {
          totalAbsent++;
        }
      });

      const chartData = [
        { name: 'Present', value: totalPresent },
        { name: 'Absent', value: totalAbsent },
      ].map((entry, index) => ({
        ...entry,
        fill: COLORS[index % COLORS.length]
      }));
      setData(chartData);
    } else {
        setData([]);
    }
  }, [attendance]);

  return (
    <div className="mt-4 p-5 border rounded-lg shadow-sm dark:shadow-dark-sm">
      <h3 className="text-xl my-2 font-semibold mb-2">Monthly Attendance Summary</h3>
      <ResponsiveContainer width="100%" aspect={1}>
        {data && data.length > 0 && (data[0].value > 0 || data[1].value > 0) ? (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={renderCustomizedLabel}
            />
            <Legend />
          </PieChart>
        ) : (
          <div className="items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
