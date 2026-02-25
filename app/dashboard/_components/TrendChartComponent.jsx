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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
