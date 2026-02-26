"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "./EmptyState";
import { TrendingUp } from "lucide-react";

const TrendChartComponent = ({ data }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="mt-4 p-5 border rounded-lg h-[300px] animate-pulse bg-muted" />;

  return (
    <div className="mt-4 p-5 border rounded-lg shadow-sm dark:shadow-dark-sm bg-background">
      <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
      {data && data.length > 0 ? (
        <div className="h-[300px] sm:h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis 
                domain={[0, 100]} 
                tickFormatter={(val) => `${val}%`}
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Attendance']} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
              <Line
                type="monotone"
                dataKey="percentage"
                name="Attendance Rate"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 4, fill: '#8884d8', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[250px]">
          <EmptyState 
            icon={TrendingUp}
            title="No Trend Data"
            description="Attendance trend data will be available once multiple days of attendance are recorded."
          />
        </div>
      )}
    </div>
  );
};

export default TrendChartComponent;
