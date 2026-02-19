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

const TrendChartComponent = ({ data }) => {
  return (
    <div className="mt-4 p-5 border rounded-lg shadow-sm dark:shadow-dark-sm bg-background">
      <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        {data && data.length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChartComponent;
